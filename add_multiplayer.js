const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add multiplayer button to start screen
const oldBtns = `<button class="gbtn" onclick="startGame('solo')">▶ Свободная игра</button>
    <button class="gbtn" style="border-color:#4fc3f7;color:#4fc3f7" onclick="startGame('story')">📖 Сюжет (5 глав)</button>`;
const newBtns = `<button class="gbtn" onclick="startGame('solo')">▶ Свободная игра</button>
    <button class="gbtn" style="border-color:#4fc3f7;color:#4fc3f7" onclick="startGame('story')">📖 Сюжет (5 глав)</button>
    <button class="gbtn" style="border-color:#69f0ae;color:#69f0ae" onclick="startMultiplayer()">🌐 Играть онлайн</button>`;

html = html.replace(oldBtns, newBtns);

// 2. Add multiplayer overlay HTML
const mpOverlay = `
<div id="mpScreen" style="position:fixed;inset:0;background:rgba(5,5,15,.97);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:195;gap:12px;color:#fff;padding:20px">
  <div style="font-size:20px;font-weight:700;color:#69f0ae">🌐 Мультиплеер</div>
  <div style="font-size:11px;color:#555;text-align:center;max-width:260px">До 5 игроков в одном районе. Кто первый доставит — получает очки!</div>
  <div id="mpStatus" style="font-size:12px;color:#aaa;min-height:18px"></div>
  <div style="display:flex;flex-direction:column;gap:8px;width:240px">
    <div style="font-size:10px;color:#666">Район:</div>
    <select id="mpDistrict" style="padding:10px;background:#1a1a2a;border:1px solid #333;border-radius:10px;color:#fff;font-size:13px">
      <option value="patriki">🥂 Патрики</option>
      <option value="ramenki">🏢 Раменки</option>
      <option value="mytishi">🏚️ Мытищи</option>
      <option value="krasnogorsk">👑 Красногорск</option>
    </select>
    <div style="font-size:10px;color:#666">Сервер:</div>
    <input id="mpServerUrl" style="padding:10px;background:#1a1a2a;border:1px solid #333;border-radius:10px;color:#fff;font-size:11px;outline:none" value="ws://localhost:8080" placeholder="ws://your-server:8080">
    <button class="gbtn" style="border-color:#69f0ae;color:#69f0ae" onclick="connectMultiplayer()">🔗 Подключиться</button>
    <button class="gbtn" style="border-color:#333;color:#666" onclick="closeMpScreen()">← Назад</button>
  </div>
  <div id="mpPlayers" style="font-size:11px;color:#aaa;text-align:center;margin-top:4px"></div>
</div>
`;

html = html.replace('</body>', mpOverlay + '\n</body>');

// 3. Add multiplayer JS
const mpJS = `
// ===== MULTIPLAYER CLIENT =====
let mpWS=null,mpPlayers=new Map(),mpConnected=false,mpRoomId=null;
const MP_TICK=100;let mpLastTick=0;

function closeMpScreen(){
  document.getElementById('mpScreen').style.display='none';
  document.getElementById('startScreen').style.display='flex';
}

function startMultiplayer(){
  if(!selectedChar)selectedChar='roman';
  G.ch=CHARS[selectedChar];G.p.speed=G.ch.speed;
  document.getElementById('startScreen').style.display='none';
  document.getElementById('mpScreen').style.display='flex';
}

function connectMultiplayer(){
  const url=document.getElementById('mpServerUrl').value.trim()||'ws://localhost:8080';
  const district=document.getElementById('mpDistrict').value;
  setMpStatus('Подключаюсь...');
  if(mpWS){try{mpWS.close();}catch(e){}}
  try{
    mpWS=new WebSocket(url);
    mpWS.onopen=()=>{
      mpConnected=true;
      setMpStatus('Ищу игру...');
      mpWS.send(JSON.stringify({type:'find_game',district,name:G.ch?G.ch.name:'Игрок',color:G.ch?G.ch.color:'#69f0ae'}));
    };
    mpWS.onmessage=(ev)=>{try{handleMPMsg(JSON.parse(ev.data));}catch(e){}};
    mpWS.onclose=()=>{mpConnected=false;setMpStatus('Отключён от сервера');};
    mpWS.onerror=()=>setMpStatus('Ошибка подключения ❌');
  }catch(e){setMpStatus('Ошибка: '+e.message);}
}

function setMpStatus(t){const el=document.getElementById('mpStatus');if(el)el.textContent=t;}

function handleMPMsg(msg){
  switch(msg.type){
    case 'joined':
      mpRoomId=msg.roomId;
      setMpStatus('В лобби: '+msg.players.length+'/5 — ожидаем...');
      mpPlayers.clear();msg.players.forEach(p=>mpPlayers.set(p.id,{...p}));
      updateMPList();
      break;
    case 'player_joined':
      mpPlayers.set(msg.player.id,{...msg.player,wx:0,wy:0,score:0});
      setMpStatus('В лобби: '+mpPlayers.size+'/5');updateMPList();
      showPhone(msg.player.name+' подключился! 👋');
      break;
    case 'player_left':
      mpPlayers.delete(msg.id);updateMPList();
      showPhone((msg.name||'Игрок')+' вышел');
      break;
    case 'round_start':
      document.getElementById('mpScreen').style.display='none';
      G.money=G.ch?G.ch.money:12000;G.score=0;G.served=0;G.failed=0;
      G.timer=msg.duration||180;G.mode='multi';G.dayTime=.35;G.relation=50;
      G.speedMod=1;G.priceDiscount=1;G.randomEventCooldown=15;
      document.getElementById('hud').style.display='flex';
      document.getElementById('distLabel').style.display='block';
      document.getElementById('travelBtn').style.display='none';
      document.getElementById('joyArea').style.display='block';
      loadDist(msg.district||'patriki');G.running=true;
      showPhone('🎮 Старт! Первый доставит — молодец!');
      break;
    case 'round_end':
      G.running=false;
      const lines=(msg.scores||[]).map((s,i)=>{
        const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'  ';
        return medal+' '+s.name+' — '+s.score+' ⭐';
      });
      document.getElementById('goT').textContent='🏆 Раунд окончен!';
      document.getElementById('goS').innerHTML=lines.join('<br>');
      document.getElementById('gameOver').style.display='flex';
      break;
    case 'player_move':
      if(mpPlayers.has(msg.id)){const p=mpPlayers.get(msg.id);p.wx=msg.wx||0;p.wy=msg.wy||0;p.item=msg.item||null;}
      break;
    case 'player_pickup':
      if(mpPlayers.has(msg.id))mpPlayers.get(msg.id).item=msg.item;
      break;
    case 'player_scored':
      addF((msg.name||'?')+' +'+msg.pts+'⭐','#69f0ae');
      if(mpPlayers.has(msg.id))mpPlayers.get(msg.id).score=msg.totalScore||0;
      break;
    case 'chat':
      showPhone((msg.name||'?')+': '+(msg.text||''));
      break;
  }
}

function updateMPList(){
  const el=document.getElementById('mpPlayers');if(!el)return;
  const items=[];
  mpPlayers.forEach(p=>items.push('<span style="color:'+(p.color||'#69f0ae')+'">●</span> '+(p.name||'?')));
  el.innerHTML=items.length?'Игроки: '+items.join(' | '):'';
}

function sendMPTick(){
  if(!mpConnected||!mpWS||mpWS.readyState!==1)return;
  const now=Date.now();if(now-mpLastTick<MP_TICK)return;mpLastTick=now;
  mpWS.send(JSON.stringify({type:'move',wx:~~G.p.wx,wy:~~G.p.wy,item:G.p.item||null}));
}

function sendMPPickup(locId,item){
  if(!mpConnected||!mpWS||mpWS.readyState!==1)return;
  mpWS.send(JSON.stringify({type:'pickup',locId,item}));
}

function sendMPDelivered(pts){
  if(!mpConnected||!mpWS||mpWS.readyState!==1)return;
  mpWS.send(JSON.stringify({type:'delivered',pts}));
}

function drawMPPlayers(){
  if(!mpConnected||!G.dist)return;
  mpPlayers.forEach((p)=>{
    if(!p.wx&&!p.wy)return;
    const {sx,sy}=wToS(p.wx,p.wy);
    if(sx<-50||sx>W+50||sy<-50||sy>H+50)return;
    let itemE=null;
    if(p.item){const loc=G.dist.locs.find(l=>l.id===p.item);if(loc)itemE=loc.logo;}
    drawHuman(sx,sy,null,p.color||'#69f0ae',null,false,(Date.now()/200)%100,.9,null,itemE);
    X.fillStyle='rgba(5,10,20,.8)';X.beginPath();X.roundRect(sx-26,sy-40,52,14,4);X.fill();
    X.fillStyle=p.color||'#69f0ae';X.font='8px system-ui';X.textAlign='center';
    X.fillText((p.name||'?').slice(0,10),sx,sy-29);
    X.fillStyle='rgba(255,255,255,.6)';X.fillText('⭐'+(p.score||0),sx,sy-20);
  });
}
`;

// Inject MP JS before buildCharSelect
html = html.replace('buildCharSelect();\nrequestAnimationFrame(loop);', mpJS + '\nbuildCharSelect();\nrequestAnimationFrame(loop);');

// Hook sendMPTick and drawMPPlayers into game loop
html = html.replace(
  'G.npcs.forEach(npc=>drawNPC(npc));\n  G.girls.forEach(g=>drawGirl(g));\n  drawPlayer();',
  'sendMPTick();\n  drawMPPlayers();\n  G.npcs.forEach(npc=>drawNPC(npc));\n  G.girls.forEach(g=>drawGirl(g));\n  drawPlayer();'
);

// Hook delivery to send MP event
html = html.replace(
  "G.score+=pts;G.served++;G.relation=Math.min(100,G.relation+5);",
  "G.score+=pts;G.served++;G.relation=Math.min(100,G.relation+5);sendMPDelivered(pts);"
);

// Hook pickup to send MP event
html = html.replace(
  "G.p.item=l.id;G.money-=pr;addP(l.wx,l.wy,l.logo,3);",
  "G.p.item=l.id;G.money-=pr;addP(l.wx,l.wy,l.logo,3);sendMPPickup(l.id,l.logo);"
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Multiplayer added. Size:', html.length, 'bytes');
