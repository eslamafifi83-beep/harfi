(function(){
'use strict';
var $ = function(s){ return document.querySelector(s); };
var stage = $('#stage');
var C = window.HARFI_CONTENT, L = C.L, PIC = C.PIC, W = C.W, UNITS = C.UNITS, BY_CH = C.BY_CH;
var BALLOON_COLORS = ['#F2994A','#F2C94C','#7FC8C2','#E88FA8','#A99BE6','#9ED27F'];

function kwHTML(w){ return '<span class="kw">'+w.letters.map(function(c,i){ return '<span data-i="'+i+'">'+c+'</span>'; }).join('')+'</span>'; }
function lightUp(root, on){
  root.querySelectorAll('.kw span').forEach(function(s){
    var i = +s.dataset.i;
    s.classList.toggle('hot', !!on && on.indexOf(i) >= 0);
    s.classList.toggle('dim', !!on && on.indexOf(i) < 0);
  });
}
/* sound a word out: each syllable slowly with its letters lit, then the whole word. Toota teaches unless told otherwise. */
function soundOut(root, w, done, who){
  who = who || 'b';
  var parts = w.syl.map(function(s){ return {t:s.t, rate:.6, who:who}; }).concat([{t:w.word, rate:.75, who:who}]);
  speakSeq(parts, function(i){ lightUp(root, i < w.syl.length ? w.syl[i].on : w.letters.map(function(_,k){ return k; })); },
    function(){ lightUp(root, null); if (done) done(); }, 450);
}
var EAR = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>';
function earBtn(ar, en){ return '<button class="earbtn"><span class="ar">'+ar+'</span><span class="en" style="font-size:15px;font-weight:600">'+en+'</span>'+EAR+'</button>'; }

/* ---------- the friends: Filfil (a chili pepper boy) and Toota (a little berry girl) ---------- */
var NAMES = {f:{ar:'فلفل', en:'Filfil'}, b:{ar:'توتة', en:'Toota'}};
/* Style A "sticker" friends: bold outline, bright colours, a shiny highlight. Drawn in a 200x250 box.
   Each copy gets its own ids (gradients), so many can be on screen at once. Animated by CSS on .buddy:
   .eyes blink, .rig breathes, .mouthOpen/.mouthShut talk, .armR waves, .stm (steam) and .hrt (hearts) pop. */
var buddyUid = 0;
function buddyEye(cx, cy, rx, ry){
  return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#fff" stroke="#2B1B48" stroke-width="3.5"/>' +
    '<g class="pupil" data-cx="'+cx+'" data-cy="'+cy+'"><circle cx="'+cx+'" cy="'+(cy+2)+'" r="'+(rx*.62)+'" fill="#2B1B48"/>' +
    '<circle cx="'+(cx-rx*.22)+'" cy="'+(cy-ry*.18)+'" r="'+(rx*.24)+'" fill="#fff"/><circle cx="'+(cx+rx*.2)+'" cy="'+(cy+ry*.22)+'" r="'+(rx*.1)+'" fill="#fff"/></g>';
}
function filfilSVG(){
  var p = 'bf' + (buddyUid++), g = '#2C6B22', olg = 'stroke="'+g+'" stroke-width="4.5" stroke-linejoin="round"';
  return '<svg viewBox="0 0 200 250" aria-hidden="true"><defs>' +
    '<linearGradient id="'+p+'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6A45"/><stop offset="1" stop-color="#E5281C"/></linearGradient>' +
    '<radialGradient id="'+p+'l" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#8FE070"/><stop offset="1" stop-color="#2F8A27"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="240" rx="52" ry="8" fill="#2B1B48" opacity=".16"/>' +
    '<g class="rig">' +
      '<path d="M80 200 L78 226 M118 200 L120 226" stroke="'+g+'" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M62 232 Q64 220 78 221 Q90 222 90 232 Z M108 232 Q108 222 120 221 Q134 220 136 232 Z" fill="#2B1B48"/>' +
      '<path d="M64 232 H90 M108 232 H134" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M48 136 Q28 140 22 118" fill="none" stroke="'+g+'" stroke-width="8" stroke-linecap="round"/><circle cx="21" cy="114" r="9" fill="url(#'+p+'l)" '+olg+'/>' +
      '<g class="armR" style="transform-origin:152px 134px"><path d="M152 134 Q174 134 180 112" fill="none" stroke="'+g+'" stroke-width="8" stroke-linecap="round"/><circle cx="181" cy="108" r="9" fill="url(#'+p+'l)" '+olg+'/></g>' +
      '<path d="M100 46 C148 44 162 92 158 136 C156 160 151 176 142 188 C148 196 158 200 164 194 C166 208 150 216 136 204 C124 210 112 212 98 210 C64 206 44 174 42 134 C40 90 54 48 100 46 Z" fill="url(#'+p+'a)" stroke="#7A1610" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M62 92 C56 112 56 140 66 162" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".55"/><circle cx="70" cy="76" r="5" fill="#fff" opacity=".7"/>' +
      '<path d="M58 64 Q66 40 84 52 Q92 32 104 49 Q118 34 126 54 Q144 46 144 66 Q122 74 100 69 Q78 74 58 64 Z" fill="url(#'+p+'l)" '+olg+'/>' +
      '<path d="M100 50 C97 30 110 16 126 20 C136 23 136 34 126 35" fill="none" stroke="'+g+'" stroke-width="7" stroke-linecap="round"/>' +
      '<path class="brow" d="M64 92 Q78 84 92 91 M108 86 Q122 74 136 82" stroke="#2B1B48" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '<g class="eyes">' + buddyEye(80, 113, 15, 18) + buddyEye(120, 111, 15, 18) + '</g>' +
      '<ellipse cx="64" cy="140" rx="9" ry="6" fill="#FFB0A0" opacity=".85"/><ellipse cx="138" cy="138" rx="9" ry="6" fill="#FFB0A0" opacity=".85"/>' +
      '<g class="mouthShut"><path d="M80 141 Q100 166 124 139 Q102 150 80 141 Z" fill="#5A0F0A"/><path d="M95 146 L95 151 L103 151 L103 146.5 Z" fill="#fff"/><path d="M98 156 Q104 160 110 155 Q106 151 98 156 Z" fill="#FF7A8A"/></g>' +
      '<g class="mouthOpen"><ellipse cx="102" cy="150" rx="15" ry="12" fill="#5A0F0A"/><ellipse cx="102" cy="156" rx="9" ry="5" fill="#FF7A8A"/></g>' +
    '</g>' +
    '<circle class="stm" cx="112" cy="18" r="9" fill="#fff"/><circle class="stm" cx="132" cy="10" r="7" fill="#fff"/>' +
  '</svg>';
}
function tootaSVG(){
  var p = 'bt' + (buddyUid++), cx = 100, cy = 146, R = 62, r = 11.5, gap = 19, outer = '', inner = '';
  for (var y = cy - R; y <= cy + R - 12; y += gap * .87) {
    var row = Math.round((y - (cy - R)) / (gap * .87));
    for (var x = cx - R; x <= cx + R; x += gap) {
      var xx = x + (row % 2 ? gap / 2 : 0);
      if ((xx - cx) * (xx - cx) / (R * R) + (y - cy) * (y - cy) / ((R - 4) * (R - 4)) > 1) continue;
      outer += '<circle cx="'+xx.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(r + 4)+'"/>';
      inner += '<circle cx="'+xx.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="url(#'+p+'d)"/><circle cx="'+(xx - 4).toFixed(1)+'" cy="'+(y - 5).toFixed(1)+'" r="2.8" fill="#fff" opacity=".55"/>';
    }
  }
  var olg = 'stroke="#2C6B22" stroke-width="4.5" stroke-linejoin="round"', olp = 'stroke="#B0306E" stroke-width="4" stroke-linejoin="round"', limb = '#4A1A68';
  var leaf = 'C-13 -10 -11 -36 0 -46 C11 -36 13 -10 0 0 Z';
  return '<svg viewBox="0 0 200 250" aria-hidden="true"><defs>' +
    '<radialGradient id="'+p+'d" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#B46BDB"/><stop offset=".6" stop-color="#8A3FB5"/><stop offset="1" stop-color="#6B2A92"/></radialGradient>' +
    '<radialGradient id="'+p+'l" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#8FE070"/><stop offset="1" stop-color="#2F8A27"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="240" rx="50" ry="8" fill="#2B1B48" opacity=".16"/>' +
    '<g class="rig">' +
      '<path d="M86 200 L85 226 M114 200 L115 226" stroke="'+limb+'" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M68 232 Q70 220 84 221 Q96 222 96 232 Z M104 232 Q104 222 116 221 Q130 220 132 232 Z" fill="#FF7EB6" '+olp+'/>' +
      '<path d="M46 150 Q26 152 22 132" fill="none" stroke="'+limb+'" stroke-width="8" stroke-linecap="round"/><circle cx="21" cy="128" r="8.5" fill="'+limb+'"/>' +
      '<g class="armR" style="transform-origin:154px 148px"><path d="M154 148 Q176 148 180 128" fill="none" stroke="'+limb+'" stroke-width="8" stroke-linecap="round"/><circle cx="181" cy="124" r="8.5" fill="'+limb+'"/></g>' +
      '<g fill="#3E1458">' + outer + '</g>' + inner +
      '<g transform="translate(100 92)"><path transform="rotate(-38)" d="M0 0 '+leaf+'" fill="url(#'+p+'l)" '+olg+'/><path transform="rotate(38)" d="M0 0 '+leaf+'" fill="url(#'+p+'l)" '+olg+'/>' +
        '<path d="M0 2 C-14 -10 -12 -40 0 -52 C12 -40 14 -10 0 2 Z" fill="url(#'+p+'l)" '+olg+'/><path d="M0 -4 V-40" stroke="#2C6B22" stroke-width="2.5" stroke-linecap="round" opacity=".6"/></g>' +
      '<g transform="translate(152 106) rotate(18)"><path d="M0 0 L-20 -13 Q-26 0 -20 13 Z M0 0 L20 -13 Q26 0 20 13 Z" fill="#FF7EB6" '+olp+'/><circle r="6.5" fill="#FF5AA0" '+olp+'/></g>' +
      '<ellipse cx="100" cy="152" rx="46" ry="34" fill="#A35FCB" opacity=".7"/>' +
      '<g class="eyes">' + buddyEye(82, 139, 14, 17) + buddyEye(118, 139, 14, 17) + '</g>' +
      '<path d="M70 126 l-6 -6 M74 123 l-3 -7 M130 126 l6 -6 M126 123 l3 -7" stroke="#2B1B48" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="68" cy="162" rx="9" ry="6" fill="#FF9AC8" opacity=".9"/><ellipse cx="132" cy="162" rx="9" ry="6" fill="#FF9AC8" opacity=".9"/>' +
      '<g class="mouthShut"><path d="M88 160 Q100 174 112 160 Q100 165 88 160 Z" fill="#3A0F4E"/><path d="M95 166 Q100 170 105 166 Q100 164 95 166 Z" fill="#FF7A9E"/></g>' +
      '<g class="mouthOpen"><ellipse cx="100" cy="165" rx="11" ry="9" fill="#3A0F4E"/><ellipse cx="100" cy="169" rx="7" ry="4" fill="#FF7A9E"/></g>' +
    '</g>' +
    '<path class="hrt" d="M100 70 c-6 -8 -18 -2 -12 8 l12 12 l12 -12 c6 -10 -6 -16 -12 -8 Z" fill="#FF5AA0"/>' +
    '<path class="hrt" d="M66 84 c-4 -6 -13 -1 -9 6 l9 9 l9 -9 c4 -7 -5 -12 -9 -6 Z" fill="#FF7EB6"/>' +
    '<path class="hrt" d="M136 80 c-4 -6 -13 -1 -9 6 l9 9 l9 -9 c4 -7 -5 -12 -9 -6 Z" fill="#FF7EB6"/>' +
  '</svg>';
}
var BUDDY_SVG = { get f(){ return filfilSVG(); }, get b(){ return tootaSVG(); } };
PIC.filfil = filfilSVG(); PIC.toota = tootaSVG();
function buddyBtn(who, extra){ return '<button class="buddy '+(who==='f'?'b1':'b2')+' '+(extra||'')+'" data-who="'+who+'" aria-label="'+NAMES[who].en+'">'+BUDDY_SVG[who]+'</button>'; }
/* their eyes follow her finger */
function lookAt(x, y){
  document.querySelectorAll('.buddy .pupil').forEach(function(pu){
    var svg = pu.ownerSVGElement, bx = svg.getBoundingClientRect(); if (!bx.width) return;
    var s = bx.width / 200, dx = x - (bx.left + (+pu.dataset.cx) * s), dy = y - (bx.top + (+pu.dataset.cy) * s), d = Math.hypot(dx, dy) || 1, m = Math.min(5, d / 30);
    pu.setAttribute('transform', 'translate(' + (dx / d * m).toFixed(1) + ' ' + (dy / d * m).toFixed(1) + ')');
  });
}
addEventListener('pointerdown', function(e){ lookAt(e.clientX, e.clientY); }, true);
addEventListener('pointermove', function(e){ if (e.pointerType === 'mouse') lookAt(e.clientX, e.clientY); });
/* one-off reactions: steam for Filfil, hearts for Toota */
function react(btn){ var c = btn.dataset.who === 'f' ? 'steam' : 'love'; btn.classList.remove(c); void btn.offsetWidth; btn.classList.add(c); setTimeout(function(){ btn.classList.remove(c); }, 1400); }
var JOKES = {
  f: [['هههه! بتزغزغيني!','Hahaha! Bitzaghzaghīni!','Hee hee! That tickles!'],
      ['يلّا يا بطلة!','Yalla ya baṭala!','Come on, champion!'],
      ['أنا فلفل، أشطر فلفل في الدنيا!','Ana Filfil, ashṭar filfil fi-d-dunya!','I\'m Filfil, the cleverest pepper in the world!']],
  b: [['أنا توتة… صغيّرة وحلوة!','Ana Tūta… ṣughayyara w-ḥilwa!','I\'m Toota… small and sweet!'],
      ['إنتي شاطرة زيّي!','Inti shaṭra zayyi!','You\'re clever like me!'],
      ['أنا توتة، صاحبتك!','Ana Tūta, ṣaḥbitik!','I\'m Toota, your friend!'],
      ['يا سلام عليكي!','Ya salām ʿalēki!','Wow, look at you!']]
};
function pokeBuddy(btn){
  var who = btn.dataset.who, j = JOKES[who][Math.floor(Math.random()*JOKES[who].length)];
  btn.classList.remove('happy','spin'); void btn.offsetWidth; btn.classList.add(Math.random() < .5 ? 'happy' : 'spin');
  setTimeout(function(){ btn.classList.remove('happy','spin'); }, 900);
  tone(who === 'f' ? 700 : 500, 0, .25, 'sine', .14, who === 'f' ? 1400 : 900); burst(btn); react(btn);
  say(j[0], j[1], j[2], true, who);
}
document.addEventListener('click', function(e){ var b = e.target.closest && e.target.closest('.buddy'); if (b && !b.closest('.friend') && !b.closest('.show')) pokeBuddy(b); });
function mountBuddies(){
  $('#buddies').innerHTML = buddyBtn('f') + buddyBtn('b');
  $('#spF').innerHTML = buddyBtn('f'); $('#spB').innerHTML = buddyBtn('b');
  /* landing page: letters drift up behind everything, and the friends take turns waving */
  var fl = $('#spFloat'), cols = ['#FF8A3D','#22B5A6','#FF5AA0','#FFC93C','#8A3FB5','#5BB8F0'];
  ABC.split('').forEach(function(c, i){
    var e = document.createElement('i'); e.className = 'ar'; e.textContent = c;
    e.style.left = (2 + Math.random() * 94) + '%'; e.style.color = cols[i % cols.length];
    e.style.fontSize = (28 + Math.random() * 34) + 'px'; e.style.animationDuration = (14 + Math.random() * 12) + 's';
    e.style.animationDelay = (-Math.random() * 26) + 's'; e.style.setProperty('--r', (Math.random() * 60 - 30) + 'deg');
    fl.appendChild(e);
  });
  var turn = 0;
  (function waveLoop(){
    if ($('#splash').hidden) return;
    var b = document.querySelector((turn++ % 2 ? '#spB' : '#spF') + ' .buddy');
    if (b) { b.classList.remove('waving'); void b.offsetWidth; b.classList.add('waving'); setTimeout(function(){ b.classList.remove('waving'); }, 2800); }
    setTimeout(waveLoop, 3600);
  })();
}

/* ---------- levels (the same six in every unit) ---------- */
var LEVELS = [
  {id:'sounds', ar:'الأصوات',    tr:'el-aṣwāt',    en:'Sounds'},
  {id:'say',    ar:'قولي معايا', tr:'ʾūli maʿāya', en:'Say it with me'},
  {id:'vowels', ar:'الحركات',    tr:'el-ḥarakāt',  en:'Short vowels'},
  {id:'first',  ar:'أوّل صوت',   tr:'awwel ṣōt',   en:'First sound'},
  {id:'trace',  ar:'لوّني',      tr:'lawwini',     en:'Write'},
  {id:'words',  ar:'كلمات',      tr:'kilmāt',      en:'Words'}
];
function glyphFor(u, id){
  var U = UNITS[u], s = L[U.sounding[0]].ch;
  if (id === 'sounds') return s;
  if (id === 'vowels') return s + 'ُ';
  if (id === 'first') return s + 'ـ';
  if (id === 'words') return W[U.words[0]].word;
  return id;
}
/* letters she has met so far (this unit and the ones before) */
function learned(u){ var a = []; for (var i = 0; i <= u; i++) a = a.concat(UNITS[i].letters); return a; }
/* wrong options: mostly this unit's letters, some older ones for review */
function distractors(u, not, n){
  var own = UNITS[u].letters.filter(function(k){ return not.indexOf(k) < 0; });
  var old = learned(u).filter(function(k){ return not.indexOf(k) < 0 && own.indexOf(k) < 0; });
  var pool = shuffle(own).slice(0, Math.max(1, n - (old.length ? 1 : 0))).concat(shuffle(old)).slice(0, n);
  while (pool.length < n && own.length > pool.length) pool.push(own[pool.length]);
  return pool;
}

var PRAISE = [
  ['شاطرة!','Shaṭra!','Clever girl!'],
  ['برافو عليكي!','Brāvo ʿalēki!','Bravo!'],
  ['جامدة!','Gamda!','Awesome!'],
  ['الله عليكي!','Allah ʿalēki!','Lovely!'],
  ['هايل!','Hāyel!','Brilliant!']
];

/* ---------- saved progress (per device) ---------- */
var save = {done:{}, stickers:[], unit:0};
try { var raw = localStorage.getItem('harfi-v1'); if (raw) save = JSON.parse(raw) || save; } catch(e) {}
save.done = save.done || {}; save.stickers = save.stickers || []; save.unit = save.unit || 0;
LEVELS.forEach(function(lv){ if (save.done[lv.id] != null) { save.done['u0:'+lv.id] = save.done[lv.id]; delete save.done[lv.id]; } }); /* older saves */
function persist(){ try { localStorage.setItem('harfi-v1', JSON.stringify(save)); } catch(e) {} updateCounts(); }
function updateCounts(){
  var s = 0; for (var k in save.done) s += save.done[k];
  $('#starCount').textContent = s;
  $('#stickerCount').textContent = save.stickers.length;
}
function doneKey(u, id){ return 'u'+u+':'+id; }
function unitDone(u){ return LEVELS.every(function(lv){ return save.done[doneKey(u, lv.id)]; }); }
function unitOpen(u){ return u === 0 || unitDone(u - 1); }

/* ---------- sound effects ---------- */
var muted = false, ac = null;
function audio(){
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { ac = null; } }
  if (ac && ac.state === 'suspended') ac.resume();
  return ac;
}
function tone(f, t0, d, type, g, f2){
  var a = audio(); if (!a || muted) return;
  var now = a.currentTime + t0, o = a.createOscillator(), gn = a.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(f, now);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + d);
  gn.gain.setValueAtTime(0.0001, now);
  gn.gain.exponentialRampToValueAtTime(g || 0.15, now + 0.012);
  gn.gain.exponentialRampToValueAtTime(0.0001, now + d);
  o.connect(gn); gn.connect(a.destination);
  o.start(now); o.stop(now + d + 0.03);
}
var SFX = {
  tap:function(){ tone(660,0,.08,'triangle',.12); },
  pop:function(){ tone(950,0,.12,'square',.07,180); tone(1600,0,.05,'triangle',.09); },
  good:function(){ [523,659,784,1047].forEach(function(f,i){ tone(f,i*.08,.28,'triangle',.15); }); },
  bad:function(){ tone(320,0,.18,'triangle',.12,230); tone(240,.16,.24,'triangle',.1,170); },
  star:function(){ tone(1319,0,.35,'sine',.14); tone(1760,.07,.35,'sine',.1); },
  fanfare:function(){ [523,659,784,659,784,1047].forEach(function(f,i){ tone(f,i*.12,i===5?.7:.16,'triangle',.16); }); },
  dot:function(){ tone(880,0,.16,'sine',.14,1320); },
  tick:function(){ tone(1400,0,.03,'sine',.035); },
  whoosh:function(){ tone(220,0,.35,'sine',.08,900); }
};

/* ---------- voices ----------
   Clips live in audio/ (made by voices/generate.mjs). audio/index.json maps "speaker|speed|text" -> file.
   Every line has ONE speaker: Toota (b) teaches all letters, sounds and words; chat lines are
   given to one friend or the other. Toota never borrows Filfil's clips, so she always sounds like a girl. */
var arVoice = null;
function pickVoice(){
  if (!('speechSynthesis' in window)) return;
  var vs = speechSynthesis.getVoices() || [];
  arVoice = vs.filter(function(v){ return /^ar[-_]EG/i.test(v.lang); })[0] || vs.filter(function(v){ return /^ar/i.test(v.lang); })[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
var seqToken = 0, talkTimer = null, speaker = 'b';
var VOICE = {f:{pitch:1.5, rate:1.05}, b:{pitch:1.35, rate:1}};
function talking(on){
  clearTimeout(talkTimer);
  document.querySelectorAll('.buddy.talking').forEach(function(b){ b.classList.remove('talking'); });
  if (on) document.querySelectorAll('.buddy[data-who="'+speaker+'"]').forEach(function(b){ b.classList.add('talking'); });
}
var CLIPS = {}, MISSING = {};
var PLAY_RATE = {normal: .88, calm: .92, slow: 1};   /* playback speed per clip speed (1 = as recorded) */
try { fetch('audio/index.json', {cache: 'no-store'}).then(function(r){ return r.ok ? r.json() : {}; }).then(function(j){ CLIPS = j || {}; }).catch(function(){}); } catch(e) {}
function speedOf(rate){ rate = rate || .85; return rate <= .62 ? 'slow' : (rate <= .8 ? 'calm' : 'normal'); }
function clean(t){ return String(t).replace(/[!؟?…]/g,' ').replace(/\s+/g,' ').trim(); }
function clipFor(who, rate, text){
  var t = clean(text), sp = speedOf(rate);
  var own = CLIPS[who+'|'+sp+'|'+t] || CLIPS[who+'|calm|'+t] || CLIPS[who+'|slow|'+t] || CLIPS[who+'|normal|'+t];
  if (own || who === 'b') return own || null;
  return CLIPS['b|'+sp+'|'+t] || CLIPS['b|calm|'+t] || null;   /* Filfil may borrow Toota's clip, never the other way */
}
window.HARFI_LOG = window.HARFI_LOG || null;   /* set to [] to record every line spoken (used by voices/collect-lines.mjs) */
window.harfiMissing = function(){ return Object.keys(MISSING); };
var currentAudio = null, player = null, blocked = [];
var SILENCE = 'data:audio/wav;base64,UklGRuQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YcADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
function getPlayer(){ if (!player) { player = new Audio(); player.preload = 'auto'; } return player; }
function unlockAudio(){
  var a = getPlayer();
  try { a.src = SILENCE; var q = a.play(); if (q && q.then) q.then(function(){ a.pause(); }).catch(function(){}); } catch(e) {}
  try { audio(); } catch(e) {}
}
['pointerdown', 'touchend', 'keydown'].forEach(function(ev){ addEventListener(ev, function once(){ unlockAudio(); removeEventListener(ev, once, true); }, true); });
window.harfiBlocked = function(){ return blocked; };
function utter(text, rate, done, keep, who){
  if (who) speaker = who;
  var finished = false;
  function fin(){ if (finished) return; finished = true; talking(false); if (done) done(); }
  var guess = 700 + text.length * 170 / (rate || .85);
  var key = speaker+'|'+speedOf(rate)+'|'+clean(text);
  if (window.HARFI_LOG) window.HARFI_LOG.push(key);
  var file = clipFor(speaker, rate, text);
  if (!file && Object.keys(CLIPS).length) MISSING[key] = 1;
  if (file && !muted) {
    try {
      if (currentAudio && !keep) currentAudio.pause();
      if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} }
      var a = getPlayer(), retried = false; currentAudio = a;
      a.onended = a.onerror = a.onplay = null; a.src = 'audio/' + file;
      /* a touch slower than the recording, so it's easy to follow (pitch stays the same) */
      a.playbackRate = PLAY_RATE[speedOf(rate)] * (speaker === 'f' ? .93 : 1);   /* Filfil talks fast, so he's slowed a little more */ a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = true;
      a.onplay = function(){ talking(true); };
      a.onended = fin;
      a.onerror = function(){
        if (!retried) { retried = true; a.src = 'audio/' + file + '?r=' + Date.now(); var q = a.play(); if (q && q.catch) q.catch(function(){}); return; }
        delete CLIPS[key]; MISSING[key] = 1; fin();
      };
      talking(true);
      var p = a.play(); if (p && p.catch) p.catch(function(e){ if (e && e.name === 'NotAllowedError') { blocked.push(key); unlockAudio(); fin(); } });
      setTimeout(fin, 12000);
      return;
    } catch(e) {}
  }
  if (muted || !('speechSynthesis' in window) || !arVoice) { talking(!muted); talkTimer = setTimeout(fin, muted ? 50 : Math.min(guess, 1400)); return; }
  try {
    if (!keep) speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = arVoice.lang; u.voice = arVoice;
    u.rate = (rate || 0.85) * VOICE[speaker].rate; u.pitch = VOICE[speaker].pitch;
    u.onstart = function(){ talking(true); };
    u.onend = fin; u.onerror = fin;
    talking(true);
    speechSynthesis.speak(u);
    setTimeout(fin, guess + 2500);
  } catch(e) { fin(); }
}
/* phonics (letters, sounds, words) default to Toota */
function speak(text, rate, who){ seqToken++; if (currentAudio) { try { currentAudio.pause(); } catch(e) {} } utter(text, rate, null, false, who || 'b'); }
function speakSeq(parts, onEach, done, gap){
  var my = ++seqToken, i = 0;
  if (currentAudio) { try { currentAudio.pause(); } catch(e) {} }
  if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} }
  function step(){
    if (my !== seqToken) return;
    if (i >= parts.length) { if (done) done(); return; }
    var p = parts[i];
    if (onEach) onEach(i);
    utter(p.t, p.rate || .7, function(){ i++; setTimeout(step, gap == null ? 350 : gap); }, true, p.who || 'b');
  }
  step();
}
function stopSpeech(){ seqToken++; talking(false); if (currentAudio) { try { currentAudio.pause(); } catch(e) {} } if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} } }

/* ---------- speech bubble and reactions ---------- */
var bubble = $('#bubble');
function whoFor(text){ var s = 0; for (var i = 0; i < text.length; i++) s += text.charCodeAt(i); return s % 2 ? 'f' : 'b'; }
function say(ar, tr, en, talk, who){
  who = who || whoFor(clean(ar)); speaker = who;
  bubble.className = 'bubble ' + who;
  bubble.innerHTML = '<span class="who">'+NAMES[who].ar+'</span><span class="ar">'+ar+'</span>' + (tr ? '<span class="tr en">'+tr+'</span>' : '') + (en ? '<span class="en">'+en+'</span>' : '');
  bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
  if (talk !== false) speak(ar, .85, who);
  return who;
}
function sayThen(ar, tr, en, who, next){ who = say(ar, tr, en, false, who); speakSeq([{t:ar, rate:.85, who:who}], null, function(){ if (next) next(); }); }
function mood(m){
  var dur = m === 'dance' ? 2600 : 900;
  document.querySelectorAll('#buddies .buddy').forEach(function(q, i){
    setTimeout(function(){
      q.classList.remove('happy','sad','dance','spin'); void q.offsetWidth; q.classList.add(m);
      setTimeout(function(){ q.classList.remove(m); }, dur);
    }, i * 140);
  });
}
var lastPraise = -1;
function praise(el){
  var i; do { i = Math.floor(Math.random()*PRAISE.length); } while (i === lastPraise);
  lastPraise = i;
  SFX.good(); mood(Math.random() < .25 ? 'spin' : 'happy'); say(PRAISE[i][0], PRAISE[i][1], PRAISE[i][2]);
  if (el) burst(el);
}
function oops(ar, tr, en, talk){ SFX.bad(); mood('sad'); say(ar, tr, en, talk); }

var fx = $('#fx');
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(n){
  if (reduce) return;
  var cols = ['#F2994A','#F2C94C','#0F7C78','#E88FA8','#8E44AD','#9ED27F'];
  for (var i=0;i<(n||70);i++){
    var c = document.createElement('i'); c.className = 'conf';
    c.style.left = (Math.random()*100)+'vw';
    c.style.background = cols[i%cols.length];
    c.style.setProperty('--dx', (Math.random()*200-100)+'px');
    c.style.setProperty('--r', (Math.random()*900-450)+'deg');
    c.style.setProperty('--d', (1.4+Math.random()*1.4)+'s');
    c.style.animationDelay = (Math.random()*.4)+'s';
    fx.appendChild(c);
    setTimeout(function(el){ return function(){ el.remove(); }; }(c), 3400);
  }
}
var STAR = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#F2C94C" stroke="#C58F12" stroke-width="1.2" stroke-linejoin="round"/></svg>';
function burst(el, x, y){
  if (reduce) return;
  if (el) { var r = el.getBoundingClientRect(); x = r.left + r.width/2; y = r.top + r.height/2; }
  for (var i=0;i<10;i++){
    var s = document.createElement('i'); s.className = 'spark'; s.innerHTML = STAR;
    var a = i/10*Math.PI*2, d = 60 + Math.random()*50;
    s.style.left = x+'px'; s.style.top = y+'px';
    s.style.setProperty('--dx', Math.cos(a)*d+'px'); s.style.setProperty('--dy', Math.sin(a)*d+'px');
    fx.appendChild(s);
    setTimeout(function(el){ return function(){ el.remove(); }; }(s), 800);
  }
}

/* ---------- helpers ---------- */
function shuffle(a){ a = a.slice(); for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function h(html){ var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
var cleanup = null, timers = [];
function later(fn, ms){ var t = setTimeout(fn, ms); timers.push(t); return t; }
function clearScene(){
  if (cleanup) { cleanup(); cleanup = null; }
  timers.forEach(clearTimeout); timers = [];
  stopSpeech();
  stage.innerHTML = ''; $('#footAct').innerHTML = '';
}
function scene(html){ clearScene(); var el = h('<section class="scene">'+html+'</section>'); stage.appendChild(el); return el; }
function dotsHTML(n, cur){ var s=''; for (var i=0;i<n;i++) s += '<i class="'+(i<cur?'on':(i===cur?'now':''))+'"></i>'; return '<div class="dots" aria-label="Round '+(cur+1)+' of '+n+'">'+s+'</div>'; }
function task(ar, tr, en){ return '<div class="task"><span class="ar">'+ar+'</span><span class="en">'+tr+' · '+en+'</span></div>'; }
function footButton(ar, en, fn, cls){
  var b = h('<button class="go '+(cls||'')+'"><span class="ar">'+ar+'</span><span class="en" style="font-size:17px">'+en+'</span></button>');
  b.addEventListener('click', function(){ SFX.tap(); fn(); });
  $('#footAct').innerHTML = ''; $('#footAct').appendChild(b); return b;
}
var SPEAKER = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2140" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>';
var LOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
function theName(l){ return 'ال' + l.name.replace(/^ال/, ''); }   /* "الباء", "الألف" (shown, never spoken: she learns sounds, not names) */
/* Phonics first: a letter is always spoken as its SOUND (بَ "ba"), never its name (باء). Every single sound
   plays at this one rate, so each letter sound has exactly one clip. */
var SND = .6;
function sounds(l, n){ var p = []; for (var i = 0; i < (n || 1); i++) p.push({t:l.snd, rate:SND}); return p; }

var mistakes = 0;
function starsFor(m){ return m <= 1 ? 3 : (m <= 4 ? 2 : 1); }

/* ---------- map: 7 units, 6 levels each ---------- */
var viewUnit = null;
function openLevelCount(u){ var n = 0; for (var i=0;i<LEVELS.length;i++){ if (save.done[doneKey(u, LEVELS[i].id)]) n++; else break; } return n; }
function showMap(greet, u){
  if (u != null) viewUnit = u;
  if (viewUnit == null || !unitOpen(viewUnit)) viewUnit = Math.min(save.unit || 0, UNITS.length - 1);
  u = viewUnit;
  var U = UNITS[u];
  var el = scene(task('رحلة الحروف','Riḥlet el-ḥurūf','Letter journey · unit '+(u+1)+' of '+UNITS.length+': '+U.label) +
    '<div class="units" id="units" role="tablist" aria-label="Units"></div><div class="map" id="map"><svg class="path" id="mapPath" aria-hidden="true"></svg></div>');
  var units = el.querySelector('#units');
  UNITS.forEach(function(UU, i){
    var open = unitOpen(i), cls = 'uchip' + (i === u ? ' on' : '') + (unitDone(i) ? ' done' : '') + (open ? '' : ' locked');
    var b = h('<button class="'+cls+'" role="tab" aria-selected="'+(i===u)+'" aria-label="Unit '+(i+1)+(open?'':' (locked)')+'"><span class="ar">'+UU.label+'</span>'+(open?'':LOCK)+'</button>');
    b.addEventListener('click', function(){
      if (!open) { SFX.bad(); mood('sad'); say('خلّصي الوحدة اللي قبلها الأوّل','Khallaṣi el-waḥda elli ʾablaha el-awwel','Finish the unit before it first', true, 'b'); return; }
      SFX.whoosh(); showMap(false, i);
    });
    units.appendChild(b);
  });
  setTimeout(function(){ var on = units.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({inline:'center', block:'nearest'}); }, 50);
  var map = el.querySelector('#map'), open = openLevelCount(u);
  LEVELS.forEach(function(lv, i){
    var st = save.done[doneKey(u, lv.id)], state = st ? 'done' : (i === open ? 'open' : 'locked');
    var stars = '';
    if (state === 'done') { stars = '<span class="stars">'; for (var s=0;s<3;s++) stars += '<span style="width:20px;opacity:'+(s<st?1:.25)+'">'+STAR+'</span>'; stars += '</span>'; }
    var g = glyphFor(u, lv.id);
    var glyph = g === 'say' ? '<svg width="56%" height="56%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" stroke-width="3"/></svg>'
      : g === 'trace' ? '<svg width="52%" height="52%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/><path d="M13 6l5 5"/></svg>'
      : '<span class="ar"'+(g.length > 2 ? ' style="font-size:.62em"' : '')+'>'+g+'</span>';
    var b = h('<button class="node '+state+'" aria-label="'+lv.en+(state==='locked'?' (locked)':'')+'"><span class="disc">'+glyph+'</span><span class="lbl"><span class="ar">'+lv.ar+'</span><span class="en">'+lv.en+'</span></span>'+stars+'</button>');
    b.addEventListener('click', function(){
      if (state === 'locked') { SFX.bad(); mood('sad'); say('لسّه مقفولة','Lissa ma\'fūla','Not yet! Finish the orange one first'); return; }
      SFX.whoosh(); startLevel(u, i);
    });
    map.appendChild(b);
  });
  function layout(){
    var w = map.clientWidth, hgt = map.clientHeight, wide = w > 620;
    var P = wide ? [[89,30],[73,70],[57,30],[41,70],[25,30],[10,70]] : [[70,12],[30,27],[70,42],[30,57],[70,72],[32,88]];
    var pts = P.map(function(p){ return [p[0]/100*w, p[1]/100*hgt]; });
    map.querySelectorAll('.node').forEach(function(n, i){ n.style.left = P[i][0]+'%'; n.style.top = P[i][1]+'%'; });
    function curve(k){
      var d = 'M'+pts[0][0]+' '+pts[0][1];
      for (var i=1;i<=k;i++){
        var a = pts[i-1], b = pts[i];
        if (wide) { var mx = (a[0]+b[0])/2; d += ' C'+mx+' '+a[1]+' '+mx+' '+b[1]+' '+b[0]+' '+b[1]; }
        else { var my = (a[1]+b[1])/2; d += ' C'+a[0]+' '+my+' '+b[0]+' '+my+' '+b[0]+' '+b[1]; }
      }
      return d;
    }
    var done = Math.min(open, LEVELS.length-1);
    map.querySelector('#mapPath').innerHTML = '<path d="'+curve(LEVELS.length-1)+'" fill="none" stroke="#E4D6BC" stroke-width="20" stroke-linecap="round" stroke-dasharray="2 30"/>' + (done>0 ? '<path d="'+curve(done)+'" fill="none" stroke="#0F7C78" stroke-width="20" stroke-linecap="round"/>' : '');
  }
  layout();
  window.addEventListener('resize', layout);
  cleanup = function(){ window.removeEventListener('resize', layout); };
  if (unitDone(UNITS.length - 1)) say('خلّصتي كل الحروف!','Khallaṣti kull el-ḥurūf!','You learned every letter! Play any game again.', greet, 'b');
  else if (open >= LEVELS.length) say('الوحدة دي خلصت! اختاري الوحدة الجاية','El-waḥda di khilṣit! Ikhtāri el-waḥda el-gayya','This unit is done! Pick the next one at the top', greet, 'f');
  else if (open === 0 && u === 0) say('يلّا نبدأ! دوسي على البرتقالي','Yalla nibda\'! Dūsi ʿal-burtu\'āni','Let\'s start! Tap the orange circle', greet, 'b');
  else if (open === 0) say('حروف جديدة! يلّا بينا','Ḥurūf gdīda! Yalla bīna','New letters! Let\'s go', greet, 'f');
  else say('اختاري اللعبة الجاية','Ikhtāri el-liʿba el-gayya','Pick the next game', greet, 'b');
}

function startLevel(u, i){
  mistakes = 0; viewUnit = u;
  var id = LEVELS[i].id;
  if (id === 'sounds') meetLetters(u, i);
  else if (id === 'say') sayGame(u, i);
  else if (id === 'vowels') vowelGame(u, i);
  else if (id === 'first') firstSound(u, i);
  else if (id === 'trace') traceGame(u, i);
  else wordGame(u, i);
}

function finishLevel(u, i){
  var lv = LEVELS[i], st = starsFor(mistakes), sticker = UNITS[u].stickers[i];
  save.done[doneKey(u, lv.id)] = Math.max(save.done[doneKey(u, lv.id)] || 0, st);
  if (save.stickers.indexOf(sticker) < 0) save.stickers.push(sticker);
  var unitFinished = unitDone(u);
  if (unitFinished && u + 1 < UNITS.length) save.unit = Math.max(save.unit || 0, u + 1);
  persist();
  var el = scene('<div class="reward"><div class="bigstars" id="bs"></div><h2 class="ar">برافو عليكي!</h2><div class="sub en">Brāvo ʿalēki! · '+(unitFinished && i === LEVELS.length-1 ? 'Unit '+(u+1)+' done: '+UNITS[u].label : 'Level done: '+lv.en)+'</div><div class="sticker">'+PIC[sticker]+'</div><div class="sub"><span class="ar" style="font-weight:800;color:#2B2140">كسبتي ستيكر!</span> <span class="en">You won a sticker</span></div></div>');
  SFX.fanfare(); confetti(unitFinished ? 140 : 90); mood('dance');
  say('كسبتي ستيكر جديد!','Kisbti stiker gdīd!','You won a new sticker!', true, 'b');
  later(function(){ say('إحنا فخورين بيكي!','Iḥna fakhūrīn bīki!','We\'re so proud of you!', true, 'f'); }, 2600);
  var bs = el.querySelector('#bs');
  for (var s=0;s<3;s++){
    (function(s){
      later(function(){
        var sz = s===1 ? 88 : 68;
        var span = h('<span style="width:'+sz+'px;height:'+sz+'px;display:block;opacity:'+(s<st?1:.2)+'">'+STAR+'</span>');
        span.firstChild.style.animation = 'starIn .5s cubic-bezier(.3,1.8,.5,1) both';
        bs.appendChild(span); if (s<st) SFX.star();
      }, 350 + s*380);
    })(s);
  }
  if (i < LEVELS.length-1) footButton('اللعبة الجاية','Next game', function(){ startLevel(u, i+1); }, 'ready');
  else if (u + 1 < UNITS.length) footButton('حروف جديدة','Next letters: '+UNITS[u+1].label, function(){ showMap(true, u+1); }, 'ready');
  else footButton('على الخريطة','Back to map', function(){ showMap(true); }, 'ready');
}

/* ---------- 1 · sounds: meet the letters, pop balloons, then match by sound alone ---------- */
function meetLetters(u, li){
  var U = UNITS[u];
  var el = scene(task('اتعرّفي على الحروف','Itʿarrafi ʿala el-ḥurūf','Meet the letters. Tap each one to hear it') + '<div class="cards" id="cards"></div>');
  var seen = {}, cards = el.querySelector('#cards');
  U.letters.forEach(function(k){
    var l = L[k];
    var c = h('<button class="lcard" aria-label="Letter '+l.en+'"><span class="seen">'+CHECK+'</span><span class="big ar">'+l.ch+'</span><span class="nm"><span class="ar">'+l.snd+'</span><span class="en" dir="ltr">“'+(l.key === 'alif' ? 'a' : l.tr + 'a')+'” · '+l.en+'</span></span></button>');
    c.addEventListener('click', function(){
      c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
      SFX.tap(); speakSeq(sounds(l, 3), function(i){   /* the letter's sound, three times (not its name) */ if (i) { c.classList.remove('play'); void c.offsetWidth; c.classList.add('play'); } }, null, 300);
      burst(c.querySelector('.big'));
      if (!seen[k]) { seen[k] = true; c.classList.add('was'); }
      if (Object.keys(seen).length === U.letters.length) { next.disabled = false; next.classList.add('ready'); mood('happy'); later(function(){ sayThen('شاطرة! يلّا نلعب بالبلالين','Shaṭra! Yalla nilʿab bil-balalīn','Great! Now let\'s pop balloons', 'f'); }, 2600); }
    });
    cards.appendChild(c);
  });
  var next = footButton('يلّا','Next', function(){ popGame(u, li, 0); });
  next.disabled = true;
  say('دوسي على كل حرف','Dūsi ʿala kull ḥarf','Tap every letter to hear its sound', true, 'b');
}

function popGame(u, li, round){
  var targets = UNITS[u].sounding.slice(0, 3);
  var tk = targets[round], T = L[tk], NEED = 4;
  var others = distractors(u, [tk], 3);
  var el = scene(dotsHTML(targets.length, round) + '<div class="target"><div class="task"><span class="ar">فرقعي بلالين '+T.snd+'</span><span class="en">Farqaʿi balalīn '+T.en+' · Pop the '+T.en+' balloons</span></div><div class="tg ar">'+T.ch+'</div><button class="listen" id="lis" style="width:72px;height:72px" aria-label="Hear the sound">'+SPEAKER+'</button><div class="dots" id="cnt"></div></div><div class="sky" id="sky"></div>');
  var lis = el.querySelector('#lis');
  function hearT(){ lis.classList.remove('ping'); void lis.offsetWidth; lis.classList.add('ping'); speakSeq(sounds(T, 2), null, null, 250); }
  lis.addEventListener('click', hearT);
  var sky = el.querySelector('#sky'), cnt = el.querySelector('#cnt');
  [[8,12,120],[60,22,160],[30,48,90],[78,60,130]].forEach(function(c){ sky.appendChild(h('<i class="cloud" style="left:'+c[0]+'%;top:'+c[1]+'%;width:'+c[2]+'px;height:'+(c[2]*.38)+'px"></i>')); });
  var got = 0, balloons = [], run = true, last = performance.now(), spawnT = 0, sinceTarget = 0;
  function drawCount(){ var s=''; for (var i=0;i<NEED;i++) s += '<i class="'+(i<got?'on':'')+'"></i>'; cnt.innerHTML = s; }
  drawCount();
  function spawn(){
    var Wd = sky.clientWidth, H = sky.clientHeight;
    var size = Math.max(70, Math.min(110, Wd/7));
    var isT = sinceTarget >= 2 || Math.random() < .45;
    var key = isT ? tk : others[Math.floor(Math.random()*others.length)];
    sinceTarget = isT ? 0 : sinceTarget + 1;
    var b = h('<button class="balloon" aria-label="Balloon '+L[key].en+'" style="--s:'+size+'px;--c:'+BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)]+'"><span class="b ar">'+L[key].ch+'</span><span class="knot"></span></button>');
    var o = {el:b, key:key, x: 10 + Math.random()*(Wd - size - 20), y: H + 10, v: 55 + Math.random()*35, ph: Math.random()*6, dead:false};
    b.addEventListener('pointerdown', function(e){
      e.preventDefault(); if (o.dead || !run) return;
      if (o.key === tk) {
        o.dead = true; b.classList.add('popped'); SFX.pop(); burst(b); speak(T.snd, SND);
        got++; drawCount(); mood('happy');
        setTimeout(function(){ b.remove(); }, 300);
        if (got >= NEED) { run = false; later(function(){ praise(); confetti(40); }, 250); later(function(){ round+1 < targets.length ? popGame(u, li, round+1) : soundMatch(u, li); }, 1900); }
        else if (got === 2) say('كمان! كمّلي','Kamān! Kammili','More! Keep going', false, 'f');
      } else {
        mistakes++;
        b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
        oops('مش ده… اسمعي تاني: '+T.snd, 'Mish da… ismaʿi tāni: "'+T.tr+'"', 'Not that one. Listen again: "'+T.tr+'" '+T.ch, false);
        speakSeq([{t:'مش ده… اسمعي تاني', rate:.85, who:'f'}].concat(sounds(T, 2)), null, null, 300);
      }
    });
    sky.appendChild(b); balloons.push(o);
  }
  var raf;
  function frame(now){
    if (!run && balloons.every(function(o){ return o.dead; })) return;
    var dt = Math.min(.05, (now - last)/1000); last = now;
    spawnT -= dt;
    if (run && spawnT <= 0 && balloons.filter(function(o){ return !o.dead; }).length < 6) { spawn(); spawnT = 0.95; }
    balloons.forEach(function(o){
      if (o.dead) return;
      o.y -= o.v*dt; o.ph += dt*1.6;
      o.el.style.transform = 'translate('+(o.x + Math.sin(o.ph)*14)+'px,'+o.y+'px)';
      if (o.y < -o.el.offsetHeight - 60) { o.dead = true; o.el.remove(); }
    });
    balloons = balloons.filter(function(o){ return !o.dead || o.el.classList.contains('popped'); });
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  cleanup = function(){ run = false; cancelAnimationFrame(raf); };
  say('فرقعي البلالين اللي بتقول '+T.snd, 'Farqaʿi el-balalīn elli bit\'ūl "'+T.tr+'"', 'Pop only the balloons that say "'+T.tr+'". Tap the speaker to hear it', false, 'f');
  speakSeq([{t:'فرقعي البلالين اللي بتقول', rate:.85, who:'f'}].concat(sounds(T, 2)), null, null, 300);
}

function soundMatch(u, li){
  var rounds = shuffle(UNITS[u].letters), r = 0;
  function play(){
    var k = rounds[r], l = L[k];
    var opts = shuffle([k].concat(distractors(u, [k], 2)));
    var el = scene(dotsHTML(rounds.length, r) + task('مين بيقول الصوت ده؟','Mīn biy\'ūl eṣ-ṣōt da?','Which letter makes this sound?') +
      '<div class="stage"><div class="row"><button class="listen" id="lis" aria-label="Hear the sound again">'+SPEAKER+'</button></div><div class="choices" id="ch"></div></div>');
    var lis = el.querySelector('#lis'), ch = el.querySelector('#ch'), locked = false;
    function hear(){ lis.classList.remove('ping'); void lis.offsetWidth; lis.classList.add('ping'); speakSeq(sounds(l, 2), null, null, 300); }
    lis.addEventListener('click', hear);
    opts.forEach(function(o){
      var b = h('<button class="choice" aria-label="Letter '+L[o].en+'"><span class="big ar" style="color:#2B2140">'+L[o].ch+'</span><span class="sm en">"'+L[o].tr+'"</span></button>');
      b.addEventListener('click', function(){
        if (locked) return;
        if (o === k) {
          locked = true; b.classList.add('right'); praise(b.querySelector('.big'));
          later(function(){ speakSeq(sounds(l, 2), null, null, 250); }, 1000);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(u, li); }, 2600);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); SFX.bad(); mood('sad');
          say('ده بيقول '+L[o].snd+'… اسمعي تاني', 'Da biy\'ūl "'+L[o].tr+'"… ismaʿi tāni', 'That one says "'+L[o].tr+'". Listen again', false, 'b');
          speakSeq(sounds(L[o]), null, function(){ later(hear, 500); });
        }
      });
      ch.appendChild(b);
    });
    if (r === 0) later(function(){ sayThen('اسمعي بس… من غير ما تشوفي','Ismaʿi bass… min gheir ma tshūfi','Just listen, then tap the letter', 'b', hear); }, 300);
    else later(hear, 400);
  }
  play();
}

/* ---------- 2 · say it with me ---------- */
function sayGame(u, li){
  var U = UNITS[u];
  var items = U.sounding.slice(0, 3).map(function(k){ var l = L[k]; return {show:l.snd, parts:sounds(l), tr:l.tr+'a', en:'the sound of '+l.ch}; });
  var words = u === 0 ? [W.baba, W.filfil, W.toota] : U.words.map(function(k){ return W[k]; });
  items = items.concat(words.map(function(w){ return {w:w}; }));
  var r = 0;
  function play(){
    var it = items[r], w = it.w;
    var el = scene(dotsHTML(items.length, r) + task('اسمعي وقولي معايا','Ismaʿi w-ʾūli maʿāya','Listen, then say it out loud') +
      '<div class="stage phase-listen" id="st"><div class="row"><div class="saycard" id="card">' +
        (w ? kwHTML(w) : '<span class="kw"><span data-i="0">'+it.show+'</span></span>') +
        '<span class="tr en">'+(w ? w.syl.map(function(s){ return s.tr; }).join(' · ')+'  →  '+w.tr+' ('+w.en+')' : '"'+it.tr+'" · '+it.en)+'</span>' +
      '</div></div><div class="turn turnbox" id="turn"></div></div>');
    var st = el.querySelector('#st'), card = el.querySelector('#card'), turn = el.querySelector('#turn');
    /* Toota says it slowly in pieces, then one friend says it whole: Filfil says his own name, Toota says hers.
       A single sound is only ever said by Toota, so it always comes from the same clip. */
    var second = (w === W.toota || !w) ? 'b' : 'f', first = w === W.filfil ? 'f' : 'b';
    function friendsSay(done){
      st.classList.add('phase-listen');
      var all = w ? w.letters.map(function(_,k){ return k; }) : [0];
      var word = w ? w.word : it.show, trw = w ? w.tr : it.tr;
      say(word, trw, w ? NAMES[first].en+' says it in little pieces' : NAMES[first].en+' says the sound', false, first);
      function secondTurn(){
        say(word, trw, 'Now '+NAMES[second].en+' says it', false, second);
        speakSeq([w ? {t:w.word, rate:.75, who:second} : it.parts[0]], function(){ lightUp(card, all); }, function(){ lightUp(card, null); if (done) done(); });
      }
      if (w) soundOut(card, w, function(){ setTimeout(secondTurn, 350); }, first);
      else speakSeq(it.parts.concat(it.parts), function(){ lightUp(card, [0]); }, function(){ lightUp(card, null); setTimeout(secondTurn, 350); }, 400);
    }
    function herTurn(){
      st.classList.remove('phase-listen'); SFX.dot(); mood('happy');
      say('دورك! قولي '+(w ? w.word : it.show), 'Dōrik! ʾūli '+(w ? w.tr : it.tr), w === W.filfil ? 'Your turn! Say Filfil\'s name' : w === W.toota ? 'Your turn! Say Toota\'s name' : 'Your turn! Say it out loud', false, 'b');
      speakSeq([{t:'دورك! قولي', rate:.85}, w ? {t:w.word, rate:.75} : it.parts[0]], null, null, 150);   /* the sound or word comes from its own clip */
      document.querySelectorAll('#buddies .buddy').forEach(function(b){ b.style.transform = 'rotate(-8deg) translateY(-4px)'; });
      later(function(){ document.querySelectorAll('#buddies .buddy').forEach(function(b){ b.style.transform = ''; }); }, 3100);
      turn.innerHTML = '<div class="ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill="none" stroke="#F3E6CE" stroke-width="8"/><circle class="run" cx="42" cy="42" r="38" fill="none" stroke="#F2994A" stroke-width="8" stroke-dasharray="239" stroke-linecap="round"/></svg><span class="face"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2B2140" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".6" fill="#2B2140"/><circle cx="15" cy="10" r=".6" fill="#2B2140"/><ellipse cx="12" cy="15.5" rx="2.4" ry="2" fill="#2B2140"/></svg></span></div><span class="ar">دورك!</span><span class="en" style="font-size:18px;color:#6B5E52">Your turn</span>';
      later(compare, 3200);
    }
    function compare(){
      sayThen('اسمعي تاني… زيّك؟','Ismaʿi tāni… zayyik?','Listen again. Did it sound like you?', 'f', function(){ friendsSay(function(){
        st.classList.remove('phase-listen');
        turn.innerHTML = '';
        var yes = h('<button class="go teal"><span class="ar">قلتها!</span><span class="en" style="font-size:17px">I said it</span></button>');
        var again = h('<button class="ghost"><span class="ar">تاني</span><span class="en" style="font-size:16px">Again</span></button>');
        yes.addEventListener('click', function(){
          yes.disabled = true; praise(card); confetti(30);
          later(function(){ r++; r < items.length ? play() : finishLevel(u, li); }, 1700);
        });
        again.addEventListener('click', function(){ SFX.tap(); turn.innerHTML = ''; friendsSay(herTurn); });
        turn.appendChild(again); turn.appendChild(yes);
      }); });
    }
    later(function(){ sayThen('اسمعي كويس', 'Ismaʿi kwayyis', w ? 'Listen: the word in little pieces, then all together' : 'Listen to the sound', 'b', function(){ friendsSay(herTurn); }); }, r === 0 ? 600 : 300);
  }
  play();
}

/* ---------- 3 · short vowels ---------- */
var VOW = [
  {k:'a', mark:'َ', name:'فتحة', en:'fatḥa', col:'#0F7C78'},
  {k:'i', mark:'ِ', name:'كسرة', en:'kasra', col:'#B5476B'},
  {k:'u', mark:'ُ', name:'ضمّة', en:'ḍamma', col:'#5B4BB0'}
];
function vowelGame(u, li){
  var two = UNITS[u].sounding.slice(0, 2);
  var rounds = shuffle(two.reduce(function(a, lk){ return a.concat(VOW.map(function(v){ return {lk:lk, v:v}; })); }, []));
  var r = 0;
  function play(){
    var R = rounds[r], l = L[R.lk];
    var syl = function(v){ return l.ch + v.mark; };
    var trs = function(v){ return l.tr + v.k; };
    var el = scene(dotsHTML(rounds.length, r) + task('اسمعي… ده أنهي صوت؟','Ismaʿi… da anhi ṣōt?','Listen. Which sound is it?') +
      '<div class="stage"><div class="row"><button class="listen" id="lis" aria-label="Hear the sound again">'+SPEAKER+'</button></div><div class="choices" id="ch"></div></div>');
    var ch = el.querySelector('#ch'), lis = el.querySelector('#lis'), locked = false;
    function hear(){ lis.classList.remove('ping'); void lis.offsetWidth; lis.classList.add('ping'); speak(syl(R.v), .7); }
    lis.addEventListener('click', hear);
    shuffle(VOW).forEach(function(v){
      var b = h('<button class="choice" aria-label="'+trs(v)+'"><span class="big ar" style="color:'+v.col+'">'+syl(v)+'</span><span class="sm"><b class="ar">'+v.name+'</b> <span class="en">'+v.en+' · '+trs(v)+'</span></span></button>');
      b.addEventListener('click', function(){
        if (locked) return;
        if (v.k === R.v.k) {
          locked = true; b.classList.add('right'); praise(b.querySelector('.big'));
          later(function(){ speak(syl(v), .7); }, 1000);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(u, li); }, 2300);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          SFX.bad(); mood('sad');
          say('ده '+trs(v)+'… اسمعي تاني', 'Da '+trs(v)+'… ismaʿi tāni', 'That one says "'+trs(v)+'". Listen again', false, 'b');
          speak(syl(v), .7); later(hear, 1300);
        }
      });
      ch.appendChild(b);
    });
    if (r === 0) later(function(){ sayThen('العلامة الصغيّرة بتغيّر الصوت','El-ʿalāma eṣ-ṣughayyara bitghayyar eṣ-ṣōt','The little mark changes the sound: a, i, u', 'b', hear); }, 300);
    else later(hear, 500);
  }
  play();
}

/* ---------- 4 · first sound ---------- */
function firstSound(u, li){
  var U = UNITS[u];
  var rounds = shuffle(U.keywords.map(function(k){ return W[k]; }));
  if (u === 0) rounds.push(W.toota);
  var r = 0;
  function play(){
    var R = rounds[r];
    var opts = shuffle([R.first].concat(distractors(u, [R.first], 2)));
    var el = scene(dotsHTML(rounds.length, r) + task('الكلمة دي بتبدأ بأنهي صوت؟','El-kilma di bitibda\' b-anhi ṣōt?','Which sound does this word start with?') +
      '<div class="stage"><div class="row"><button class="pic" id="pic" aria-label="Hear the word">'+PIC[R.pic]+'<span class="word ar" id="word"><span class="q">؟</span></span><span class="en" style="font-size:16px;color:#6B5E52">'+R.en+'</span></button>'+earBtn('أوّل صوت','First sound')+'</div><div class="choices" id="ch"></div></div>');
    var ch = el.querySelector('#ch'), locked = false, pic = el.querySelector('#pic'), onsetBtn = el.querySelector('.earbtn');
    var onset = R.syl[0].t;
    function prompt(){ speakSeq([{t:R.word,rate:.75},{t:onset,rate:.55},{t:onset,rate:.55}], null, null, 400); }
    pic.addEventListener('click', function(){ SFX.tap(); speak(R.word, .75); });
    onsetBtn.addEventListener('click', function(){ SFX.tap(); speakSeq([{t:onset,rate:.55},{t:onset,rate:.55}], null, null, 350); });
    opts.forEach(function(k){
      var l = L[k];
      var b = h('<button class="choice" aria-label="Letter '+l.en+'"><span class="big ar" style="color:#2B2140">'+l.ch+'</span><span class="sm en">"'+l.tr+'"</span></button>');
      b.addEventListener('click', function(){
        if (locked) return;
        if (k === R.first) {
          locked = true; b.classList.add('right'); praise(b.querySelector('.big'));
          var wd = el.querySelector('#word'); wd.innerHTML = kwHTML(R);
          later(function(){ lightUp(wd, [0]); speakSeq(sounds(l), null, function(){ soundOut(wd, R); }); }, 1100);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(u, li); }, 7200);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          SFX.bad(); mood('sad');
          say('ده بيقول '+l.snd+'… اسمعي أوّل الكلمة', 'Da biy\'ūl "'+l.tr+'"… ismaʿi awwel el-kilma', 'That says "'+l.tr+'". Listen to the start: "'+R.syl[0].tr+'…"', false, 'b');
          speakSeq(sounds(l).concat([{t:onset,rate:.55},{t:onset,rate:.55}]), null, null, 450);
        }
      });
      ch.appendChild(b);
    });
    if (r === 0) later(function(){ sayThen('اسمعي أوّل صوت في الكلمة','Ismaʿi awwel ṣōt fil-kilma','Listen to the very first sound of the word', 'b', prompt); }, 300);
    else later(prompt, 400);
  }
  play();
}

/* ---------- 5 · write: colour in the letter with a finger (works for every letter) ---------- */
function traceGame(u, li){
  var keys = UNITS[u].letters, r = 0;
  function play(){
    var l = L[keys[r]];
    var el = scene(dotsHTML(keys.length, r) + task('لوّني '+l.snd,'Lawwini "'+(l.key === 'alif' ? 'a' : l.tr + 'a')+'"','Colour in '+l.en+' with your finger. Start at the green dot') +
      '<div class="trace-wrap"><div class="board" id="board"><canvas id="cv" aria-label="Colour in the letter '+l.en+'"></canvas></div><div class="side"><div class="model"><span class="big ar">'+l.ch+'</span><span class="en" style="color:#6B5E52">'+l.en+'</span></div><div class="meter" aria-hidden="true"><i id="fill"></i></div></div></div>');
    var board = el.querySelector('#board'), cv = el.querySelector('#cv'), ctx = cv.getContext('2d'), fillBar = el.querySelector('#fill');
    var dpr, Wd, Ht, fs, mask, paint, pctx, clip, cctx, samples = [], startPt = null, drawing = false, lastP = null, moves = 0, finished = false, started = false;
    function setup(){
      dpr = Math.min(2, window.devicePixelRatio || 1);
      Wd = board.clientWidth; Ht = board.clientHeight;
      if (Wd < 40 || Ht < 40) return;
      cv.width = Math.round(Wd * dpr); cv.height = Math.round(Ht * dpr); cv.style.width = Wd + 'px'; cv.style.height = Ht + 'px';
      fs = Math.min(Ht * 0.72, Wd * 0.62);
      mask = document.createElement('canvas'); mask.width = cv.width; mask.height = cv.height;
      var m = mask.getContext('2d'); m.scale(dpr, dpr); m.font = '800 ' + fs + 'px "Baloo Bhaijaan 2", sans-serif'; m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillStyle = '#000'; m.fillText(l.ch, Wd/2, Ht/2);
      var md = m.getImageData(0, 0, mask.width, mask.height).data, step = Math.max(3, Math.round(4 * dpr)), best = -1e9;
      samples = [];
      for (var y = 0; y < mask.height; y += step) for (var x = 0; x < mask.width; x += step) {
        if (md[(y * mask.width + x) * 4 + 3] > 128) { samples.push(y * mask.width + x); var score = x - y * 0.6; if (score > best) { best = score; startPt = [x / dpr, y / dpr]; } }
      }
      paint = document.createElement('canvas'); paint.width = cv.width; paint.height = cv.height; pctx = paint.getContext('2d');
      pctx.lineCap = 'round'; pctx.lineJoin = 'round'; pctx.strokeStyle = '#0F7C78'; pctx.fillStyle = '#0F7C78'; pctx.lineWidth = fs * 0.15 * dpr;
      clip = document.createElement('canvas'); clip.width = cv.width; clip.height = cv.height; cctx = clip.getContext('2d');
      draw(); cv.dataset.ready = '1';
    }
    function draw(full){
      ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.font = '800 ' + fs + 'px "Baloo Bhaijaan 2", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = full ? '#0F7C78' : '#F1E9DA'; ctx.fillText(l.ch, Wd/2, Ht/2);
      if (!full) {
        ctx.setLineDash([5, 11]); ctx.lineWidth = 3; ctx.strokeStyle = '#C9BBA2'; ctx.strokeText(l.ch, Wd/2, Ht/2); ctx.setLineDash([]);
        cctx.globalCompositeOperation = 'source-over'; cctx.clearRect(0, 0, clip.width, clip.height); cctx.drawImage(paint, 0, 0);
        cctx.globalCompositeOperation = 'destination-in'; cctx.drawImage(mask, 0, 0); cctx.globalCompositeOperation = 'source-over';
        ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(clip, 0, 0); ctx.setTransform(dpr,0,0,dpr,0,0);
        if (!started && startPt) { ctx.beginPath(); ctx.arc(startPt[0], startPt[1], 22, 0, Math.PI*2); ctx.fillStyle = 'rgba(46,158,91,.3)'; ctx.fill(); ctx.beginPath(); ctx.arc(startPt[0], startPt[1], 13, 0, Math.PI*2); ctx.fillStyle = '#2E9E5B'; ctx.fill(); }
      }
    }
    function coverage(){
      if (!samples.length) return 0;
      var pd = pctx.getImageData(0, 0, paint.width, paint.height).data, hit = 0;
      for (var i = 0; i < samples.length; i++) if (pd[samples[i] * 4 + 3] > 0) hit++;
      return hit / samples.length;
    }
    function pos(e){ var b = cv.getBoundingClientRect(); return [(e.clientX - b.left), (e.clientY - b.top)]; }
    function stroke(a, b){ pctx.beginPath(); pctx.moveTo(a[0]*dpr, a[1]*dpr); pctx.lineTo(b[0]*dpr, b[1]*dpr); pctx.stroke(); }
    cv.addEventListener('pointerdown', function(e){
      if (finished || !pctx) return; e.preventDefault();
      drawing = true; started = true; lastP = pos(e); stroke(lastP, lastP); draw();
      try { cv.setPointerCapture(e.pointerId); } catch(err) {}
    });
    cv.addEventListener('pointermove', function(e){
      if (!drawing || finished || !pctx) return;
      var p = pos(e); stroke(lastP, p); lastP = p; draw();
      if (++moves % 5 === 0) { SFX.tick(); check(); }
    });
    function up(){ if (!drawing) return; drawing = false; check(); }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    function check(){
      var c = coverage(); fillBar.style.width = Math.min(100, Math.round(c / 0.72 * 100)) + '%';
      if (c >= 0.72 && !finished) {
        finished = true; draw(true); SFX.good(); mood('happy'); burst(board); confetti(40); praise();
        later(function(){ speakSeq(sounds(l, 2), null, null, 300); }, 1200);
        later(function(){ r++; r < keys.length ? play() : finishLevel(u, li); }, 3600);
      }
    }
    var ro = function(){ if (!started) setup(); };
    window.addEventListener('resize', ro);
    cleanup = function(){ window.removeEventListener('resize', ro); };
    var go = function(){ requestAnimationFrame(setup); };
    if (document.fonts && document.fonts.load) document.fonts.load('800 100px "Baloo Bhaijaan 2"', l.ch).then(go, go); else go();
    footButton('تاني','Start again', function(){ play(); });
    if (r === 0) say('ابدئي من النقطة الخضرا ولوّني الحرف كله','Ibda\'i min en-nu\'ṭa el-khaḍra w-lawwini el-ḥarf kullu','Start at the green dot and colour in the whole letter', true, 'b');
    else speakSeq(sounds(l, 2), null, null, 300);
  }
  play();
}

/* ---------- 6 · build words ---------- */
function wordGame(u, li){
  var rounds = UNITS[u].words.map(function(k){ return W[k]; });
  var r = 0;
  function play(){
    var R = rounds[r], plain = R.plain, pos = 0, wrongHere = 0;
    var el = scene(dotsHTML(rounds.length, r) + task('ركّبي الكلمة','Rakkibi el-kilma','Build the word. Right to left!') +
      '<div class="stage"><div class="row"><button class="pic" id="pic" aria-label="Hear the word" style="padding:8px 16px">'+PIC[R.pic]+'<span class="en" style="font-size:16px;color:#6B5E52">'+R.tr+' · '+R.en+'</span></button>'+earBtn('قطّعي الكلمة','Sound it out')+'<div id="out" style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="slots" id="slots"></div></div></div><div class="tiles" id="tiles"></div></div>');
    var slots = el.querySelector('#slots'), tiles = el.querySelector('#tiles');
    el.querySelector('#pic').addEventListener('click', function(){ SFX.tap(); speak(R.word, .75); });
    function pieces(){ speakSeq(R.syl.map(function(s){ return {t:s.t,rate:.55}; }).concat([{t:R.word,rate:.7}]), null, null, 450); }
    function pieceAt(p){ var sy = R.syl.filter(function(s){ return s.on.indexOf(p) >= 0; })[0]; return sy ? sy.t : R.word; }
    el.querySelector('.earbtn').addEventListener('click', function(){ SFX.tap(); pieces(); });
    plain.forEach(function(){ slots.appendChild(h('<span class="slot"></span>')); });
    function mark(){ slots.querySelectorAll('.slot').forEach(function(s, i){ s.classList.toggle('next', i === pos); }); }
    mark();
    var uniq = plain.filter(function(c, i, a){ return a.indexOf(c) === i; });
    var extra = distractors(u, uniq.map(function(c){ return BY_CH[c]; }), uniq.length < 3 ? 2 : 1).map(function(k){ return L[k].ch; });
    shuffle(uniq.concat(extra)).forEach(function(c){
      var lk = BY_CH[c];
      var t = h('<button class="tile ar" aria-label="Letter '+L[lk].en+'">'+c+'</button>');
      t.addEventListener('click', function(){
        if (pos >= plain.length) return;
        tiles.querySelectorAll('.tile').forEach(function(x){ x.classList.remove('hint'); });
        if (c === plain[pos]) {
          var s = slots.children[pos]; s.textContent = c; s.classList.add('filled'); s.classList.remove('next');
          SFX.pop(); burst(s); if (c === 'ا') speak('آ', .8); else speak(L[lk].snd, SND);
          pos++; wrongHere = 0; mark();
          if (pos === plain.length) done();
        } else {
          mistakes++; wrongHere++;
          t.classList.remove('no'); void t.offsetWidth; t.classList.add('no');
          oops('مش ده… اسمعي تاني','Mish da… ismaʿi tāni','Not that one. Listen to this piece again', false);
          speakSeq([{t:pieceAt(pos),rate:.55},{t:pieceAt(pos),rate:.55}], null, null, 350);
          if (wrongHere >= 2) tiles.querySelectorAll('.tile').forEach(function(x){ if (x.textContent === plain[pos]) x.classList.add('hint'); });
        }
      });
      tiles.appendChild(t);
    });
    function done(){
      later(function(){
        SFX.whoosh();
        var out = el.querySelector('#out');
        out.innerHTML = '<div class="joined ar">'+kwHTML(R)+'</div><div class="en" style="font-size:18px;color:#6B5E52">'+R.syl.map(function(s){ return s.tr; }).join(' · ')+' → '+R.tr+'. The letters join up in a word</div>';
        tiles.style.visibility = 'hidden';
        praise(); confetti(50);
        later(function(){ sayThen('الحروف مسكت إيد بعض!','El-ḥurūf misikit īd baʿḍ!','The letters are holding hands!', 'f', function(){ soundOut(out, R); }); }, 900);
      }, 500);
      later(function(){ r++; r < rounds.length ? play() : finishLevel(u, li); }, 9500);
    }
    if (r === 0) later(function(){ sayThen('اسمعي الكلمة حتّة حتّة','Ismaʿi el-kilma ḥitta ḥitta','Listen to the word piece by piece, then tap the letters in order', 'b', pieces); }, 300);
    else later(pieces, 400);
  }
  play();
}

/* ---------- the show: Filfil and Toota make their entrance ----------
   A little stage: drumroll, the curtains open, Filfil bursts out of a gift box, Toota drops from the sky,
   letters rain down, then she can tap them before pressing play. Names are said inside normal
   sentences at normal speed (never split into slow syllables). Every visit, each friend greets her by the
   time of day, says their name, and says let's play. The first visit adds the gift box and letter rain.
   Every line here is in SHOW_LINES so voices/collect-lines.mjs gets a clip made for it. */
var SHOW = {
  hi_am:   ['f', 'صباح الخير! أنا فلفل!', 'Ṣabāḥ el-khēr! Ana Filfil!', 'Good morning! I\'m Filfil!'],
  hi_af:   ['f', 'مساء الخير! أنا فلفل!', 'Masāʾ el-khēr! Ana Filfil!', 'Good afternoon! I\'m Filfil!'],
  hi_pm:   ['f', 'مساء الخير! أنا فلفل!', 'Masāʾ el-khēr! Ana Filfil!', 'Good evening! I\'m Filfil!'],
  toota_am:['b', 'صباح الخير! وأنا توتة!', 'Ṣabāḥ el-khēr! W-ana Tūta!', 'Good morning! And I\'m Toota!'],
  toota_af:['b', 'مساء الخير! وأنا توتة!', 'Masāʾ el-khēr! W-ana Tūta!', 'Good afternoon! And I\'m Toota!'],
  toota_pm:['b', 'مساء الخير! وأنا توتة!', 'Masāʾ el-khēr! W-ana Tūta!', 'Good evening! And I\'m Toota!'],
  ready:   ['f', 'جاهزة؟ يلّا بينا!', 'Gahza? Yalla bīna!', 'Ready? Let\'s go!'],
  play:    ['b', 'يلّا نبدأ نلعب!', 'Yalla nibdaʾ nilʿab!', 'Let\'s start playing!']
};
var SHOW_LINES = Object.keys(SHOW).map(function(k){ return [SHOW[k][0], SHOW[k][1]]; });
var ABC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

function noise(t0, d, g){
  var a = audio(); if (!a || muted) return;
  var len = Math.floor(a.sampleRate * d), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
  for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  var src = a.createBufferSource(), gn = a.createGain(), f = a.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 1800; src.buffer = buf; gn.gain.value = g || .25;
  src.connect(f); f.connect(gn); gn.connect(a.destination); src.start(a.currentTime + t0);
}
var SHOWFX = {
  drum: function(){ for (var i = 0; i < 10; i++) { tone(110 + (i % 2) * 18, i * .06, .07, 'triangle', .05 + i * .018); noise(i * .06, .045, .05 + i * .015); } tone(80, .62, .4, 'sine', .3, 50); noise(.62, .35, .35); },
  curtain: function(){ noise(0, .9, .18); tone(200, 0, .8, 'sine', .06, 500); },
  wobble: function(){ [0, .22, .44].forEach(function(t){ tone(520, t, .1, 'square', .05, 380); }); },
  boom: function(){ tone(160, 0, .35, 'sine', .3, 40); noise(0, .3, .4); [1047,1319,1568,2093].forEach(function(f,i){ tone(f, .12 + i * .06, .25, 'triangle', .1); }); },
  flame: function(){ noise(0, .7, .4); tone(300, 0, .6, 'sawtooth', .04, 90); },
  whistle: function(){ tone(1900, 0, .9, 'sine', .1, 380); },
  boing: function(){ tone(180, 0, .28, 'sine', .25, 520); tone(260, .3, .22, 'sine', .15, 480); },
  letter: function(i){ tone(700 + i * 160, 0, .12, 'triangle', .14, 1100 + i * 160); }
};

function showTime(full){
  clearScene(); stopSpeech();
  var old = $('#show'); if (old) old.remove();
  var stars = ''; for (var i = 0; i < 40; i++) stars += '<i style="left:'+(Math.random()*100)+'%;top:'+(Math.random()*62)+'%;animation-delay:-'+(Math.random()*3).toFixed(2)+'s;--s:'+(2+Math.random()*4).toFixed(1)+'px"></i>';
  var sh = h('<div class="show" id="show" role="dialog" aria-label="Meet Filfil and Toota">' +
    '<div class="sky">'+stars+'</div><div class="beam l"></div><div class="beam r"></div>' +
    '<div class="floor"></div>' +
    '<div class="rain" aria-hidden="true"></div>' +
    '<div class="actor f" data-who="f"><div class="sb"></div><div class="nm ar"></div><div class="puff" aria-hidden="true"></div>'+buddyBtn('f')+'</div>' +
    '<div class="gift" aria-hidden="true"><div class="lid"></div><div class="box"></div></div>' +
    '<div class="actor b" data-who="b"><div class="sb"></div><div class="nm ar"></div><div class="hearts" aria-hidden="true"></div>'+buddyBtn('b')+'</div>' +
    '<div class="valance"></div><div class="curtain l"></div><div class="curtain r"></div>' +
    '<button class="skip" id="showSkip"><span class="ar">تخطّي</span> <span class="en">Skip</span></button>' +
    '<button class="go huge showgo" id="showGo" hidden><span class="ar">يلّا نلعب!</span><span class="en" style="font-size:20px">Let\'s play</span></button>' +
  '</div>');
  document.body.appendChild(sh);
  var hr = new Date().getHours(), P = (hr >= 4 && hr < 12) ? 'am' : (hr >= 12 && hr < 17) ? 'af' : 'pm';   /* صباح الخير before noon, مساء الخير after (af/pm differ only in English) */
  var ts = [], dead = false;
  function at(ms, fn){ ts.push(setTimeout(function(){ if (!dead) fn(); }, ms)); }
  function actor(who){ return sh.querySelector('.actor.' + who); }
  function line(k, next){
    var L0 = SHOW[k], who = L0[0], a = actor(who), sb = a.querySelector('.sb');
    sh.querySelectorAll('.sb.on').forEach(function(x){ x.classList.remove('on'); });
    sb.innerHTML = '<span class="ar">'+L0[1]+'</span><span class="en">'+L0[3]+'</span>';
    void sb.offsetWidth; sb.classList.add('on');
    speakSeq([{t: L0[1], rate: .85, who: who}], null, function(){ if (!dead && next) at(250, next); });
  }
  function name(who){
    var nm = actor(who).querySelector('.nm'), t = NAMES[who].ar;
    nm.innerHTML = '<span>'+t+'</span><small class="en">'+NAMES[who].en+'</small>';   /* one joined word (splitting it would break the letter joins) */
    t.split('').forEach(function(c, i){ at(i * 160, function(){ SHOWFX.letter(i); }); });
  }
  function move(who, cls, ms){ var b = actor(who).querySelector('.buddy'); b.classList.remove('happy','spin','dance','hot'); void b.offsetWidth; b.classList.add(cls); at(ms || 900, function(){ b.classList.remove(cls); }); }
  function flame(){ var p = actor('f').querySelector('.puff'); p.classList.remove('on'); void p.offsetWidth; p.classList.add('on'); SHOWFX.flame(); move('f', 'hot', 800); }
  function hearts(){
    var hb = actor('b').querySelector('.hearts'); hb.innerHTML = '';
    for (var i = 0; i < 6; i++) hb.appendChild(h('<i style="--x:'+(Math.random()*120-60)+'px;animation-delay:'+(i*.09)+'s">&#10084;</i>'));
    tone(1320, 0, .12, 'sine', .1); tone(1760, .1, .16, 'sine', .1);
  }
  function rainLetters(){
    var r = sh.querySelector('.rain'), cols = ['#F2994A','#F2C94C','#0F7C78','#E88FA8','#9ED27F','#FFFFFF','#C79BE0'];
    ABC.split('').forEach(function(c, i){
      var e = h('<i class="ar">'+c+'</i>');
      e.style.left = (3 + Math.random() * 94) + '%'; e.style.color = cols[i % cols.length];
      e.style.animationDelay = (Math.random() * 1.6) + 's'; e.style.setProperty('--r', (Math.random()*80-40)+'deg');
      e.style.fontSize = (40 + Math.random() * 40) + 'px';
      e.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); if (e.classList.contains('got')) return; e.classList.add('got'); SFX.pop(); burst(e); });
      r.appendChild(e);
    });
    SFX.fanfare(); confetti(60);
  }
  function starShower(){ for (var i = 0; i < 7; i++) at(i * 180, function(){ burst(null, innerWidth * (.15 + Math.random() * .7), innerHeight * (.15 + Math.random() * .4)); SFX.star(); }); }
  function openStage(){ SHOWFX.drum(); at(700, function(){ sh.classList.add('open'); SHOWFX.curtain(); }); }
  function finish(){
    if (dead) return; dead = true; ts.forEach(clearTimeout); stopSpeech();
    save.met = 3; persist();
    sh.classList.add('bye'); setTimeout(function(){ sh.remove(); }, 450);
    showMap(true);
  }
  function showPlay(){ var g = $('#showGo'); g.hidden = false; g.classList.add('ready'); }
  $('#showGo').addEventListener('click', function(){ SFX.fanfare(); finish(); });
  $('#showSkip').addEventListener('click', function(){ SFX.tap(); finish(); });
  sh.querySelectorAll('.actor .buddy').forEach(function(b){
    b.addEventListener('click', function(e){
      e.stopPropagation(); if (!sh.classList.contains('live')) return;
      var who = b.dataset.who, j = JOKES[who][Math.floor(Math.random() * JOKES[who].length)];
      if (who === 'f') move('f', 'spin', 800); else { hearts(); move('b', 'spin', 800); }
      burst(b); react(b); SHOWFX.boing();
      var sb = actor(who).querySelector('.sb');
      sh.querySelectorAll('.sb.on').forEach(function(x){ x.classList.remove('on'); });
      sb.innerHTML = '<span class="ar">'+j[0]+'</span><span class="en">'+j[2]+'</span>'; void sb.offsetWidth; sb.classList.add('on');
      speakSeq([{t: j[0], rate: .85, who: who}]);
    });
  });

  /* the same four lines every visit: each friend says good morning/afternoon and their name, then let's play */
  function greet(){
    line('toota_' + P, function(){
      if (full) { rainLetters(); starShower(); }
      move('f', 'dance', 2400); move('b', 'dance', 2400);
      line('ready', function(){
        SFX.fanfare(); confetti(80); sh.classList.add('live'); showPlay();
        line('play', full ? null : function(){ at(1400, finish); });   /* later visits go straight on to the map */
      });
    });
  }

  openStage();
  at(1100, function(){ sh.classList.add('gift-in'); SHOWFX.wobble(); });
  at(1800, function(){ sh.classList.add('in-f'); SHOWFX.boom(); burst(actor('f').querySelector('.buddy')); });
  at(2200, function(){ name('f'); move('f', 'happy');
    line('hi_' + P, function(){
      SHOWFX.whistle(); sh.classList.add('in-b'); at(750, function(){ SHOWFX.boing(); hearts(); name('b'); });
      at(950, greet);   /* Toota talks as soon as she lands */
    });
  });
}
function meetFriends(){ showTime(true); }

/* ---------- chrome ---------- */
$('#homeBtn').addEventListener('click', function(){ SFX.tap(); showMap(true); });
$('#soundBtn').addEventListener('click', function(){
  muted = !muted; this.setAttribute('aria-pressed', String(!muted));
  if (muted) stopSpeech(); else SFX.tap();
});
$('#labelBtn').addEventListener('click', function(){
  var on = document.body.classList.toggle('labels-off');
  this.setAttribute('aria-pressed', String(!on)); SFX.tap();
});
function openBook(){
  var book = $('#book'), all = [];
  UNITS.forEach(function(U){ U.stickers.forEach(function(s){ if (all.indexOf(s) < 0) all.push(s); }); });
  book.innerHTML = '';
  all.forEach(function(s){
    var has = save.stickers.indexOf(s) >= 0;
    book.appendChild(h('<div class="slotS '+(has?'':'locked')+'" aria-label="'+s+' sticker'+(has?'':' (not yet)')+'">'+PIC[s]+'</div>'));
  });
  $('#bookOv').hidden = false; SFX.tap();
}
$('#bookBtn').addEventListener('click', openBook);
$('#bookClose').addEventListener('click', function(){ $('#bookOv').hidden = true; SFX.tap(); });
$('#bookOv').addEventListener('click', function(e){ if (e.target === this) this.hidden = true; });
$('#startBtn').addEventListener('click', function(){
  audio(); SFX.fanfare(); pickVoice();
  var sp = $('#splash'); sp.classList.add('bye');
  setTimeout(function(){ sp.hidden = true; sp.classList.remove('bye'); }, 560);
  showTime(true);   /* the full show every visit (about 15 seconds, with a Skip button) */
});

window.HARFI_DEBUG = { startLevel: startLevel, LEVELS: LEVELS, UNITS: UNITS, L: L, W: W, VOW: VOW, PRAISE: PRAISE, JOKES: JOKES, pokeBuddy: pokeBuddy, meetFriends: meetFriends, showTime: showTime, SHOW_LINES: SHOW_LINES, showMap: showMap, save: save, theName: theName };
mountBuddies();
updateCounts();
showMap(false);
setTimeout(function(){ pickVoice(); if (!arVoice && !Object.keys(CLIPS).length) $('#voiceWarn').hidden = false; }, 1500);
})();
