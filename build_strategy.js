const fs = require('fs');
const fdLine = fs.readFileSync('fd_line.txt', 'utf8').trim();

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a14;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;user-select:none;-webkit-user-select:none}
canvas{display:block;touch-action:none}
.screen{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,5,15,.97);z-index:10;padding:16px;gap:12px}
.screen.active{display:flex}
@keyframes glow{0%,100%{text-shadow:0 0 20px #ff6b9d,0 0 40px #ff6b9d44}50%{text-shadow:0 0 30px #ff6b9d,0 0 60px #ff6b9d88}}
@keyframes shake{0%,100%{transform:none}15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%{transform:translateX(-2px)}}
.shake{animation:shake .4s ease-out!important}
@keyframes dayIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.8)}30%{opacity:1;transform:translate(-50%,-50%) scale(1)}70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.05)}}
#dayBanner.show{display:block!important;animation:dayIn 2s ease-in-out forwards}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.title{font-size:22px;font-weight:900;color:#ff6b9d;text-align:center;letter-spacing:2px;animation:glow 3s ease-in-out infinite}
.subtitle{font-size:11px;color:#666;text-align:center;letter-spacing:4px;text-transform:uppercase;animation:fadeUp .6s ease-out}
.btn{background:transparent;border:1.5px solid #ff6b9d;color:#ff6b9d;padding:10px 28px;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s;letter-spacing:1px}
.btn:hover,.btn:active{background:#ff6b9d22}
.btn.green{border-color:#69f0ae;color:#69f0ae}
.btn.green:hover{background:#69f0ae22}
.btn.gold{border-color:#ffd740;color:#ffd740}
.btn.gold:hover{background:#ffd74022}
.btn.dim{border-color:#444;color:#666}
/* Character select */
#charGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;max-width:320px}
.charCard{background:#111120;border:1.5px solid #333;border-radius:14px;padding:12px;cursor:pointer;transition:.2s;display:flex;flex-direction:column;align-items:center;gap:4px}
.charCard:hover,.charCard.sel{border-color:#ff6b9d;background:#ff6b9d11}
.charCard img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid #333}
.charCard .cn{font-size:13px;font-weight:700;color:#fff}
.charCard .cs{font-size:9px;color:#aaa;text-align:center}
.statBar{width:100%;height:4px;background:#1e1e2e;border-radius:2px;overflow:hidden;margin:1px 0}
.statBar span{display:block;height:100%;border-radius:2px;transition:.4s}
/* Tutorial overlay */
#tutScreen{position:fixed;inset:0;background:rgba(5,5,15,.97);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:200;padding:20px;gap:10px;overflow-y:auto}
.tutRow{display:flex;align-items:center;gap:10px;width:100%;max-width:320px;padding:8px 0;border-bottom:1px solid #1a1a2a}
.tutEmoji{font-size:24px;min-width:32px;text-align:center}
.tutTxt{font-size:11px;color:#ccc;line-height:1.5}
/* HUD */
#hud{position:fixed;top:0;left:0;right:0;display:none;flex-direction:column;z-index:20;pointer-events:none}
#hudTop{display:flex;gap:6px;padding:8px 10px;background:linear-gradient(180deg,rgba(5,5,15,.95),transparent);align-items:center;flex-wrap:wrap}
.hstat{background:rgba(10,10,25,.8);border:1px solid #222;border-radius:10px;padding:4px 9px;font-size:11px;font-weight:700;white-space:nowrap}
#hudBot{display:flex;justify-content:space-between;align-items:flex-end;padding:8px 10px;position:fixed;bottom:0;left:0;right:0;pointer-events:all;background:linear-gradient(0deg,rgba(5,5,15,.9),transparent)}
#endTurnBtn{border:1.5px solid #ffd740;color:#ffd740;background:rgba(10,10,20,.9);padding:8px 18px;border-radius:16px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:1px}
#endTurnBtn:active{background:#ffd74033}
#movesLeft{font-size:11px;color:#aaa;text-align:center;margin-bottom:4px}
/* Phone toast */
#phone{position:fixed;top:64px;left:50%;transform:translateX(-50%);background:rgba(10,10,25,.96);border:1.5px solid #ff6b9d;border-radius:14px;padding:10px 18px;font-size:12px;color:#fff;display:none;z-index:50;max-width:280px;text-align:center;pointer-events:none}
/* Event toast */
#evToast{position:fixed;top:70px;left:50%;transform:translateX(-50%) scale(.9);background:rgba(10,10,25,.97);border:1.5px solid #ffd740;border-radius:16px;padding:12px 18px;z-index:55;display:none;transition:.3s;max-width:280px;text-align:center}
#evToast.show{transform:translateX(-50%) scale(1)}
#evTitle{font-size:14px;font-weight:700;color:#ffd740;margin-bottom:4px}
#evDesc{font-size:11px;color:#ccc}
/* Battle screen */
#battle{position:fixed;inset:0;background:#080812;z-index:60;display:none;flex-direction:column}
#bHeader{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,.5)}
#bTitle{font-size:14px;font-weight:700;color:#ff6b9d}
#bRound{font-size:11px;color:#aaa}
#bField{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:10px}
.bHP{width:100%;max-width:320px}
.bHPLabel{font-size:10px;color:#aaa;margin-bottom:3px}
.bHPBar{height:8px;border-radius:4px;background:#222;overflow:hidden}
.bHPFill{height:100%;border-radius:4px;transition:.5s}
#bDemand{background:rgba(255,80,80,.12);border:1.5px solid #f44336;border-radius:14px;padding:14px 20px;text-align:center;max-width:280px;width:100%}
#bDemandEmoji{font-size:28px;margin-bottom:4px}
#bDemandName{font-size:13px;font-weight:700;color:#ff8a80}
#bDemandPow{font-size:10px;color:#aaa;margin-top:2px}
#bLog{font-size:10px;color:#69f0ae;min-height:18px;text-align:center}
#bCards{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:10px 14px;background:rgba(0,0,0,.4)}
.bCard{background:rgba(15,15,35,.9);border:1.5px solid #333;border-radius:12px;padding:10px 12px;cursor:pointer;transition:.2s;min-width:80px;text-align:center;flex:0 0 auto;position:relative}
.bCard:hover,.bCard:active{border-color:#ff6b9d;background:#ff6b9d11;transform:translateY(-2px)}
.bCard.used{opacity:.3;pointer-events:none}
.bCard.good{border-color:#69f0ae;background:rgba(105,240,174,.1);box-shadow:0 0 8px #69f0ae55}
.bCard.good::after{content:'⚡ СИЛЬНО';position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#69f0ae;color:#000;font-size:7px;font-weight:900;padding:1px 5px;border-radius:4px;white-space:nowrap}
.bCard.good{border-color:#69f0ae}
.bCardEmoji{font-size:22px}
.bCardName{font-size:9px;color:#ccc;margin-top:3px}
.bCardPow{font-size:10px;font-weight:700;color:#ffd740;margin-top:2px}
#bResult{position:absolute;inset:0;background:rgba(0,0,0,.85);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:5}
#bResultTitle{font-size:26px;font-weight:900;text-align:center}
#bResultSub{font-size:12px;color:#aaa;text-align:center;max-width:260px}
/* Apartment screen */
#apt{position:fixed;inset:0;background:#08080f;z-index:60;display:none;flex-direction:column;padding:14px;gap:10px;overflow-y:auto}
#aptTitle{font-size:16px;font-weight:700;color:#ff6b9d;text-align:center}
#aptGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.aptRoom{background:#111120;border:1.5px solid #222;border-radius:12px;padding:10px;cursor:pointer;transition:.2s}
.aptRoom.owned{border-color:#69f0ae22}
.aptRoom.upgradable{border-color:#ffd740}
.aptRoom:active{transform:scale(.98)}
.aptRoomEmoji{font-size:20px;margin-bottom:4px}
.aptRoomName{font-size:11px;font-weight:700;color:#e0e0e0}
.aptRoomSub{font-size:9px;color:#666;margin-top:2px}
#unitList{display:flex;flex-direction:column;gap:6px}
.unitRow{background:#111120;border:1px solid #222;border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:8px}
.unitEmoji{font-size:18px;min-width:24px;text-align:center}
.unitInfo{flex:1}
.unitName{font-size:11px;font-weight:700}
.unitDesc{font-size:9px;color:#777}
.unitBtn{font-size:9px;padding:4px 10px;border-radius:8px}
/* District label */
#distLabel{position:fixed;top:52px;left:50%;transform:translateX(-50%);background:rgba(10,10,25,.85);border:1px solid #333;border-radius:10px;padding:4px 12px;font-size:11px;color:#aaa;pointer-events:none;z-index:15}
/* Minimap */
#mm{position:fixed;bottom:60px;right:8px;width:80px;height:80px;border:1px solid #333;border-radius:6px;z-index:25}
/* Hex info popup */
#hexInfo{position:fixed;bottom:60px;left:8px;background:rgba(10,10,25,.95);border:1px solid #333;border-radius:12px;padding:10px 14px;font-size:11px;z-index:25;display:none;max-width:180px}
#hexInfo .hiTitle{font-weight:700;color:#ffd740;margin-bottom:4px}
#hexInfo .hiDesc{color:#aaa;font-size:9px}
#hexInfo .hiBtn{margin-top:6px;font-size:10px;padding:4px 12px;border-radius:8px}
/* Floating text */
.floatText{position:fixed;pointer-events:none;font-size:13px;font-weight:700;z-index:80;transition:none}
/* Turn/Day indicator */
#turnLabel{position:fixed;top:52px;right:8px;background:rgba(10,10,25,.85);border:1px solid #ffd74055;border-radius:10px;padding:4px 10px;font-size:10px;color:#ffd740;z-index:15;pointer-events:none}
`;

// ─── HTML ────────────────────────────────────────────────────────────────────
const HTML = `
<canvas id="c"></canvas>
<canvas id="mm"></canvas>

<!-- TUTORIAL SCREEN -->
<div id="tutScreen">
  <div style="font-size:18px;font-weight:900;color:#ff6b9d;letter-spacing:2px;margin-bottom:4px">КАК ИГРАТЬ</div>
  <div class="tutRow"><div class="tutEmoji">🗺️</div><div class="tutTxt"><b>Карта</b> — гексагональная. Нажми на гекс рядом чтобы переместиться. Туман войны открывается при движении.</div></div>
  <div class="tutRow"><div class="tutEmoji">⏭</div><div class="tutTxt"><b>Конец хода</b> — пополняет ходы и энергию. Каждые 3 хода — новый день, начисляется зарплата.</div></div>
  <div class="tutRow"><div class="tutEmoji">👩</div><div class="tutTxt"><b>Девушки</b> ходят по карте. Наступи на них — начнётся свидание-битва с карточками!</div></div>
  <div class="tutRow"><div class="tutEmoji">🃏</div><div class="tutTxt"><b>Карточки</b> — покупай в магазинах. Каждая карта имеет силу и тип. Бей по слабостям противника.</div></div>
  <div class="tutRow"><div class="tutEmoji">🏪</div><div class="tutTxt"><b>Магазины</b> — нажми на здание, затем кнопку. Доступны магазины, рестораны, метро и спецобъекты.</div></div>
  <div class="tutRow"><div class="tutEmoji">🚇</div><div class="tutTxt"><b>Метро</b> — телепортирует в другой район. Незаменимо для быстрого перемещения по карте.</div></div>
  <div class="tutRow"><div class="tutEmoji">🎲</div><div class="tutTxt"><b>Случайные события</b> каждый ход! Выбирай варианты мудро — они влияют на отношения и репутацию.</div></div>
  <div class="tutRow"><div class="tutEmoji">👩‍👧</div><div class="tutTxt"><b>Тёща — финальный босс</b> в Красногорске. Победи её в битве чтобы получить благословение на свадьбу!</div></div>
  <button class="btn" onclick="document.getElementById('tutScreen').style.display='none'" style="margin-top:12px">Понял! Играть 🎮</button>
</div>

<!-- START SCREEN -->
<div id="startScreen" class="screen active">
  <div class="title">БАЗОВЫЙ МИНИМУМ</div>
  <div class="subtitle">Стратегия · Гексагональная карта</div>
  <div id="tgGreet" style="font-size:11px;color:#ff6b9d;height:16px"></div>
  <div id="bestResults" style="display:none;font-size:9px;color:#666;text-align:center;max-width:320px;padding:4px 10px;background:rgba(255,215,64,.05);border-radius:8px;border:1px solid #333"></div>
  <div id="charGrid"></div>
  <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:320px;margin-top:4px">
    <button class="btn" onclick="startGame('campaign')">📖 Кампания (5 глав)</button>
    <button class="btn green" onclick="startGame('free')">🗺 Свободная игра</button>
    <button class="btn" onclick="document.getElementById('tutScreen').style.display='flex'" style="border-color:#555;color:#888;font-size:11px;padding:7px 16px">❓ Как играть</button>
  </div>
</div>

<!-- HUD -->
<div id="hud">
  <div id="hudTop">
    <img id="hudFace" style="width:28px;height:28px;border-radius:50%;border:1.5px solid #ff6b9d;object-fit:cover;flex-shrink:0" src="" alt="" onerror="this.style.display='none'">
    <span class="hstat" id="hMoney">💰 0₽</span>
    <span class="hstat" id="hEnergy">💪 10</span>
    <span class="hstat" id="hRel">❤️ 0</span>
    <span class="hstat" id="hRep">🧠 50</span>
  </div>
  <div style="display:flex;align-items:center;gap:6px;padding:3px 8px 3px">
    <span id="hudLvl" style="font-size:9px;color:#ffd740;font-weight:700;min-width:30px">Ур.1</span>
    <div style="flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">
      <div id="xpBar" style="height:100%;background:linear-gradient(90deg,#ffd740,#ff9800);border-radius:2px;width:0%;transition:.4s"></div>
    </div>
    <span id="hudXpLbl" style="font-size:8px;color:#888">0/80</span>
  </div>
</div>
<div id="distLabel"></div>
<div id="turnLabel"></div>
<div id="questLabel" style="position:fixed;top:52px;left:50%;transform:translateX(-50%);display:none;background:rgba(5,5,20,.88);border:1px solid #ff6b9d44;border-radius:10px;padding:5px 14px;font-size:10px;color:#ff6b9d;z-index:21;pointer-events:none;max-width:280px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
<div id="hudBot">
  <div id="hexInfo">
    <div class="hiTitle" id="hiTitle">—</div>
    <div class="hiDesc" id="hiDesc"></div>
    <button class="btn green hiBtn" id="hiBtn" onclick="hexAction()" style="display:none">Войти</button>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <div id="movesLeft"></div>
    <div style="display:flex;gap:6px">
      <button onclick="openApt()" style="background:rgba(10,10,25,.9);border:1.5px solid #444;color:#aaa;border-radius:14px;padding:6px 12px;font-size:11px;cursor:pointer">🏠 Квартира</button>
      <button id="endTurnBtn" onclick="endTurn()">⏭ Ход</button>
    </div>
  </div>
</div>

<!-- PHONE TOAST -->
<div id="phone"></div>

<!-- DAY BANNER -->
<div id="dayBanner" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:200;background:rgba(10,10,25,.88);border:1.5px solid #ffd740;border-radius:20px;padding:14px 36px;text-align:center;pointer-events:none">
  <div id="dayBannerNum" style="font-size:28px;font-weight:900;color:#ffd740;letter-spacing:2px"></div>
  <div id="dayBannerWx" style="font-size:14px;margin-top:4px;color:#aaa"></div>
</div>

<!-- EVENT TOAST -->
<div id="evToast">
  <div id="evTitle"></div>
  <div id="evDesc"></div>
</div>

<!-- BATTLE SCREEN -->
<div id="battle" style="display:none;flex-direction:column;position:fixed;inset:0;z-index:60">
  <div id="bHeader">
    <div id="bTitle">💕 Свидание</div>
    <div id="bRound">Раунд 1/5</div>
  </div>
  <div id="bField">
    <div class="bHP" id="bHPHero">
      <div class="bHPLabel" id="bHPHeroLbl">Твоё обаяние: 100</div>
      <div class="bHPBar"><div class="bHPFill" id="bHPHeroFill" style="background:linear-gradient(90deg,#ff6b9d,#ff4081);width:100%"></div></div>
    </div>
    <div class="bHP" id="bHPGirl">
      <div class="bHPLabel" id="bHPGirlLbl">Её настроение: 100</div>
      <div class="bHPBar"><div class="bHPFill" id="bHPGirlFill" style="background:linear-gradient(90deg,#f44336,#b71c1c);width:100%"></div></div>
    </div>
    <div id="bDemand">
      <div id="bDemandEmoji">?</div>
      <div id="bDemandName">Ждём...</div>
      <div id="bDemandType" style="display:inline-block;margin-top:4px;padding:2px 8px;border-radius:8px;font-size:9px;font-weight:700;letter-spacing:.5px;background:rgba(244,67,54,.2);color:#ff8a80"></div>
      <div id="bDemandPow"></div>
    </div>
    <div id="bLog"></div>
  </div>
  <div id="bCards"></div>
  <div id="bResult" style="display:none;flex-direction:column;align-items:center;justify-content:center">
    <div id="bResultTitle"></div>
    <div id="bResultSub"></div>
    <button class="btn" onclick="closeBattle()" style="margin-top:16px">Продолжить</button>
  </div>
</div>

<!-- APARTMENT SCREEN -->
<div id="apt" style="display:none">
  <div id="aptTitle">🏠 Твоя квартира</div>
  <div id="aptLevelLabel" style="text-align:center;font-size:10px;color:#aaa"></div>
  <div id="aptGrid"></div>
  <div style="font-size:11px;font-weight:700;color:#ff6b9d;margin-top:8px">👥 Помощники</div>
  <div id="unitList"></div>
  <button class="btn" onclick="closeApt()" style="margin-top:8px;align-self:center">← На карту</button>
</div>

<!-- DIALOG BOX -->
<div id="dialogBox" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:70;flex-direction:column;align-items:center;justify-content:flex-end;padding:16px;gap:8px">
  <div style="background:#0d0d1f;border:1.5px solid #ff6b9d;border-radius:18px;padding:16px;width:100%;max-width:340px">
    <div id="dlgChar" style="font-size:11px;color:#ff6b9d;margin-bottom:6px;font-weight:700"></div>
    <div id="dlgText" style="font-size:13px;color:#e0e0e0;line-height:1.5;margin-bottom:12px"></div>
    <div id="dlgChoices" style="display:flex;flex-direction:column;gap:6px"></div>
  </div>
</div>

<!-- GAME OVER -->
<div id="goScreen" class="screen">
  <div id="goEmoji" style="font-size:48px;line-height:1"></div>
  <div id="goTitle" class="title"></div>
  <div id="goSub" style="font-size:11px;color:#aaa;text-align:center;max-width:280px;line-height:1.6"></div>
  <div id="goStats" style="background:#111120;border:1px solid #222;border-radius:12px;padding:14px;width:100%;max-width:280px;font-size:11px;line-height:1.8;color:#ccc"></div>
  <div id="goLeaderboard" style="background:#111120;border:1px solid #333;border-radius:12px;padding:10px 14px;width:100%;max-width:280px;font-size:10px;display:none"></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:280px">
    <button class="btn" onclick="location.reload()">🔄 Снова</button>
    <button class="btn" id="shareBtn" onclick="shareResult()" style="border-color:#29b6f6;color:#29b6f6;font-size:11px;padding:8px 18px">📤 Поделиться</button>
  </div>
</div>
`;

// ─── GAME JS ─────────────────────────────────────────────────────────────────
const GAME_JS = `
const TG=window.Telegram&&window.Telegram.WebApp;
if(TG){TG.ready();TG.expand();if(TG.initDataUnsafe&&TG.initDataUnsafe.user){const u=TG.initDataUnsafe.user;window._tgName=u.first_name+(u.last_name?' '+u.last_name:'');}}
function haptic(t){if(TG&&TG.HapticFeedback){try{if(t==='impact')TG.HapticFeedback.impactOccurred('medium');else if(t==='success')TG.HapticFeedback.notificationOccurred('success');else if(t==='error')TG.HapticFeedback.notificationOccurred('error');else if(t==='light')TG.HapticFeedback.impactOccurred('light');}catch(e){}}}

// ── Hex engine ──────────────────────────────────────────────────────────────
const HSZ=44, SQ3=Math.sqrt(3);
const HW=HSZ*SQ3, HH=HSZ*2, VD=HH*.75;
const COLS=24, ROWS=20;

function hexCenter(col,row){
  return{x:HW*col+(row&1)*HW*.5, y:VD*row};
}
function pixelToHex(px,py){
  const col_approx=(px-(py/VD%1)*HW*.5)/HW;
  // brute force nearest hex (fast enough for click)
  let best=null,bd=1e9;
  const rc=Math.round(py/VD), cc=Math.round(col_approx);
  for(let r=rc-2;r<=rc+2;r++){for(let c=cc-2;c<=cc+2;c++){
    if(r<0||r>=ROWS||c<0||c>=COLS)continue;
    const {x,y}=hexCenter(c,r);
    const d=(x-px)**2+(y-py)**2;
    if(d<bd){bd=d;best={col:c,row:r};}
  }}
  return best;
}
const NOFF=[
  [[1,0],[-1,0],[0,-1],[0,1],[-1,-1],[-1,1]], // even row
  [[1,0],[-1,0],[0,-1],[0,1],[1,-1],[1,1]]    // odd row
];
function hexNeighbors(col,row){
  return NOFF[row&1].map(([dc,dr])=>({col:col+dc,row:row+dr}))
    .filter(({col:c,row:r})=>c>=0&&c<COLS&&r>=0&&r<ROWS);
}
function hexKey(col,row){return col*100+row;}
function hexDist(c1,r1,c2,r2){
  // convert offset to cube
  const toC=(c,r)=>{const x=c-(r-(r&1))/2;return{x,z:r,y:-x-r};};
  const a=toC(c1,r1),b=toC(c2,r2);
  return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.z-b.z));
}
function hexReachable(col,row,moves){
  const vis=new Set([hexKey(col,row)]);
  const front=[{col,row,left:moves}];
  const reach=new Set();
  while(front.length){
    const {col:c,row:r,left:l}=front.shift();
    if(l<=0)continue;
    hexNeighbors(c,r).forEach(n=>{
      const t=MAP[n.row][n.col];
      if(t===HT.WATER||t===HT.MKAD)return;
      const k=hexKey(n.col,n.row);
      if(!vis.has(k)){vis.add(k);reach.add(k);front.push({col:n.col,row:n.row,left:l-1});}
    });
  }
  return reach;
}

// Draw a pointy-top hex
function drawHex(ctx,cx,cy,sz,fill,stroke,alpha){
  ctx.globalAlpha=alpha==null?1:alpha;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=Math.PI/180*(60*i-30);
    if(i===0)ctx.moveTo(cx+sz*Math.cos(a),cy+sz*Math.sin(a));
    else ctx.lineTo(cx+sz*Math.cos(a),cy+sz*Math.sin(a));
  }
  ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
  ctx.globalAlpha=1;
}

// ── Terrain types ────────────────────────────────────────────────────────────
const HT={PLAIN:0,ROAD:1,PARK:2,SHOP:3,RESTAURANT:4,APARTMENT:5,METRO:6,GYM:7,SALON:8,MOM:9,JEWELRY:10,WATER:11,MKAD:12,FOREST:13,HQ:14};
const HTC={ // base fill colors by terrain
  0:'#16182e',1:'#252538',2:'#0e2e0e',3:'#22104a',4:'#2a1010',
  5:'#101030',6:'#001428',7:'#0e2a10',8:'#2a102a',9:'#2a1e08',
  10:'#1a0e06',11:'#08122a',12:'#1a1a22',13:'#082208',14:'#200a30'
};
// District color tint modifiers (strong visual difference)
const DTINT={patriki:[0,22,0],ramenki:[0,8,22],mytishi:[18,8,-8],krasnogorsk:[22,16,0]};
// District plain hex colors (unique per district)
const DPLAIN={patriki:'#0e2018',ramenki:'#0e1828',mytishi:'#1e1810',krasnogorsk:'#201a08'};

// ── Objects on map ───────────────────────────────────────────────────────────
const SHOPS_DEF=[
  {id:'flora',name:'Флора 🌸',emoji:'🌹',desc:'Цветочный магазин',price:500,gives:'bouquet',district:'patriki',effect:'card_bouquet'},
  {id:'chocolate',name:'Шоколадный 🍫',emoji:'🍫',desc:'Сладости и подарки',price:200,gives:'chocolate',district:'patriki',effect:'card_choc'},
  {id:'azon',name:'Азон 📦',emoji:'📦',desc:'Маркетплейс, средние цены',price:800,gives:'gift',district:'ramenki',effect:'card_gift'},
  {id:'wildberry',name:'WildBerry 🛍',emoji:'🛍',desc:'Маркетплейс',price:600,gives:'gift2',district:'ramenki',effect:'card_gift'},
  {id:'magnit',name:'Магнетик 🛒',emoji:'🛒',desc:'Продукты, дёшево',price:150,gives:'food',district:'mytishi',effect:'add_money'},
  {id:'cheap',name:'Всё по 99 💲',emoji:'💲',desc:'Всё дёшево',price:99,gives:'cheap',district:'mytishi',effect:'card_cheap'},
  {id:'cartier',name:'Картье 💍',emoji:'💍',desc:'Ювелирка, очень дорого',price:8000,gives:'ring',district:'krasnogorsk',effect:'card_ring'},
  {id:'gucci',name:'Гуччи 👜',emoji:'👜',desc:'Одежда, очень дорого',price:12000,gives:'luxury',district:'krasnogorsk',effect:'card_luxury'},
  {id:'flowers99',name:'Цветы 99₽ 🌼',emoji:'🌼',desc:'Дешёвые цветы',price:99,gives:'cheap_bouquet',district:'mytishi',effect:'card_bouquet_cheap'},
  {id:'bookstore',name:'Книжный 📜',emoji:'📜',desc:'Стихи: красиво и бюджетно',price:300,gives:'poem',district:'patriki',effect:'card_poem'},
  {id:'music',name:'Музыкальный 🎸',emoji:'🎸',desc:'Серенада: произведёт впечатление',price:1500,gives:'serenade',district:'ramenki',effect:'card_serenade'},
  {id:'dance',name:'Школа танцев 💃',emoji:'💃',desc:'Танцевальный урок',price:700,gives:'dance',district:'mytishi',effect:'card_dance'},
];
const RESTS_DEF=[
  {id:'chaihona',name:'Чайхона 🍜',emoji:'🍜',desc:'Ресторан: +20 обаяния',cost:1500,district:'patriki',bonus:'charisma'},
  {id:'sushi',name:'Суши-бар 🍱',emoji:'🍱',desc:'Романтический ужин: +card_dinner',cost:2000,district:'ramenki',bonus:'dinner'},
  {id:'stolovka',name:'Столовая 🍲',emoji:'🍲',desc:'Дёшево: +Энергия',cost:200,district:'mytishi',bonus:'energy'},
  {id:'premium',name:'Prestige 🥂',emoji:'🥂',desc:'Дорогой ресторан: +rep',cost:5000,district:'krasnogorsk',bonus:'rep'},
];
const SPECIALS_DEF=[
  {id:'metro_p',name:'Метро 🚇',emoji:'🚇',desc:'Быстрый переезд',type:'metro',district:'patriki'},
  {id:'metro_r',name:'Метро 🚇',emoji:'🚇',desc:'Быстрый переезд',type:'metro',district:'ramenki'},
  {id:'metro_m',name:'Метро 🚇',emoji:'🚇',desc:'Быстрый переезд',type:'metro',district:'mytishi'},
  {id:'metro_k',name:'Метро 🚇',emoji:'🚇',desc:'Быстрый переезд',type:'metro',district:'krasnogorsk'},
  {id:'gym_p',name:'Качалка 💪',emoji:'💪',desc:'+Харизма на 3 хода',type:'gym',cost:300,district:'patriki'},
  {id:'gym_k',name:'Фитнес-клуб 🏋',emoji:'🏋',desc:'+Харизма на 3 хода',type:'gym',cost:800,district:'krasnogorsk'},
  {id:'salon_p',name:'Салон 💅',emoji:'💅',desc:'+Внешность на 3 хода',type:'salon',cost:500,district:'patriki'},
  {id:'salon_k',name:'Салон Люкс 💄',emoji:'💄',desc:'+Внешность на 3 хода',type:'salon',cost:1500,district:'krasnogorsk'},
  {id:'park_p',name:'Патриаршие Пруды 🦢',emoji:'🦢',desc:'Отдых: +Энергия бесплатно',type:'park',district:'patriki'},
  {id:'park_m',name:'Лесопарк 🌲',emoji:'🌲',desc:'Отдых: +Энергия',type:'park',district:'mytishi'},
  {id:'mom',name:'Мамина квартира 👩',emoji:'👩',desc:'Босс-файт с родителями',type:'mom',district:'mytishi'},
  {id:'hq',name:'Твоя квартира 🏠',emoji:'🏠',desc:'База. Нанимай помощников.',type:'hq',district:'patriki'},
];

// Map: which hexes have objects (col, row) for each district quadrant
// Districts occupy: patriki=top-left, krasnogorsk=top-right, mytishi=bottom-left, ramenki=bottom-right
// MKAD lines: row 8-9 (horizontal), col 11-12 (vertical)
const OBJ_HEXES={}; // key->object definition
function getDistrict(col,row){
  if(col<12&&row<10)return 'patriki';
  if(col>=12&&row<10)return 'krasnogorsk';
  if(col<12&&row>=10)return 'mytishi';
  return 'ramenki';
}

// ── Map generation ───────────────────────────────────────────────────────────
let MAP=[];
function generateMap(){
  MAP=Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>{
    // MKAD border
    if((r===9||r===10)&&(c<3||c>20))return HT.MKAD;
    if((c===11||c===12)&&(r<3||r>16))return HT.MKAD;
    // Water features
    if(r>=7&&r<=11&&c>=10&&c<=13)return HT.ROAD; // MKAD crossing area
    // Parks
    if(c>=4&&c<=6&&r>=6&&r<=8)return HT.PARK;
    if(c>=15&&c<=17&&r>=12&&r<=14)return HT.PARK;
    if(c>=4&&c<=5&&r>=12&&r<=14)return HT.FOREST;
    // Main roads
    if(r===5||r===14)return HT.ROAD;
    if(c===5||c===17)return HT.ROAD;
    if(c===8||c===15)return HT.ROAD;
    // Districts background
    return HT.PLAIN;
  }));

  // Place objects at specific positions
  const placements=[
    // Patriki objects (col<12, row<10)
    {c:5,r:4,type:HT.HQ,oid:'hq'},{c:3,r:5,type:HT.SHOP,oid:'flora'},
    {c:7,r:3,type:HT.RESTAURANT,oid:'chaihona'},{c:4,r:2,type:HT.METRO,oid:'metro_p'},
    {c:2,r:7,type:HT.GYM,oid:'gym_p'},{c:8,r:6,type:HT.SALON,oid:'salon_p'},
    {c:6,r:7,type:HT.PARK,oid:'park_p'},{c:9,r:2,type:HT.SHOP,oid:'chocolate'},
    // Krasnogorsk objects (col>=12, row<10)
    {c:17,r:2,type:HT.METRO,oid:'metro_k'},{c:16,r:5,type:HT.SHOP,oid:'cartier'},
    {c:19,r:3,type:HT.SHOP,oid:'gucci'},{c:14,r:6,type:HT.RESTAURANT,oid:'premium'},
    {c:21,r:5,type:HT.GYM,oid:'gym_k'},{c:18,r:7,type:HT.SALON,oid:'salon_k'},
    // Mytishi objects (col<12, row>=10)
    {c:4,r:15,type:HT.METRO,oid:'metro_m'},{c:3,r:11,type:HT.SHOP,oid:'cheap'},
    {c:7,r:13,type:HT.SHOP,oid:'magnit'},{c:2,r:14,type:HT.MOM,oid:'mom'},
    {c:5,r:17,type:HT.PARK,oid:'park_m'},{c:9,r:12,type:HT.SHOP,oid:'flowers99'},
    // Ramenki objects (col>=12, row>=10)
    {c:17,r:15,type:HT.METRO,oid:'metro_r'},{c:15,r:11,type:HT.SHOP,oid:'wildberry'},
    {c:19,r:12,type:HT.SHOP,oid:'azon'},{c:16,r:14,type:HT.RESTAURANT,oid:'sushi'},
    {c:14,r:17,type:HT.RESTAURANT,oid:'stolovka'},
  ];
  placements.forEach(({c,r,type,oid})=>{
    MAP[r][c]=type;
    const obj=[...SHOPS_DEF,...RESTS_DEF,...SPECIALS_DEF].find(o=>o.id===oid);
    if(obj)OBJ_HEXES[hexKey(c,r)]=obj;
  });
}

// ── Characters ───────────────────────────────────────────────────────────────
const CHARS={
  arseniy:{name:'Арсений',face:'arseniy',money:25000,bonus:'discount',bonusDesc:'Скидка 25% в магазинах',color:'#4fc3f7',stat:{salary:3,charisma:2,looks:2,generosity:1}},
  lenya:{name:'Лёня',face:'lenya',money:40000,bonus:'car',bonusDesc:'Машина: +2 хода',color:'#81c784',stat:{salary:4,charisma:1,looks:1,generosity:2}},
  vova:{name:'Вова',face:'vova',money:10000,bonus:'sport',bonusDesc:'Спортсмен: +3 энергии',color:'#ffb74d',stat:{salary:1,charisma:2,looks:3,generosity:1}},
  roman:{name:'Роман',face:'roman',money:12000,bonus:'romantic',bonusDesc:'Романтик: x2 к отношениям',color:'#f48fb1',stat:{salary:1,charisma:3,looks:2,generosity:3}},
};

// ── Battle cards ─────────────────────────────────────────────────────────────
const ALL_CARDS={
  compliment:{emoji:'💬',name:'Комплимент',power:25,type:'attention',cost:0,desc:'Бесплатно, перезаряжается'},
  joke:{emoji:'😄',name:'Шутка',power:20,type:'mood',cost:0,desc:'Поднимает настроение'},
  hug:{emoji:'🤗',name:'Обнять',power:30,type:'affection',cost:0,desc:'Тёплые объятия'},
  listen:{emoji:'👂',name:'Выслушать',power:20,type:'trust',cost:0,desc:'Внимательный слушатель'},
  bouquet:{emoji:'🌹',name:'Букет',power:35,type:'romance',cost:500},
  bouquet_cheap:{emoji:'🌼',name:'Цветы',power:18,type:'romance',cost:99},
  choc:{emoji:'🍫',name:'Шоколад',power:22,type:'sweet',cost:200},
  gift:{emoji:'🎁',name:'Подарок',power:38,type:'luxury',cost:800},
  ring:{emoji:'💍',name:'Украшение',power:60,type:'luxury',cost:8000},
  luxury:{emoji:'👜',name:'Дорогой подарок',power:55,type:'luxury',cost:12000},
  dinner:{emoji:'🍽',name:'Ужин в ресторане',power:45,type:'experience',cost:2000},
  poem:{emoji:'📜',name:'Стихи',power:28,type:'romance',cost:300,desc:'Читаешь ей стихи'},
  serenade:{emoji:'🎸',name:'Серенада',power:42,type:'mood',cost:1500,desc:'Поёшь под окном'},
  dance:{emoji:'💃',name:'Танец',power:35,type:'affection',cost:700,desc:'Кружишь её в танце'},
};
// Free cards always available (never consumed)
const FREE_CARDS=['compliment','joke','hug','listen'];

// Her demand cards
const DEMANDS=[
  {emoji:'💅',name:'Каприз',power:22,type:'luxury',desc:'Хочет что-то дорогое'},
  {emoji:'👜',name:'Новая сумка',power:30,type:'luxury',desc:'Подруга купила новую сумку...'},
  {emoji:'📱',name:'Телефон',power:20,type:'trust',desc:'Дай телефон проверю'},
  {emoji:'🥺',name:'Внимание',power:25,type:'attention',desc:'Ты меня не замечаешь!'},
  {emoji:'🌺',name:'Хочу цветы',power:18,type:'romance',desc:'Когда ты последний раз дарил?'},
  {emoji:'😤',name:'Обида',power:22,type:'mood',desc:'Ты сказал не то...'},
  {emoji:'🏠',name:'Квартира?',power:35,type:'status',desc:'Подруга переехала в свой дом!'},
  {emoji:'🍽',name:'Ресторан',power:28,type:'experience',desc:'Хочу в ресторан, давно не ходили'},
  {emoji:'🛍',name:'Шоппинг',power:32,type:'luxury',desc:'Ты же любишь меня?'},
];
const COUNTER_BONUS={luxury:['ring','luxury','gift'],romance:['bouquet','bouquet_cheap','compliment','poem'],
  attention:['compliment','listen','hug'],trust:['listen','hug','compliment'],
  mood:['joke','hug','compliment','serenade'],experience:['dinner','gift'],
  status:['ring','luxury'],sweet:['choc','gift'],affection:['hug','dance','compliment']};

// ── Girls on map ─────────────────────────────────────────────────────────────
// Opening lines by personality type (shown before battle)
const GIRL_OPENERS={
  romantic:['Ты такой романтичный... Посмотрим, что ты умеешь 💕','Мечтала о такой встрече! Докажи, что ты не как все 🌹','Звёзды сегодня красивые... А ты?'],
  intellectual:['Прежде чем говорить — докажи, что умеешь слушать 📚','Интересно, умеешь ли ты поддержать умный разговор?','Читал Достоевского? Я тебя проверю 😊'],
  adventurous:['Эй! Не стой на месте, давай что-нибудь сделаем! 🏃','Скучно? Тогда за мной! Я знаю классное место 🗺','Жизнь слишком коротка для скуки. Удиви меня!'],
  materialistic:['Ммм, интересно... А у тебя есть вкус? 💎','Подожди... Это что, дешёвые часы? Шутка, посмотрим 😂','Я люблю красивые вещи. Что ты можешь предложить?'],
  caring:['Ты такой... заботливый на вид? Или нет? 🌸','Мне важно чувствовать себя особенной. Умеешь?','Главное — внимание. Ты меня слышишь? 👂'],
  status:['Знаешь, я бываю только в лучших местах 👑','Подписчики смотрят — не облажайся! 😎','Ты вообще кто? Расскажи о себе.'],
  trust:['Я ценю честных людей. Ты честный? 🤝','Сначала надо узнать тебя получше...','Доверие строится медленно. Начнём?'],
};
const GIRL_DATA=[
  {name:'Алиса',face:'arina',color:'#ff6b9d',personality:'romantic',desc:'Романтичная 💕 Любит комплименты',bias:['romance','attention']},
  {name:'Катя',face:'lilya',color:'#f48fb1',personality:'intellectual',desc:'Умная 📚 Ценит беседы',bias:['mood','experience']},
  {name:'Маша',face:'arina',color:'#f06292',personality:'adventurous',desc:'Активная 🏃 Хочет приключений',bias:['experience','mood']},
  {name:'Настя',face:'lilya',color:'#ec407a',personality:'materialistic',desc:'Материалистка 💎 Любит роскошь',bias:['luxury','status']},
  {name:'Даша',face:'arina',color:'#e91e63',personality:'caring',desc:'Нежная 🌸 Ценит заботу',bias:['attention','trust']},
  {name:'Юля',face:'lilya',color:'#ff80ab',personality:'status',desc:'Гламурная 👑 Статус важен',bias:['status','luxury']},
  {name:'Лена',face:'arina',color:'#ad1457',personality:'trust',desc:'Верная 🤝 Строит доверие',bias:['trust','attention']},
  {name:'Аня',face:'lilya',color:'#ff4081',personality:'romantic',desc:'Мечтательная 🌙 Ищет любовь',bias:['romance','trust']},
];
const GIRL_DISTRICTS=[
  {col:6,row:3,level:1},{col:4,row:6,level:1},{col:8,row:2,level:2},
  {col:15,row:4,level:3},{col:18,row:6,level:3},{col:16,row:2,level:3},
  {col:3,row:12,level:1},{col:7,row:15,level:1},{col:10,row:11,level:2},
  {col:16,row:13,level:2},{col:20,row:14,level:2},{col:13,row:16,level:2},
];
let GIRLS=[];
function spawnGirls(){
  GIRLS=GIRL_DISTRICTS.map((pos,i)=>{
    const gd=GIRL_DATA[i%GIRL_DATA.length];
    return{col:pos.col,row:pos.row,level:pos.level||1,...gd,beaten:false,id:i};
  });
}

// ── Wandering NPCs ────────────────────────────────────────────────────────────
const NPC_TYPES=[
  {type:'vendor',emoji:'🛒',color:'#4fc3f7',name:'Торговец',
    onMeet:()=>{const xtra=Math.random()<.5?500:1000;G.money+=xtra;showPhone('Торговец: скидка! +'+xtra+'₽ 🛒');gainXP(5);}},
  {type:'advisor',emoji:'💡',color:'#ffb74d',name:'Советник',
    onMeet:()=>{const tips=['Иди в Патрики — там лучшие девушки!','Зарплата растёт с уровнем персонажа','Тёща — финальный босс. Готовься!','Метро сэкономит тебе ходы!','Купи кольцо в Картье для сюжета'];const t=tips[Math.floor(Math.random()*tips.length)];showPhone('💡 Совет: '+t);gainXP(3);}},
  {type:'bystander',emoji:'🧑',color:'#81c784',name:'Прохожий',
    onMeet:()=>{if(Math.random()<.4){G.money+=200;showPhone('Прохожий уронил 200₽! 💵');}else{G.energy=Math.min(G.maxEnergy,G.energy+1);showPhone('Прохожий угостил кофе: +1 энергия ☕');}}},
];
let NPCS=[];
function spawnNPCs(){
  NPCS=[];
  const positions=[
    {col:7,row:4},{col:3,row:7},{col:17,row:4},{col:20,row:7},
    {col:5,row:14},{col:9,row:13},{col:18,row:15},{col:15,row:12},
  ];
  positions.forEach((pos,i)=>{
    const t=NPC_TYPES[i%NPC_TYPES.length];
    NPCS.push({col:pos.col,row:pos.row,...t,met:false});
  });
}
function updateNPCs(){
  NPCS.forEach(npc=>{
    // Respawn after 3 days
    if(npc.met){
      if(!npc.respawnDay)npc.respawnDay=G.day+3;
      if(G.day>=npc.respawnDay){
        npc.met=false;npc.respawnDay=0;
        // Move to random position
        const pos=[[7,4],[3,7],[17,4],[20,7],[5,14],[9,13],[18,15],[15,12]];
        const p=pos[Math.floor(Math.random()*pos.length)];
        npc.col=p[0];npc.row=p[1];
      }
      return;
    }
    const nb=hexNeighbors(npc.col,npc.row);
    if(nb.length&&Math.random()<.3){
      const n=nb[Math.floor(Math.random()*nb.length)];
      if(MAP[n.row]&&MAP[n.row][n.col]!==HT.WATER&&MAP[n.row][n.col]!==HT.MKAD&&!OBJ_HEXES[hexKey(n.col,n.row)]){
        npc.col=n.col;npc.row=n.row;
      }
    }
    // Meet hero
    if(npc.col===G.col&&npc.row===G.row){
      npc.met=true;npc.onMeet();playSFX('event');
      spawnParticles(W/2,H/2,'stars');
    }
  });
}

// ── Game state ────────────────────────────────────────────────────────────────
let G={};
let FI={};
function preloadFaces(){
  Object.entries(FD).forEach(([k,v])=>{const img=new Image();img.src=v;FI[k]=img;});
}
function initG(charId){
  const ch=CHARS[charId];
  const baseEnergy=ch.bonus==='sport'?13:10;
  const baseMoves=ch.bonus==='car'?7:5;
  G={char:charId,ch,
    turn:1,day:1,moves:baseMoves,maxMoves:baseMoves,
    energy:baseEnergy,maxEnergy:baseEnergy,
    money:ch.bonus==='discount'?~~(ch.money*1.1):ch.money,
    rep:50,rel:0,xp:0,level:1,
    stats:{...ch.stat},charisma:ch.stat.charisma,looks:ch.stat.looks,
    col:5,row:4,
    fog:new Set(),explored:new Set(),
    cards:[...FREE_CARDS],
    units:[],
    apt:{level:1,gym:false,salon:false},
    charmBuff:0,looksBuff:0,
    discountTimer:0,energyBuff:0,
    mode:'free',chapter:0,storyFlags:{},
    distStatus:{patriki:true}, // start in patriki, no bonus
  };
  revealFog(5,4,3);
}

function revealFog(col,row,radius){
  let newHexes=0;
  for(let r=row-radius;r<=row+radius;r++){
    for(let c=col-radius;c<=col+radius;c++){
      if(c<0||c>=COLS||r<0||r>=ROWS)continue;
      if(hexDist(col,row,c,r)<=radius){
        const k=hexKey(c,r);
        if(!G.explored.has(k))newHexes++;
        G.fog.add(k);G.explored.add(k);
      }
    }
  }
  if(newHexes>0&&G.level)gainXP(newHexes);
}

// ── Random events ─────────────────────────────────────────────────────────────
// Events with choices (dialog-based)
const REVENTS=[
  {title:'📱 Бывшая написала!',dialog:true,
    text:'Бывшая: "Привет, как дела? Соскучилась..." Что делаешь?',
    choices:[
      {text:'Игнорирую 🙅',rel:0,pts:0,response:'Правильно! Нечего отвечать.'},
      {text:'Отвечаю по-доброму',rel:-5,pts:0,response:'Алиса нашла переписку... -5 к отношениям'},
      {text:'Блокирую сразу',rel:+3,pts:0,response:'Молодец! +3 к отношениям с Алисой'},
    ]},
  {title:'💸 Мама прислала деньги!',dialog:false,e:()=>{G.money+=5000;showPhone('+5000₽ от мамы! 💕');playSFX('buy');}},
  {title:'🍺 Друзья зовут в бар',dialog:true,
    text:'Друзья: "Пятница! Бар! Не приходи — потеряешь нас!" Идёшь?',
    choices:[
      {text:'Иду! Один вечер не считается 🍺',
        e:()=>{G.energy=Math.min(G.maxEnergy,G.energy+3);G.moves=Math.max(1,G.moves-1);G.rel=Math.max(0,G.rel-5);},
        response:'Отлично погуляли! +3 энергии, -1 ход, -5 к отношениям'},
      {text:'Нет, у меня дела',
        e:()=>{G.rep=Math.min(100,G.rep+3);},
        response:'Друзья уважают твой выбор. +3 Репутации'},
    ]},
  {title:'🛍 Скидки в WildBerry!',dialog:false,e:()=>{G.discountTimer=3;showPhone('WildBerry: скидки -30% на 3 хода! 🛍');playSFX('event');}},
  {title:'👛 Нашёл кошелёк!',dialog:true,
    text:'На улице лежит кошелёк с 3000₽ и паспортом. Что делаешь?',
    choices:[
      {text:'Беру деньги, выброшу кошелёк',e:()=>{G.money+=3000;},response:'+3000₽. Но совесть немного гложет...'},
      {text:'Сдаю в полицию',e:()=>{G.rep=Math.min(100,G.rep+8);},response:'Репутация растёт! +8 🧠 Репутации'},
      {text:'Оставляю как есть',e:()=>{},response:'Сделал вид что не заметил.'},
    ]},
  {title:'🚔 Штраф за парковку',dialog:false,e:()=>{G.money=Math.max(0,G.money-1500);showPhone('-1500₽ штраф за парковку 😤');}},
  {title:'🚗 Пробки на МКАД',dialog:false,e:()=>{G.moves=Math.max(1,G.moves-1);showPhone('Пробки! -1 ход 🚗');}},
  {title:'💪 Встретил тренера',dialog:true,
    text:'Знакомый тренер предлагает бесплатную тренировку. Идёшь?',
    choices:[
      {text:'Да, хочу поработать над собой!',e:()=>{G.stats.charisma++;G.energy=Math.max(1,G.energy-1);},response:'Отличная тренировка! +1 Харизма, -1 Энергия'},
      {text:'Нет времени, потом',e:()=>{},response:'Ладно, в следующий раз.'},
    ]},
  {title:'🤝 Встреча с бизнес-партнёром',dialog:true,
    text:'Партнёр предлагает вложить деньги в его стартап. Рискнёшь?',
    choices:[
      {text:'Вкладываю 5000₽ — рискну!',e:()=>{if(G.money>=5000){G.money-=5000;const win=Math.random()<.55;if(win){G.money+=12000;return'+12000₽! Стартап выстрелил! 🎉';}else{return'Стартап провалился. Деньги потеряны 😭';}}else{return'Недостаточно денег...';}},response:'Подписываешь бумаги...'},
      {text:'Слишком рискованно, откажусь',e:()=>{G.rep=Math.min(100,G.rep+3);},response:'+3 Репутации за осторожность. Иногда лучше не рисковать.'},
    ]},
  {title:'🎤 Стендап-шоу',dialog:true,
    text:'Дружище устроил стендап. Берёшь билет за 700₽?',
    choices:[
      {text:'Беру! Повеселимся 🎤',e:()=>{if(G.money>=700){G.money-=700;G.rel=Math.min(100,G.rel+6);G.energy=Math.min(G.maxEnergy,G.energy+2);return'+6❤️ +2⚡ — отличный вечер!';}else{return'Денег нет на билет...';}},response:'В очереди на кассе...'},
      {text:'Не мой формат',e:()=>{},response:'Дома спокойнее.'},
    ]},
  {title:'🏆 Конкурс в соцсетях',dialog:false,
    e:()=>{const win=Math.random()<.4;if(win){const prize=Math.floor(Math.random()*3+1)*1000;G.money+=prize;G.rep=Math.min(100,G.rep+5);showPhone('Выиграл конкурс! +'+prize+'₽ +5🧠 🏆');playSFX('win');}else{showPhone('Не повезло в конкурсе... Зато опыт!');}}},
  {title:'🎁 Её День Рождения!',dialog:true,
    text:'Алиса намекала... сегодня её день рождения! Срочно!',
    choices:[
      {text:'Покупаю самое дорогое! 💎',e:()=>{playSFX(G.money>=5000?'buy':'fail');if(G.money>=5000){G.money-=5000;G.rel=Math.min(100,G.rel+20);return'+20 к отношениям! 💕';}else{G.rel=Math.max(0,G.rel-15);return'Денег нет... -15 к отношениям 😭';}},response:'Смотришь на ценник...'},
      {text:'Цветы и торт 🎂',e:()=>{G.money=Math.max(0,G.money-500);G.rel=Math.min(100,G.rel+8);},response:'+8 к отношениям. Она рада, но ожидала больше...'},
      {text:'Ничего не подарю',e:()=>{G.rel=Math.max(0,G.rel-20);},response:'-20 к отношениям. Она ОЧЕНЬ обиделась. 😤'},
    ]},
];
// District-specific events
const DISTRICT_EVENTS={
  patriki:[
    {title:'🥂 Тусовка в Патриках!',dialog:false,e:()=>{G.rel=Math.min(100,G.rel+5);G.rep=Math.min(100,G.rep+3);showPhone('Крутая вечеринка! +5❤️ +3🧠');playSFX('event');}},
    {title:'☕ Кофе в Starbucks',dialog:false,e:()=>{G.energy=Math.min(G.maxEnergy,G.energy+2);G.money=Math.max(0,G.money-300);showPhone('Кофе: +2⚡ -300₽');}},
  ],
  krasnogorsk:[
    {title:'🚗 Увидел Bentley!',dialog:false,e:()=>{G.storyFlags.sawBentley=true;showPhone('Богатство Красногорска... вдохновляет!');G.rep=Math.min(100,G.rep+2);}},
    {title:'💎 Ювелирный акцент',dialog:false,e:()=>{if(G.money>=3000){G.money-=3000;G.rel=Math.min(100,G.rel+10);showPhone('Купил серёжки: +10❤️');}else showPhone('Тут нужны деньги...');}},
  ],
  mytishi:[
    {title:'🥟 Пельмени у соседей',dialog:false,e:()=>{G.energy=Math.min(G.maxEnergy,G.energy+3);showPhone('Угостили пельменями: +3⚡');}},
    {title:'🏚 Коммунальный скандал',dialog:false,e:()=>{G.rep=Math.max(0,G.rep-3);showPhone('Скандал в подъезде... -3🧠');}},
  ],
  ramenki:[
    {title:'📦 WildBerry промокод',dialog:false,e:()=>{G.discountTimer=2;showPhone('Промокод! Скидки -30% на 2 хода 📦');playSFX('event');}},
    {title:'🏋 Стрит-воркаут',dialog:false,e:()=>{G.stats.charisma++;showPhone('Воркаут: +1 Харизма 💪');playSFX('buy');}},
  ],
};

let evCooldown=0;
function tryEvent(){
  if(evCooldown>0){evCooldown--;return;}
  // День Влюблённых — day 14 special event (once per game)
  if(G.day===14&&!G.storyFlags.valentineDone){
    G.storyFlags.valentineDone=true;
    const ev={title:'💝 День Влюблённых!',dialog:true,
      text:'14 февраля! Сегодня весь город в огне любви. Все женщины восприимчивее. Что будешь делать?',
      choices:[
        {text:'Устрою грандиозный сюрприз 🌹',e:()=>{if(G.money>=2000){G.money-=2000;G.rel=Math.min(100,G.rel+25);spawnParticles(W/2,H/2,'hearts');playSFX('win');return'+25❤️! Она в восторге! 💕';}else{return'Не хватает денег на сюрприз...';}},response:'Готовишь план...'},
        {text:'Напишу стихи и спою серенаду',e:()=>{G.rel=Math.min(100,G.rel+15);G.rep=Math.min(100,G.rep+5);spawnParticles(W/2,H/2,'hearts');return'+15❤️ +5🧠 — романтика зашкаливает!';},response:'Берёшь гитару...'},
        {text:'Обычный день, не отмечаю',e:()=>{G.rel=Math.max(0,G.rel-10);return'Она запомнит это... -10❤️';},response:'Делаешь вид что не знаешь...'},
      ]};
    const mapped=ev.choices.map(c=>({text:c.text,rel:0,pts:0,response:c.response,fn:c.e}));
    showDialog(ev.title,ev.text,mapped,()=>{updateHUD();render();});
    evCooldown=6;return;
  }
  if(Math.random()<.28){
    // 30% chance of district-specific event
    const curDist=getDistrict(G.col,G.row);
    let ev;
    if(Math.random()<.3&&DISTRICT_EVENTS[curDist]){
      const distEvs=DISTRICT_EVENTS[curDist];
      ev=distEvs[Math.floor(Math.random()*distEvs.length)];
    } else {
      ev=REVENTS[Math.floor(Math.random()*REVENTS.length)];
    }
    if(ev.dialog){
      // Map event choices to showDialog format; e() runs as fn (at click time, dynamic response)
      const mapped=ev.choices.map(c=>({
        text:c.text,rel:c.rel||0,pts:c.pts||0,
        response:c.response||'...',
        fn:c.e||null
      }));
      showDialog(ev.title,ev.text,mapped,(idx)=>{updateHUD();render();});
    } else {
      ev.e();playSFX('event');
    }
    evCooldown=4;
  }
}

function showPhone(t){const el=document.getElementById('phone');el.textContent=t;el.style.display='block';clearTimeout(el._t);el._t=setTimeout(()=>el.style.display='none',3200);}

// ── Turn system ───────────────────────────────────────────────────────────────
function showDayBanner(day,wxLabel){
  const el=document.getElementById('dayBanner');
  const num=document.getElementById('dayBannerNum');
  const wx=document.getElementById('dayBannerWx');
  if(!el)return;
  num.textContent='День '+day;
  wx.textContent=wxLabel||'';
  el.classList.remove('show');
  void el.offsetWidth; // reflow
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2100);
}

function endTurn(){
  haptic('impact');
  const prevDay=G.day;
  G.turn++;
  G.day=Math.ceil(G.turn/3);
  // Apply weather effects to moves/energy
  const wx=getWeather();
  G.moves=Math.max(1,G.maxMoves+(wx.moveBonus||0));
  G.energy=Math.min(G.maxEnergy,G.energy+4+(wx.energyBonus||0));
  if(wx.romBonus)G.rel=Math.min(100,G.rel+wx.romBonus);
  // Daily salary income + new weather
  if(G.day>prevDay){
    rollWeather();
    const newWx=getWeather();
    showDayBanner(G.day,newWx.label+' '+(newWx.id==='sunny'?'Солнечно':newWx.id==='cloudy'?'Пасмурно':newWx.id==='rainy'?'Дождь':newWx.id==='snowy'?'Снег':''));
    if(newWx.id!=='sunny')showPhone(newWx.label+' Погода: '+{cloudy:'Пасмурно',rainy:'Дождь! +'+wx.romBonus+'❤️',snowy:'Снег! +'+wx.romBonus+'❤️ но -ход'}[newWx.id]);
    const salary=1500*(G.stats.salary||1)+(G.units.includes('driver')?500:0);
    G.money+=salary;
    showPhone('💰 Зарплата +'+salary.toLocaleString('ru')+'₽ (День '+G.day+')');
    haptic('success');playSFX('buy');spawnParticles(W/2,H*0.4,'money');
  }
  playSFX('turn');
  if(G.charmBuff>0)G.charmBuff--;
  if(G.looksBuff>0)G.looksBuff--;
  if(G.discountTimer>0)G.discountTimer--;
  updateNPCs();
  GIRLS.forEach(gi=>{
    // Girls wander slightly
    const nb=hexNeighbors(gi.col,gi.row);
    if(nb.length&&Math.random()<.4){
      const n=nb[Math.floor(Math.random()*nb.length)];
      if(MAP[n.row][n.col]!==HT.WATER&&MAP[n.row][n.col]!==HT.MKAD&&!OBJ_HEXES[hexKey(n.col,n.row)]){
        gi.col=n.col;gi.row=n.row;
      }
    }
  });
  tryEvent();
  updateHUD();
  selectedHex=null;reachSet=null;
  render();
  checkAchievements();
  // Story chapter advance
  if(G.mode==='campaign')checkChapter();
  // Free mode: 30-day challenge
  if(G.mode==='free'&&G.day>=30&&!G.storyFlags.freeEnded){
    G.storyFlags.freeEnded=true;
    const score=G.money+G.rel*200+G.rep*100+G.level*500;
    const girlsBeaten=GIRLS.filter(g=>g.beaten).length;
    const rank=score>=50000?'🏆 Легенда!':score>=25000?'⭐ Хорошо':score>=10000?'👍 Неплохо':'😅 Новичок';
    document.getElementById('goEmoji').textContent=rank.split(' ')[0];
    document.getElementById('goTitle').textContent='30 дней. '+rank.split(' ').slice(1).join(' ');
    document.getElementById('goSub').textContent='Свободная игра завершена! Успел всё?';
    document.getElementById('goStats').innerHTML=
      '💰 '+G.money.toLocaleString('ru')+'₽ · ❤️ '+G.rel+'% · 🧠 '+G.rep+'<br>'+
      '💕 Свиданий: '+girlsBeaten+'/'+GIRLS.length+' · 🆙 Уровень: '+G.level+'<br>'+
      '🏆 Общий счёт: '+score.toLocaleString('ru');
    document.getElementById('goScreen').classList.add('active');
    playSFX('win');spawnParticles(W/2,H/2,'win');
    stopBGMusic();
    checkAndSaveBest();
  }
}

// ── Sound effects ─────────────────────────────────────────────────────────────
let _AC=null;
function getAC(){if(!_AC){try{_AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return _AC;}
function playSFX(type){
  const ac=getAC();if(!ac)return;
  try{
    const o=ac.createOscillator(),g=ac.createGain();
    o.connect(g);g.connect(ac.destination);const now=ac.currentTime;
    if(type==='move'){o.type='sine';o.frequency.setValueAtTime(330,now);o.frequency.exponentialRampToValueAtTime(550,now+.08);g.gain.setValueAtTime(.06,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.start(now);o.stop(now+.12);}
    else if(type==='buy'){o.type='triangle';o.frequency.setValueAtTime(523,now);o.frequency.setValueAtTime(784,now+.1);g.gain.setValueAtTime(.1,now);g.gain.exponentialRampToValueAtTime(.001,now+.25);o.start(now);o.stop(now+.25);}
    else if(type==='turn'){o.type='sine';o.frequency.setValueAtTime(440,now);o.frequency.setValueAtTime(550,now+.1);o.frequency.setValueAtTime(660,now+.2);g.gain.setValueAtTime(.07,now);g.gain.exponentialRampToValueAtTime(.001,now+.35);o.start(now);o.stop(now+.35);}
    else if(type==='win'){o.type='triangle';[523,659,784,1047].forEach((f,i)=>{const o2=ac.createOscillator(),g2=ac.createGain();o2.connect(g2);g2.connect(ac.destination);o2.frequency.value=f;g2.gain.setValueAtTime(.12,now+i*.07);g2.gain.exponentialRampToValueAtTime(.001,now+i*.07+.2);o2.start(now+i*.07);o2.stop(now+i*.07+.2);});}
    else if(type==='fail'){o.type='sawtooth';o.frequency.setValueAtTime(300,now);o.frequency.exponentialRampToValueAtTime(80,now+.3);g.gain.setValueAtTime(.1,now);g.gain.exponentialRampToValueAtTime(.001,now+.35);o.start(now);o.stop(now+.35);}
    else if(type==='event'){o.type='sine';o.frequency.setValueAtTime(660,now);o.frequency.setValueAtTime(440,now+.1);g.gain.setValueAtTime(.1,now);g.gain.exponentialRampToValueAtTime(.001,now+.2);o.start(now);o.stop(now+.2);}
  }catch(e){}
}

// ── Ambient music ─────────────────────────────────────────────────────────────
let bgMusic={node:null,gain:null,on:false};
const AMBIENT_NOTES=[220,261,294,330,349,392,440,494]; // A minor scale
let bgNoteIdx=0,bgNoteTimer=null;
function startBGMusic(){
  if(bgMusic.on)return;
  const ac=getAC();if(!ac)return;
  bgMusic.on=true;
  bgMusic.gain=ac.createGain();
  bgMusic.gain.gain.setValueAtTime(0,ac.currentTime);
  bgMusic.gain.gain.linearRampToValueAtTime(0.04,ac.currentTime+2);
  bgMusic.gain.connect(ac.destination);
  function playNote(){
    if(!bgMusic.on||!bgMusic.gain)return;
    try{
      const o=ac.createOscillator();const g2=ac.createGain();
      o.connect(g2);g2.connect(bgMusic.gain);
      const note=AMBIENT_NOTES[bgNoteIdx%AMBIENT_NOTES.length];
      bgNoteIdx++;
      const oct=Math.random()<.3?2:1;
      o.type='sine';o.frequency.value=note*oct;
      const dur=1.8+Math.random()*1.2;
      const now2=ac.currentTime;
      g2.gain.setValueAtTime(0,now2);
      g2.gain.linearRampToValueAtTime(.6,now2+.2);
      g2.gain.linearRampToValueAtTime(0,now2+dur);
      o.start(now2);o.stop(now2+dur+.1);
    }catch(e){}
    bgNoteTimer=setTimeout(playNote,(1200+Math.random()*800));
  }
  // delay first note slightly
  bgNoteTimer=setTimeout(playNote,1000);
}
function stopBGMusic(){
  bgMusic.on=false;
  if(bgNoteTimer)clearTimeout(bgNoteTimer);
  if(bgMusic.gain){try{bgMusic.gain.gain.setValueAtTime(bgMusic.gain.gain.value,getAC().currentTime);bgMusic.gain.gain.linearRampToValueAtTime(0,getAC().currentTime+1);}catch(e){}}
}

// ── Hero animation ─────────────────────────────────────────────────────────────
let heroAnim={active:false,sx:0,sy:0,ex:0,ey:0,t:0};
function getHeroRenderPos(){
  if(!heroAnim.active)return hexCenter(G.col,G.row);
  heroAnim.t+=0.14;
  if(heroAnim.t>=1){heroAnim.active=false;return hexCenter(G.col,G.row);}
  const e=1-Math.pow(1-heroAnim.t,3); // ease out cubic
  return{x:heroAnim.sx+(heroAnim.ex-heroAnim.sx)*e,y:heroAnim.sy+(heroAnim.ey-heroAnim.sy)*e};
}

// ── Movement ──────────────────────────────────────────────────────────────────
let selectedHex=null,reachSet=null;
function moveHeroTo(col,row){
  if(G.moves<=0){showPhone('Нет ходов! Конец хода →');return;}
  const d=hexDist(G.col,G.row,col,row);
  if(d===0)return;
  if(reachSet&&!reachSet.has(hexKey(col,row))){showPhone('Слишком далеко! '+G.moves+' ходов осталось');return;}
  // Start animation
  const start=hexCenter(G.col,G.row);
  G.moves-=Math.max(1,Math.min(d,G.moves));
  G.col=col;G.row=row;
  const end=hexCenter(col,row);
  heroAnim={active:true,sx:start.x,sy:start.y,ex:end.x,ey:end.y,t:0};
  revealFog(col,row,3);
  // First district visit bonus
  const dist=getDistrict(col,row);
  if(!G.distStatus[dist]){
    G.distStatus[dist]=true;
    const distNames={patriki:'Патрики 🥂',krasnogorsk:'Красногорск 👑',mytishi:'Мытищи 🏚',ramenki:'Раменки 🏢'};
    const bonus=dist==='krasnogorsk'?3000:1500;
    G.money+=bonus;gainXP(30);
    showPhone('🗺️ Первый визит: '+distNames[dist]+'! +'+bonus+'₽ +30XP');
    playSFX('event');spawnParticles(W/2,H/2,'stars');
  }
  selectedHex=null;reachSet=null;
  updateHUD();playSFX('move');
  // Check if landing on girl, тёща, or NPC
  setTimeout(()=>{
    // Тёща boss fight (chapter 5)
    if(G.storyFlags.needTyoshcha&&!G.storyFlags.tyoshchaDefeated&&col===TYOSHCHA_COL&&row===TYOSHCHA_ROW){
      startTyoshchaBattle();return;
    }
    // NPCs
    const npc=NPCS.find(n=>!n.met&&n.col===col&&n.row===row);
    if(npc){npc.met=true;npc.onMeet();playSFX('event');spawnParticles(W/2,H/2,'stars');return;}
    const girl=GIRLS.find(gi=>!gi.beaten&&gi.col===col&&gi.row===row);
    if(girl){
      // Pre-battle opener based on personality
      const openers=GIRL_OPENERS[girl.personality]||['Привет! Готов?'];
      const opener=openers[Math.floor(Math.random()*openers.length)];
      showDialog(girl.name,opener,[
        {text:'Познакомимся 😊',rel:0,pts:0,response:'Ладно, посмотрим... 😊'},
        {text:'Конечно, готов!',rel:0,pts:0,response:'Хорошо. Начнём! 🌟'},
      ],()=>startBattle(girl));
    }
  },400);
  render();
}

// ── Object interaction ────────────────────────────────────────────────────────
let pendingHexAction=null;
function selectHex(col,row){
  const k=hexKey(col,row);
  if(!G.fog.has(k)){
    // First visit — reveal
    revealFog(col,row,2);render();return;
  }
  selectedHex={col,row};
  reachSet=hexReachable(G.col,G.row,G.moves);
  const obj=OBJ_HEXES[k];
  const el=document.getElementById('hexInfo');
  if(obj){
    pendingHexAction={col,row,obj};
    document.getElementById('hiTitle').textContent=obj.emoji+' '+obj.name;
    document.getElementById('hiDesc').textContent=obj.desc||'';
    const btn=document.getElementById('hiBtn');
    btn.style.display='block';
    let label='Войти';
    if(obj.price)label=\`Купить (\${(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round(obj.price*.75):obj.price}₽)\`;
    else if(obj.cost)label=\`Посетить (\${obj.cost}₽)\`;
    btn.textContent=label;
    el.style.display='block';
  } else {
    // Тёща boss
    if(G.storyFlags&&G.storyFlags.needTyoshcha&&!G.storyFlags.tyoshchaDefeated&&col===TYOSHCHA_COL&&row===TYOSHCHA_ROW){
      document.getElementById('hiTitle').textContent='👩‍👧 Тёща';
      document.getElementById('hiDesc').textContent='ФИНАЛЬНЫЙ БОСС · Нужно получить её благословение';
      const btn=document.getElementById('hiBtn');btn.style.display='block';btn.textContent='⚔️ Поговорить';
      pendingHexAction={col,row,tyoshcha:true};
      document.getElementById('hexInfo').style.display='block';return;
    }
    const girl=GIRLS.find(gi=>!gi.beaten&&gi.col===col&&gi.row===row);
    if(girl){
      document.getElementById('hiTitle').textContent='👩 '+girl.name;
      document.getElementById('hiDesc').textContent=(girl.desc||'Уровень '+girl.level)+' · Нажми чтобы познакомиться';
      const btn=document.getElementById('hiBtn');btn.style.display='block';btn.textContent='Познакомиться';
      pendingHexAction={col,row,girl};
      el.style.display='block';
    } else {
      document.getElementById('hiTitle').textContent=terrainName(MAP[row]?.[col]||0);
      document.getElementById('hiDesc').textContent='';
      document.getElementById('hiBtn').style.display='none';
      pendingHexAction=null;
      el.style.display='block';
    }
  }
  render();
}

function hexAction(){
  if(!pendingHexAction)return;
  const {col,row,obj,girl,tyoshcha}=pendingHexAction;
  const k=hexKey(col,row);
  // First move there if not adjacent
  const d=hexDist(G.col,G.row,col,row);
  if(d>0){
    if(!reachSet||!reachSet.has(k)){showPhone('Нет ходов чтобы добраться!');return;}
    G.moves-=Math.max(1,d);G.col=col;G.row=row;revealFog(col,row,3);
  }
  if(tyoshcha){startTyoshchaBattle();return;}
  if(girl){startBattle(girl);return;}
  if(!obj)return;
  // Shop
  if(obj.effect&&obj.effect.startsWith('card_')){
    const cardId=obj.effect.replace('card_','');
    const price=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.price||0)*.75):(obj.price||0);
    if(G.money<price){showPhone('Нет денег! 💸');haptic('error');return;}
    G.money-=price;
    if(!G.cards.includes(cardId))G.cards.push(cardId);
    showPhone((ALL_CARDS[cardId]?.emoji||'✅')+' '+obj.name+' куплено!');haptic('success');
    playSFX('buy');spawnParticles(W/2,H*0.7,'money');gainXP(10);
  } else if(obj.type==='metro'){
    showMetroMenu();return;
  } else if(obj.type==='gym'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег! 💸');return;}
    G.money-=cost;G.charmBuff=3;G.stats.charisma++;showPhone('💪 Харизма +1 на 3 хода!');haptic('success');
  } else if(obj.type==='salon'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег! 💸');return;}
    G.money-=cost;G.looksBuff=3;G.stats.looks++;showPhone('💅 Внешность +1 на 3 хода!');haptic('success');
  } else if(obj.type==='park'){
    G.energy=Math.min(G.maxEnergy,G.energy+3);showPhone('🌳 Отдохнул! +3 Энергии');haptic('light');
  } else if(obj.type==='hq'){
    openApt();return;
  } else if(obj.type==='mom'){
    startMomBattle();return;
  } else if(obj.bonus==='energy'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег!');return;}
    G.money-=cost;G.energy=G.maxEnergy;showPhone('🍲 Поел, энергия восстановлена!');haptic('success');
  } else if(obj.bonus==='charisma'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег!');return;}
    G.money-=cost;G.charmBuff=2;if(!G.cards.includes('dinner'))G.cards.push('dinner');
    showPhone('🍜 Отличный ужин! +Харизма, получена карта Ужин');haptic('success');
  } else if(obj.bonus==='dinner'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег!');return;}
    G.money-=cost;if(!G.cards.includes('dinner'))G.cards.push('dinner');
    showPhone('🍱 Романтический ужин! Карта Ужин добавлена.');haptic('success');
  } else if(obj.bonus==='rep'){
    const cost=(G.discountTimer>0||G.ch?.bonus==='discount')?Math.round((obj.cost||0)*.75):(obj.cost||0);
    if(G.money<cost){showPhone('Нет денег!');return;}
    G.money-=cost;G.rep=Math.min(100,G.rep+15);
    showPhone('🥂 Prestige! +15 Репутации');haptic('success');
  }
  pendingHexAction=null;document.getElementById('hexInfo').style.display='none';
  updateHUD();render();
}

function terrainName(t){
  return['Пустырь','Дорога','Парк','Магазин','Ресторан','Жилой дом','Метро','Качалка','Салон','Мамина квартира','Ювелирный','Вода','МКАД','Лес','Твоя квартира'][t]||'Неизвестно';
}

// Metro fast travel
function showMetroMenu(){
  const entries=Object.entries(OBJ_HEXES).filter(([k,o])=>o.type==='metro');
  const distNames=['Патрики','Красногорск','Мытищи','Раменки'];
  const choices=entries.map(([k,o],i)=>({
    text:o.name+' ('+distNames[i]+')',rel:0,pts:0,
    response:'Едем в '+distNames[i]+'!',
    _metroKey:k
  }));
  showDialog('🚇 Метро','Куда едем?',choices,(idx)=>{
    if(idx==null)return;
    const k=entries[idx][0];
    const col2=Math.floor(Number(k)/100),row2=Number(k)%100;
    G.col=col2;G.row=row2;G.moves=Math.max(0,G.moves-1);revealFog(col2,row2,3);
    selectedHex=null;reachSet=null;
    updateHUD();render();showPhone('🚇 Приехал: '+entries[idx][1].name);
  });
}

// ── Battle system ─────────────────────────────────────────────────────────────
let BATTLE=null;
function getBattleCards(){
  return G.cards.map(id=>({id,...(ALL_CARDS[id]||{emoji:'?',name:id,power:10,type:'generic'})}));
}
function startBattle(girl){
  haptic('impact');
  const demands=[];
  for(let i=0;i<5;i++){
    // 60% chance to pick a demand matching girl's personality bias
    let pool=DEMANDS;
    if(girl.bias&&Math.random()<.6){
      const biased=DEMANDS.filter(d=>girl.bias.includes(d.type));
      if(biased.length)pool=biased;
    }
    demands.push({...pool[Math.floor(Math.random()*pool.length)]});
  }
  // Scale demands by girl level
  demands.forEach(d=>{d.power=Math.round(d.power*(1+girl.level*.2));});

  BATTLE={girl,demands,round:0,heroHP:100+G.stats.charisma*5,girlHP:100+girl.level*15,
    maxHeroHP:100+G.stats.charisma*5,maxGirlHP:100+girl.level*15,
    log:'',cards:getBattleCards(),usedCards:new Set(),done:false,score:0};

  document.getElementById('bTitle').textContent='💕 Свидание: '+girl.name+(girl.desc?' · '+girl.desc:'');
  document.getElementById('battle').style.display='flex';
  updateBattleHUD();
  showNextDemand();
}

function startMomBattle(){
  haptic('impact');
  const girl={name:'Родители',level:4,color:'#9c27b0',id:-1};
  const demands=[
    {emoji:'🏠',name:'Квартира?',power:50,type:'status',desc:'Папа: Квартира есть?'},
    {emoji:'🚗',name:'Машина?',power:45,type:'status',desc:'Папа: Машина есть?'},
    {emoji:'🍲',name:'Борщ?',power:40,type:'experience',desc:'Мама: Борщ варишь?'},
    {emoji:'💰',name:'Зарплата?',power:55,type:'status',desc:'Папа: Сколько получаешь?'},
    {emoji:'👪',name:'Дети?',power:35,type:'affection',desc:'Мама: Когда внуки?'},
  ];
  BATTLE={girl,demands,round:0,heroHP:120,girlHP:200,maxHeroHP:120,maxGirlHP:200,
    log:'',cards:getBattleCards(),usedCards:new Set(),done:false,score:0,isMom:true};
  document.getElementById('bTitle').textContent='👪 Знакомство с родителями';
  document.getElementById('battle').style.display='flex';
  updateBattleHUD();showNextDemand();
}

// Тёща fixed position in Krasnogorsk
const TYOSHCHA_COL=17,TYOSHCHA_ROW=5;

function startTyoshchaBattle(){
  if(G.storyFlags.tyoshchaDefeated)return;
  haptic('impact');
  const girl={name:'Тёща',level:6,color:'#e91e63',id:-2};
  const demands=[
    {emoji:'🏠',name:'Квартира?',power:70,type:'status',desc:'Тёща: У тебя своя квартира есть?!'},
    {emoji:'💰',name:'Доходы?',power:75,type:'status',desc:'Тёща: И на что моя дочь жить будет?!'},
    {emoji:'👨‍👩‍👧',name:'Семья?',power:60,type:'affection',desc:'Тёща: Из какой ты семьи вообще?'},
    {emoji:'💍',name:'Кольцо?',power:80,type:'gift',desc:'Тёща: Это что, из подземного перехода?!'},
    {emoji:'🎓',name:'Образование?',power:65,type:'experience',desc:'Тёща: Диплом-то есть хоть?'},
  ];
  BATTLE={girl,demands,round:0,heroHP:150,girlHP:300,maxHeroHP:150,maxGirlHP:300,
    log:'',cards:getBattleCards(),usedCards:new Set(),done:false,score:0,isTyoshcha:true};
  document.getElementById('bTitle').textContent='👩‍👧 ФИНАЛЬНЫЙ БОСС: Тёща';
  document.getElementById('battle').style.display='flex';
  updateBattleHUD();showNextDemand();
}

function updateBattleHUD(){
  const b=BATTLE;
  document.getElementById('bRound').textContent='Раунд '+(b.round+1)+'/5';
  const hPct=Math.max(0,b.heroHP/b.maxHeroHP*100);
  const gPct=Math.max(0,b.girlHP/b.maxGirlHP*100);
  const hBar=document.getElementById('bHPHeroFill');
  hBar.style.width=hPct+'%';
  hBar.style.background=hPct>50?'linear-gradient(90deg,#ff6b9d,#ff4081)':hPct>25?'linear-gradient(90deg,#ffa726,#ff6f00)':'linear-gradient(90deg,#f44336,#b71c1c)';
  const gBar=document.getElementById('bHPGirlFill');
  gBar.style.width=gPct+'%';
  gBar.style.background=gPct>50?'linear-gradient(90deg,#f44336,#b71c1c)':gPct>25?'linear-gradient(90deg,#ff8f00,#f57f17)':'linear-gradient(90deg,#8bc34a,#558b2f)';
  document.getElementById('bHPHeroLbl').textContent='Твоё обаяние: '+Math.max(0,b.heroHP);
  document.getElementById('bHPGirlLbl').textContent=(b.girl.name+': ')+Math.max(0,b.girlHP);
  // Render cards
  const cc=document.getElementById('bCards');cc.innerHTML='';
  b.cards.forEach((card,i)=>{
    const div=document.createElement('div');div.className='bCard'+(b.usedCards.has(card.id)?' used':'');
    // Highlight if good counter
    const dem=b.demands[b.round];
    if(dem&&COUNTER_BONUS[dem.type]&&COUNTER_BONUS[dem.type].includes(card.id))div.classList.add('good');
    // Card type color accent
    const typeColors={attention:'#4fc3f7',mood:'#ffb74d',affection:'#f48fb1',romance:'#e91e63',luxury:'#ffd740',status:'#9c27b0',experience:'#69f0ae',generic:'#aaa'};
    const tc=typeColors[card.type]||'#aaa';
    div.style.borderColor=div.classList.contains('good')?'#69f0ae':tc+'66';
    div.innerHTML=\`<div class="bCardEmoji">\${card.emoji}</div><div class="bCardName" style="color:\${tc}">\${card.name}</div><div class="bCardPow">\${card.power} силы</div>\`;
    div.onclick=()=>playCard(i);cc.appendChild(div);
  });
}

function showNextDemand(){
  const b=BATTLE;
  if(b.round>=5||b.heroHP<=0||b.girlHP<=0){endBattle();return;}
  const dem=b.demands[b.round];
  document.getElementById('bDemandEmoji').textContent=dem.emoji;
  document.getElementById('bDemandName').textContent=dem.name;
  // Type tag
  const typeLabels={luxury:'Роскошь',romance:'Романтика',attention:'Внимание',trust:'Доверие',mood:'Настроение',experience:'Опыт',status:'Статус',sweet:'Сладкое',affection:'Нежность'};
  const typeEl=document.getElementById('bDemandType');
  if(typeEl){typeEl.textContent=typeLabels[dem.type]||dem.type;}
  document.getElementById('bDemandPow').textContent=dem.desc||('Сила: '+dem.power);
  // Show weakness hint
  const counters=COUNTER_BONUS[dem.type]||[];
  const counterNames=counters.slice(0,2).map(id=>ALL_CARDS[id]?.name||id).join(', ');
  document.getElementById('bLog').textContent=counterNames?'💡 Слабость: '+counterNames:'Выбери ответ...';
  updateBattleHUD();
}

function playCard(idx){
  const b=BATTLE;if(b.done)return;
  const card=b.cards[idx];
  if(!FREE_CARDS.includes(card.id)&&b.usedCards.has(card.id)){
    showPhone('Карта уже использована!');return;
  }
  const dem=b.demands[b.round];
  const isCounter=!!(COUNTER_BONUS[dem.type]&&COUNTER_BONUS[dem.type].includes(card.id));
  let mult=1;
  if(isCounter)mult=1.8;
  else if(card.type===dem.type)mult=1.4;
  // Combo: two counter cards in a row = bonus
  const comboMult=(isCounter&&b.lastWasCounter)?1.4:1;
  if(isCounter&&b.lastWasCounter)spawnParticles(W/2,H*0.6,'win');
  b.lastWasCounter=isCounter;
  // Critical hit: 20% base (30% for Vova — sport bonus)
  const critChance=G.ch?.bonus==='sport'?0.3:0.2;
  const isCrit=isCounter&&Math.random()<critChance;
  const critMult=isCrit?2:1;
  if(isCrit)spawnParticles(W/2,H*0.5,'stars');
  // Wingman bonus
  const wingBonus=G.units.includes('wingman')?1.2:1;
  const attack=Math.round(card.power*mult*comboMult*critMult*wingBonus*(1+G.stats.charisma*.05));
  const defense=Math.round(dem.power*(1-(G.charmBuff>0?.1:0)));
  const net=attack-defense;
  const logEl=document.getElementById('bLog');
  if(net>0){
    b.girlHP=Math.max(0,b.girlHP-net);b.score+=net;
    let pct=isCrit?'💥 КРИТИЧЕСКИЙ УДАР!':mult>=1.8?'🎯 Идеально!':mult>=1.4?'👍 Хорошо':wingBonus>1?'🤝 Вингмен помог!':'🙂 Нейтрально';
    if(comboMult>1&&!isCrit)pct='🔥 КОМБО! '+pct;
    logEl.textContent=pct+' +'+net;logEl.style.color=isCrit?'#ff9800':comboMult>1?'#ffd740':'#69f0ae';
    haptic('success');
  } else {
    b.heroHP=Math.max(0,b.heroHP+net);
    logEl.textContent='😬 Не то... '+net;logEl.style.color='#f44336';
    haptic('error');
    // Screen shake on hero damage
    const btEl=document.getElementById('battle');
    if(btEl){btEl.classList.remove('shake');void btEl.offsetWidth;btEl.classList.add('shake');setTimeout(()=>btEl.classList.remove('shake'),420);}
  }
  if(!FREE_CARDS.includes(card.id))b.usedCards.add(card.id);
  b.round++;
  updateBattleHUD();
  setTimeout(()=>{
    logEl.style.color='';
    if(b.round>=5||b.heroHP<=0||b.girlHP<=0)endBattle();
    else showNextDemand();
  },800);
}

function endBattle(){
  const b=BATTLE;b.done=true;
  const win=b.girlHP<=0||(b.heroHP>0&&b.round>=5&&b.score>0);
  const res=document.getElementById('bResult');
  res.style.display='flex';
  if(win||b.round>=5&&b.heroHP>0){
    const relGain=win?Math.round(10+b.score*.1*(G.ch.bonus==='romantic'?2:1)):5;
    const moneyGain=win?Math.round(b.score*5):0;
    G.rel=Math.min(100,G.rel+relGain);G.rep=Math.min(100,G.rep+5);
    if(moneyGain)G.money+=moneyGain;
    document.getElementById('bResultTitle').innerHTML='<span style="color:#69f0ae">💕 Свидание удалось!</span>';
    document.getElementById('bResultSub').textContent=\`+\${relGain} к отношениям\${moneyGain?' | +'+moneyGain+'₽':''}\`;
    haptic('success');playSFX('win');
    spawnParticles(W/2,H/2,'win');
    gainXP(20+b.score);
    if(b.girl.id>=0){const gi=GIRLS.find(g=>g.id===b.girl.id);if(gi)gi.beaten=true;}
    setTimeout(()=>checkAchievements(),500);
  } else {
    G.rep=Math.max(0,G.rep-10);
    document.getElementById('bResultTitle').innerHTML='<span style="color:#f44336">💔 Не получилось</span>';
    document.getElementById('bResultSub').textContent='Она ушла... -10 Репутации';
    haptic('error');
  }
  if(b.isMom){
    G.storyFlags.metMom=true;
    const lbl=win?'Родители одобрили! 🎉':'Родители недовольны... 😬';
    document.getElementById('bResultSub').textContent+='\\n'+lbl;
  }
  if(b.isTyoshcha){
    if(win){
      G.storyFlags.tyoshchaDefeated=true;
      document.getElementById('bResultSub').textContent='Тёща дала благословение! (нехотя) 💍';
      setTimeout(()=>{document.getElementById('battle').style.display='none';triggerWedding();},1800);
    } else {
      document.getElementById('bResultSub').textContent='Тёща не одобрила... Попробуй снова!';
    }
  }
  updateHUD();
}

function closeBattle(){
  document.getElementById('battle').style.display='none';
  document.getElementById('bResult').style.display='none';
  BATTLE=null;render();
}

// ── Achievements ──────────────────────────────────────────────────────────────
const ACHIEVEMENTS=[
  {id:'first_date',name:'Первое свидание',emoji:'💕',check:()=>GIRLS.some(g=>g.beaten)},
  {id:'rich',name:'Богач',emoji:'💰',check:()=>G.money>=50000},
  {id:'charmer',name:'Чаровник',emoji:'😍',check:()=>G.rel>=80},
  {id:'famous',name:'Знаменитость',emoji:'⭐',check:()=>G.rep>=90},
  {id:'explorer',name:'Исследователь',emoji:'🗺',check:()=>Object.keys(G.distStatus).length>=4},
  {id:'level5',name:'Опытный',emoji:'🆙',check:()=>(G.level||1)>=5},
  {id:'casanova',name:'Казанова',emoji:'💘',check:()=>GIRLS.filter(g=>g.beaten).length>=6},
  {id:'engaged',name:'Сделал предложение',emoji:'💍',check:()=>G.storyFlags&&G.storyFlags.engaged},
  {id:'tyoshcha',name:'Герой семьи',emoji:'👩‍👧',check:()=>G.storyFlags&&G.storyFlags.tyoshchaDefeated},
  {id:'ideal',name:'Идеальный муж',emoji:'💎',check:()=>G.storyFlags&&G.storyFlags.weddingTriggered&&G.rel>=70&&G.rep>=60&&G.money>=5000},
];
function checkAchievements(){
  const unlocked=JSON.parse(localStorage.getItem('bazmin_ach')||'[]');
  ACHIEVEMENTS.forEach(ach=>{
    if(unlocked.includes(ach.id))return;
    if(ach.check()){
      unlocked.push(ach.id);
      localStorage.setItem('bazmin_ach',JSON.stringify(unlocked));
      showPhone(ach.emoji+' Достижение: '+ach.name+'!');
      playSFX('win');spawnParticles(W/2,H/3,'stars');
    }
  });
}

// ── Apartment screen ──────────────────────────────────────────────────────────
const APT_ROOMS=[
  {id:'bedroom',name:'Спальня',emoji:'🛏',desc:'Повышает настроение',levels:[{cost:0,owned:true},{cost:5000,bonus:'rel+5'},{cost:15000,bonus:'rel+10'}]},
  {id:'kitchen',name:'Кухня',emoji:'🍳',desc:'Готовишь дома — энергия',levels:[{cost:0,owned:true},{cost:3000,bonus:'energy+2'},{cost:10000,bonus:'energy+5'}]},
  {id:'gym',name:'Домашний зал',emoji:'🏋',desc:'+1 Харизма пассивно',levels:[{cost:8000,bonus:'charisma+1'},{cost:20000,bonus:'charisma+2'},{cost:50000,bonus:'charisma+3'}]},
  {id:'study',name:'Кабинет',emoji:'📚',desc:'+1 Зарплата',levels:[{cost:5000,bonus:'salary+1'},{cost:15000,bonus:'salary+2'},{cost:40000,bonus:'salary+3'}]},
];
const UNITS_DEF=[
  {id:'driver',name:'Друг-водитель',emoji:'🚗',desc:'+2 к ходам за ход',cost:5000,maintenance:500,effect:'moves+2'},
  {id:'stylist',name:'Стилист',emoji:'💈',desc:'+2 Внешность',cost:3000,maintenance:300,effect:'looks+2'},
  {id:'cook',name:'Повар',emoji:'👨‍🍳',desc:'Восстанавливает +2 энергии',cost:4000,maintenance:400,effect:'energy+2'},
  {id:'trainer',name:'Тренер',emoji:'💪',desc:'+2 Харизма',cost:6000,maintenance:600,effect:'charisma+2'},
  {id:'wingman',name:'Бро-вингмен',emoji:'🤝',desc:'+20% в свиданиях',cost:7000,maintenance:700,effect:'battle+20'},
  {id:'mamins',name:"Мамин одобрямс",emoji:'👵',desc:'Мама тебя любит',cost:10000,maintenance:1000,effect:'mom_bonus'},
];
function openApt(){
  const el=document.getElementById('apt');el.style.display='flex';
  document.getElementById('aptLevelLabel').textContent='Уровень: '+['Съёмная однушка','Ипотечная двушка','Свой лофт','Пентхаус'][Math.min(3,G.apt.level-1)];
  const grid=document.getElementById('aptGrid');grid.innerHTML='';
  APT_ROOMS.forEach(room=>{
    const lvl=G.apt[room.id]||0;
    const nextLvl=room.levels[lvl];
    const div=document.createElement('div');
    div.className='aptRoom'+(lvl>0?' owned':'')+(nextLvl&&G.money>=nextLvl.cost?' upgradable':'');
    div.innerHTML='<div class="aptRoomEmoji">'+room.emoji+'</div><div class="aptRoomName">'+room.name+'</div><div class="aptRoomSub">Ур.'+lvl+(nextLvl?' | Улучшить: '+nextLvl.cost+'₽':' (макс)')+'</div>';
    if(nextLvl)div.onclick=()=>buyRoom(room.id,lvl,nextLvl);
    grid.appendChild(div);
  });
  const ul=document.getElementById('unitList');ul.innerHTML='';
  UNITS_DEF.forEach(u=>{
    const owned=G.units.includes(u.id);
    const div=document.createElement('div');div.className='unitRow';
    div.innerHTML='<div class="unitEmoji">'+u.emoji+'</div><div class="unitInfo"><div class="unitName">'+u.name+'</div><div class="unitDesc">'+u.desc+'</div></div><button class="btn '+(owned?'dim':'green')+' unitBtn">'+(owned?'Нанят':'Нанять '+u.cost+'₽')+'</button>';
    if(!owned){const btn=div.querySelector('button');btn.onclick=()=>hireUnit(u.id);}
    ul.appendChild(div);
  });
}
function buyRoom(id,curLvl,nextLvl){
  if(G.money<nextLvl.cost){showPhone('Недостаточно денег!');return;}
  G.money-=nextLvl.cost;
  G.apt[id]=(curLvl+1);
  if(nextLvl.bonus){
    const [stat,val]=nextLvl.bonus.split('+');
    if(stat==='energy')G.maxEnergy+=parseInt(val);
    else if(stat==='charisma')G.stats.charisma+=parseInt(val);
    else if(stat==='salary')G.stats.salary+=parseInt(val);
    else if(stat==='rel')G.rel=Math.min(100,G.rel+parseInt(val));
  }
  showPhone('✅ Улучшено!');haptic('success');updateHUD();openApt();
}
function hireUnit(id){
  if(G.units.includes(id)){showPhone('Уже нанят!');return;}
  const u=UNITS_DEF.find(x=>x.id===id);
  if(G.money<u.cost){showPhone('Нет денег! 💸');haptic('error');return;}
  G.money-=u.cost;G.units.push(id);
  if(u.effect==='moves+2')G.maxMoves+=2;
  else if(u.effect==='looks+2')G.stats.looks+=2;
  else if(u.effect==='energy+2'){G.maxEnergy+=2;G.energy+=2;}
  else if(u.effect==='charisma+2')G.stats.charisma+=2;
  showPhone('✅ '+u.name+' нанят!');haptic('success');updateHUD();openApt();
}
function closeApt(){document.getElementById('apt').style.display='none';render();}

// ── Quest display ─────────────────────────────────────────────────────────────
function setQuest(text){
  const el=document.getElementById('questLabel');
  if(!el)return;
  if(text){el.textContent='🎯 '+text;el.style.display='block';}
  else{el.style.display='none';}
}
function updateQuest(){
  if(G.mode!=='campaign'){setQuest(null);return;}
  const f=G.storyFlags||{};
  if(!f.ch1Started)return;
  if(G.chapter<=1&&!f.ch1Done)setQuest('Познакомься с девушкой в Патриках');
  else if(G.chapter===2&&!f.ch2Done)setQuest('Купи подарок для Алисы (Патрики)');
  else if(G.chapter===3&&!f.metMom)setQuest('Найди мамину квартиру в Мытищах');
  else if(G.chapter===3&&!f.ch3Done)setQuest('Родители ждут тебя!');
  else if(G.chapter===4&&!f.ch4Done)setQuest('Купи кольцо в Картье (Красногорск)');
  else if(G.chapter===5&&f.needTyoshcha&&!f.tyoshchaDefeated)setQuest('Найди тёщу в Красногорске!');
  else setQuest(null);
}

// ── Story chapters ─────────────────────────────────────────────────────────────
function checkChapter(){
  if(G.chapter===0&&G.mode==='campaign'){
    G.chapter=1;
    setTimeout(()=>showDialog('Матушка Земля 🌍','Добро пожаловать в Матушку Землю — сервис знакомств! Найди свою половинку в большом городе. Начни с Патриков — там живут модные девушки.',[
      {text:'Погнали!',rel:0,pts:0,response:'Удачи!'},
    ],()=>{G.storyFlags.ch1Started=true;showPhone('Глава 1: Найди девушку в Патриках и познакомься!');}),500);
  }
  if(G.chapter===1&&G.storyFlags.ch1Started){
    const beatenInPatriki=GIRLS.filter(gi=>gi.beaten&&gi.col<12&&gi.row<10);
    if(beatenInPatriki.length>=1&&!G.storyFlags.ch1Done){
      G.storyFlags.ch1Done=true;G.chapter=2;
      setTimeout(()=>showDialog('Алиса 💕','Мне понравилось наше свидание! Но честно... подруга говорит ты немного скуп. Может ты меня удивишь?',[
        {text:'Куплю что-нибудь особенное! 💎',rel:+12,pts:100,response:'Вот это другой разговор! 😍'},
        {text:'Подруга ничего не понимает!',rel:-5,pts:0,response:'Ты так думаешь? 🙄'},
        {text:'Ну ладно, куплю...',rel:+3,pts:20,response:'Хорошо 😊'},
      ],()=>{showPhone('Глава 2: Купи что-нибудь особенное для Алисы!');}),500);
    }
  }
  if(G.chapter===2&&!G.storyFlags.ch2Done){
    const hasBought=G.cards.some(c=>['bouquet','ring','luxury','gift'].includes(c));
    if(hasBought){
      G.storyFlags.ch2Done=true;G.chapter=3;
      setTimeout(()=>showDialog('Алиса 💕','Я хочу познакомить тебя с родителями. Они строгие, но справедливые. Найди мамину квартиру в Мытищах...',[
        {text:'Готов! Сделаю всё правильно 💪',rel:+8,pts:50,response:'Вот это мужчина! 💕'},
        {text:'Зачем так рано?..',rel:-5,pts:0,response:'Ну хочешь не хочешь...'},
      ],()=>{showPhone('Глава 3: Найди Мамину квартиру в Мытищах!');}),500);
    }
  }
  if(G.chapter===3&&G.storyFlags.metMom&&!G.storyFlags.ch3Done){
    G.storyFlags.ch3Done=true;G.chapter=4;
    setTimeout(()=>showDialog('Алиса 💕','Мои родители тебя одобрили... почти. Папа сказал — сначала кольцо! Настоящее, из Картье 💍',[
      {text:'Куплю самое лучшее!',rel:+20,pts:200,response:'Ты самый лучший! 😍💕'},
      {text:'Может что-то попроще?',rel:-10,pts:0,response:'Папа будет недоволен...'},
    ],()=>{showPhone('Глава 4: Купи кольцо в Картье (Красногорск) и вернись к Алисе!');}),500);
  }
  if(G.chapter===4&&!G.storyFlags.ch4Done){
    if(G.cards.includes('ring')){
      G.storyFlags.ch4Done=true;G.chapter=5;
      setTimeout(()=>showDialog('Алиса 💕','[Ты опускаешься на одно колено] Алиса... выйдешь за меня?',[
        {text:'Я хочу провести с тобой всю жизнь!',rel:+30,pts:500,response:'ДА! Тысячу раз да! 💍💕😭'},
        {text:'Нам нужно поговорить...',rel:+5,pts:50,response:'Ты уверен? Окей...'},
      ],()=>{G.storyFlags.engaged=true;G.storyFlags.needTyoshcha=true;showPhone('Глава 5: Найди тёщу в Красногорске и получи её благословение! 👩‍👧');}),500);
    }
  }
}

function triggerWedding(){
  if(G.storyFlags.weddingTriggered)return;
  G.storyFlags.weddingTriggered=true;
  const rel=G.rel,rep=G.rep,money=G.money;
  let ending,subtitle;
  if(rel>=70&&rep>=60&&money>=5000){
    ending='💎 Идеальный муж!';subtitle='Алиса счастлива. Мама рыдает от радости. Даже тёща одобрила. Свадьба была шикарной!';
  } else if(rel>=40){
    ending='😅 Базовый минимум';subtitle='Свадьба состоялась. Тёща недовольна, но молчит. Алиса говорит всё нормально.';
  } else {
    ending='💸 Банкрот';subtitle='Алиса ушла к бизнесмену. Говорит ты не тот уровень. Мама плачет.';
  }
  const emojiMap={'💎 Идеальный муж!':'💍','😅 Базовый минимум':'😅','💸 Банкрот':'💸'};
  document.getElementById('goEmoji').textContent=emojiMap[ending]||'🎭';
  document.getElementById('goTitle').textContent=ending;
  document.getElementById('goSub').textContent=subtitle;
  document.getElementById('goStats').innerHTML=
    '💰 Денег: '+money.toLocaleString('ru')+'₽ &nbsp;|&nbsp; ❤️ Отношения: '+rel+'%<br>'+
    '🧠 Репутация: '+rep+' &nbsp;|&nbsp; 🏆 День '+G.day+' (ход '+G.turn+')';
  // Show unlocked achievements
  const achs=JSON.parse(localStorage.getItem('bazmin_ach')||'[]');
  if(achs.length){
    const achEmojis=achs.map(id=>{const a=ACHIEVEMENTS.find(x=>x.id===id);return a?a.emoji:'⭐';}).join('');
    document.getElementById('goStats').innerHTML+=('<br><span style="font-size:13px">'+achEmojis+'</span> Достижений: '+achs.length+'/'+ACHIEVEMENTS.length);
  }
  document.getElementById('goScreen').classList.add('active');
  playSFX(rel>=40?'win':'fail');
  setTimeout(()=>spawnParticles(W/2,H/2,rel>=70?'win':'hearts'),300);
  stopBGMusic();
  checkAndSaveBest();
  setTimeout(()=>checkAchievements(),600);
}

function shareResult(){
  const ending=document.getElementById('goTitle').textContent;
  const stats='💰 '+G.money.toLocaleString('ru')+'₽ ❤️ '+G.rel+'% 🧠 '+G.rep;
  const text='Я прошёл БАЗОВЫЙ МИНИМУМ! '+ending+'\\n'+stats+'\\n▶️ Играй: https://t.me/bazmin_game';
  if(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.openTelegramLink){
    Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=https://t.me/bazmin_game&text='+encodeURIComponent(text));
  } else if(navigator.share){
    navigator.share({title:'Базовый Минимум',text});
  } else {
    navigator.clipboard&&navigator.clipboard.writeText(text).then(()=>showPhone('Скопировано! 📋'));
  }
}

// ── Dialog system ─────────────────────────────────────────────────────────────
function showDialog(charName,text,choices,cb){
  const box=document.getElementById('dialogBox');
  document.getElementById('dlgChar').textContent='💬 '+charName+':';
  document.getElementById('dlgText').textContent=text;
  const cc=document.getElementById('dlgChoices');cc.innerHTML='';
  box.style.display='flex';
  G.running=false;
  choices.forEach((c,i)=>{
    const btn=document.createElement('button');btn.className='btn';
    btn.style.cssText='font-size:11px;padding:7px 14px;text-align:left;white-space:normal;width:100%';
    const tag=(c.rel>0?'❤️+'+c.rel:c.rel<0?'💔'+c.rel:'')+(c.pts>0?' ⭐+'+c.pts:'');
    btn.innerHTML=c.text+(tag?\`<span style="font-size:9px;color:#aaa;display:block">\${tag}</span>\`:'');
    btn.onclick=()=>{
      G.rel=Math.max(0,Math.min(100,(G.rel||0)+c.rel));
      if(c.rel>0)G.rep=Math.min(100,(G.rep||50)+2);
      // If choice has fn(), call it and use returned string as response (dynamic responses)
      let resp=c.response||'...';
      if(c.fn){const r=c.fn();if(typeof r==='string')resp=r;}
      document.getElementById('dlgChar').textContent='💬 '+charName+':';
      document.getElementById('dlgText').textContent=resp;
      cc.innerHTML='';
      const ok=document.createElement('button');ok.className='btn';ok.textContent='Понял 👍';ok.style.cssText='font-size:11px;padding:7px 14px';
      ok.onclick=()=>{box.style.display='none';G.running=true;if(cb)cb(i);};cc.appendChild(ok);
    };
    cc.appendChild(btn);
  });
}

// ── XP & Level up ─────────────────────────────────────────────────────────────
function xpToNextLevel(lv){return lv*80+80;}
function gainXP(amount){
  if(!G.level)G.level=1;if(!G.xp)G.xp=0;
  G.xp+=amount;
  const needed=xpToNextLevel(G.level);
  if(G.xp>=needed){
    G.xp-=needed;G.level++;
    // Level up bonus: alternating stat boosts
    const boost=(G.level%3===0)?'energy':(G.level%3===1)?'moves':'charisma';
    if(boost==='energy'){G.maxEnergy++;G.energy=G.maxEnergy;}
    else if(boost==='moves'){G.maxMoves++;G.moves=Math.min(G.moves+1,G.maxMoves);}
    else{G.stats.charisma++;G.rep=Math.min(100,G.rep+5);}
    const boostTxt={energy:'Макс. энергия +1 ⚡',moves:'Макс. ходов +1 ⏰',charisma:'Харизма +1 💬 +5 Реп'}[boost];
    showPhone('🆙 УРОВЕНЬ '+G.level+'! '+boostTxt);
    playSFX('win');spawnParticles(W/2,H/3,'stars');
  }
  updateHUD();
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function updateHUD(){
  document.getElementById('hMoney').textContent='💰 '+G.money.toLocaleString('ru')+'₽';
  document.getElementById('hEnergy').textContent='💪 '+G.energy+'/'+G.maxEnergy;
  document.getElementById('hRel').textContent='❤️ '+G.rel;
  document.getElementById('hRep').textContent='🧠 '+G.rep;
  const xpNeed=xpToNextLevel(G.level||1);
  const xpPct=Math.min(100,Math.round(((G.xp||0)/xpNeed)*100));
  const lvlEl=document.getElementById('hudLvl');if(lvlEl)lvlEl.textContent='Ур.'+(G.level||1);
  const xpBarEl=document.getElementById('xpBar');if(xpBarEl)xpBarEl.style.width=xpPct+'%';
  const xpLbl=document.getElementById('hudXpLbl');if(xpLbl)xpLbl.textContent=(G.xp||0)+'/'+xpNeed;
  const amb=getDayAmbient();
  document.getElementById('turnLabel').textContent=amb.label+' · День '+G.day;
  const mv=G.moves;
  document.getElementById('movesLeft').textContent=mv>0?'⏰ Ходов: '+mv:'Ходов нет';
  // District label
  const dn={patriki:'🥂 Патрики',krasnogorsk:'👑 Красногорск',mytishi:'🏚 Мытищи',ramenki:'🏢 Раменки'}[getDistrict(G.col,G.row)]||'';
  document.getElementById('distLabel').textContent=dn;
  updateQuest();
}

// ── Rendering ─────────────────────────────────────────────────────────────────
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let cam={x:0,y:0};
let W,H;

function resize(){
  W=c.width=window.innerWidth;H=c.height=window.innerHeight;
  centerOnHero();render();
}

function centerOnHero(){
  const {x,y}=hexCenter(G.col,G.row);
  cam.x=W/2-x;cam.y=H/2-y-40;
}

function getDayPhase(){
  const tod=(G.turn-1)%3;
  return tod; // 0=morning, 1=afternoon, 2=evening
}
const WEATHERS=[
  {id:'sunny',label:'☀️',overlay:null,moveBonus:0,energyBonus:1,romBonus:0},
  {id:'cloudy',label:'☁️',overlay:'rgba(80,80,120,.08)',moveBonus:0,energyBonus:0,romBonus:0},
  {id:'rainy',label:'🌧️',overlay:'rgba(30,60,120,.12)',moveBonus:-1,energyBonus:0,romBonus:+5},
  {id:'snowy',label:'❄️',overlay:'rgba(180,220,255,.1)',moveBonus:-1,energyBonus:-1,romBonus:+8},
];
function getWeather(){
  if(!G.weather)G.weather=0;
  return WEATHERS[G.weather%WEATHERS.length];
}
function rollWeather(){
  // Change weather randomly each day, weighted toward sunny/cloudy
  const weights=[4,3,2,1];
  let total=weights.reduce((a,b)=>a+b,0);
  let r=Math.floor(Math.random()*total);
  for(let i=0;i<weights.length;i++){r-=weights[i];if(r<0){G.weather=i;break;}}
}
function getDayAmbient(){
  const phase=getDayPhase();
  const wx=getWeather();
  let sky0,sky1,overlay,label;
  if(phase===0){sky0='#080f1c';sky1='#0a1220';overlay='rgba(255,120,60,.06)';label='🌅 Утро';}
  else if(phase===1){sky0='#080812';sky1='#0d0d20';overlay=null;label='☀️ День';}
  else{sky0='#100810';sky1='#180810';overlay='rgba(180,60,20,.09)';label='🌇 Вечер';}
  // Weather modifies overlay
  if(wx.overlay)overlay=wx.overlay;
  return{sky0,sky1,overlay,label:wx.label+' '+label};
}

function render(){
  if(!G.col&&G.col!==0)return;
  ctx.clearRect(0,0,W,H);
  // Sky with day/night gradient
  const amb=getDayAmbient();
  const skgrd=ctx.createLinearGradient(0,0,0,H);
  skgrd.addColorStop(0,amb.sky0);skgrd.addColorStop(1,amb.sky1);
  ctx.fillStyle=skgrd;ctx.fillRect(0,0,W,H);

  // Draw all hexes
  for(let r=0;r<ROWS;r++){
    for(let c2=0;c2<COLS;c2++){
      const {x,y}=hexCenter(c2,r);
      const sx=x+cam.x, sy=y+cam.y;
      if(sx<-80||sx>W+80||sy<-80||sy>H+80)continue;
      const k=hexKey(c2,r);
      const inFog=!G.fog.has(k);
      const t=MAP[r][c2];
      const dist=getDistrict(c2,r);
      let fillCol;
      if(inFog){fillCol='#07070f';}
      else if(t===HT.MKAD){fillCol='#2a2a3a';}
      else if(t===HT.ROAD){fillCol=distTintHex('#242434',dist);}
      else if(t===HT.PLAIN){fillCol=DPLAIN[dist]||'#0e1420';}
      else{fillCol=HTC[t]||'#16182e';}
      // Draw hex fill
      drawHex(ctx,sx,sy,HSZ-1,fillCol,null,1);
      // Border
      const borderCol=inFog?'#0e0e1a':t===HT.MKAD?'rgba(255,255,100,.4)':'rgba(255,255,255,.07)';
      drawHex(ctx,sx,sy,HSZ-1,null,borderCol,1);
      if(!inFog){
        // MKAD special: bright dashes
        if(t===HT.MKAD){
          ctx.strokeStyle='rgba(255,220,50,.5)';ctx.lineWidth=2;
          ctx.setLineDash([4,4]);
          drawHex(ctx,sx,sy,HSZ-3,null,'rgba(255,220,50,.4)',1);
          ctx.setLineDash([]);
        }
        const obj=OBJ_HEXES[k];
        if(obj){
          // Object glow
          const grd=ctx.createRadialGradient(sx,sy,0,sx,sy,HSZ);
          grd.addColorStop(0,'rgba(255,255,255,.08)');grd.addColorStop(1,'transparent');
          ctx.fillStyle=grd;ctx.beginPath();
          for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);if(i===0)ctx.moveTo(sx+HSZ*Math.cos(a),sy+HSZ*Math.sin(a));else ctx.lineTo(sx+HSZ*Math.cos(a),sy+HSZ*Math.sin(a));}
          ctx.closePath();ctx.fill();
          ctx.font='20px serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.globalAlpha=1;ctx.fillText(obj.emoji,sx,sy-5);
          // Object name
          ctx.font='bold 7px system-ui';ctx.fillStyle='rgba(255,255,255,.75)';ctx.textBaseline='top';
          ctx.fillText(obj.name.replace(/ [^\s]+$/,'').slice(0,12),sx,sy+10);
          ctx.textBaseline='alphabetic';
        } else if(t===HT.PARK||t===HT.FOREST){
          ctx.font='16px serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.globalAlpha=.7;ctx.fillText(t===HT.PARK?'🌳':'🌲',sx,sy);ctx.globalAlpha=1;
        } else if(t===HT.ROAD){
          // Road marking
          ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(sx-8,sy);ctx.lineTo(sx+8,sy);ctx.stroke();
        } else if(t===HT.APARTMENT){
          ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.globalAlpha=.65;ctx.fillText('🏢',sx,sy-2);ctx.globalAlpha=1;
        } else if(t===HT.HQ){
          ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.globalAlpha=.8;ctx.fillText('🏠',sx,sy-2);ctx.globalAlpha=1;
          ctx.font='bold 7px system-ui';ctx.fillStyle='#69f0ae';ctx.textBaseline='top';
          ctx.fillText('БАЗА',sx,sy+10);ctx.textBaseline='alphabetic';
        } else if(t===HT.WATER){
          // Water shimmer
          const w=(Math.sin(Date.now()/1200+c2*.5)+1)*.5;
          ctx.globalAlpha=.3+w*.2;
          ctx.fillStyle='#1a4a8a';ctx.beginPath();
          ctx.ellipse(sx,sy,12,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
        }
      } else {
        // Fog overlay
        drawHex(ctx,sx,sy,HSZ-1,'rgba(4,4,10,.6)',null,1);
      }
    }
  }

  // District name labels (at district centers, if explored)
  const dCenters={patriki:{c:5,r:4,name:'🥂 Патрики',col:'#4caf50'},krasnogorsk:{c:17,r:4,name:'👑 Красногорск',col:'#ffd740'},mytishi:{c:5,r:14,name:'🏚 Мытищи',col:'#90a4ae'},ramenki:{c:17,r:14,name:'🏢 Раменки',col:'#4fc3f7'}};
  Object.values(dCenters).forEach(dc=>{
    if(!G.fog.has(hexKey(dc.c,dc.r)))return;
    const {x,y}=hexCenter(dc.c,dc.r);
    const sx=x+cam.x,sy=y+cam.y;
    if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
    ctx.globalAlpha=.55;
    ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=dc.col;
    ctx.strokeStyle='rgba(0,0,0,.8)';ctx.lineWidth=3;
    ctx.strokeText(dc.name,sx,sy-50);ctx.fillText(dc.name,sx,sy-50);
    ctx.globalAlpha=1;
  });

  // Reachable highlight
  if(reachSet&&G.moves>0){
    reachSet.forEach(k=>{
      const col2=Math.floor(k/100),row2=k%100;
      const {x,y}=hexCenter(col2,row2);
      const sx=x+cam.x,sy=y+cam.y;
      if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
      drawHex(ctx,sx,sy,HSZ-1,'rgba(255,215,64,.1)','rgba(255,215,64,.5)',1);
    });
  }
  // Selected hex highlight
  if(selectedHex){
    const {x,y}=hexCenter(selectedHex.col,selectedHex.row);
    const sx=x+cam.x,sy=y+cam.y;
    const pulse=(Math.sin(Date.now()/300)+1)*.5;
    drawHex(ctx,sx,sy,HSZ-1,'rgba(255,215,64,.15)',\`rgba(255,215,64,\${.5+pulse*.5})\`,1);
  }

  // Day/night ambient overlay (after hex render, before characters)
  {const amb2=getDayAmbient();if(amb2.overlay){ctx.fillStyle=amb2.overlay;ctx.fillRect(0,0,W,H);}}

  // Girls
  GIRLS.forEach(gi=>{
    if(gi.beaten)return;
    const {x,y}=hexCenter(gi.col,gi.row);
    const sx=x+cam.x,sy=y+cam.y;
    if(!G.fog.has(hexKey(gi.col,gi.row)))return;
    if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
    // Draw girl icon
    drawCharIcon(ctx,sx,sy-16,gi.color,gi.face,gi.name,false);
    // Pulsing ring
    const pulse=(Math.sin(Date.now()/400)+1)*.5;
    ctx.strokeStyle=\`rgba(255,107,157,\${.4+pulse*.6})\`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(sx,sy+6,22,0,Math.PI*2);ctx.stroke();
  });

  // Wandering NPCs
  NPCS.forEach(npc=>{
    if(npc.met)return;
    const {x,y}=hexCenter(npc.col,npc.row);
    const sx=x+cam.x,sy=y+cam.y;
    if(!G.fog.has(hexKey(npc.col,npc.row)))return;
    if(sx<-60||sx>W+60||sy<-60||sy>H+60)return;
    const nb=(Math.sin(Date.now()/500)+1)*.5;
    ctx.fillStyle=npc.color+'44';ctx.beginPath();ctx.arc(sx,sy-6,14,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=npc.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx,sy-6,14,0,Math.PI*2);ctx.stroke();
    ctx.font='14px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(npc.emoji,sx,sy-6);ctx.textBaseline='alphabetic';
    ctx.fillStyle='rgba(5,5,20,.8)';ctx.beginPath();ctx.roundRect(sx-22,sy+10,44,12,3);ctx.fill();
    ctx.fillStyle=npc.color;ctx.font='8px system-ui';ctx.textAlign='center';ctx.fillText(npc.name,sx,sy+19);
  });

  // Тёща boss (chapter 5, Krasnogorsk)
  if(G.storyFlags&&G.storyFlags.needTyoshcha&&!G.storyFlags.tyoshchaDefeated){
    const {x:tx,y:ty}=hexCenter(TYOSHCHA_COL,TYOSHCHA_ROW);
    const tsx=tx+cam.x,tsy=ty+cam.y;
    if(G.fog.has(hexKey(TYOSHCHA_COL,TYOSHCHA_ROW))&&tsx>-80&&tsx<W+80&&tsy>-80&&tsy<H+80){
      // Ominous pulsing red ring
      const tp=(Math.sin(Date.now()/300)+1)*.5;
      ctx.strokeStyle=\`rgba(233,30,99,\${.5+tp*.5})\`;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(tsx,tsy+6,28,0,Math.PI*2);ctx.stroke();
      // Boss label
      ctx.fillStyle='rgba(233,30,99,.9)';
      const lw=ctx.measureText('👩‍👧 ТЁЩА').width+16;
      ctx.beginPath();ctx.roundRect(tsx-lw/2,tsy-50,lw,18,4);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 11px system-ui';ctx.textAlign='center';
      ctx.fillText('👩‍👧 ТЁЩА',tsx,tsy-38);
      // Character circle
      ctx.fillStyle='#e91e63';ctx.beginPath();ctx.arc(tsx,tsy-12,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='20px serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('👩‍👧',tsx,tsy-12);ctx.textBaseline='alphabetic';
    }
  }

  // Hero (animated)
  {
    const {x,y}=getHeroRenderPos();
    const sx=x+cam.x,sy=y+cam.y;
    // Shadow
    ctx.globalAlpha=.3;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx,sy+24,16,6,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    drawCharIcon(ctx,sx,sy-16,G.ch.color,G.ch.face,G.ch.name,true);
    // Pulse ring
    const pulse=(Math.sin(Date.now()/400)+1)*.5;
    ctx.strokeStyle=\`rgba(255,255,255,\${.4+pulse*.4})\`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(sx,sy+6,24+pulse*3,0,Math.PI*2);ctx.stroke();
    // Smooth camera follow
    if(heroAnim.active){
      const tx=W/2-x,ty=H/2-y-40;
      cam.x+=(tx-cam.x)*.1;cam.y+=(ty-cam.y)*.1;
    }
  }

  // Particles overlay
  updateParticles(ctx);
  // Weather ambient particles (rain/snow)
  {const wx=getWeather();
  if(wx.id==='rainy'){
    // Draw canvas rain lines directly (faster than emoji particles)
    ctx.save();ctx.strokeStyle='rgba(100,160,255,.35)';ctx.lineWidth=1;
    const t=Date.now();
    for(let i=0;i<18;i++){
      const rx=((i*173+t*.7)%1000)/1000*W;
      const ry=((i*97+t*1.4)%1000)/1000*H;
      ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx+3,ry+10);ctx.stroke();
    }
    ctx.restore();
  } else if(wx.id==='snowy'){
    for(let i=0;i<2;i++){
      if(Math.random()<.25){
        particles.push({
          x:Math.random()*W,y:-10,vx:(Math.random()-.5)*.6,
          vy:0.5+Math.random()*.6,
          emoji:'❄',size:7+Math.random()*4,
          life:80+Math.random()*50,maxLife:130,_env:true
        });
      }
    }
  }}
  renderMinimap();
}

function distTintHex(base,dist){
  const t=DTINT[dist]||[0,0,0];
  const r2=parseInt(base.slice(1,3),16)+t[0];
  const g2=parseInt(base.slice(3,5),16)+t[1];
  const b2=parseInt(base.slice(5,7),16)+t[2];
  return \`rgb(\${Math.max(0,Math.min(255,r2))},\${Math.max(0,Math.min(255,g2))},\${Math.max(0,Math.min(255,b2))})\`;
}

function drawCharIcon(ctx,sx,sy,color,faceKey,name,isHero){
  const r=isHero?22:18;
  // Background circle
  ctx.fillStyle=color+'55';ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=isHero?2.5:1.5;ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.stroke();
  // Face image
  if(FI[faceKey]&&FI[faceKey].complete&&FI[faceKey].naturalWidth>0){
    ctx.save();ctx.beginPath();ctx.arc(sx,sy,r-2,0,Math.PI*2);ctx.clip();
    ctx.drawImage(FI[faceKey],sx-r+2,sy-r+2,(r-2)*2,(r-2)*2);ctx.restore();
  } else {
    ctx.font=(isHero?'16':'13')+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(isHero?'🧑':'👩',sx,sy);
  }
  // Name label
  ctx.fillStyle='rgba(5,5,20,.85)';ctx.beginPath();
  ctx.roundRect(sx-26,sy+r+1,52,13,4);ctx.fill();
  ctx.fillStyle=color;ctx.font='bold 8px system-ui';ctx.textAlign='center';ctx.textBaseline='top';
  ctx.fillText(name.slice(0,8),sx,sy+r+3);
  ctx.textBaseline='alphabetic';
}

// Minimap
function renderMinimap(){
  const mc=document.getElementById('mm');
  const mctx=mc.getContext('2d');
  const mw=mc.width,mh=mc.height;
  mctx.fillStyle='#08080f';mctx.fillRect(0,0,mw,mh);
  const sw=mw/COLS, sh=mh/ROWS;
  for(let r=0;r<ROWS;r+=2){
    for(let c2=0;c2<COLS;c2+=2){
      const t=MAP[r][c2];
      const k=hexKey(c2,r);
      const inFog=!G.fog.has(k);
      if(inFog){mctx.fillStyle='#0a0a14';}
      else{
        const dist=getDistrict(c2,r);
        if(t===HT.MKAD)mctx.fillStyle='#4a4a5a';
        else if(t===HT.ROAD)mctx.fillStyle={patriki:'#1a3022',krasnogorsk:'#2a2212',mytishi:'#241e14',ramenki:'#182030'}[dist]||'#1a1a28';
        else if(t===HT.PARK||t===HT.FOREST)mctx.fillStyle='#0a280a';
        else if(OBJ_HEXES[k])mctx.fillStyle='#4a2a6a';
        else mctx.fillStyle={patriki:'#0e2018',krasnogorsk:'#201a08',mytishi:'#1a1408',ramenki:'#0e1828'}[dist]||'#181828';
      }
      mctx.fillRect(c2*sw,r*sh,sw*2,sh*2);
    }
  }
  // Girls
  GIRLS.forEach(gi=>{if(!gi.beaten&&G.fog.has(hexKey(gi.col,gi.row))){mctx.fillStyle='#ff6b9d';mctx.beginPath();mctx.arc(gi.col*sw,gi.row*sh,3,0,Math.PI*2);mctx.fill();}});
  // Тёща on minimap
  if(G.storyFlags&&G.storyFlags.needTyoshcha&&!G.storyFlags.tyoshchaDefeated&&G.fog.has(hexKey(TYOSHCHA_COL,TYOSHCHA_ROW))){
    mctx.fillStyle='#e91e63';mctx.beginPath();mctx.arc(TYOSHCHA_COL*sw,TYOSHCHA_ROW*sh,4,0,Math.PI*2);mctx.fill();
    mctx.strokeStyle='#fff';mctx.lineWidth=1;mctx.beginPath();mctx.arc(TYOSHCHA_COL*sw,TYOSHCHA_ROW*sh,4,0,Math.PI*2);mctx.stroke();
  }
  // Hero
  mctx.fillStyle='#4fc3f7';mctx.beginPath();mctx.arc(G.col*sw,G.row*sh,4,0,Math.PI*2);mctx.fill();
  mctx.strokeStyle='#fff';mctx.lineWidth=1;mctx.beginPath();mctx.arc(G.col*sw,G.row*sh,4,0,Math.PI*2);mctx.stroke();
}

// ── Input ─────────────────────────────────────────────────────────────────────
let drag={active:false,startX:0,startY:0,camX:0,camY:0,moved:false};

c.addEventListener('mousedown',e=>{drag={active:true,startX:e.clientX,startY:e.clientY,camX:cam.x,camY:cam.y,moved:false};});
c.addEventListener('mousemove',e=>{
  if(!drag.active)return;
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
  if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;
  if(drag.moved){cam.x=drag.camX+dx;cam.y=drag.camY+dy;render();}
});
c.addEventListener('mouseup',e=>{
  if(!drag.moved){handleClick(e.clientX,e.clientY);}
  drag.active=false;
});
c.addEventListener('touchstart',e=>{e.preventDefault();const t2=e.touches[0];drag={active:true,startX:t2.clientX,startY:t2.clientY,camX:cam.x,camY:cam.y,moved:false};},{passive:false});
c.addEventListener('touchmove',e=>{e.preventDefault();const t2=e.touches[0];const dx=t2.clientX-drag.startX,dy=t2.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)>8)drag.moved=true;if(drag.moved){cam.x=drag.camX+dx;cam.y=drag.camY+dy;render();}},{passive:false});
c.addEventListener('touchend',e=>{if(!drag.moved){const t2=e.changedTouches[0];handleClick(t2.clientX,t2.clientY);}drag.active=false;});

function handleClick(px,py){
  const hex=pixelToHex(px-cam.x,py-cam.y);
  if(!hex)return;
  if(hex.col===G.col&&hex.row===G.row){
    // Click on hero: open apt if on HQ
    const k=hexKey(hex.col,hex.row);
    const obj=OBJ_HEXES[k];
    if(obj&&obj.type==='hq'){openApt();return;}
    selectHex(hex.col,hex.row);return;
  }
  // If clicking same selected hex: move/interact
  if(selectedHex&&selectedHex.col===hex.col&&selectedHex.row===hex.row){
    const d=hexDist(G.col,G.row,hex.col,hex.row);
    if(d===1||(reachSet&&reachSet.has(hexKey(hex.col,hex.row)))){
      moveHeroTo(hex.col,hex.row);
    }
    return;
  }
  selectHex(hex.col,hex.row);
  haptic('light');
}

// ── Particle system ───────────────────────────────────────────────────────────
let particles=[];
function addParticle(sx,sy,emoji,vx,vy,life){
  particles.push({sx,sy,x:sx,y:sy,emoji,vx,vy,life,maxLife:life,size:16+Math.random()*8});
}
function spawnParticles(sx,sy,type){
  const sets={
    hearts:['❤️','💕','💖','💗'],
    money:['💰','💵','💸','✨'],
    stars:['⭐','✨','🌟','💫'],
    win:['🎉','🎊','⭐','💖','✨'],
    fail:['💔','😤','💸'],
  };
  const emojis=sets[type]||sets.stars;
  const count=type==='win'?8:5;
  for(let i=0;i<count;i++){
    const angle=((i/count)*Math.PI*2)+(Math.random()-.5)*.5;
    const spd=1.5+Math.random()*2.5;
    addParticle(sx,sy,emojis[Math.floor(Math.random()*emojis.length)],
      Math.cos(angle)*spd,Math.sin(angle)*spd-2,40+Math.random()*20);
  }
}
function updateParticles(ctx){
  particles=particles.filter(p=>{
    p.life--;if(p.life<=0)return false;
    p.x+=p.vx;p.y+=p.vy;
    if(!p._env)p.vy+=0.06; // gravity for emitted particles, not env
    const alpha=Math.min(1,p.life/p.maxLife*2);
    ctx.globalAlpha=alpha;
    ctx.font=p.size+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(p.emoji,p.x,p.y);
    ctx.globalAlpha=1;
    return true;
  });
}

// ── Ambient loop ──────────────────────────────────────────────────────────────
let lastRender=0;
function loop(ts){
  requestAnimationFrame(loop);
  if(ts-lastRender>60){lastRender=ts;if(G.col||G.col===0)render();}
}

// ── Init ──────────────────────────────────────────────────────────────────────
let selectedChar='roman';
// ── Highscores ────────────────────────────────────────────────────────────────
function loadBest(){try{return JSON.parse(localStorage.getItem('bazmin_best')||'{}');}catch{return{};}}
function saveBest(data){try{localStorage.setItem('bazmin_best',JSON.stringify(data));}catch{}}
function checkAndSaveBest(){
  const b=loadBest();
  let changed=false;
  if(!b.money||G.money>b.money){b.money=G.money;b.moneyChar=G.ch.name;changed=true;}
  if(!b.rel||G.rel>b.rel){b.rel=G.rel;b.relChar=G.ch.name;changed=true;}
  if(!b.level||G.level>b.level){b.level=G.level;b.levelChar=G.ch.name;changed=true;}
  if(!b.day||G.day>b.day){b.day=G.day;b.dayChar=G.ch.name;changed=true;}
  // Top-5 leaderboard
  const totalScore=G.money+G.rel*200+G.rep*100+G.level*500+GIRLS.filter(g=>g.beaten).length*500;
  try{
    let hs=JSON.parse(localStorage.getItem('bazmin_hs')||'[]');
    hs.push({score:totalScore,name:G.ch.name,rel:G.rel,money:G.money,day:G.day,mode:G.mode,ts:Date.now()});
    hs.sort((a2,b2)=>b2.score-a2.score);hs=hs.slice(0,5);
    localStorage.setItem('bazmin_hs',JSON.stringify(hs));
    // Show leaderboard on game over
    const lbEl=document.getElementById('goLeaderboard');
    if(lbEl&&hs.length){
      const medals=['🥇','🥈','🥉','4.','5.'];
      lbEl.style.display='block';
      lbEl.innerHTML='<div style="color:#ffd740;font-weight:700;margin-bottom:6px">🏆 Лучшие результаты</div>'+
        hs.map((h,i)=>{
          const isCur=(h.ts===hs[hs.indexOf(h)].ts&&h.score===totalScore&&h.name===G.ch.name);
          return\`<div style="\${h.score===totalScore&&h.name===G.ch.name?'color:#ff6b9d;':'color:#aaa;'}">\${medals[i]} \${h.name}: \${h.score.toLocaleString('ru')} (❤️\${h.rel}% 💰\${Math.round(h.money/1000)}k)</div>\`;
        }).join('');
    }
  }catch(e){}
  if(changed)saveBest(b);
  return b;
}

function buildCharSelect(){
  const el=document.getElementById('charGrid');el.innerHTML='';
  if(window._tgName)document.getElementById('tgGreet').textContent='Привет, '+window._tgName+'! 👋';
  // Show best results
  const b=loadBest();
  const bel=document.getElementById('bestResults');
  if(bel){
    if(b.money||b.rel){
      const lines=[];
      if(b.money)lines.push('💰 '+b.money.toLocaleString('ru')+'₽ ('+b.moneyChar+')');
      if(b.rel)lines.push('❤️ '+b.rel+'% ('+b.relChar+')');
      if(b.level)lines.push('🆙 Ур.'+b.level+' ('+b.levelChar+')');
      bel.style.display='block';bel.innerHTML='🏆 Рекорды: '+lines.join(' · ');
    } else {bel.style.display='none';}
  }
  Object.entries(CHARS).forEach(([id,ch])=>{
    const s=ch.stat||{};
    const statBar=(label,val,color)=>{
      const pct=Math.round(val/5*100);
      return \`<div style="display:flex;align-items:center;gap:4px;width:100%"><span style="font-size:8px;color:#666;min-width:30px">\${label}</span><div class="statBar" style="flex:1"><span style="width:\${pct}%;background:\${color}"></span></div></div>\`;
    };
    const div=document.createElement('div');div.className='charCard'+(id===selectedChar?' sel':'');
    div.innerHTML=\`<img src="\${FD[ch.face]||''}" onerror="this.style.display='none'" alt=""><div class="cn">\${ch.name}</div><div class="cs">\${ch.money.toLocaleString('ru')}₽</div>\${statBar('💰',s.salary||1,'#4fc3f7')}\${statBar('💬',s.charisma||1,'#ff6b9d')}\${statBar('👀',s.looks||1,'#ffb74d')}<div class="cs" style="margin-top:2px">\${ch.bonusDesc}</div>\`;
    div.onclick=()=>{document.querySelectorAll('.charCard').forEach(c2=>c2.classList.remove('sel'));div.classList.add('sel');selectedChar=id;haptic('light');};
    el.appendChild(div);
  });
}
function startGame(mode){
  if(!selectedChar)selectedChar='roman';
  preloadFaces();generateMap();initG(selectedChar);spawnGirls();spawnNPCs();
  G.mode=mode;
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('hud').style.display='flex';
  // Set HUD portrait
  const hudFace=document.getElementById('hudFace');
  if(hudFace&&G.ch)hudFace.src=FD[G.ch.face]||'';
  W=c.width=window.innerWidth;H=c.height=window.innerHeight;
  const mmEl=document.getElementById('mm');
  mmEl.style.cssText='position:fixed;bottom:60px;right:8px;width:80px;height:80px;border:1px solid #333;border-radius:6px;z-index:25';
  mmEl.width=80;mmEl.height=80;
  centerOnHero();updateHUD();render();
  if(mode==='campaign')setTimeout(()=>checkChapter(),1000);
  showPhone('Добро пожаловать в Базовый Минимум! 🗺 Тапни на гексе чтобы ходить.');
  setTimeout(startBGMusic,500);
  requestAnimationFrame(loop);
}
window.addEventListener('resize',()=>{if(G.col||G.col===0){W=c.width=window.innerWidth;H=c.height=window.innerHeight;centerOnHero();render();}});
buildCharSelect();
`;

// ─── Assemble ────────────────────────────────────────────────────────────────
const fullHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>БАЗОВЫЙ МИНИМУМ: Стратегия</title>
<style>${CSS}</style>
</head>
<body>
${HTML}
<script>
${fdLine}
${GAME_JS}
</script>
</body>
</html>`;

fs.writeFileSync('index.html', fullHTML, 'utf8');
console.log('Built! Size:', fullHTML.length, 'bytes');
