const fs = require('fs');
const fdLine = fs.readFileSync('fd_line.txt', 'utf8');

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>БАЗОВЫЙ МИНИМУМ — Isometric Edition</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a12;overflow:hidden;touch-action:none;font-family:'Segoe UI',system-ui,sans-serif;user-select:none}
canvas{display:block;position:fixed;inset:0}
#startScreen{position:fixed;inset:0;background:linear-gradient(135deg,#0a0a1a,#1a0a2e,#0a1a2e);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:200;gap:8px;padding:16px;overflow-y:auto}
#startScreen h1{font-size:26px;color:#ff6b9d;text-shadow:0 0 30px #ff6b9d;text-align:center;letter-spacing:3px;animation:glow 2s ease-in-out infinite alternate}
@keyframes glow{from{text-shadow:0 0 20px #ff6b9d}to{text-shadow:0 0 40px #ff6b9d,0 0 80px #ff6b9d55}}
.sub{color:#888;font-size:10px;letter-spacing:2px;margin-bottom:6px}
.charSelect{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:400px}
.charCard{width:82px;padding:8px 4px;border:2px solid #222;border-radius:14px;background:rgba(255,255,255,.02);cursor:pointer;text-align:center;transition:all .3s}
.charCard:active,.charCard.sel{border-color:#ff6b9d;background:rgba(255,107,157,.08)}
.charCard img{width:52px;height:52px;border-radius:50%;border:2px solid #444;margin-bottom:3px}
.charCard .cn{color:#fff;font-weight:700;font-size:10px}
.charCard .cs{color:#666;font-size:8px;margin-top:2px;line-height:1.3}
#hud{position:fixed;top:0;left:0;right:0;padding:6px 10px;display:none;align-items:center;gap:8px;background:linear-gradient(180deg,rgba(0,0,0,.85),transparent);z-index:10;pointer-events:none}
.hi{color:#fff;font-size:11px;font-weight:700;text-shadow:0 0 8px #000;flex:1;text-align:center}
#distLabel{position:fixed;top:32px;left:0;right:0;text-align:center;color:#ff6b9d;font-size:10px;font-weight:700;letter-spacing:3px;text-shadow:0 0 15px #ff6b9d88;z-index:10;pointer-events:none;display:none}
#phone{position:fixed;top:52px;right:6px;max-width:200px;padding:8px 10px;background:rgba(10,10,20,.95);border:1px solid #444;border-radius:16px;color:#fff;font-size:10px;display:none;z-index:15;backdrop-filter:blur(10px)}
#phone .pt{color:#ff6b9d;font-weight:700;margin-bottom:3px;font-size:11px}
#travelScreen{position:fixed;inset:0;background:rgba(5,5,15,.97);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:180;gap:10px;color:#fff}
.distBtn{padding:12px 18px;border:1px solid #333;border-radius:14px;background:rgba(255,255,255,.03);color:#fff;font-size:13px;font-weight:700;cursor:pointer;width:220px;text-align:left;transition:all .2s}
.distBtn:active{border-color:#ff6b9d;background:rgba(255,107,157,.1)}
.distBtn .dd{font-size:9px;color:#666;display:block;margin-top:2px}
#loadScreen{position:fixed;inset:0;background:#050510;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:190;color:#fff;gap:10px}
#loadBar{width:180px;height:4px;background:#1a1a2a;border-radius:2px;overflow:hidden}
#loadFill{height:100%;width:0;background:linear-gradient(90deg,#ff6b9d,#764ba2);transition:width .3s}
#gameOver{position:fixed;inset:0;background:rgba(5,5,15,.96);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:200;gap:12px;color:#fff;padding:20px;text-align:center}
#gameOver h2{font-size:24px;text-shadow:0 0 30px #ff6b9d}
.stat{font-size:12px;opacity:.7;line-height:1.9}
.gbtn{padding:11px 28px;border:1px solid #ff6b9d;border-radius:50px;background:transparent;color:#ff6b9d;font-size:13px;font-weight:700;cursor:pointer}
.gbtn:active{background:#ff6b9d;color:#fff}
#minimap{position:fixed;bottom:8px;left:8px;border:1px solid rgba(255,255,255,.12);border-radius:10px;z-index:10;pointer-events:none;background:rgba(5,5,15,.8)}
#travelBtn{position:fixed;bottom:96px;right:8px;padding:7px 12px;background:rgba(10,10,20,.85);border:1px solid #444;border-radius:14px;color:#aaa;font-size:10px;font-weight:700;z-index:11;cursor:pointer;display:none}
#travelBtn:active{border-color:#ff6b9d;color:#ff6b9d}
#joyArea{position:fixed;bottom:6px;right:6px;width:120px;height:120px;z-index:12;display:none}
#jBase{width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);position:absolute;bottom:10px;right:10px}
#jKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,107,157,.22);border:2px solid rgba(255,107,157,.4);position:absolute;bottom:37px;right:37px}
#itemSlot{position:fixed;bottom:10px;left:50%;transform:translateX(-50%);padding:6px 14px;background:rgba(10,10,20,.88);border:1px solid #444;border-radius:18px;color:#fff;font-size:11px;z-index:11;display:none}
#dialogBox{position:fixed;bottom:0;left:0;right:0;background:rgba(5,5,18,.97);border-top:1px solid #333;padding:14px 16px;z-index:50;display:none;flex-direction:column;gap:8px}
#dialogChar{color:#ff6b9d;font-weight:700;font-size:13px;margin-bottom:2px}
#dialogText{color:#eee;font-size:12px;line-height:1.6;margin-bottom:4px}
.dialogChoice{padding:9px 14px;border:1px solid #333;border-radius:12px;background:rgba(255,255,255,.04);color:#fff;font-size:11px;cursor:pointer;text-align:left;transition:all .2s;margin-bottom:4px;display:block;width:100%}
.dialogChoice:active{border-color:#ff6b9d;background:rgba(255,107,157,.1)}
.dc{font-size:9px;opacity:.55;float:right;margin-top:1px}
#eventToast{position:fixed;top:62px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(10,10,25,.97);border:1px solid #ff6b9d;border-radius:18px;padding:10px 18px;color:#fff;font-size:12px;z-index:40;display:none;text-align:center;min-width:220px;box-shadow:0 4px 24px rgba(255,107,157,.3);transition:transform .3s,opacity .3s;opacity:0}
#eventToast.show{transform:translateX(-50%) translateY(0);opacity:1}
#eventToast .et{color:#ff6b9d;font-weight:700;font-size:13px;margin-bottom:3px}
#relBar{position:fixed;top:46px;left:8px;width:85px;z-index:10;display:none;pointer-events:none}
#relBar .rl{font-size:9px;color:#ff6b9d;font-weight:700;margin-bottom:2px}
#relTrack{height:5px;background:#1a1a2a;border-radius:3px;overflow:hidden}
#relFill{height:100%;width:50%;background:linear-gradient(90deg,#ff6b9d,#ff4081);transition:width .5s;border-radius:3px}
#chapterBanner{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.8);z-index:60;text-align:center;pointer-events:none;display:none;opacity:0;transition:all .5s;background:rgba(5,5,18,.95);padding:24px 32px;border-radius:20px;border:1px solid #ff6b9d}
#chapterBanner.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
#chapterBanner h2{font-size:26px;color:#ff6b9d;text-shadow:0 0 40px #ff6b9d}
#chapterBanner p{color:#aaa;font-size:13px;margin-top:8px}
</style>
</head>
<body>
<canvas id="c"></canvas>
<canvas id="minimap" width="120" height="90"></canvas>
<div id="startScreen">
  <h1>💅 БАЗОВЫЙ<br>МИНИМУМ 💪</h1>
  <div class="sub">ISOMETRIC EDITION v2.0</div>
  <div class="sub" style="color:#555">Выбери персонажа:</div>
  <div class="charSelect" id="charSelect"></div>
  <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;justify-content:center">
    <button class="gbtn" onclick="startGame('solo')">▶ Свободная игра</button>
    <button class="gbtn" style="border-color:#4fc3f7;color:#4fc3f7" onclick="startGame('story')">📖 Сюжет (5 глав)</button>
  </div>
</div>
<div id="hud">
  <span class="hi" id="hMoney">💰 0₽</span>
  <span class="hi" id="hTime">⏱ 240</span>
  <span class="hi" id="hScore">⭐ 0</span>
</div>
<div id="distLabel"></div>
<div id="relBar"><div class="rl">❤️ Отношения</div><div id="relTrack"><div id="relFill"></div></div></div>
<div id="phone"><div class="pt">📱 Уведомление</div><div id="phoneText"></div></div>
<div id="travelScreen">
  <div style="font-size:18px;font-weight:700;color:#ff6b9d">🗺️ Сменить район</div>
  <div style="font-size:11px;color:#666;margin-bottom:4px" id="travelFrom"></div>
  <div id="travelList"></div>
  <button class="distBtn" style="border-color:#333;color:#555;text-align:center" onclick="hideTravel()">✕ Остаться</button>
</div>
<div id="loadScreen">
  <div style="font-size:22px" id="loadText">Загрузка...</div>
  <div id="loadBar"><div id="loadFill"></div></div>
  <div style="font-size:11px;color:#555;max-width:260px;text-align:center" id="loadJoke"></div>
</div>
<div id="gameOver">
  <h2 id="goT">Игра окончена</h2>
  <div class="stat" id="goS"></div>
  <button class="gbtn" onclick="location.reload()">↺ Снова</button>
</div>
<button id="travelBtn" onclick="showTravel()">🗺 Район</button>
<div id="joyArea"><div id="jBase"></div><div id="jKnob"></div></div>
<div id="itemSlot"></div>
<div id="dialogBox">
  <div id="dialogChar"></div>
  <div id="dialogText"></div>
  <div id="dialogChoices"></div>
</div>
<div id="eventToast"><div class="et" id="eventTitle"></div><div id="eventDesc"></div></div>
<div id="chapterBanner"><h2 id="chBannerTitle"></h2><p id="chBannerSub"></p></div>
<script>
`;

const gameCode = `
// ===== CANVAS =====
const c=document.getElementById('c'),X=c.getContext('2d');
const mc=document.getElementById('minimap'),MX=mc.getContext('2d');
let W,H;function resize(){W=c.width=innerWidth;H=c.height=innerHeight}addEventListener('resize',resize);resize();
const L=(a,b,t)=>a+(b-a)*t,R=(a,b)=>a+Math.random()*(b-a),P=a=>a[~~(Math.random()*a.length)],CL=(v,a,b)=>Math.max(a,Math.min(b,v));

// Isometric tile dimensions
const TW=64,TH=32;
function isoSX(gx,gy){return(gx-gy)*(TW/2);}
function isoSY(gx,gy){return(gx+gy)*(TH/2);}

// ===== FACE DATA =====
const FI={};
FDLINE_PLACEHOLDER
Object.entries(FD).forEach(([k,v])=>{const i=new Image();i.src=v;FI[k]=i;});

// ===== JOYSTICK =====
const JOY={a:false,dx:0,dy:0};
(function(){const jB=document.getElementById('jBase'),jK=document.getElementById('jKnob'),jA=document.getElementById('joyArea');
function mv(px,py){const r=jB.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=px-cx,dy=py-cy;const d=Math.hypot(dx,dy),m=38;if(d>m){dx=dx/d*m;dy=dy/d*m;}jK.style.right=(10+48-21-dx)+'px';jK.style.bottom=(10+48-21-dy)+'px';JOY.dx=dx/m;JOY.dy=dy/m;JOY.a=true;}
function end(){jK.style.right='37px';jK.style.bottom='37px';JOY.dx=0;JOY.dy=0;JOY.a=false;}
jA.addEventListener('touchstart',e=>{e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY)},{passive:false});
jA.addEventListener('touchmove',e=>{e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY)},{passive:false});
jA.addEventListener('touchend',end);jA.addEventListener('mousedown',e=>mv(e.clientX,e.clientY));
addEventListener('mousemove',e=>{if(JOY.a)mv(e.clientX,e.clientY)});addEventListener('mouseup',end);})();

// ===== CHARACTERS =====
const CHARS={
arseniy:{name:'Арсений',color:'#ffa726',hair:'#5d4037',money:25000,speed:2.5,bonus:'discount',mult:1,face:'arseniy'},
lenya:{name:'Лёня',color:'#4fc3f7',hair:'#8d6e63',money:40000,speed:3.0,bonus:'car',mult:1,face:'lenya'},
vova:{name:'Вова',color:'#424242',hair:'#212121',money:10000,speed:4.0,bonus:'time',mult:1,face:'vova'},
roman:{name:'Роман',color:'#ef5350',hair:'#5d4037',money:12000,speed:2.8,bonus:'points',mult:2,face:'roman'},
};

// ===== DISTRICTS =====
const DISTRICTS={
patriki:{name:'Патрики',emoji:'🥂',color:'#ff6b9d',desc:'Хипстеры, бары, всё дорогое',
  roadCol:'#252530',sidewalkCol:'#32323e',grassCol:'#121e12',parkColor:'#1a3a1a',
  gridW:30,gridH:22,theme:'hipster',pM:1,gT:20,
  locs:[
    {id:'coffee_p',name:'Кофемания',color:'#6d4c41',neon:'#ffab40',price:800,gx:3,gy:2,logo:'☕',lt:'COFFEE'},
    {id:'bar',name:'Бар Москва',color:'#880e4f',neon:'#f50057',price:2000,gx:8,gy:2,logo:'🍸',lt:'BAR'},
    {id:'flowers_p',name:'Флора',color:'#e91e63',neon:'#ff80ab',price:2500,gx:13,gy:2,logo:'🌸',lt:'FLORA'},
    {id:'barber',name:'Барбершоп',color:'#37474f',neon:'#80cbc4',price:1500,gx:18,gy:2,logo:'💈',lt:'BARBER'},
    {id:'wine',name:'Винотека',color:'#4a148c',neon:'#ea80fc',price:3000,gx:23,gy:2,logo:'🍷',lt:'VINO'},
    {id:'gallery',name:'Арт-Галерея',color:'#283593',neon:'#8c9eff',price:2000,gx:27,gy:2,logo:'🎨',lt:'ART'},
    {id:'taxi_p',name:'Я.Такси',color:'#f9a825',neon:'#ffee58',price:500,gx:3,gy:8,logo:'🚕',lt:'TAXI'},
    {id:'restaurant_p',name:'Паста Бар',color:'#bf360c',neon:'#ff6e40',price:4000,gx:11,gy:8,logo:'🍝',lt:'PASTA'},
    {id:'boutique',name:'Бутик Luxe',color:'#6a1b9a',neon:'#ce93d8',price:5000,gx:19,gy:8,logo:'👗',lt:'LUXE'},
    {id:'spa_p',name:'SPA Патрики',color:'#00695c',neon:'#64ffda',price:3500,gx:3,gy:14,logo:'💆',lt:'SPA'},
    {id:'sushi_p',name:'Суши-бар',color:'#c62828',neon:'#ff5252',price:3000,gx:11,gy:14,logo:'🍣',lt:'SUSHI'},
  ],
  requests:[
    {need:'coffee_p',text:'Кофемания ☕',pts:80},{need:'bar',text:'В бар 🍸',pts:150},
    {need:'flowers_p',text:'Флора 🌸',pts:120},{need:'wine',text:'Вина 🍷',pts:200},
    {need:'restaurant_p',text:'Паста Бар 🍝',pts:250},{need:'boutique',text:'Бутик 👗',pts:300},
    {need:'spa_p',text:'SPA 💆',pts:220},{need:'sushi_p',text:'Суши 🍣',pts:180},
  ],
  gF:['lilya','arina'],gN:['Лиля','Арина','Алиса','Ева','Мила'],
  gC:['#f48fb1','#ce93d8','#ef9a9a'],
  jokes:['Самокатчик чуть не сбил...','NFT в меню кафе...','Очередь в The Hummus 40 мин'],
},
ramenki:{name:'Раменки',emoji:'🏢',color:'#4caf50',desc:'Средний класс, ЖК, пробки',
  roadCol:'#242924',sidewalkCol:'#2e332e',grassCol:'#0e1a0e',parkColor:'#122012',
  gridW:34,gridH:26,theme:'residential',pM:1.2,gT:22,
  locs:[
    {id:'azbuka',name:'Вкус & Цена',color:'#8e3b5e',neon:'#ff3366',price:5000,gx:3,gy:2,logo:'🍷',lt:'V&C'},
    {id:'pyat',name:'Пятёрочка',color:'#d32f2f',neon:'#ff5252',price:300,gx:9,gy:2,logo:'⭐',lt:'5ка'},
    {id:'silver',name:'Серебр. Яблоко',color:'#78909c',neon:'#cfd8dc',price:3500,gx:15,gy:2,logo:'🍎',lt:'SILVER'},
    {id:'wb_r',name:'WildBerry',color:'#7b1fa2',neon:'#ce93d8',price:2500,gx:22,gy:2,logo:'🫐',lt:'WB'},
    {id:'azon',name:'Azon',color:'#1565c0',neon:'#42a5f5',price:2000,gx:28,gy:2,logo:'📦',lt:'AZON'},
    {id:'shawarma',name:'Шаурма Хаус',color:'#795548',neon:'#bcaaa4',price:200,gx:3,gy:9,logo:'🌯',lt:'ШАУРМА'},
    {id:'flowers_r',name:'Цветы у метро',color:'#e91e63',neon:'#ff80ab',price:800,gx:12,gy:9,logo:'💐',lt:'ЦВЕТЫ'},
    {id:'jewelry_r',name:'Золот. Брилл.',color:'#ff8f00',neon:'#ffd740',price:7000,gx:20,gy:9,logo:'💎',lt:'GOLD'},
    {id:'taxi_r',name:'Я.Премиум',color:'#212121',neon:'#ffd600',price:2000,gx:28,gy:9,logo:'🚖',lt:'PREMIUM'},
    {id:'magnit_r',name:'Магнетик',color:'#c62828',neon:'#ef5350',price:250,gx:3,gy:16,logo:'🧲',lt:'MAG'},
    {id:'kfc_r',name:'Курочка',color:'#b71c1c',neon:'#ff1744',price:400,gx:12,gy:16,logo:'🍗',lt:'КУРОЧ'},
  ],
  requests:[
    {need:'azbuka',text:'Вкус&Цена 🍷',pts:300},{need:'pyat',text:'Пятёрку ⭐',pts:30},
    {need:'silver',text:'Серебр.Яблоко 🍎',pts:220},{need:'wb_r',text:'WildBerry 🫐',pts:180},
    {need:'flowers_r',text:'Цветы 💐',pts:90},{need:'jewelry_r',text:'Ювелирку 💎',pts:500},
    {need:'kfc_r',text:'Курочку 🍗',pts:40},{need:'taxi_r',text:'Такси 🚖',pts:150},
  ],
  gF:['lilya','arina'],gN:['Марина','Оксана','Наташа','Света','Люба'],
  gC:['#a5d6a7','#ef9a9a','#ffe082'],
  jokes:['Пробка на Мичуринском весь день','ЖКХ повысили тариф','Парковка во дворе только для жильцов'],
},
mytishi:{name:'Мытищи',emoji:'🏚️',color:'#78909c',desc:'Панельки, маршрутки, шаурма',
  roadCol:'#1e1e24',sidewalkCol:'#26262e',grassCol:'#0c140c',parkColor:'#0e1a0e',
  gridW:28,gridH:20,theme:'panel',pM:0.5,gT:28,
  locs:[
    {id:'magnit',name:'Магнетик',color:'#c62828',neon:'#ef5350',price:200,gx:3,gy:2,logo:'🧲',lt:'MAG'},
    {id:'fix',name:'Всё по 99',color:'#e65100',neon:'#ff9100',price:100,gx:8,gy:2,logo:'🏷️',lt:'99₽'},
    {id:'flowers_m',name:'Цветы у метро',color:'#c2185b',neon:'#f48fb1',price:400,gx:13,gy:2,logo:'💐',lt:'ЦВЕТЫ'},
    {id:'shawarma_m',name:'Шаурма 24/7',color:'#4e342e',neon:'#a1887f',price:150,gx:18,gy:2,logo:'🌯',lt:'24/7'},
    {id:'marsh',name:'Маршрутка',color:'#546e7a',neon:'#90a4ae',price:50,gx:3,gy:8,logo:'🚐',lt:'МАРШ'},
    {id:'kfc_m',name:'Курочка',color:'#b71c1c',neon:'#ff1744',price:400,gx:9,gy:8,logo:'🍗',lt:'КУРОЧ'},
    {id:'park_m',name:'Парк Победы',color:'#33691e',neon:'#76ff03',price:0,gx:15,gy:8,logo:'🌳',lt:'ПАРК'},
    {id:'wb_m',name:'WildBerry ПВЗ',color:'#7b1fa2',neon:'#ce93d8',price:300,gx:21,gy:8,logo:'🫐',lt:'WB'},
  ],
  requests:[
    {need:'magnit',text:'Магнетик 🧲',pts:20},{need:'fix',text:'99₽ 🏷️',pts:15},
    {need:'flowers_m',text:'Цветы 💐',pts:40},{need:'shawarma_m',text:'Шаурму 🌯',pts:15},
    {need:'marsh',text:'Маршрутку 🚐',pts:10},{need:'kfc_m',text:'Курочку 🍗',pts:35},
    {need:'park_m',text:'В парк 🌳',pts:25},{need:'wb_m',text:'WB ПВЗ 🫐',pts:30},
  ],
  gF:['lilya','arina'],gN:['Кристина','Даша','Лера','Яна','Таня'],
  gC:['#b0bec5','#ef9a9a','#ffe082'],
  jokes:['Маршрутка сломалась у поворота','Горячую воду отключили','Пьяный сосед поёт третий час'],
},
krasnogorsk:{name:'Красногорск',emoji:'👑',color:'#ffd700',desc:'Элита, охрана, премиум',
  roadCol:'#282618',sidewalkCol:'#343020',grassCol:'#141e08',parkColor:'#1a2e08',
  gridW:34,gridH:26,theme:'elite',pM:3,gT:18,
  locs:[
    {id:'bork',name:'Борк Хаус',color:'#4e342e',neon:'#d4a056',price:8000,gx:3,gy:2,logo:'🏠',lt:'BORK'},
    {id:'cartie',name:'Картье',color:'#b8860b',neon:'#ffd700',price:15000,gx:9,gy:2,logo:'💎',lt:'CARTIÉ'},
    {id:'resto_k',name:'Крыша',color:'#311b92',neon:'#b388ff',price:8000,gx:16,gy:2,logo:'🥂',lt:'КРЫША'},
    {id:'silver_k',name:'Серебр. Яблоко',color:'#78909c',neon:'#e0e0e0',price:5000,gx:24,gy:2,logo:'🍎',lt:'SILVER'},
    {id:'spa_k',name:'SPA Роял',color:'#00695c',neon:'#64ffda',price:6000,gx:3,gy:9,logo:'💆',lt:'ROYAL'},
    {id:'guchi',name:'Гучи',color:'#1b5e20',neon:'#69f0ae',price:12000,gx:11,gy:9,logo:'👜',lt:'GUCHI'},
    {id:'taxi_k',name:'VIP Такси',color:'#1a1a1a',neon:'#ffd600',price:4000,gx:20,gy:9,logo:'🚖',lt:'VIP'},
    {id:'flowers_k',name:'Букет Люкс',color:'#880e4f',neon:'#ff80ab',price:5000,gx:28,gy:9,logo:'🌹',lt:'LUXE'},
    {id:'maldives',name:'Тур Мальдивы',color:'#01579b',neon:'#40c4ff',price:25000,gx:11,gy:16,logo:'✈️',lt:'FLY'},
    {id:'tiffany',name:'Тиффани',color:'#00897b',neon:'#64ffda',price:20000,gx:20,gy:16,logo:'💍',lt:'TIFF'},
  ],
  requests:[
    {need:'cartie',text:'Картье 💎',pts:1200},{need:'resto_k',text:'На Крышу 🥂',pts:600},
    {need:'silver_k',text:'Серебр.Яблоко 🍎',pts:350},{need:'spa_k',text:'SPA 💆',pts:400},
    {need:'guchi',text:'Гучи 👜',pts:800},{need:'maldives',text:'Мальдивы ✈️',pts:2000},
    {need:'flowers_k',text:'Букет Люкс 🌹',pts:500},{need:'tiffany',text:'Тиффани 💍',pts:1500},
  ],
  gF:['lilya','arina'],gN:['Виктория','Камилла','Стефания','Валерия'],
  gC:['#ffe082','#ffab91','#f8bbd0'],
  jokes:['Охранник проверяет пропуск','Парковка от 5000₽/час','Дресс-код: без кед не пускают'],
}};
const DORD=['patriki','ramenki','mytishi','krasnogorsk'];

// Tile type constants
const T={EMPTY:0,ROAD_H:1,ROAD_V:2,ROAD_X:3,SIDEWALK:4,GRASS:5,PARK:6,
  BLDLOW:7,BLDMED:8,BLDHIGH:9,BLDLUX:10,BLDPANEL:11,
  TREE:12,BENCH:13,LAMP:14,FOUNTAIN:15,SHOP:16};

// ===== GAME STATE =====
const G={
  running:false,ch:null,distId:null,dist:null,mode:'solo',
  p:{wx:0,wy:0,speed:3,item:null,walkT:0},
  girls:[],npcs:[],particles:[],floats:[],cars:[],
  money:0,score:0,timer:240,served:0,failed:0,
  ox:0,oy:0,shake:0,dayTime:.35,daySpeed:.0025,
  chapter:0,relation:50,storyState:{},
  speedMod:1,speedModTimer:0,priceDiscount:1,discountTimer:0,
  randomEventCooldown:10,urgentQuest:false,urgentTimer:0
};

let GRID=[],GRID_W=0,GRID_H=0;

// ===== GRID INIT =====
function initGrid(){
  const d=G.dist;
  GRID_W=d.gridW;GRID_H=d.gridH;
  GRID=Array.from({length:GRID_H},()=>Array.from({length:GRID_W},()=>({t:T.EMPTY,h:1,hue:220,variant:0,loc:null,trafficLight:false})));

  // Road positions
  const hR=[3,9,15,19],vR=[4,10,17,24];

  for(let y=0;y<GRID_H;y++)for(let x=0;x<GRID_W;x++){
    const onH=hR.some(r=>y===r||y===r+1);
    const onV=vR.some(r=>x===r||x===r+1);
    if(onH&&onV){GRID[y][x].t=T.ROAD_X;GRID[y][x].trafficLight=Math.random()<.5;}
    else if(onH)GRID[y][x].t=T.ROAD_H;
    else if(onV)GRID[y][x].t=T.ROAD_V;
    else if(hR.some(r=>y===r-1||y===r+2)||vR.some(r=>x===r-1||x===r+2))GRID[y][x].t=T.SIDEWALK;
    else GRID[y][x].t=T.GRASS;
  }

  fillBuildings(hR,vR);

  // Place shops
  d.locs.forEach(loc=>{
    if(loc.gx<GRID_W&&loc.gy<GRID_H){
      GRID[loc.gy][loc.gx].t=T.SHOP;
      GRID[loc.gy][loc.gx].loc=loc;
      loc.wx=(loc.gx+.5)*TW;
      loc.wy=(loc.gy+.5)*TH;
    }
  });

  // Lamps and benches on sidewalks
  for(let y=0;y<GRID_H;y++)for(let x=0;x<GRID_W;x++){
    if(GRID[y][x].t===T.SIDEWALK){
      const r=Math.random();
      if(r<.08)GRID[y][x].t=T.LAMP;
      else if(r<.12)GRID[y][x].t=T.BENCH;
    }
  }
}

function fillBuildings(hR,vR){
  const d=G.dist;
  const rows=[-1,...hR.map(r=>[r-1,r+2]).flat(),GRID_H];
  const cols=[-1,...vR.map(r=>[r-1,r+2]).flat(),GRID_W];
  const boundaries_y=[-1,...hR.map(r=>[r-2,r+3]).flat(),GRID_H+1].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  const boundaries_x=[-1,...vR.map(r=>[r-2,r+3]).flat(),GRID_W+1].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);

  for(let bi=0;bi<boundaries_y.length-1;bi++){
    for(let bj=0;bj<boundaries_x.length-1;bj++){
      const y0=boundaries_y[bi]+1,y1=boundaries_y[bi+1]-1;
      const x0=boundaries_x[bj]+1,x1=boundaries_x[bj+1]-1;
      if(y1<y0||x1<x0)continue;

      const isPark=Math.random()<.18;
      for(let y=y0;y<=y1&&y<GRID_H;y++){
        for(let x=x0;x<=x1&&x<GRID_W;x++){
          if(GRID[y][x].t!==T.GRASS)continue;
          if(isPark){
            const r=Math.random();
            if(r<.3)GRID[y][x].t=T.TREE;
            else if(r<.34&&x===~~((x0+x1)/2)&&y===~~((y0+y1)/2))GRID[y][x].t=T.FOUNTAIN;
            else if(r<.37)GRID[y][x].t=T.BENCH;
            else GRID[y][x].t=T.PARK;
          } else {
            const theme=d.theme;
            const h=theme==='elite'?~~R(4,9):theme==='panel'?~~R(3,7):~~R(1,5);
            const hue=theme==='hipster'?~~R(200,320):theme==='panel'?~~R(180,220):theme==='elite'?~~R(30,60):~~R(180,280);
            const bt=h>5?T.BLDHIGH:h>3?T.BLDMED:theme==='panel'?T.BLDPANEL:theme==='elite'?T.BLDLUX:T.BLDLOW;
            GRID[y][x].t=bt;GRID[y][x].h=h;GRID[y][x].hue=hue;GRID[y][x].variant=~~R(0,4);
          }
        }
      }
    }
  }
}

function gToW(gx,gy){return{wx:(gx+.5)*TW,wy:(gy+.5)*TH};}

function wToS(wx,wy){
  const gx=wx/TW,gy=wy/TH;
  return{sx:W/2+isoSX(gx,gy)+G.ox,sy:H/2+isoSY(gx,gy)+G.oy};
}

// ===== CARS =====
function genCars(){
  G.cars=[];
  const hR=[3,9,15,19],vR=[4,10,17,24];
  for(let i=0;i<14;i++){
    const isH=Math.random()>.4;
    const ry=P(hR);const rx=P(vR);
    G.cars.push({
      wx:isH?R(0,GRID_W*TW):(rx+.5)*TW+TW*.3,
      wy:isH?(ry+.5)*TH+TH*.3:R(0,GRID_H*TH),
      isH,speed:(R(.8,2.0))*(Math.random()>.5?1:-1),
      color:P(['#e53935','#1e88e5','#43a047','#f9a825','#8e24aa','#eeeeee','#ff5722','#00bcd4']),
    });
  }
}

// ===== NPCs =====
function genNPCs(){
  G.npcs=[];
  for(let i=0;i<10;i++){
    const gx=~~R(2,GRID_W-2),gy=~~R(2,GRID_H-2);
    const w=gToW(gx,gy);
    G.npcs.push({wx:w.wx,wy:w.wy,tx:w.wx,ty:w.wy,speed:R(.5,1.2),
      color:P(['#ef9a9a','#f48fb1','#ce93d8','#9fa8da','#a5d6a7','#ffe082','#80deea']),
      isGirl:Math.random()>.4,walkT:0,moveTimer:R(2,8),moving:false});
  }
}

// ===== SKY =====
function getSky(){
  const t=G.dayTime;
  if(t<.2||t>.85)return{r:6,g:6,b:16,a:.07};
  if(t<.3){const p=(t-.2)*10;return{r:L(6,50,p),g:L(6,35,p),b:L(16,70,p),a:L(.07,.45,p)};}
  if(t<.45){const p=(t-.3)/.15;return{r:L(50,135,p),g:L(35,165,p),b:L(70,205,p),a:L(.45,.88,p)};}
  if(t<.55)return{r:135,g:165,b:205,a:.88};
  if(t<.7){const p=(t-.55)/.15;return{r:L(135,70,p),g:L(165,45,p),b:L(205,90,p),a:L(.88,.45,p)};}
  const p=(t-.7)/.15;return{r:L(70,6,p),g:L(45,6,p),b:L(90,16,p),a:L(.45,.07,p)};
}

// ===== TILE COLOR HELPERS =====
function dimRGB(hex,f){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return \`rgb(\${~~(r*f)},\${~~(g*f)},\${~~(b*f)})\`;}
function hslStr(h,s,l){return \`hsl(\${h},\${s}%,\${l}%)\`;}

// ===== ISO DRAWING =====
function drawDiamond(sx,sy,w,h,fill,stroke){
  X.fillStyle=fill;
  X.beginPath();X.moveTo(sx,sy-h/2);X.lineTo(sx+w/2,sy);X.lineTo(sx,sy+h/2);X.lineTo(sx-w/2,sy);X.closePath();X.fill();
  if(stroke){X.strokeStyle=stroke;X.lineWidth=.5;X.stroke();}
}

function drawCube(sx,sy,ph,topC,leftC,rightC){
  const hw=TW/2,hh=TH/2;
  X.fillStyle=topC;X.beginPath();X.moveTo(sx,sy-ph);X.lineTo(sx+hw,sy-ph+hh);X.lineTo(sx,sy-ph+TH);X.lineTo(sx-hw,sy-ph+hh);X.closePath();X.fill();
  X.fillStyle=leftC;X.beginPath();X.moveTo(sx-hw,sy-ph+hh);X.lineTo(sx,sy-ph+TH);X.lineTo(sx,sy+TH);X.lineTo(sx-hw,sy+hh);X.closePath();X.fill();
  X.fillStyle=rightC;X.beginPath();X.moveTo(sx+hw,sy-ph+hh);X.lineTo(sx,sy-ph+TH);X.lineTo(sx,sy+TH);X.lineTo(sx+hw,sy+hh);X.closePath();X.fill();
}

function drawTree(sx,sy,sky){
  const night=sky.a<.5;
  X.globalAlpha=.14;X.fillStyle='#000';X.beginPath();X.ellipse(sx+3,sy+1,9,4,0,0,Math.PI*2);X.fill();X.globalAlpha=1;
  X.fillStyle=night?'#2a1a0a':'#4e342e';X.fillRect(sx-2,sy-6,4,10);
  const g=night?'#0d240d':'#1b5e20',gL=night?'#112e11':'#2e7d32';
  X.fillStyle=g;X.beginPath();X.arc(sx,sy-12,8,0,Math.PI*2);X.fill();
  X.fillStyle=gL;X.beginPath();X.arc(sx,sy-17,5,0,Math.PI*2);X.fill();
  X.beginPath();X.arc(sx-4,sy-11,4,0,Math.PI*2);X.fill();
  X.beginPath();X.arc(sx+4,sy-11,4,0,Math.PI*2);X.fill();
}

function drawLamp(sx,sy,sky){
  const night=sky.a<.5;
  X.fillStyle='#607d8b';X.fillRect(sx-1,sy-16,2,16);X.fillRect(sx-4,sy-17,8,2);
  if(night){
    const grd=X.createRadialGradient(sx,sy-15,0,sx,sy-15,36);
    grd.addColorStop(0,\`rgba(255,230,120,\${(.5-sky.a)*.6})\`);grd.addColorStop(1,'transparent');
    X.fillStyle=grd;X.fillRect(sx-36,sy-51,72,72);
    X.fillStyle='rgba(255,240,100,0.95)';X.beginPath();X.arc(sx,sy-16,2.5,0,Math.PI*2);X.fill();
  }
}

function drawFountain(sx,sy){
  const t=Date.now()/1000;
  X.fillStyle='#01579b';X.beginPath();X.arc(sx,sy,12,0,Math.PI*2);X.fill();
  X.fillStyle='rgba(100,180,255,.35)';X.beginPath();X.arc(sx,sy,8,0,Math.PI*2);X.fill();
  for(let i=0;i<4;i++){const a=t*2+i*1.57,r=3+Math.sin(t*3+i)*2;
    X.globalAlpha=.5;X.fillStyle='#81d4fa';
    X.beginPath();X.arc(sx+Math.cos(a)*r,sy+Math.sin(a)*r-Math.abs(Math.sin(t*2+i))*7,1.5,0,Math.PI*2);X.fill();X.globalAlpha=1;}
}

function drawShop(sx,sy,loc,sky){
  const night=sky.a<.5;
  const bh=20;
  const tf=night?.6:1,lf=night?.4:.7,rf=night?.35:.6;
  drawCube(sx,sy-TH/2,bh,dimRGB(loc.color,tf),dimRGB(loc.color,lf),dimRGB(loc.color,rf));
  if(night){X.shadowColor=loc.neon;X.shadowBlur=14;X.fillStyle=loc.neon;X.font='bold 7px monospace';X.textAlign='center';X.fillText(loc.lt||'SHOP',sx,sy-bh-TH/2-5);X.shadowBlur=0;}
  const fb=Math.sin(Date.now()/500)*1.5;
  X.font='11px serif';X.textAlign='center';X.fillText(loc.logo,sx,sy-bh-TH/2-12+fb);
}

function drawCar(car,sky){
  const night=sky.a<.5;
  const d=G.dist;
  if(car.isH){car.wx+=car.speed*G.speedMod;if(car.wx>GRID_W*TW+60)car.wx=-60;if(car.wx<-60)car.wx=GRID_W*TW+60;}
  else{car.wy+=car.speed*G.speedMod;if(car.wy>GRID_H*TH+60)car.wy=-60;if(car.wy<-60)car.wy=GRID_H*TH+60;}
  const{sx,sy}=wToS(car.wx,car.wy);
  if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
  if(night){const grd=X.createRadialGradient(sx,sy,0,sx,sy,22);grd.addColorStop(0,\`rgba(255,240,180,\${(.5-sky.a)*.35})\`);grd.addColorStop(1,'transparent');X.fillStyle=grd;X.fillRect(sx-22,sy-22,44,44);}
  const ch=4,cw=car.isH?16:8,cl=car.isH?8:16;
  X.fillStyle=dimRGB(car.color,night?.65:.95);
  X.beginPath();X.moveTo(sx,sy-ch);X.lineTo(sx+cw/2,sy-ch+cl/4);X.lineTo(sx,sy-ch+cl/2);X.lineTo(sx-cw/2,sy-ch+cl/4);X.closePath();X.fill();
  X.fillStyle=dimRGB(car.color,night?.45:.7);
  X.beginPath();X.moveTo(sx-cw/2,sy-ch+cl/4);X.lineTo(sx,sy-ch+cl/2);X.lineTo(sx,sy+cl/2);X.lineTo(sx-cw/2,sy+cl/4);X.closePath();X.fill();
  X.fillStyle=dimRGB(car.color,night?.5:.75);
  X.beginPath();X.moveTo(sx+cw/2,sy-ch+cl/4);X.lineTo(sx,sy-ch+cl/2);X.lineTo(sx,sy+cl/2);X.lineTo(sx+cw/2,sy+cl/4);X.closePath();X.fill();
}

// ===== ISOMETRIC MAP =====
function drawIsoMap(sky){
  const night=sky.a<.5;
  const d=G.dist;
  const tf=~~(Date.now()/2000)%2;

  for(let y=0;y<GRID_H;y++){
    for(let x=0;x<GRID_W;x++){
      const wx=(x+.5)*TW,wy=(y+.5)*TH;
      const{sx,sy}=wToS(wx,wy);
      if(sx<-80||sx>W+80||sy<-120||sy>H+80)continue;
      const tile=GRID[y][x];

      // Ground
      let gc=d.grassCol||'#121812';
      if(tile.t===T.ROAD_H||tile.t===T.ROAD_V||tile.t===T.ROAD_X)gc=d.roadCol;
      else if(tile.t===T.SIDEWALK||tile.t===T.LAMP||tile.t===T.BENCH)gc=d.sidewalkCol;
      else if(tile.t===T.PARK||tile.t===T.TREE||tile.t===T.FOUNTAIN)gc=d.parkColor||'#122012';
      drawDiamond(sx,sy,TW,TH,gc,'rgba(0,0,0,.12)');

      // Road marking
      if(tile.t===T.ROAD_H){X.strokeStyle='rgba(255,255,255,.1)';X.lineWidth=.5;X.beginPath();X.moveTo(sx-TW/2,sy);X.lineTo(sx+TW/2,sy);X.stroke();}
      if(tile.t===T.ROAD_V){X.strokeStyle='rgba(255,255,255,.1)';X.lineWidth=.5;X.beginPath();X.moveTo(sx,sy-TH/2);X.lineTo(sx,sy+TH/2);X.stroke();}
      if(tile.trafficLight){
        const go=tf===0;
        X.fillStyle='#212121';X.fillRect(sx+8,sy-20,5,14);
        X.fillStyle=go?'#f44336':'#222';X.beginPath();X.arc(sx+10,sy-18,2.5,0,Math.PI*2);X.fill();
        X.fillStyle=go?'#222':'#4caf50';X.beginPath();X.arc(sx+10,sy-11,2.5,0,Math.PI*2);X.fill();
      }
    }
  }

  // Objects pass (back-to-front)
  for(let y=0;y<GRID_H;y++){
    for(let x=0;x<GRID_W;x++){
      const wx=(x+.5)*TW,wy=(y+.5)*TH;
      const{sx,sy}=wToS(wx,wy);
      if(sx<-100||sx>W+100||sy<-200||sy>H+100)continue;
      const tile=GRID[y][x];
      if(tile.t<T.BLDLOW&&tile.t!==T.TREE&&tile.t!==T.BENCH&&tile.t!==T.LAMP&&tile.t!==T.FOUNTAIN&&tile.t!==T.SHOP)continue;

      if(tile.t>=T.BLDLOW&&tile.t<=T.BLDPANEL){
        const bh=(tile.h||1)*7+8;
        const hue=tile.hue||220,h=tile.h||1;
        const br=night?8+h*2:14+h*3;
        const tc=hslStr(hue,12,br+8),lc=hslStr(hue,12,br),rc=hslStr(hue,12,br-4);
        drawCube(sx,sy,bh,tc,lc,rc);
        if(night&&bh>14){
          X.globalAlpha=.45;
          for(let wy2=bh-6;wy2>3;wy2-=8){
            for(let wx2=-TW/4+2;wx2<TW/4-2;wx2+=8){
              const lit=(wx2*7+wy2*3+x*13+y*5)%5>1;
              X.fillStyle=lit?'rgba(255,225,120,.9)':'rgba(40,40,60,.5)';
              X.fillRect(sx+wx2-2,sy-wy2-3,5,5);
            }
          }
          X.globalAlpha=1;
        }
        // Hipster cafe awning
        if(d.theme==='hipster'&&tile.t===T.BLDLOW){
          X.fillStyle='rgba(255,100,150,0.25)';
          X.beginPath();X.moveTo(sx-TW/2+4,sy+3);X.lineTo(sx,sy-2);X.lineTo(sx+TW/2-4,sy+3);X.closePath();X.fill();
        }
      } else if(tile.t===T.SHOP&&tile.loc){
        drawShop(sx,sy,tile.loc,sky);
      } else if(tile.t===T.TREE){
        drawTree(sx,sy-3,sky);
      } else if(tile.t===T.BENCH){
        const bc=night?'#2a1a0a':'#4e342e';
        X.fillStyle=bc;X.fillRect(sx-7,sy-8,14,3);X.fillRect(sx-8,sy-7,2,6);X.fillRect(sx+6,sy-7,2,6);
        X.fillStyle=night?'#1a1410':'#3e2723';X.fillRect(sx-7,sy-6,14,2);
      } else if(tile.t===T.LAMP){
        drawLamp(sx,sy,sky);
      } else if(tile.t===T.FOUNTAIN){
        drawFountain(sx,sy);
      }
    }
  }

  // Cars
  G.cars.forEach(car=>drawCar(car,sky));
}

// ===== CHARACTER DRAWING =====
function drawHuman(sx,sy,faceId,bodyCol,hairCol,isGirl,walkT,sz,emotion,item){
  const s=sz||1,t=walkT||0,moving=t>0.01;
  const legSwing=moving?Math.sin(t*6)*11*s:0;
  const armSwing=moving?Math.sin(t*6)*7*s:Math.sin(Date.now()/800)*1.5*s;
  const bob=moving?Math.abs(Math.sin(t*6))*2*s:Math.sin(Date.now()/600)*.8*s;
  const by=sy-bob;

  X.globalAlpha=.18;X.fillStyle='#000';X.beginPath();X.ellipse(sx,sy+1*s,7*s,3*s,0,0,Math.PI*2);X.fill();X.globalAlpha=1;

  // Legs
  const legC=isGirl?'#ec407a':'#1565c0';
  X.strokeStyle=legC;X.lineWidth=3*s;X.lineCap='round';
  X.beginPath();X.moveTo(sx-2*s,by+4*s);X.lineTo(sx-3*s+legSwing*.4,by+11*s);X.stroke();
  X.beginPath();X.moveTo(sx+2*s,by+4*s);X.lineTo(sx+3*s-legSwing*.4,by+11*s);X.stroke();
  X.fillStyle='#1a1a1a';
  X.beginPath();X.ellipse(sx-3*s+legSwing*.4,by+11*s,2*s,1.2*s,0,0,Math.PI*2);X.fill();
  X.beginPath();X.ellipse(sx+3*s-legSwing*.4,by+11*s,2*s,1.2*s,0,0,Math.PI*2);X.fill();

  // Body
  X.fillStyle=bodyCol||'#ffa726';X.beginPath();X.roundRect(sx-5*s,by-6*s,10*s,10*s,2*s);X.fill();

  // Arms
  X.strokeStyle=bodyCol||'#ffa726';X.lineWidth=2.5*s;
  X.beginPath();X.moveTo(sx-5*s,by-4*s);
  if(item)X.lineTo(sx-9*s,by-11*s);else X.lineTo(sx-8*s-armSwing*.3,by+2*s);X.stroke();
  X.beginPath();X.moveTo(sx+5*s,by-4*s);
  if(item)X.lineTo(sx+9*s,by-11*s);else X.lineTo(sx+8*s+armSwing*.3,by+2*s);X.stroke();

  // Neck
  X.fillStyle='#f5cba7';X.fillRect(sx-2*s,by-10*s,4*s,4*s);

  const headR=7*s,hx=sx,hy=by-14*s;
  // Hair
  X.fillStyle=hairCol||'#5d4037';
  X.beginPath();X.arc(hx,hy,headR+1*s,Math.PI,Math.PI*2);X.fill();
  if(isGirl){X.beginPath();X.arc(hx-6*s,hy,2.5*s,0,Math.PI*2);X.fill();X.beginPath();X.arc(hx+6*s,hy,2.5*s,0,Math.PI*2);X.fill();}
  // Skin
  X.fillStyle='#f5cba7';X.beginPath();X.arc(hx,hy,headR,0,Math.PI*2);X.fill();
  // Face
  if(faceId&&FI[faceId]&&FI[faceId].complete){
    X.save();X.beginPath();X.arc(hx,hy,headR-.5,0,Math.PI*2);X.clip();
    X.drawImage(FI[faceId],hx-headR,hy-headR,headR*2,headR*2);X.restore();
  } else {
    X.fillStyle='#333';X.beginPath();X.arc(hx-2.5*s,hy-1*s,1.2*s,0,Math.PI*2);X.fill();
    X.beginPath();X.arc(hx+2.5*s,hy-1*s,1.2*s,0,Math.PI*2);X.fill();
    X.strokeStyle='#333';X.lineWidth=.8*s;X.beginPath();X.arc(hx,hy+2*s,1.5*s,0,Math.PI,false);X.stroke();
  }
  if(emotion){const et=Date.now()/300;X.font=\`\${10*s}px serif\`;X.textAlign='center';X.fillText(emotion,hx,hy-headR-7*s-Math.abs(Math.sin(et))*2);}
  if(item){const it=Math.sin(Date.now()/200)*2;X.font=\`\${14*s}px serif\`;X.textAlign='center';X.fillText(item,hx,hy-headR-13*s+it);}
  return hy-headR;
}

function drawPlayer(){
  const p=G.p,ch=G.ch;
  const{sx,sy}=wToS(p.wx,p.wy);
  p.walkT+=JOY.a?.05:0;
  let itemE=null;
  if(p.item){const loc=G.dist.locs.find(l=>l.id===p.item);if(loc)itemE=loc.logo;}
  drawHuman(sx,sy,ch.face,ch.color,ch.hair,false,p.walkT,1.1,null,itemE);
  if(JOY.a){const pu=(Math.sin(Date.now()/150)+1)*.2+.1;X.strokeStyle=\`rgba(255,107,157,\${pu})\`;X.lineWidth=1.5;X.beginPath();X.arc(sx,sy,19,0,Math.PI*2);X.stroke();}
}

function drawGirl(g){
  const{sx,sy}=wToS(g.wx,g.wy);
  const distToP=Math.hypot(g.wx-G.p.wx,g.wy-G.p.wy);
  g.walkT=distToP<180?g.walkT+.02:0;
  let emo=null;
  if(g.sat){const age=(Date.now()-g.satAt)/1000;emo=age<1.5?'😍':age<2.5?'❤️':null;}
  else if(g.tl<5)emo='😤';else if(g.tl<10)emo='😟';
  const hair=P(['#5d4037','#ffa000','#212121','#ef5350','#7b1fa2']);
  drawHuman(sx,sy,g.faceId,g.color,hair,true,g.walkT,.85,emo,null);
  if(!g.sat&&g.request&&distToP<280){
    const bx=sx,by2=sy-44;
    X.fillStyle='rgba(10,10,20,.88)';X.beginPath();X.roundRect(bx-42,by2-11,84,17,5);X.fill();
    X.strokeStyle='rgba(255,107,157,.45)';X.lineWidth=1;X.stroke();
    X.fillStyle='#fff';X.font='8px system-ui';X.textAlign='center';X.fillText(g.request.text,bx,by2);
    const pct=g.tl/g.tm;
    X.fillStyle='rgba(255,255,255,.12)';X.fillRect(bx-38,by2+6,76,3);
    X.fillStyle=pct>.5?'#4caf50':pct>.25?'#ff9800':'#f44336';X.fillRect(bx-38,by2+6,76*pct,3);
  }
}

function drawNPC(npc){
  const{sx,sy}=wToS(npc.wx,npc.wy);
  if(sx<-50||sx>W+50||sy<-50||sy>H+50)return;
  npc.walkT+=npc.moving?.04:0;
  drawHuman(sx,sy,null,npc.color,null,npc.isGirl,npc.walkT,.68,null,null);
}

// ===== PARTICLES =====
function addP(wx,wy,e,n){n=n||1;for(let i=0;i<n;i++)G.particles.push({wx:wx+R(-8,8),wy:wy+R(-8,8),vx:R(-1,1),vy:R(-2,-.5),e,a:1,t:0});}
function addF(t,c){G.floats.push({text:t,color:c,a:1.5,y:H*.42});}
function drawPF(){
  G.particles=G.particles.filter(p=>{p.t+=.04;p.vy+=.02;p.a-=.022;if(p.a<=0)return false;
    const{sx,sy}=wToS(p.wx,p.wy);X.save();X.globalAlpha=Math.min(1,p.a);X.font=\`\${p.t<1?12:10}px serif\`;X.textAlign='center';X.fillText(p.e,sx+p.vx*p.t*18,sy+p.vy*p.t*18);X.restore();X.globalAlpha=1;return true;});
  G.floats=G.floats.filter(f=>{f.y-=.7;f.a-=.016;if(f.a<=0)return false;X.globalAlpha=Math.min(1,f.a);X.font='bold 13px system-ui';X.textAlign='center';X.strokeStyle='rgba(0,0,0,.7)';X.lineWidth=3;X.strokeText(f.text,W/2,f.y);X.fillStyle=f.color;X.fillText(f.text,W/2,f.y);X.globalAlpha=1;return true;});
}

// ===== MINIMAP =====
function drawMinimap(){
  const mw=mc.width,mh=mc.height,sx=mw/(GRID_W*TW),sy=mh/(GRID_H*TH);
  MX.fillStyle='rgba(5,5,15,.92)';MX.fillRect(0,0,mw,mh);
  for(let y=0;y<GRID_H;y+=2)for(let x=0;x<GRID_W;x+=2){
    const t=GRID[y][x].t;
    let col='#181820';
    if(t===T.ROAD_H||t===T.ROAD_V||t===T.ROAD_X)col='#38384a';
    else if(t===T.SIDEWALK||t===T.LAMP||t===T.BENCH)col='#28283a';
    else if(t===T.PARK||t===T.TREE)col='#182818';
    else if(t>=T.BLDLOW)col='#222228';
    else if(t===T.SHOP)col='#382038';
    MX.fillStyle=col;MX.fillRect(x*sx*TW,y*sy*TH,sx*TW*2,sy*TH*2);
  }
  G.dist.locs.forEach(l=>{MX.fillStyle=l.neon||'#ff6b9d';MX.beginPath();MX.arc(l.wx*sx,l.wy*sy,2.5,0,Math.PI*2);MX.fill();});
  G.girls.forEach(g=>{if(g.sat)return;MX.fillStyle='#ff6b9d';MX.beginPath();MX.arc(g.wx*sx,g.wy*sy,1.5,0,Math.PI*2);MX.fill();});
  MX.fillStyle='#4fc3f7';MX.beginPath();MX.arc(G.p.wx*sx,G.p.wy*sy,3,0,Math.PI*2);MX.fill();
}

// ===== GAME LOGIC =====
function spawnGirl(){
  const d=G.dist,req=P(d.requests);
  const gx=~~R(2,GRID_W-2),gy=~~R(2,GRID_H-2);
  const w=gToW(gx,gy);const tm=d.gT+(G.ch.bonus==='time'?8:0);
  G.girls.push({wx:w.wx+R(-16,16),wy:w.wy+R(-16,16),name:P(d.gN),color:P(d.gC),request:req,sat:false,satAt:0,tl:tm,tm,faceId:P(d.gF),walkT:0});
}

function showPhone(t){const ph=document.getElementById('phone'),pt=document.getElementById('phoneText');pt.textContent=t;ph.style.display='block';clearTimeout(ph._t);ph._t=setTimeout(()=>ph.style.display='none',3500);}

function updatePlayer(){
  if(!JOY.a)return;
  const p=G.p,sp=(G.ch.bonus==='car'?p.speed*1.6:p.speed)*G.speedMod;
  const isoJX=JOY.dx+JOY.dy,isoJY=-JOY.dx+JOY.dy;
  p.wx=CL(p.wx+isoJX*sp,TW,GRID_W*TW-TW);
  p.wy=CL(p.wy+isoJY*sp,TH,GRID_H*TH-TH);
}

function checkPickup(){
  if(G.p.item)return;
  for(const l of G.dist.locs){
    if(Math.hypot(G.p.wx-l.wx,G.p.wy-l.wy)<52){
      let pr=l.price;
      if(G.ch.bonus==='discount')pr=~~(pr*.75);
      if(G.priceDiscount&&G.priceDiscount<1)pr=~~(pr*G.priceDiscount);
      if(pr===0||G.money>=pr){G.p.item=l.id;G.money-=pr;addP(l.wx,l.wy,l.logo,3);if(pr>0)addF(\`-\${pr.toLocaleString('ru')}₽\`,'#ffd740');else addF('Free!','#4caf50');G.shake=4;}
      else{addF('Нет денег! 💸','#f44336');G.shake=6;}break;
    }
  }
}

function checkDelivery(){
  if(!G.p.item)return;
  for(const g of G.girls){
    if(g.sat)continue;
    if(Math.hypot(G.p.wx-g.wx,G.p.wy-g.wy)<48){
      if(g.request.need===G.p.item){
        g.sat=true;g.satAt=Date.now();G.p.item=null;
        const pts=~~(g.request.pts*G.dist.pM*(G.ch.bonus==='points'?G.ch.mult:1));
        G.score+=pts;G.served++;G.relation=Math.min(100,G.relation+5);
        addP(g.wx,g.wy,'❤️',4);addP(g.wx,g.wy,'✨',2);addF(\`+\${pts} ⭐\`,'#4caf50');G.shake=3;
        if(G.mode==='story'&&G.chapter>0)setTimeout(()=>tryDeliveryDialog(g),600);
        setTimeout(()=>{G.girls=G.girls.filter(gg=>gg!==g);if(G.running&&G.girls.filter(gg=>!gg.sat).length<3)spawnGirl();},2500);
      } else {addF('Не то! 🤷','#ff9800');G.relation=Math.max(0,G.relation-2);}
      break;
    }
  }
}

function updateGirls(dt){
  for(let i=G.girls.length-1;i>=0;i--){
    const g=G.girls[i];if(g.sat)continue;g.tl-=dt;
    if(g.tl<=0){addP(g.wx,g.wy,'🚩',2);addF(\`\${g.name}: Не мужик! 😤\`,'#f44336');G.failed++;G.girls.splice(i,1);G.shake=7;G.relation=Math.max(0,G.relation-8);if(G.running)setTimeout(()=>spawnGirl(),1500);}
  }
}

function updateNPCs(dt){
  G.npcs.forEach(npc=>{
    npc.moveTimer-=dt;
    if(npc.moveTimer<=0){const gx=~~R(1,GRID_W-1),gy=~~R(1,GRID_H-1);const w=gToW(gx,gy);npc.tx=w.wx+R(-10,10);npc.ty=w.wy+R(-10,10);npc.moveTimer=R(3,10);}
    const dx=npc.tx-npc.wx,dy=npc.ty-npc.wy,dist=Math.hypot(dx,dy);
    if(dist>5){npc.wx+=dx/dist*npc.speed;npc.wy+=dy/dist*npc.speed;npc.moving=true;}else npc.moving=false;
  });
}

function centerCam(){
  const{sx,sy}=wToS(G.p.wx,G.p.wy);
  G.ox+=(W/2-sx)*.07;G.oy+=(H/2-sy)*.07;
}

function updateHUD(){
  document.getElementById('hMoney').textContent=\`💰 \${G.money.toLocaleString('ru')}₽\`;
  document.getElementById('hTime').textContent=\`⏱ \${Math.ceil(G.timer)}\`;
  document.getElementById('hScore').textContent=\`⭐ \${G.score}\`;
  const is=document.getElementById('itemSlot');
  if(G.p.item){const loc=G.dist.locs.find(l=>l.id===G.p.item);is.textContent=loc?\`\${loc.logo} \${loc.name}\`:'?';is.style.display='block';}else is.style.display='none';
  if(G.mode==='story'){
    document.getElementById('relBar').style.display='block';
    document.getElementById('relFill').style.width=G.relation+'%';
    document.getElementById('relFill').style.background=G.relation>60?'linear-gradient(90deg,#ff6b9d,#ff4081)':G.relation>30?'linear-gradient(90deg,#ff9800,#f44336)':'linear-gradient(90deg,#f44336,#b71c1c)';
  }
}

// ===== RANDOM EVENTS =====
const REVENTS=[
  {title:'📱 Бывшая написала!',desc:'Девушка хочет проверить телефон...',e:()=>{G.relation-=12;addF('Подруга: "Кто это?!" 😱','#f44336');}},
  {title:'💸 Мама прислала 5000₽!',desc:'Удача!',e:()=>{G.money+=5000;addF('+5000₽ от мамы 💕','#4caf50');}},
  {title:'🍺 Друзья зовут в бар',desc:'Идёшь — скорость +, отношения -',e:()=>{G.relation-=15;G.speedMod=1.4;G.speedModTimer=18;addF('Чуть выпил... скорость +40%','#ff9800');}},
  {title:'🛍️ Скидки в WildBerry!',desc:'Все цены -30% на 30 сек',e:()=>{G.priceDiscount=.7;G.discountTimer=30;addF('WildBerry скидки -30%!','#ce93d8');}},
  {title:'🎂 Её день рождения!',desc:'Срочно купи подарок!',e:()=>{addF('День рождения! 60 секунд! 🎂','#ffd740');G.timer+=5;}},
  {title:'🚗 Пробка!',desc:'Скорость снижена на 25 секунд',e:()=>{G.speedMod=.5;G.speedModTimer=25;addF('Пробка! Скорость -50% 🚗','#f44336');}},
  {title:'👛 Нашёл кошелёк!',desc:'+2000₽',e:()=>{G.money+=2000;addF('+2000₽ нашёл кошелёк! 🤑','#4caf50');}},
  {title:'🚔 Штраф за парковку',desc:'-1000₽',e:()=>{G.money=Math.max(0,G.money-1000);addF('-1000₽ штраф! 😤','#f44336');}},
  {title:'📦 Помочь с переездом',desc:'Теряешь 25 секунд',e:()=>{G.timer=Math.max(10,G.timer-25);addF('Помогаю с переездом... -25сек','#ff9800');}},
];

function tryRandomEvent(){
  if(G.randomEventCooldown>0)return;
  if(Math.random()<.004){
    const ev=P(REVENTS);showEvent(ev);G.randomEventCooldown=20;
  }
}

function showEvent(ev){
  const el=document.getElementById('eventToast');
  document.getElementById('eventTitle').textContent=ev.title;
  document.getElementById('eventDesc').textContent=ev.desc;
  el.style.display='block';setTimeout(()=>el.classList.add('show'),10);
  ev.e();clearTimeout(el._t);
  el._t=setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.style.display='none',400);},3200);
}

// ===== STORY SYSTEM =====
const CHAPTERS=[
  {id:1,title:'Глава 1: Тиндер-матч',sub:'Первое свидание в Москве'},
  {id:2,title:'Глава 2: Отношения',sub:'Запросы растут...'},
  {id:3,title:'Глава 3: Родители',sub:'Квартира есть? Машина?'},
  {id:4,title:'Глава 4: Предложение',sub:'Кольцо из Картье или с рынка?'},
  {id:5,title:'Глава 5: Свадьба',sub:'Финальный забег'},
];

const CDIALOGS={
  1:{intro:{char:'Алиса',text:'Привет! Ты тот самый с Тиндера? 😊 Можешь за кофе сходить? ☕',choices:[
    {text:'Конечно, принцесса! Лучший кофе города!',rel:+10,pts:50,response:'Ты такой внимательный! 😍'},
    {text:'Окей, какой кофе?',rel:+3,pts:20,response:'Ну... ладно, спасибо'},
    {text:'Кофе дорогой, может чай?',rel:-8,pts:0,response:'Ты серьёзно? 🙄'},
  ]},
  delivery:{char:'Алиса',text:'О, кофе! Ты такой быстрый! На второе свидание?',choices:[
    {text:'Специально бежал! Только лучшее!',rel:+12,pts:60,response:'Второе свидание? Да! 💕'},
    {text:'Вон там за углом нашёл',rel:+2,pts:15,response:'...Спасибо'},
    {text:'Держи',rel:-3,pts:5,response:'Ну ладно'},
  ]}},
  2:{intro:{char:'Алиса',text:'Почему не Премиум такси? Подруга говорит ты жадный 😒',choices:[
    {text:'Хочешь Премиум? Только лучшее для тебя!',rel:+8,pts:40,response:'Вот это разговор! 😊'},
    {text:'Обычное такси тоже нормально',rel:-5,pts:0,response:'Ну такое... 🙄'},
    {text:'Подруга права?! Это оскорбление!',rel:-15,pts:-20,response:'Э... извини'},
  ]}},
  3:{intro:{char:'Папа',text:'Значит с Алисой встречаешься? Квартира есть? Машина? 🏠',choices:[
    {text:'Работаю над этим! Карьера, цели, планы',rel:+10,pts:80,response:'Хм, целеустремлённый.'},
    {text:'Пока нет, но буду стараться',rel:0,pts:20,response:'Посмотрим...'},
    {text:'Главное — любовь!',rel:-20,pts:-30,response:'Романтик... *вздыхает*'},
  ]},
  mama:{char:'Мама',text:'А борщ варить умеешь? Алисочка любит домашнее!',choices:[
    {text:'Конечно! Каждые выходные готовлю!',rel:+15,pts:100,response:'Ой, какой хороший! 😍'},
    {text:'Учусь понемногу',rel:+5,pts:30,response:'Ну хорошо, учись'},
    {text:'Это дело женщин',rel:-25,pts:-50,response:'ЧТО ты сказал?!'},
  ]}},
  4:{ring:{char:'Алиса',text:'О боже... ты предлагаешь мне? 💍',choices:[
    {text:'Картье. Только лучшее для тебя.',rel:+25,pts:500,response:'Да! Тысячу раз да! 💎'},
    {text:'Кольцо с душой, от всего сердца',rel:+5,pts:100,response:'Я... ценю это...'},
    {text:'Ну как бы да, типа',rel:-20,pts:-100,response:'Романтика ноль...'},
  ]}},
  5:{tesha:{char:'Тёща',text:'У Машиного мужа лимузин был белый! А у вас что?',choices:[
    {text:'У нас будет лучше! Всё организовано!',rel:+5,pts:50,response:'Ладно, посмотрим...'},
    {text:'Лимузин будет, не переживайте',rel:+3,pts:30,response:'Обещаешь?'},
    {text:'Маша пусть к своему мужу идёт!',rel:-30,pts:-200,response:'АЛИСА! Ты слышала?!'},
  ]}},
};

function showChapterBanner(ch){
  const b=document.getElementById('chapterBanner'),data=CHAPTERS[ch-1];if(!data)return;
  document.getElementById('chBannerTitle').textContent=data.title;
  document.getElementById('chBannerSub').textContent=data.sub;
  b.style.display='block';setTimeout(()=>b.classList.add('show'),10);
  setTimeout(()=>{b.classList.remove('show');setTimeout(()=>b.style.display='none',600);},3500);
  const cd=CDIALOGS[ch];
  if(cd&&cd.intro)setTimeout(()=>showDialog(cd.intro.char,cd.intro.text,cd.intro.choices),4200);
}

function showDialog(charName,text,choices,cb){
  const box=document.getElementById('dialogBox');
  document.getElementById('dialogChar').textContent=\`💬 \${charName}:\`;
  document.getElementById('dialogText').textContent=text;
  const ch=document.getElementById('dialogChoices');ch.innerHTML='';
  choices.forEach((c,i)=>{
    const btn=document.createElement('button');btn.className='dialogChoice';
    btn.innerHTML=\`\${c.text}<span class="dc">\${c.rel>0?'❤️+'+c.rel:c.rel<0?'💔'+c.rel:''}\${c.pts>0?' ⭐+'+c.pts:c.pts<0?' ⭐'+c.pts:''}</span>\`;
    btn.onclick=()=>{
      G.relation=CL(G.relation+c.rel,0,100);G.score=Math.max(0,G.score+(c.pts||0));
      document.getElementById('dialogChar').textContent=\`💬 \${charName}:\`;
      document.getElementById('dialogText').textContent=c.response||'...';
      ch.innerHTML='';const ok=document.createElement('button');ok.className='dialogChoice';ok.textContent='Понял 👍';
      ok.onclick=()=>{box.style.display='none';G.running=true;if(cb)cb(i);};ch.appendChild(ok);
    };ch.appendChild(btn);
  });
  box.style.display='flex';G.running=false;
}

function tryDeliveryDialog(girl){
  const cd=CDIALOGS[G.chapter];
  if(cd&&cd.delivery&&!G.storyState['dd'+G.chapter]){
    G.storyState['dd'+G.chapter]=true;
    showDialog(girl.name,cd.delivery.text,cd.delivery.choices);
  }
}

// ===== GAME LOOP =====
let lastT=0;
function loop(ts){
  const dt=Math.min((ts-lastT)/1000,.12);lastT=ts;
  requestAnimationFrame(loop);
  if(!G.running)return;
  G.timer-=dt;G.dayTime=(G.dayTime+G.daySpeed*dt)%1;
  if(G.shake>0)G.shake-=.25;
  if(G.randomEventCooldown>0)G.randomEventCooldown-=dt;
  if(G.speedModTimer>0){G.speedModTimer-=dt;if(G.speedModTimer<=0)G.speedMod=1;}
  if(G.discountTimer>0){G.discountTimer-=dt;if(G.discountTimer<=0)G.priceDiscount=1;}
  if(G.timer<=0||(G.money<0&&!G.p.item)){gameOverScreen();return;}
  updatePlayer();checkPickup();checkDelivery();updateGirls(dt);updateNPCs(dt);centerCam();tryRandomEvent();

  const sky=getSky();
  X.fillStyle=\`rgb(\${~~sky.r},\${~~sky.g},\${~~sky.b})\`;X.fillRect(0,0,W,H);
  X.fillStyle=\`rgba(\${~~sky.r>>1},\${~~sky.g>>1},\${~~sky.b>>1},\${(1-sky.a)*.3})\`;X.fillRect(0,0,W,H);

  drawIsoMap(sky);
  G.npcs.forEach(npc=>drawNPC(npc));
  G.girls.forEach(g=>drawGirl(g));
  drawPlayer();
  drawPF();updateHUD();drawMinimap();
}

// ===== TRAVEL =====
function showTravel(){if(!G.running)return;G.running=false;document.getElementById('travelFrom').textContent=\`\${G.dist.emoji} \${G.dist.name}\`;let h='';DORD.forEach(id=>{if(id===G.distId)return;const d=DISTRICTS[id];h+=\`<button class="distBtn" onclick="travelTo('\${id}')">\${d.emoji} \${d.name}<span class="dd">\${d.desc}</span></button>\`;});document.getElementById('travelList').innerHTML=h;document.getElementById('travelScreen').style.display='flex';}
function hideTravel(){document.getElementById('travelScreen').style.display='none';G.running=true;}
function travelTo(id){document.getElementById('travelScreen').style.display='none';const d=DISTRICTS[id];document.getElementById('loadText').textContent=\`\${d.emoji} \${d.name}\`;document.getElementById('loadJoke').textContent=P(d.jokes);document.getElementById('loadFill').style.width='0';document.getElementById('loadScreen').style.display='flex';let p=0;const iv=setInterval(()=>{p+=R(10,25);if(p>100)p=100;document.getElementById('loadFill').style.width=p+'%';if(p>=100){clearInterval(iv);setTimeout(()=>{document.getElementById('loadScreen').style.display='none';loadDist(id);G.running=true;},350);}},130);}

function loadDist(id){
  G.distId=id;G.dist=DISTRICTS[id];initGrid();
  G.p.wx=(GRID_W/2)*TW;G.p.wy=(GRID_H/2)*TH;
  G.p.item=null;G.girls=[];G.particles=[];G.floats=[];
  const cw=G.p.wx,ch=G.p.wy;
  G.ox=-(isoSX(cw/TW,ch/TH));G.oy=-(isoSY(cw/TW,ch/TH));
  genCars();genNPCs();for(let i=0;i<3;i++)spawnGirl();
  document.getElementById('distLabel').textContent=\`\${G.dist.emoji} \${G.dist.name}\`;
  showPhone(\`\${G.dist.emoji} Добро пожаловать в \${G.dist.name}!\`);
}

function gameOverScreen(){
  G.running=false;
  let title='';
  if(G.mode==='story'){
    if(G.relation>=70&&G.score>=500)title='💎 Идеальный муж!';
    else if(G.relation>=40)title='😅 Базовый минимум';
    else title='💸 Банкрот';
  } else title=G.money<=0?'💸 Банкрот':'⏱ Время вышло';
  document.getElementById('goT').textContent=title;
  const ending=G.mode==='story'?{
    '💎 Идеальный муж!':'Алиса счастлива. Мама одобрила. Тёща смирилась.',
    '😅 Базовый минимум':'Свадьба состоялась. Еле вытянул.',
    '💸 Банкрот':'Деньги кончились. Невеста ушла к бизнесмену.'
  }[title]:'';
  document.getElementById('goS').innerHTML=\`\${G.ch.name}<br>⭐ \${G.score}<br>✅ \${G.served}<br>🚩 \${G.failed}<br>💰 \${G.money.toLocaleString('ru')}₽\${G.mode==='story'?'<br>❤️ '+G.relation+'%<br><br>'+ending:''}\`;
  document.getElementById('gameOver').style.display='flex';
}

// ===== START =====
let selectedChar=null;
function buildCharSelect(){
  const el=document.getElementById('charSelect');el.innerHTML='';
  Object.entries(CHARS).forEach(([id,ch])=>{
    const div=document.createElement('div');div.className='charCard';div.id='cc_'+id;
    const bt={discount:'Скидки 25%',car:'Скорость x1.6',time:'+8сек',points:'Очки x2'}[ch.bonus]||ch.bonus;
    div.innerHTML=\`<img src="\${FD[ch.face]||''}" onerror="this.style.display='none'" alt=""><div class="cn">\${ch.name}</div><div class="cs">\${ch.money.toLocaleString('ru')}₽<br>\${bt}</div>\`;
    div.onclick=()=>{document.querySelectorAll('.charCard').forEach(c=>c.classList.remove('sel'));div.classList.add('sel');selectedChar=id;};
    el.appendChild(div);
  });
}

function startGame(mode){
  if(!selectedChar)selectedChar='roman';
  G.ch=CHARS[selectedChar];G.money=G.ch.money;G.score=0;G.served=0;G.failed=0;
  G.timer=mode==='story'?600:240;G.p.speed=G.ch.speed;G.p.item=null;
  G.dayTime=.35;G.relation=50;G.mode=mode;G.chapter=mode==='story'?1:0;
  G.storyState={};G.speedMod=1;G.priceDiscount=1;G.randomEventCooldown=12;
  document.getElementById('startScreen').style.display='none';
  document.getElementById('hud').style.display='flex';
  document.getElementById('distLabel').style.display='block';
  document.getElementById('travelBtn').style.display='block';
  document.getElementById('joyArea').style.display='block';
  loadDist('patriki');G.running=true;
  if(mode==='story')setTimeout(()=>showChapterBanner(1),1200);
}

buildCharSelect();
requestAnimationFrame(loop);
`;

const footer = `</script></body></html>`;

// Replace placeholder with actual FD line
const finalCode = gameCode.replace('FDLINE_PLACEHOLDER', fdLine);
const fullHtml = html + finalCode + footer;
fs.writeFileSync('index.html', fullHtml, 'utf8');
console.log('Done! index.html size:', fullHtml.length, 'bytes');
