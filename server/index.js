const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const MAX_ROOM_SIZE = 5;
const ROUND_DURATION = 180; // seconds

// Rooms: Map<roomId, Room>
const rooms = new Map();

class Room {
  constructor(id, district) {
    this.id = id;
    this.district = district;
    this.players = new Map(); // playerId -> PlayerState
    this.startTime = Date.now();
    this.phase = 'waiting'; // waiting | playing | results
    this.timer = null;
  }

  get size() { return this.players.size; }

  broadcast(msg, excludeId = null) {
    const data = JSON.stringify(msg);
    this.players.forEach((p, id) => {
      if (id !== excludeId && p.ws.readyState === 1) {
        p.ws.send(data);
      }
    });
  }

  broadcastAll(msg) {
    this.broadcast(msg, null);
  }

  startRound() {
    this.phase = 'playing';
    this.startTime = Date.now();
    this.broadcastAll({ type: 'round_start', district: this.district, duration: ROUND_DURATION });

    this.timer = setTimeout(() => {
      this.endRound();
    }, ROUND_DURATION * 1000);
  }

  endRound() {
    clearTimeout(this.timer);
    this.phase = 'results';
    const scores = [];
    this.players.forEach((p, id) => {
      scores.push({ id, name: p.name, score: p.score, served: p.served });
    });
    scores.sort((a, b) => b.score - a.score);
    this.broadcastAll({ type: 'round_end', scores });
  }

  toPublic() {
    const players = [];
    this.players.forEach((p, id) => {
      players.push({ id, name: p.name, score: p.score, wx: p.wx, wy: p.wy, item: p.item, color: p.color });
    });
    return { id: this.id, district: this.district, phase: this.phase, players };
  }
}

function findOrCreateRoom(district) {
  // Find room with space in the given district
  for (const [id, room] of rooms) {
    if (room.district === district && room.phase === 'waiting' && room.size < MAX_ROOM_SIZE) {
      return room;
    }
  }
  // Create new room
  const id = `room_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const room = new Room(id, district);
  rooms.set(id, room);
  return room;
}

const wss = new WebSocketServer({ port: PORT });
console.log(`БАЗОВЫЙ МИНИМУМ multiplayer server running on port ${PORT}`);

let playerCounter = 0;

wss.on('connection', (ws, req) => {
  const playerId = `p${++playerCounter}`;
  let currentRoom = null;
  let playerState = null;

  console.log(`Player connected: ${playerId}`);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      // Client wants to find a multiplayer game
      case 'find_game': {
        const district = msg.district || 'patriki';
        const room = findOrCreateRoom(district);
        currentRoom = room;

        playerState = {
          id: playerId,
          ws,
          name: msg.name || `Игрок ${playerCounter}`,
          score: 0,
          served: 0,
          wx: 0,
          wy: 0,
          item: null,
          color: msg.color || '#ff6b9d',
        };
        room.players.set(playerId, playerState);

        // Tell this player they joined
        ws.send(JSON.stringify({
          type: 'joined',
          playerId,
          roomId: room.id,
          district: room.district,
          players: room.toPublic().players,
        }));

        // Notify others in room
        room.broadcast({ type: 'player_joined', player: { id: playerId, name: playerState.name, color: playerState.color } }, playerId);

        console.log(`${playerState.name} joined room ${room.id} (${room.size}/${MAX_ROOM_SIZE})`);

        // Auto-start when room is full
        if (room.size >= MAX_ROOM_SIZE && room.phase === 'waiting') {
          setTimeout(() => room.startRound(), 2000);
        } else if (room.size >= 2 && room.phase === 'waiting') {
          // Start with 2+ players after short wait
          setTimeout(() => {
            if (room.phase === 'waiting' && room.size >= 2) {
              room.startRound();
            }
          }, 10000);
        }
        break;
      }

      // Player position update
      case 'move': {
        if (!playerState || !currentRoom) break;
        playerState.wx = msg.wx;
        playerState.wy = msg.wy;
        currentRoom.broadcast({
          type: 'player_move',
          id: playerId,
          wx: msg.wx,
          wy: msg.wy,
          item: msg.item,
        }, playerId);
        break;
      }

      // Player picked up item
      case 'pickup': {
        if (!playerState || !currentRoom) break;
        playerState.item = msg.item;
        currentRoom.broadcast({
          type: 'player_pickup',
          id: playerId,
          item: msg.item,
          locId: msg.locId,
        }, playerId);
        break;
      }

      // Player delivered item (scored points)
      case 'delivered': {
        if (!playerState || !currentRoom) break;
        playerState.score += msg.pts || 0;
        playerState.served++;
        playerState.item = null;
        currentRoom.broadcastAll({
          type: 'player_scored',
          id: playerId,
          name: playerState.name,
          pts: msg.pts,
          totalScore: playerState.score,
        });
        break;
      }

      // Chat message
      case 'chat': {
        if (!playerState || !currentRoom) break;
        currentRoom.broadcastAll({
          type: 'chat',
          id: playerId,
          name: playerState.name,
          text: msg.text?.slice(0, 100),
        });
        break;
      }

      // Request current room state
      case 'get_state': {
        if (!currentRoom) break;
        ws.send(JSON.stringify({ type: 'room_state', room: currentRoom.toPublic() }));
        break;
      }
    }
  });

  ws.on('close', () => {
    console.log(`Player disconnected: ${playerId} (${playerState?.name})`);
    if (currentRoom && playerState) {
      currentRoom.players.delete(playerId);
      currentRoom.broadcast({ type: 'player_left', id: playerId, name: playerState.name });
      // Clean up empty rooms
      if (currentRoom.size === 0) {
        clearTimeout(currentRoom.timer);
        rooms.delete(currentRoom.id);
        console.log(`Room ${currentRoom.id} deleted (empty)`);
      }
    }
  });

  ws.on('error', (err) => {
    console.error(`WS error for ${playerId}:`, err.message);
  });
});

// Health check endpoint for load balancers
const http = require('http');
const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', rooms: rooms.size, players: wss.clients.size }));
  } else {
    res.writeHead(404);
    res.end();
  }
});
healthServer.listen(PORT + 1, () => {
  console.log(`Health check on port ${PORT + 1}/health`);
});
