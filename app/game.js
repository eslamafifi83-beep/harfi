(function(){
'use strict';
var $ = function(s){ return document.querySelector(s); };
var stage = $('#stage');

/* ---------- content ---------- */
var L = {
  alif:{ch:'ا', name:'ألف', en:'Alif', tr:'a',  snd:'أَ'},
  ba:  {ch:'ب', name:'باء', en:'Baa',  tr:'b',  snd:'بَ'},
  ta:  {ch:'ت', name:'تاء', en:'Taa',  tr:'t',  snd:'تَ'},
  tha: {ch:'ث', name:'ثاء', en:'Thaa', tr:'th', snd:'ثَ'}
};
var ORDER = ['alif','ba','ta','tha'];
var BALLOON_COLORS = ['#F2994A','#F2C94C','#7FC8C2','#E88FA8','#A99BE6','#9ED27F'];

var PIC = {
  duck:'<svg viewBox="0 0 260 220" aria-hidden="true"><ellipse cx="130" cy="202" rx="110" ry="12" fill="#CFE8E6"/><path d="M40 130 Q40 190 130 190 Q210 190 220 140 Q228 110 200 120 Q170 128 150 118 L60 118 Q40 118 40 130 Z" fill="#F2C94C" stroke="#C58F12" stroke-width="5"/><circle cx="80" cy="80" r="44" fill="#F2C94C" stroke="#C58F12" stroke-width="5"/><path d="M36 82 L8 92 L38 100 Z" fill="#F2994A" stroke="#C0651E" stroke-width="4" stroke-linejoin="round"/><circle cx="70" cy="70" r="8" fill="#2B2140"/><path d="M120 140 Q150 160 180 140" fill="none" stroke="#C58F12" stroke-width="5" stroke-linecap="round"/></svg>',
  apple:'<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="188" rx="62" ry="8" fill="#E9DCC4"/><path d="M100 62 C60 36 20 60 25 110 C30 160 70 186 100 172 C130 186 170 160 175 110 C180 60 140 36 100 62 Z" fill="#E0584B" stroke="#A8352B" stroke-width="5"/><path d="M100 62 C100 45 104 30 112 20" stroke="#6B4A2B" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M108 40 C125 20 150 22 158 30 C145 45 125 50 108 40 Z" fill="#5FA052" stroke="#3E7535" stroke-width="4"/><ellipse cx="62" cy="98" rx="10" ry="18" fill="#FFFFFF" opacity=".45"/></svg>',
  rabbit:'<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="190" rx="62" ry="8" fill="#E9DCC4"/><ellipse cx="78" cy="52" rx="14" ry="42" fill="#F7F3EE" stroke="#9C8F80" stroke-width="4"/><ellipse cx="78" cy="56" rx="6" ry="28" fill="#F2B8C6"/><ellipse cx="122" cy="52" rx="14" ry="42" fill="#F7F3EE" stroke="#9C8F80" stroke-width="4"/><ellipse cx="122" cy="56" rx="6" ry="28" fill="#F2B8C6"/><ellipse cx="100" cy="152" rx="55" ry="38" fill="#F7F3EE" stroke="#9C8F80" stroke-width="4"/><circle cx="100" cy="112" r="40" fill="#F7F3EE" stroke="#9C8F80" stroke-width="4"/><circle cx="86" cy="106" r="5.5" fill="#2B2140"/><circle cx="114" cy="106" r="5.5" fill="#2B2140"/><path d="M95 119 L105 119 L100 125 Z" fill="#E07A93"/><path d="M100 125 Q94 132 88 129 M100 125 Q106 132 112 129" stroke="#2B2140" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="76" cy="122" r="6" fill="#F2B8C6" opacity=".8"/><circle cx="124" cy="122" r="6" fill="#F2B8C6" opacity=".8"/></svg>',
  fox:'<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="190" rx="62" ry="8" fill="#E9DCC4"/><path d="M36 40 L78 86 L122 86 L164 40 L158 120 Q100 196 42 120 Z" fill="#E8833A" stroke="#A9531C" stroke-width="5" stroke-linejoin="round"/><path d="M46 58 L68 84 L52 92 Z" fill="#2B2140"/><path d="M154 58 L132 84 L148 92 Z" fill="#2B2140"/><path d="M48 124 Q100 196 152 124 Q124 142 100 142 Q76 142 48 124 Z" fill="#FFFFFF"/><circle cx="78" cy="112" r="6.5" fill="#2B2140"/><circle cx="122" cy="112" r="6.5" fill="#2B2140"/><circle cx="100" cy="150" r="8" fill="#2B2140"/></svg>',
  door:'<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="30" y="182" width="140" height="8" rx="4" fill="#E9DCC4"/><path d="M50 182 V82 A50 50 0 0 1 150 82 V182 Z" fill="#B7743A" stroke="#7A4A20" stroke-width="5"/><path d="M68 170 V88 A32 32 0 0 1 132 88 V170 Z" fill="none" stroke="#7A4A20" stroke-width="4" opacity=".55"/><circle cx="132" cy="132" r="8" fill="#F2C94C" stroke="#C58F12" stroke-width="3"/></svg>',
  dad:'<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M40 200 Q100 150 160 200 Z" fill="#0F7C78"/><circle cx="46" cy="110" r="11" fill="#E9B98C" stroke="#A8784F" stroke-width="4"/><circle cx="154" cy="110" r="11" fill="#E9B98C" stroke="#A8784F" stroke-width="4"/><circle cx="100" cy="106" r="54" fill="#E9B98C" stroke="#A8784F" stroke-width="4"/><path d="M47 98 Q48 48 100 48 Q152 48 153 98 Q140 72 100 74 Q60 72 47 98 Z" fill="#2B2140"/><circle cx="82" cy="104" r="6" fill="#2B2140"/><circle cx="118" cy="104" r="6" fill="#2B2140"/><path d="M74 126 Q88 114 100 124 Q112 114 126 126 Q112 134 100 129 Q88 134 74 126 Z" fill="#2B2140"/><path d="M84 142 Q100 154 116 142" stroke="#7A3B2B" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  steps:'<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M20 180 Q90 140 180 40" stroke="#E4D6BC" stroke-width="6" stroke-dasharray="3 14" fill="none" stroke-linecap="round"/><g transform="translate(70 142) rotate(35)" fill="#F2994A"><ellipse rx="15" ry="24"/><circle cx="-11" cy="-31" r="5.5"/><circle cx="-2" cy="-35" r="5.5"/><circle cx="7" cy="-33" r="5"/><circle cx="13" cy="-26" r="4.5"/></g><g transform="translate(128 88) rotate(35)" fill="#E88FA8"><ellipse rx="15" ry="24"/><circle cx="-11" cy="-31" r="5.5"/><circle cx="-2" cy="-35" r="5.5"/><circle cx="7" cy="-33" r="5"/><circle cx="13" cy="-26" r="4.5"/></g></svg>'
};

/* words split into letters (as written) and syllables (as spoken); on = which letters light up */
var W = {
  batta:  {pic:'duck',   word:'بطّة',   tr:'baṭṭa',   en:'duck',   first:'ba',   letters:['بَ','طّ','ة'],        syl:[{t:'بَطْ',on:[0,1],tr:'baṭ'},{t:'طَة',on:[1,2],tr:'ṭa'}]},
  tuffaha:{pic:'apple',  word:'تفّاحة', tr:'tuffāḥa', en:'apple',  first:'ta',   letters:['تُ','فّ','ا','حَ','ة'], syl:[{t:'تُفْ',on:[0,1],tr:'tuf'},{t:'فَا',on:[1,2],tr:'fā'},{t:'حَة',on:[3,4],tr:'ḥa'}]},
  arnab:  {pic:'rabbit', word:'أرنب',   tr:'arnab',   en:'rabbit', first:'alif', letters:['أَ','رْ','نَ','ب'],    syl:[{t:'أَرْ',on:[0,1],tr:'ar'},{t:'نَبْ',on:[2,3],tr:'nab'}]},
  thalab: {pic:'fox',    word:'ثعلب',   tr:'thaʿlab', en:'fox',    first:'tha',  letters:['ثَ','عْ','لَ','ب'],    syl:[{t:'ثَعْ',on:[0,1],tr:'thaʿ'},{t:'لَبْ',on:[2,3],tr:'lab'}]},
  baba:   {pic:'dad',    word:'بابا',   tr:'bāba',    en:'dad',    first:'ba',   letters:['ب','ا','ب','ا'],     syl:[{t:'بَا',on:[0,1],tr:'bā'},{t:'بَا',on:[2,3],tr:'ba'}]},
  bab:    {pic:'door',   word:'باب',    tr:'bāb',     en:'door',   first:'ba',   letters:['ب','ا','ب'],         syl:[{t:'بَا',on:[0,1],tr:'bā'},{t:'بْ',on:[2],tr:'b'}]},
  filfil: {pic:'filfil', word:'فلفل', tr:'Filfil', en:'his name (it means pepper)', first:'fa', letters:['فِ','لْ','فِ','لْ'], syl:[{t:'فِلْ',on:[0,1],tr:'fil'},{t:'فِلْ',on:[2,3],tr:'fil'}]},
  basbousa:{pic:'basbousa', word:'بسبوسة', tr:'Basbūsa', en:'her name (a sweet cake)', first:'ba', letters:['بَ','سْ','بُ','و','سَ','ة'], syl:[{t:'بَسْ',on:[0,1],tr:'bas'},{t:'بُو',on:[2,3],tr:'bū'},{t:'سَة',on:[4,5],tr:'sa'}]},
  tata:   {pic:'steps',  word:'تاتا',   tr:'tāta',    en:'baby steps', first:'ta', letters:['ت','ا','ت','ا'],   syl:[{t:'تَا',on:[0,1],tr:'tā'},{t:'تَا',on:[2,3],tr:'ta'}]}
};
function kwHTML(w){ return '<span class="kw">'+w.letters.map(function(c,i){ return '<span data-i="'+i+'">'+c+'</span>'; }).join('')+'</span>'; }
function lightUp(root, on){
  root.querySelectorAll('.kw span').forEach(function(s){
    var i = +s.dataset.i;
    s.classList.toggle('hot', on && on.indexOf(i) >= 0);
    s.classList.toggle('dim', !!on && on.indexOf(i) < 0);
  });
}
/* sound a word out: each syllable slowly with its letters lit, then the whole word */
function soundOut(root, w, done){
  var parts = w.syl.map(function(s){ return {t:s.t, rate:.6}; }).concat([{t:w.word, rate:.75}]);
  speakSeq(parts, function(i){ lightUp(root, i < w.syl.length ? w.syl[i].on : w.letters.map(function(_,k){ return k; })); },
    function(){ lightUp(root, null); if (done) done(); }, 450);
}
var EAR = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>';
function earBtn(ar, en){ return '<button class="earbtn"><span class="ar">'+ar+'</span><span class="en" style="font-size:15px;font-weight:600">'+en+'</span>'+EAR+'</button>'; }


/* ---------- the friends (original characters) ---------- */
var LIMBS = function(c){ return '<g stroke="'+c+'" stroke-width="5" stroke-linecap="round" fill="none"><path class="armL" d="M28 88 Q16 84 10 72"/><path class="armR" d="M92 88 Q104 84 110 72"/><path d="M48 128 L46 144"/><path d="M72 128 L74 144"/></g><g fill="#2B2140"><ellipse cx="42" cy="146" rx="9" ry="5"/><ellipse cx="78" cy="146" rx="9" ry="5"/></g><g fill="'+c+'"><circle cx="10" cy="70" r="6"/><circle cx="110" cy="70" r="6"/></g>'; };
var FACE = function(y){ return '<g class="eyes"><ellipse cx="47" cy="'+y+'" rx="9" ry="10" fill="#FFFFFF" stroke="#2B2140" stroke-width="2"/><ellipse cx="73" cy="'+y+'" rx="9" ry="10" fill="#FFFFFF" stroke="#2B2140" stroke-width="2"/><circle cx="49" cy="'+(y+2)+'" r="4.6" fill="#2B2140"/><circle cx="75" cy="'+(y+2)+'" r="4.6" fill="#2B2140"/><circle cx="50.5" cy="'+(y)+'" r="1.6" fill="#FFFFFF"/><circle cx="76.5" cy="'+(y)+'" r="1.6" fill="#FFFFFF"/></g>'; };
var BUDDY_SVG = {
  f: '<svg viewBox="0 0 120 152" aria-hidden="true">' + LIMBS('#3F8A33') +
     '<path d="M60 30 C95 30 101 64 95 96 C90 122 75 134 60 134 C45 134 30 122 25 96 C19 64 25 30 60 30 Z" fill="#E4432F" stroke="#A62A1C" stroke-width="4"/>' +
     '<path d="M36 56 C34 76 36 98 44 114" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/>' +
     '<path d="M38 36 Q60 20 82 36 Q72 44 60 41 Q48 44 38 36 Z" fill="#4E9A3E" stroke="#2F6B25" stroke-width="3" stroke-linejoin="round"/>' +
     '<path d="M60 30 C58 16 66 6 78 8 C84 9 86 16 80 18" stroke="#3F8A33" stroke-width="6" fill="none" stroke-linecap="round"/>' +
     '<path class="brow" d="M38 58 L54 55 M66 55 L82 58" stroke="#2B2140" stroke-width="3.5" stroke-linecap="round"/>' + FACE(68) +
     '<circle cx="38" cy="86" r="6" fill="#FF9C8A" opacity=".8"/><circle cx="82" cy="86" r="6" fill="#FF9C8A" opacity=".8"/>' +
     '<path class="smile" d="M46 88 Q60 104 74 88 Z" fill="#7A1E14"/><path class="smile" d="M50 90 L70 90" stroke="#FFFFFF" stroke-width="4"/>' +
     '<ellipse class="talk" cx="60" cy="94" rx="10" ry="8" fill="#7A1E14"/></svg>',
  b: '<svg viewBox="0 0 120 152" aria-hidden="true">' + LIMBS('#C98A1E') +
     '<rect x="22" y="36" width="76" height="96" rx="24" fill="#E9B04C" stroke="#B07A12" stroke-width="4"/>' +
     '<path d="M26 50 Q60 40 94 50" stroke="#F7D48A" stroke-width="7" fill="none" stroke-linecap="round"/>' +
     '<g stroke="#D39A33" stroke-width="2.5" opacity=".7"><path d="M30 112 L50 128 M70 128 L90 112 M26 96 L34 102 M94 96 L86 102"/></g>' +
     '<g transform="rotate(-18 60 30)"><ellipse cx="60" cy="30" rx="11" ry="16" fill="#F6E7C8" stroke="#C9A36B" stroke-width="3"/></g>' +
     '<path d="M84 38 L100 28 L100 48 Z M84 38 L68 28 L68 48 Z" fill="#E86A92" stroke="#B5476B" stroke-width="2.5" stroke-linejoin="round" transform="translate(6 -4) scale(.8) translate(20 8)"/><circle cx="89" cy="36" r="4" fill="#B5476B"/>' +
     '<path class="brow" d="M39 55 Q47 51 55 55 M65 55 Q73 51 81 55" stroke="#2B2140" stroke-width="3" stroke-linecap="round" fill="none"/>' + FACE(68) +
     '<path d="M38 59 l-4 -4 M42 57 l-2 -5 M82 59 l4 -4 M78 57 l2 -5" stroke="#2B2140" stroke-width="2" stroke-linecap="round"/>' +
     '<circle cx="37" cy="88" r="7" fill="#F28FA8" opacity=".75"/><circle cx="83" cy="88" r="7" fill="#F28FA8" opacity=".75"/>' +
     '<path class="smile" d="M49 90 Q60 101 71 90" stroke="#7A3B1E" stroke-width="4" fill="none" stroke-linecap="round"/>' +
     '<ellipse class="talk" cx="60" cy="94" rx="8" ry="7" fill="#7A3B1E"/></svg>'
};
PIC.filfil = BUDDY_SVG.f; PIC.basbousa = BUDDY_SVG.b;
function buddyBtn(who, extra){ return '<button class="buddy '+(who==='f'?'b1':'b2')+' '+(extra||'')+'" data-who="'+who+'" aria-label="'+NAMES[who].en+'">'+BUDDY_SVG[who]+'</button>'; }
var JOKES = {
  f: [['أنا فلفل… حرّاق!','Ana Filfil… ḥarrāʾ!','I\'m Filfil… super spicy!'],
      ['هههه! بتزغزغيني!','Hahaha! Bitzaghzaghīni!','Hee hee! That tickles!'],
      ['يلّا يا بطلة!','Yalla ya baṭala!','Come on, champion!'],
      ['فِل… فِل… فلفل!','Fil… fil… Filfil!','Fil… fil… Filfil! That\'s my name']],
  b: [['أنا بسبوسة… مسكّرة!','Ana Basbūsa… misakkara!','I\'m Basbousa… so sweet!'],
      ['إنتي شاطرة زيّي!','Inti shaṭra zayyi!','You\'re clever like me!'],
      ['بَس… بو… سة!','Bas… bū… sa!','Bas… bū… sa! Say my name!'],
      ['يا سلام عليكي!','Ya salām ʿalēki!','Wow, look at you!']]
};
function pokeBuddy(btn){
  var who = btn.dataset.who, j = JOKES[who][Math.floor(Math.random()*JOKES[who].length)];
  btn.classList.remove('happy','spin'); void btn.offsetWidth; btn.classList.add(Math.random() < .5 ? 'happy' : 'spin');
  setTimeout(function(){ btn.classList.remove('happy','spin'); }, 900);
  tone(who === 'f' ? 700 : 500, 0, .25, 'sine', .14, who === 'f' ? 1400 : 900); burst(btn);
  say(j[0], j[1], j[2], true, who);
}
document.addEventListener('click', function(e){ var b = e.target.closest && e.target.closest('.buddy'); if (b && !b.closest('.friend')) pokeBuddy(b); });
function mountBuddies(){
  $('#buddies').innerHTML = buddyBtn('f') + buddyBtn('b');
  $('#splashBuddies').innerHTML = buddyBtn('f') + buddyBtn('b');
}

var LEVELS = [
  {id:'sounds', ar:'الأصوات',  tr:'el-aṣwāt',   en:'Sounds',      glyph:'ب',   sticker:'rabbit'},
  {id:'say',    ar:'قولي معايا', tr:'ʾūli maʿāya', en:'Say it with me', glyph:'SAY', sticker:'steps'},
  {id:'vowels', ar:'الحركات',  tr:'el-ḥarakāt', en:'Short vowels',glyph:'بُ',  sticker:'duck'},
  {id:'first',  ar:'أوّل صوت', tr:'awwel ṣōt',  en:'First sound', glyph:'بـ',  sticker:'apple'},
  {id:'trace',  ar:'اكتبي',    tr:'iktibi',     en:'Write',       glyph:'✎',   sticker:'door'},
  {id:'words',  ar:'كلمات',    tr:'kilmāt',     en:'Words',       glyph:'باب', sticker:'dad'}
];

var PRAISE = [
  ['شاطرة!','Shaṭra!','Clever girl!'],
  ['برافو عليكي!','Brāvo ʿalēki!','Bravo!'],
  ['جامدة!','Gamda!','Awesome!'],
  ['الله عليكي!','Allah ʿalēki!','Lovely!'],
  ['هايل!','Hāyel!','Brilliant!']
];

/* ---------- saved progress (per device, optional) ---------- */
var save = {done:{}, stickers:[]};
try { var raw = localStorage.getItem('harfi-v1'); if (raw) save = JSON.parse(raw) || save; } catch(e) {}
function persist(){ try { localStorage.setItem('harfi-v1', JSON.stringify(save)); } catch(e) {} updateCounts(); }
function updateCounts(){
  var s = 0; for (var k in save.done) s += save.done[k];
  $('#starCount').textContent = s;
  $('#stickerCount').textContent = save.stickers.length;
}

/* ---------- sound ---------- */
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
var arVoice = null;
function pickVoice(){
  if (!('speechSynthesis' in window)) return;
  var vs = speechSynthesis.getVoices() || [];
  arVoice = vs.filter(function(v){ return /^ar[-_]EG/i.test(v.lang); })[0] || vs.filter(function(v){ return /^ar/i.test(v.lang); })[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
var seqToken = 0, talkTimer = null, speaker = 'b';
var VOICE = {f:{pitch:1.5, rate:1.05}, b:{pitch:1.25, rate:1}};
function talking(on){
  clearTimeout(talkTimer);
  document.querySelectorAll('.buddy.talking').forEach(function(b){ b.classList.remove('talking'); });
  if (on) document.querySelectorAll('.buddy[data-who="'+speaker+'"]').forEach(function(b){ b.classList.add('talking'); });
}
/* speak one piece; calls done() when finished (or after a safe timeout if the device never reports it) */
/* ---------- recorded voices ----------
   Clips are generated into audio/ by voices/generate.mjs (Azure Egyptian voices).
   audio/index.json maps "speaker|speed|text" -> file. Anything without a clip falls back to the device voice. */
var CLIPS = {}, MISSING = {};
try { fetch('audio/index.json').then(function(r){ return r.ok ? r.json() : {}; }).then(function(j){ CLIPS = j || {}; }).catch(function(){}); } catch(e) {}
function speedOf(rate){ rate = rate || .85; return rate <= .62 ? 'slow' : (rate <= .8 ? 'calm' : 'normal'); }
function clean(t){ return String(t).replace(/[!؟?…]/g,' ').replace(/\s+/g,' ').trim(); }
function clipFor(who, rate, text){
  var t = clean(text), sp = speedOf(rate), other = who === 'f' ? 'b' : 'f';
  return CLIPS[who+'|'+sp+'|'+t] || CLIPS[other+'|'+sp+'|'+t] || CLIPS[who+'|calm|'+t] || CLIPS[other+'|calm|'+t] || null;
}
window.HARFI_LOG = window.HARFI_LOG || null;   /* set to [] to record every line spoken (used by voices/collect-lines.mjs) */
window.harfiMissing = function(){ return Object.keys(MISSING); };  /* lines still using the device voice */
var currentAudio = null;
function utter(text, rate, done, keep){
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
      var a = new Audio('audio/' + file); currentAudio = a;
      a.onplay = function(){ talking(true); };
      a.onended = fin; a.onerror = fin;
      talking(true);
      var p = a.play(); if (p && p.catch) p.catch(fin);
      setTimeout(fin, 8000);
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
function speak(text, rate){ seqToken++; if (currentAudio) { try { currentAudio.pause(); } catch(e) {} } utter(text, rate); }
/* speak pieces one after another; onEach(i) fires as piece i starts; gap in ms between pieces */
/* show a line in the bubble, speak it, then run next() */
function sayThen(ar, tr, en, who, next){ say(ar, tr, en, false, who); var sp = speaker; speakSeq([{t:ar, rate:.85}], null, function(){ speaker = sp; if (next) next(); }); }
function speakSeq(parts, onEach, done, gap){
  var my = ++seqToken, i = 0;
  if (currentAudio) { try { currentAudio.pause(); } catch(e) {} }
  if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} }
  function step(){
    if (my !== seqToken) return;
    if (i >= parts.length) { if (done) done(); return; }
    var p = parts[i];
    if (onEach) onEach(i);
    utter(p.t, p.rate || .7, function(){ i++; setTimeout(step, gap == null ? 350 : gap); }, true);
  }
  step();
}
function stopSpeech(){ seqToken++; talking(false); if (currentAudio) { try { currentAudio.pause(); } catch(e) {} } if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} } }

/* ---------- Filfil, Basbousa and feedback ---------- */
var bubble = $('#bubble');
var NAMES = {f:{ar:'فلفل', en:'Filfil'}, b:{ar:'بسبوسة', en:'Basbousa'}};
var nextWho = 'b';
function say(ar, tr, en, talk, who){
  who = who || nextWho; nextWho = who === 'f' ? 'b' : 'f'; speaker = who;
  bubble.className = 'bubble ' + who;
  bubble.innerHTML = '<span class="who">'+NAMES[who].ar+'</span><span class="ar">'+ar+'</span>' + (tr ? '<span class="tr en">'+tr+'</span>' : '') + (en ? '<span class="en">'+en+'</span>' : '');
  bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
  if (talk !== false) speak(ar, .85);
}
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
  if (Math.random() < .25) { mood('spin'); SFX.good(); var j = Math.floor(Math.random()*PRAISE.length); say(PRAISE[j][0], PRAISE[j][1], PRAISE[j][2]); if (el) burst(el); return; }
  var i; do { i = Math.floor(Math.random()*PRAISE.length); } while (i === lastPraise);
  lastPraise = i;
  SFX.good(); mood('happy'); say(PRAISE[i][0], PRAISE[i][1], PRAISE[i][2]);
  if (el) burst(el);
}
function oops(ar, tr, en){ SFX.bad(); mood('sad'); say(ar, tr, en); }

var fx = $('#fx');
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(n){
  if (reduce) return;
  var cols = ['#F2994A','#F2C94C','#0F7C78','#E88FA8','#5B4BB0','#9ED27F'];
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

var mistakes = 0;
function starsFor(m){ return m <= 1 ? 3 : (m <= 4 ? 2 : 1); }

/* ---------- map ---------- */
function unlockedCount(){ var n = 0; for (var i=0;i<LEVELS.length;i++){ if (save.done[LEVELS[i].id]) n++; else break; } return n; }
function showMap(greet){
  var el = scene(task('رحلة الحروف','Riḥlet el-ḥurūf','Letter journey · unit 1: ا ب ت ث') + '<div class="map" id="map"><svg class="path" id="mapPath" aria-hidden="true"></svg></div>');
  var map = el.querySelector('#map'), open = unlockedCount();
  LEVELS.forEach(function(lv, i){
    var state = save.done[lv.id] ? 'done' : (i === open ? 'open' : 'locked');
    var stars = '';
    if (state === 'done') { stars = '<span class="stars">'; for (var s=0;s<3;s++) stars += '<span style="width:20px;opacity:'+(s<save.done[lv.id]?1:.25)+'">'+STAR+'</span>'; stars += '</span>'; }
    var glyph = lv.glyph === 'SAY' ? '<svg width="56%" height="56%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" stroke-width="3"/></svg>' : lv.glyph === '✎' ?'<svg width="52%" height="52%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/><path d="M13 6l5 5"/></svg>' : '<span class="ar">'+lv.glyph+'</span>';
    var b = h('<button class="node '+state+'" aria-label="'+lv.en+(state==='locked'?' (locked)':'')+'"><span class="disc">'+glyph+'</span><span class="lbl"><span class="ar">'+lv.ar+'</span><span class="en">'+lv.en+'</span></span>'+stars+'</button>');
    b.addEventListener('click', function(){
      if (state === 'locked') { SFX.bad(); mood('sad'); say('لسّه مقفولة','Lissa ma\'fūla','Not yet! Finish the orange one first'); return; }
      SFX.whoosh(); startLevel(i);
    });
    map.appendChild(b);
  });
  function layout(){
    var w = map.clientWidth, hgt = map.clientHeight, wide = w > 620;
    var P = wide ? [[89,30],[73,70],[57,30],[41,70],[25,30],[10,70]] : [[70,12],[30,27],[70,42],[30,57],[70,72],[32,88]];
    var nodes = map.querySelectorAll('.node');
    var pts = P.map(function(p){ return [p[0]/100*w, p[1]/100*hgt]; });
    nodes.forEach(function(n, i){ n.style.left = P[i][0]+'%'; n.style.top = P[i][1]+'%'; });
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
  if (open >= LEVELS.length) say('خلّصتي كل الألعاب!','Khallaṣti kull el-alʿāb!','You finished them all! Play any level again.', greet);
  else say(open === 0 ? 'يلّا نبدأ! دوسي على البرتقالي' : 'اختاري اللعبة الجاية', open === 0 ? 'Yalla nibda\'! Dūsi ʿal-burtu\'āni' : 'Ikhtāri el-liʿba el-gayya', open === 0 ? 'Let\'s start! Tap the orange circle' : 'Pick the next game', greet);
}

function startLevel(i){
  mistakes = 0;
  var id = LEVELS[i].id;
  if (id === 'sounds') meetLetters(i);
  else if (id === 'say') sayGame(i);
  else if (id === 'vowels') vowelGame(i);
  else if (id === 'first') firstSound(i);
  else if (id === 'trace') traceGame(i);
  else wordGame(i);
}

function finishLevel(i){
  var lv = LEVELS[i], st = starsFor(mistakes);
  save.done[lv.id] = Math.max(save.done[lv.id] || 0, st);
  if (save.stickers.indexOf(lv.sticker) < 0) save.stickers.push(lv.sticker);
  persist();
  var el = scene('<div class="reward"><div class="bigstars" id="bs"></div><h2 class="ar">برافو عليكي!</h2><div class="sub en">Brāvo ʿalēki! · Level done: '+lv.en+'</div><div class="sticker">'+PIC[lv.sticker]+'</div><div class="sub"><span class="ar" style="font-weight:800;color:#2B2140">كسبتي ستيكر!</span> <span class="en">You won a sticker</span></div></div>');
  SFX.fanfare(); confetti(90); mood('dance');
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
  if (i < LEVELS.length-1) footButton('اللعبة الجاية','Next level', function(){ startLevel(i+1); }, 'ready');
  else footButton('على الخريطة','Back to map', function(){ showMap(true); }, 'ready');
}

/* ---------- level 1: meet the letters, then pop balloons ---------- */
function meetLetters(li){
  var el = scene(task('اتعرّفي على الحروف','Itʿarrafi ʿala el-ḥurūf','Meet the letters. Tap each one to hear it') + '<div class="cards" id="cards"></div>');
  var seen = {}, cards = el.querySelector('#cards');
  ORDER.forEach(function(k){
    var l = L[k];
    var c = h('<button class="lcard" aria-label="Letter '+l.en+'"><span class="seen">'+CHECK+'</span><span class="big ar">'+l.ch+'</span><span class="nm"><span class="ar">'+l.name+'</span><span class="en">'+l.en+' · "'+l.tr+'"</span></span></button>');
    c.addEventListener('click', function(){
      c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
      SFX.tap(); speakSeq([{t:l.name, rate:.8},{t:l.snd, rate:.6},{t:l.snd, rate:.6},{t:l.snd, rate:.6}], function(i){ if (i) { c.classList.remove('play'); void c.offsetWidth; c.classList.add('play'); } }, null, 300);
      burst(c.querySelector('.big'));
      if (!seen[k]) { seen[k] = true; c.classList.add('was'); }
      if (Object.keys(seen).length === 4) { next.disabled = false; next.classList.add('ready'); mood('happy'); sayThen('شاطرة! يلّا نلعب بالبلالين','Shaṭra! Yalla nilʿab bil-balalīn','Great! Now let\'s pop balloons'); }
    });
    cards.appendChild(c);
  });
  var next = footButton('يلّا','Next', function(){ popGame(li, 0); });
  next.disabled = true;
  say('دوسي على كل حرف','Dūsi ʿala kull ḥarf','Tap every letter to hear its sound');
}

function popGame(li, round){
  var targets = ['ba','ta','alif'];
  var tk = targets[round], T = L[tk], NEED = 4;
  var el = scene(dotsHTML(targets.length, round) + '<div class="target"><div class="task"><span class="ar">فرقعي بلالين '+T.name+'</span><span class="en">Farqaʿi balalīn '+T.en+' · Pop the '+T.en+' balloons</span></div><div class="tg ar">'+T.ch+'</div><button class="listen" id="lis" style="width:72px;height:72px" aria-label="Hear the sound">'+SPEAKER+'</button><div class="dots" id="cnt"></div></div><div class="sky" id="sky"></div>');
  var lis = el.querySelector('#lis');
  function hearT(){ lis.classList.remove('ping'); void lis.offsetWidth; lis.classList.add('ping'); speakSeq([{t:T.snd,rate:.6},{t:T.snd,rate:.6}], null, null, 250); }
  lis.addEventListener('click', hearT);
  var sky = el.querySelector('#sky'), cnt = el.querySelector('#cnt');
  [[8,12,120],[60,22,160],[30,48,90],[78,60,130]].forEach(function(c){ sky.appendChild(h('<i class="cloud" style="left:'+c[0]+'%;top:'+c[1]+'%;width:'+c[2]+'px;height:'+(c[2]*.38)+'px"></i>')); });
  var got = 0, balloons = [], run = true, last = performance.now(), spawnT = 0, sinceTarget = 0;
  function drawCount(){ var s=''; for (var i=0;i<NEED;i++) s += '<i class="'+(i<got?'on':'')+'"></i>'; cnt.innerHTML = s; }
  drawCount();
  function spawn(){
    var W = sky.clientWidth, H = sky.clientHeight;
    var size = Math.max(70, Math.min(110, W/7));
    var isT = sinceTarget >= 2 || Math.random() < .45;
    var key = isT ? tk : shuffle(ORDER.filter(function(k){ return k !== tk; }))[0];
    sinceTarget = isT ? 0 : sinceTarget + 1;
    var b = h('<button class="balloon" aria-label="Balloon '+L[key].en+'" style="--s:'+size+'px;--c:'+BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)]+'"><span class="b ar">'+L[key].ch+'</span><span class="knot"></span></button>');
    var o = {el:b, key:key, x: 10 + Math.random()*(W - size - 20), y: H + 10, v: 55 + Math.random()*35, ph: Math.random()*6, dead:false};
    b.addEventListener('pointerdown', function(e){
      e.preventDefault(); if (o.dead || !run) return;
      if (o.key === tk) {
        o.dead = true; b.classList.add('popped'); SFX.pop(); burst(b); speak(T.snd, .8);
        got++; drawCount(); mood('happy');
        setTimeout(function(){ b.remove(); }, 300);
        if (got >= NEED) { run = false; later(function(){ praise(); confetti(40); }, 250); later(function(){ round+1 < targets.length ? popGame(li, round+1) : soundMatch(li); }, 1900); }
        else if (got === 2) say('كمان! كمّلي','Kamān! Kammili','More! Keep going', false);
      } else {
        mistakes++;
        b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
        oops('ده حرف ال'+L[o.key].name.replace(/^ال/,'')+'! دوّري على ال'+T.name, 'Da ḥarf el-'+L[o.key].en+'! Dawwari ʿal '+T.en, 'That\'s '+L[o.key].en+'. Look for '+T.en+' '+T.ch);
      }
    });
    sky.appendChild(b); balloons.push(o);
  }
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
  var raf = requestAnimationFrame(frame);
  cleanup = function(){ run = false; cancelAnimationFrame(raf); };
  say('فرقعي بلالين '+T.name+' بس!', 'Farqaʿi balalīn '+T.en+' bass!', 'Pop only the balloons that say "'+T.tr+'". Tap the speaker to hear it', false);
  speakSeq([{t:'فرقعي بلالين '+T.name, rate:.85},{t:T.snd,rate:.6},{t:T.snd,rate:.6}], null, null, 300);
}

/* level 1, part 3: sound only, no picture help */
function soundMatch(li){
  var rounds = shuffle(ORDER), r = 0;
  function play(){
    var k = rounds[r], l = L[k];
    var opts = shuffle([k].concat(shuffle(ORDER.filter(function(x){ return x !== k; })).slice(0,2)));
    var el = scene(dotsHTML(rounds.length, r) + task('مين بيقول الصوت ده؟','Mīn biy\'ūl eṣ-ṣōt da?','Which letter makes this sound?') +
      '<div class="stage"><div class="row"><button class="listen" id="lis" aria-label="Hear the sound again">'+SPEAKER+'</button></div><div class="choices" id="ch"></div></div>');
    var lis = el.querySelector('#lis'), ch = el.querySelector('#ch'), locked = false;
    function hear(){ lis.classList.remove('ping'); void lis.offsetWidth; lis.classList.add('ping'); speakSeq([{t:l.snd,rate:.6},{t:l.snd,rate:.6}], null, null, 300); }
    lis.addEventListener('click', hear);
    opts.forEach(function(o){
      var b = h('<button class="choice" aria-label="Letter '+L[o].en+'"><span class="big ar" style="color:#2B2140">'+L[o].ch+'</span><span class="sm en">"'+L[o].tr+'"</span></button>');
      b.addEventListener('click', function(){
        if (locked) return;
        if (o === k) {
          locked = true; b.classList.add('right'); praise(b.querySelector('.big'));
          later(function(){ speakSeq([{t:l.snd,rate:.6},{t:l.name,rate:.75}], null, null, 250); }, 900);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(li); }, 2300);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); SFX.bad(); mood('sad');
          say('ده بيقول '+L[o].snd+'… اسمعي تاني', 'Da biy\'ūl "'+L[o].tr+'"… ismaʿi tāni', 'That one says "'+L[o].tr+'". Listen again', false);
          speakSeq([{t:L[o].snd,rate:.6}], null, function(){ later(hear, 500); });
        }
      });
      ch.appendChild(b);
    });
    if (r === 0) later(function(){ sayThen('اسمعي بس… من غير ما تشوفي','Ismaʿi bass… min gheir ma tshūfi','Just listen, then tap the letter', null, hear); }, 300);
    else later(hear, 400);
  }
  play();
}

/* level 2: listen and say (repeat after Qamar) */
function sayGame(li){
  var items = [
    {show:'بَ', parts:[{t:'بَ',rate:.6}], tr:'ba', en:'the sound of ب'},
    {show:'تَ', parts:[{t:'تَ',rate:.6}], tr:'ta', en:'the sound of ت'},
    {show:'ثَ', parts:[{t:'ثَ',rate:.6}], tr:'tha', en:'tongue between your teeth'},
    {w:W.baba}, {w:W.filfil}, {w:W.basbousa}
  ];
  var r = 0;
  function play(){
    var it = items[r], w = it.w;
    var el = scene(dotsHTML(items.length, r) + task('اسمعي وقولي معايا','Ismaʿi w-ʾūli maʿāya','Listen, then say it out loud') +
      '<div class="stage phase-listen" id="st"><div class="row"><div class="saycard" id="card">' +
        (w ? kwHTML(w) : '<span class="kw"><span data-i="0">'+it.show+'</span></span>') +
        '<span class="tr en">'+(w ? w.syl.map(function(s){ return s.tr; }).join(' · ')+'  →  '+w.tr+' ('+w.en+')' : '"'+it.tr+'" · '+it.en)+'</span>' +
      '</div></div><div class="turn turnbox" id="turn"></div></div>');
    var st = el.querySelector('#st'), card = el.querySelector('#card'), turn = el.querySelector('#turn');
    /* Basbousa says it slowly (in pieces), then Filfil says it once, then it's her turn */
    function friendsSay(done){
      st.classList.add('phase-listen');
      var all = w ? w.letters.map(function(_,k){ return k; }) : [0];
      var word = w ? w.word : it.show, trw = w ? w.tr : it.tr;
      say(word, trw, w ? 'Basbousa says it in little pieces' : 'Basbousa says the sound', false, 'b');
      function filfilTurn(){
        say(word, trw, 'Now Filfil says it', false, 'f');
        speakSeq([{t: w ? w.word : it.parts[0].t, rate:.75}], function(){ lightUp(card, all); }, function(){ lightUp(card, null); if (done) done(); });
      }
      if (w) soundOut(card, w, function(){ setTimeout(filfilTurn, 350); });
      else speakSeq(it.parts.concat(it.parts), function(){ lightUp(card, [0]); }, function(){ lightUp(card, null); setTimeout(filfilTurn, 350); }, 400);
    }
    function herTurn(){
      st.classList.remove('phase-listen'); SFX.dot(); mood('happy');
      sayThen('دورك! قولي '+(w ? w.word : it.show), 'Dōrik! ʾūli '+(w ? w.tr : it.tr), w === W.filfil ? 'Your turn! Say Filfil\'s name' : w === W.basbousa ? 'Your turn! Say Basbousa\'s name' : 'Your turn! Say it out loud');
      document.querySelectorAll('#buddies .buddy').forEach(function(b){ b.style.transform = 'rotate(-8deg) translateY(-4px)'; });
      later(function(){ document.querySelectorAll('#buddies .buddy').forEach(function(b){ b.style.transform = ''; }); }, 3100);
      turn.innerHTML = '<div class="ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill="none" stroke="#F3E6CE" stroke-width="8"/><circle class="run" cx="42" cy="42" r="38" fill="none" stroke="#F2994A" stroke-width="8" stroke-dasharray="239" stroke-linecap="round"/></svg><span class="face"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2B2140" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".6" fill="#2B2140"/><circle cx="15" cy="10" r=".6" fill="#2B2140"/><ellipse cx="12" cy="15.5" rx="2.4" ry="2" fill="#2B2140"/></svg></span></div><span class="ar">دورك!</span><span class="en" style="font-size:18px;color:#6B5E52">Your turn</span>';
      later(compare, 3200);
    }
    function compare(){
      sayThen('اسمعي تاني… زيّك؟','Ismaʿi tāni… zayyik?','Listen again. Did it sound like you?', null, function(){ friendsSay(function(){
        st.classList.remove('phase-listen');
        turn.innerHTML = '';
        var yes = h('<button class="go teal"><span class="ar">قلتها!</span><span class="en" style="font-size:17px">I said it</span></button>');
        var again = h('<button class="ghost"><span class="ar">تاني</span><span class="en" style="font-size:16px">Again</span></button>');
        yes.addEventListener('click', function(){
          praise(card); confetti(30);
          later(function(){ r++; r < items.length ? play() : finishLevel(li); }, 1700);
          yes.disabled = true;
        });
        again.addEventListener('click', function(){ SFX.tap(); turn.innerHTML = ''; friendsSay(herTurn); });
        turn.appendChild(again); turn.appendChild(yes);
      }); });
    }
    later(function(){ sayThen('اسمعي كويس', 'Ismaʿi kwayyis', w ? 'Listen: the word in little pieces, then all together' : 'Listen to the sound', null, function(){ friendsSay(herTurn); }); }, r === 0 ? 600 : 300);
  }
  play();
}

/* ---------- level 2: short vowels ---------- */
var VOW = [
  {k:'a', mark:'َ', name:'فتحة', en:'fatḥa', col:'#0F7C78'},
  {k:'i', mark:'ِ', name:'كسرة', en:'kasra', col:'#B5476B'},
  {k:'u', mark:'ُ', name:'ضمّة', en:'ḍamma', col:'#5B4BB0'}
];
function vowelGame(li){
  var rounds = shuffle(['ba','ta'].reduce(function(a, lk){ return a.concat(VOW.map(function(v){ return {lk:lk, v:v}; })); }, []));
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
          later(function(){ speak(syl(v), .7); }, 900);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(li); }, 2100);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          SFX.bad(); mood('sad');
          say('ده '+trs(v)+'… اسمعي تاني', 'Da '+trs(v)+'… ismaʿi tāni', 'That one says "'+trs(v)+'". Listen again', false);
          speak(syl(v), .7); later(hear, 1300);
        }
      });
      ch.appendChild(b);
    });
    later(hear, r === 0 ? 1800 : 500);
    if (r === 0) say('العلامة الصغيّرة بتغيّر الصوت','El-ʿalāma eṣ-ṣughayyara bitghayyar eṣ-ṣōt','The little mark changes the sound: a, i, u');
  }
  play();
}

/* ---------- level 4: first sound ---------- */
function firstSound(li){
  var rounds = shuffle([W.batta, W.tuffaha, W.arnab, W.thalab]).concat([W.basbousa]);
  var r = 0;
  function play(){
    var R = rounds[r];
    var opts = shuffle([R.first].concat(shuffle(ORDER.filter(function(k){ return k !== R.first; })).slice(0,2)));
    var el = scene(dotsHTML(rounds.length, r) + task('الكلمة دي بتبدأ بأنهي صوت؟','El-kilma di bitibda\' b-anhi ṣōt?','Which sound does this word start with?') +
      '<div class="stage"><div class="row"><button class="pic" id="pic" aria-label="Hear the word">'+PIC[R.pic]+'<span class="word ar" id="word"><span class="q">؟</span></span><span class="en" style="font-size:16px;color:#6B5E52">'+R.en+'</span></button>'+earBtn('أوّل صوت','First sound')+'</div><div class="choices" id="ch"></div></div>');
    var ch = el.querySelector('#ch'), locked = false, pic = el.querySelector('#pic'), onsetBtn = el.querySelector('.earbtn');
    var onset = R.syl[0].t;
    /* the word, then its first piece twice, slowly: "baṭṭa… baṭ… baṭ" */
    function prompt(){ speakSeq([{t:R.word,rate:.75},{t:onset,rate:.55},{t:onset,rate:.55}], null, null, 400); }
    pic.addEventListener('click', function(){ SFX.tap(); speak(R.word, .75); });
    onsetBtn.addEventListener('click', function(){ SFX.tap(); speakSeq([{t:onset,rate:.5},{t:onset,rate:.5}], null, null, 350); });
    opts.forEach(function(k){
      var l = L[k];
      var b = h('<button class="choice" aria-label="Letter '+l.en+'"><span class="big ar" style="color:#2B2140">'+l.ch+'</span><span class="sm en">"'+l.tr+'"</span></button>');
      b.addEventListener('click', function(){
        if (locked) return;
        if (k === R.first) {
          locked = true; b.classList.add('right'); praise(b.querySelector('.big'));
          var wd = el.querySelector('#word'); wd.innerHTML = kwHTML(R);
          later(function(){ lightUp(wd, [0]); speakSeq([{t:l.snd,rate:.6}], null, function(){ soundOut(wd, R); }); }, 1100);
          later(function(){ r++; r < rounds.length ? play() : finishLevel(li); }, 6800);
        } else {
          mistakes++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          SFX.bad(); mood('sad');
          say('ده بيقول '+l.snd+'… اسمعي أوّل الكلمة', 'Da biy\'ūl "'+l.tr+'"… ismaʿi awwel el-kilma', 'That says "'+l.tr+'". Listen to the start: "'+R.syl[0].tr+'…"', false);
          speakSeq([{t:l.snd,rate:.6},{t:onset,rate:.55},{t:onset,rate:.55}], null, null, 450);
        }
      });
      ch.appendChild(b);
    });
    if (r === 0) later(function(){ sayThen('اسمعي أوّل صوت في الكلمة','Ismaʿi awwel ṣōt fil-kilma','Listen to the very first sound of the word', null, prompt); }, 300);
    else later(prompt, 400);
  }
  play();
}

/* ---------- level 4: tracing ---------- */
function traceGame(li){
  var rounds = [
    {lk:'ba', dots:[[360,362]]},
    {lk:'ta', dots:[[330,212],[395,212]]}
  ];
  var r = 0;
  function play(){
    var R = rounds[r], l = L[R.lk];
    var D = 'M600 150 Q612 280 520 280 L210 280 Q110 280 112 186';
    var el = scene(dotsHTML(rounds.length, r) + task('اكتبي حرف ال'+l.name.replace(/^ال/,''),'Iktibi ḥarf el-'+l.en,'Trace '+l.en+' with your finger, right to left') +
      '<div class="trace-wrap"><div class="board" id="board"><svg id="tsv" viewBox="0 0 720 440" role="img" aria-label="Trace the letter '+l.en+'">' +
        '<path d="'+D+'" fill="none" stroke="#F1E9DA" stroke-width="70" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path id="guide" d="'+D+'" fill="none" stroke="#C9BBA2" stroke-width="6" stroke-dasharray="3 18" stroke-linecap="round"/>' +
        '<path id="ink" d="'+D+'" fill="none" stroke="#0F7C78" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g id="dotsG"></g>' +
        '<g id="startG"><circle cx="600" cy="150" r="34" fill="#2E9E5B" opacity=".25"><animate attributeName="r" values="30;46;30" dur="1.4s" repeatCount="indefinite"/></circle><circle cx="600" cy="150" r="26" fill="#2E9E5B"/><path d="M586 150 h-40 m12 -12 l-12 12 l12 12" stroke="#2E9E5B" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<circle id="pen" cx="600" cy="150" r="20" fill="#F2994A" stroke="#FFFFFF" stroke-width="5" opacity="0"/>' +
      '</svg></div><div class="side"><div class="model"><span class="big ar">'+l.ch+'</span><span class="en" style="color:#6B5E52">'+l.en+'</span></div></div></div>');
    var svg = el.querySelector('#tsv'), ink = el.querySelector('#ink'), guide = el.querySelector('#guide'), pen = el.querySelector('#pen');
    var len = guide.getTotalLength(), N = 80, pts = [];
    for (var i=0;i<=N;i++){ var p = guide.getPointAtLength(len*i/N); pts.push([p.x,p.y]); }
    var idx = 0, drawing = false, phase = 'body', dotsLeft = R.dots.length;
    ink.style.strokeDasharray = len; ink.style.strokeDashoffset = len;
    function toSvg(e){ var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : {x:0,y:0}; }
    function dist(a, b){ var dx=a[0]-b.x, dy=a[1]-b.y; return Math.sqrt(dx*dx+dy*dy); }
    function setInk(){ ink.style.strokeDashoffset = len*(1 - idx/N); pen.setAttribute('cx', pts[idx][0]); pen.setAttribute('cy', pts[idx][1]); }
    svg.addEventListener('pointerdown', function(e){
      if (phase !== 'body') return;
      var p = toSvg(e);
      if (dist(pts[idx], p) < 60) { drawing = true; pen.setAttribute('opacity', 1); el.querySelector('#startG').style.display = 'none'; try { svg.setPointerCapture(e.pointerId); } catch(err) {} }
      else if (idx === 0) { mood('sad'); say('ابدئي من النقطة الخضرا','Ibda\'i min en-nu\'ṭa el-khaḍra','Start at the green dot'); }
    });
    svg.addEventListener('pointermove', function(e){
      if (!drawing) return;
      var p = toSvg(e), moved = false;
      for (var k = 1; k <= 8 && idx + k <= N; k++) { if (dist(pts[idx+k], p) < 55) { idx += k; moved = true; break; } }
      if (moved) { setInk(); if (idx % 6 === 0) SFX.tick(); }
      if (idx >= N) { drawing = false; phase = 'dots'; bodyDone(); }
    });
    function stop(){ drawing = false; }
    svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
    function bodyDone(){
      SFX.good(); mood('happy'); burst(pen); pen.setAttribute('opacity', 0);
      say(R.dots.length === 1 ? 'جميل! ودلوقتي النقطة تحت' : 'جميل! ودلوقتي النقطتين فوق', R.dots.length === 1 ? 'Gamīl! W-dilwa\'ti en-nu\'ṭa taḥt' : 'Gamīl! W-dilwa\'ti en-nu\'ṭitēn fō\'', R.dots.length === 1 ? 'Nice! Now tap the dot underneath' : 'Nice! Now tap the two dots on top');
      var g = el.querySelector('#dotsG');
      R.dots.forEach(function(d){
        var c = document.createElementNS('http://www.w3.org/2000/svg','g');
        c.setAttribute('class','dotT');
        c.innerHTML = '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="42" fill="transparent"/><circle cx="'+d[0]+'" cy="'+d[1]+'" r="26" fill="#FCE3CC" stroke="#F2994A" stroke-width="4" stroke-dasharray="6 7"><animate attributeName="r" values="24;30;24" dur="1s" repeatCount="indefinite"/></circle>';
        c.addEventListener('pointerdown', function(e){
          e.stopPropagation(); if (c.dataset.done) return;
          c.dataset.done = 1; SFX.dot();
          c.innerHTML = '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="22" fill="#0F7C78"/>';
          dotsLeft--;
          if (dotsLeft === 0) {
            praise(el.querySelector('#board')); confetti(40); speak(l.name, .8);
            later(function(){ r++; r < rounds.length ? play() : finishLevel(li); }, 2200);
          }
        });
        g.appendChild(c);
      });
    }
    footButton('تاني','Start again', function(){ play(); });
    $('#footAct .go').classList.remove('ready');
    say('امشي على النقط بصباعك','Imshi ʿala en-nu\'aṭ b-ṣubāʿik','Put your finger on the green dot and slide');
  }
  play();
}

/* ---------- level 5: build words ---------- */
function wordGame(li){
  var rounds = [
    {w:W.baba, letters:['ب','ا','ب','ا'], word:'بابا', tr:'bāba', en:'dad',        pic:'dad',   extra:['ت']},
    {w:W.bab,  letters:['ب','ا','ب'],     word:'باب',  tr:'bāb',  en:'door',       pic:'door',  extra:['ت','ث']},
    {w:W.tata, letters:['ت','ا','ت','ا'], word:'تاتا', tr:'tāta', en:'baby steps', pic:'steps', extra:['ب']}
  ];
  var CH2K = {'ا':'alif','ب':'ba','ت':'ta','ث':'tha'};
  var r = 0;
  function play(){
    var R = rounds[r], pos = 0, wrongHere = 0;
    var el = scene(dotsHTML(rounds.length, r) + task('ركّبي الكلمة','Rakkibi el-kilma','Build the word. Right to left!') +
      '<div class="stage"><div class="row"><button class="pic" id="pic" aria-label="Hear the word" style="padding:8px 16px">'+PIC[R.pic]+'<span class="en" style="font-size:16px;color:#6B5E52">'+R.tr+' · '+R.en+'</span></button>'+earBtn('قطّعي الكلمة','Sound it out')+'<div id="out" style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="slots" id="slots"></div></div></div><div class="tiles" id="tiles"></div></div>');
    var slots = el.querySelector('#slots'), tiles = el.querySelector('#tiles');
    el.querySelector('#pic').addEventListener('click', function(){ SFX.tap(); speak(R.word, .75); });
    /* sound-out before building: each piece slowly, then the whole word */
    function pieces(){ speakSeq(R.w.syl.map(function(s){ return {t:s.t,rate:.55}; }).concat([{t:R.word,rate:.7}]), null, null, 450); }
    function pieceAt(p){ var sy = R.w.syl.filter(function(s){ return s.on.indexOf(p) >= 0; })[0]; return sy ? sy.t : R.word; }
    el.querySelector('.earbtn').addEventListener('click', function(){ SFX.tap(); pieces(); });
    R.letters.forEach(function(){ slots.appendChild(h('<span class="slot"></span>')); });
    function mark(){ slots.querySelectorAll('.slot').forEach(function(s, i){ s.classList.toggle('next', i === pos); }); }
    mark();
    var uniq = R.letters.filter(function(c, i, a){ return a.indexOf(c) === i; }).concat(R.extra);
    shuffle(uniq).forEach(function(c){
      var t = h('<button class="tile ar" aria-label="Letter '+L[CH2K[c]].en+'">'+c+'</button>');
      t.addEventListener('click', function(){
        if (pos >= R.letters.length) return;
        tiles.querySelectorAll('.tile').forEach(function(x){ x.classList.remove('hint'); });
        if (c === R.letters[pos]) {
          var s = slots.children[pos]; s.textContent = c; s.classList.add('filled'); s.classList.remove('next');
          SFX.pop(); burst(s); speak(c === 'ا' ? 'آ' : L[CH2K[c]].snd, .8);
          pos++; wrongHere = 0; mark();
          if (pos === R.letters.length) done();
        } else {
          mistakes++; wrongHere++;
          t.classList.remove('no'); void t.offsetWidth; t.classList.add('no');
          oops('مش ده… اسمعي تاني','Mish da… ismaʿi tāni','Not that one. Listen to this piece again', false);
          speakSeq([{t:pieceAt(pos),rate:.5},{t:pieceAt(pos),rate:.5}], null, null, 350);
          if (wrongHere >= 2) tiles.querySelectorAll('.tile').forEach(function(x){ if (x.textContent === R.letters[pos]) x.classList.add('hint'); });
        }
      });
      tiles.appendChild(t);
    });
    function done(){
      later(function(){
        SFX.whoosh();
        var out = el.querySelector('#out');
        out.innerHTML = '<div class="joined ar">'+kwHTML(R.w)+'</div><div class="en" style="font-size:18px;color:#6B5E52">'+R.w.syl.map(function(s){ return s.tr; }).join(' · ')+' → '+R.tr+'. The letters join up in a word</div>';
        tiles.style.visibility = 'hidden';
        praise(); confetti(50);
        later(function(){ sayThen('الحروف مسكت إيد بعض!','El-ḥurūf misikit īd baʿḍ!','The letters are holding hands!', null, function(){ soundOut(out, R.w); }); }, 900);
      }, 500);
      later(function(){ r++; r < rounds.length ? play() : finishLevel(li); }, 9500);
    }
    if (r === 0) later(function(){ sayThen('اسمعي الكلمة حتّة حتّة','Ismaʿi el-kilma ḥitta ḥitta','Listen to the word piece by piece, then tap the letters in order', null, pieces); }, 300);
    else later(pieces, 400);
  }
  play();
}

/* ---------- meet the friends ---------- */
function meetFriends(){
  var el = scene(task('صحابك الجداد!','Ṣḥābik el-godād!','Meet your new friends. Tap them to hear their names') +
    '<div class="friends">' +
      '<div class="friend" data-who="f">'+buddyBtn('f')+'<div class="ar kwbox">'+kwHTML(W.filfil)+'</div><span class="en">Filfil · fil-fil · pepper</span></div>' +
      '<div class="friend" data-who="b">'+buddyBtn('b')+'<div class="ar kwbox">'+kwHTML(W.basbousa)+'</div><span class="en">Basbousa · bas-bū-sa · sweet cake</span></div>' +
    '</div>');
  function intro(who, done){
    var f = el.querySelector('.friend[data-who="'+who+'"]'), btn = f.querySelector('.buddy'), w = who === 'f' ? W.filfil : W.basbousa;
    btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin'); setTimeout(function(){ btn.classList.remove('spin'); }, 800);
    tone(who === 'f' ? 700 : 500, 0, .25, 'sine', .14, who === 'f' ? 1400 : 900);
    say(who === 'f' ? 'أنا فلفل!' : 'وأنا بسبوسة!', who === 'f' ? 'Ana Filfil!' : 'W-ana Basbūsa!', who === 'f' ? 'I\'m Filfil! Fil… fil' : 'And I\'m Basbousa! Bas… bū… sa', false, who);
    speaker = who;
    speakSeq([{t: who === 'f' ? 'أنا' : 'وأنا', rate:.9}], null, function(){ soundOut(f, w, done); });
  }
  el.querySelectorAll('.friend').forEach(function(f){ f.querySelector('.buddy').addEventListener('click', function(){ intro(f.dataset.who); }); });
  later(function(){ intro('f', function(){ later(function(){ intro('b', function(){ say('قولي أسامينا معانا!','ʾūli asamīna maʿāna!','Say our names with us! Then let\'s play', true, 'f'); nb.classList.add('ready'); }); }, 500); }); }, 700);
  var nb = footButton('يلّا نلعب','Let\'s play', function(){ save.met = true; persist(); showMap(true); });
}

/* ---------- chrome ---------- */
$('#homeBtn').addEventListener('click', function(){ SFX.tap(); showMap(true); });
$('#soundBtn').addEventListener('click', function(){
  muted = !muted; this.setAttribute('aria-pressed', String(!muted));
  if (muted && 'speechSynthesis' in window) speechSynthesis.cancel(); else SFX.tap();
});
$('#labelBtn').addEventListener('click', function(){
  var on = document.body.classList.toggle('labels-off');
  this.setAttribute('aria-pressed', String(!on)); SFX.tap();
});
function openBook(){
  var book = $('#book'); book.innerHTML = '';
  LEVELS.forEach(function(lv){
    var has = save.stickers.indexOf(lv.sticker) >= 0;
    book.appendChild(h('<div class="slotS '+(has?'':'locked')+'" aria-label="'+lv.en+' sticker'+(has?'':' (not yet)')+'">'+PIC[lv.sticker]+'</div>'));
  });
  $('#bookOv').hidden = false; SFX.tap();
}
$('#bookBtn').addEventListener('click', openBook);
$('#bookClose').addEventListener('click', function(){ $('#bookOv').hidden = true; SFX.tap(); });
$('#bookOv').addEventListener('click', function(e){ if (e.target === this) this.hidden = true; });
$('#startBtn').addEventListener('click', function(){
  audio(); SFX.fanfare(); pickVoice();
  $('#splash').hidden = true;
  if (save.met) showMap(true); else meetFriends();
});

window.HARFI_DEBUG = { startLevel: startLevel, LEVELS: LEVELS, L: L, W: W, VOW: VOW, PRAISE: PRAISE, JOKES: JOKES, pokeBuddy: pokeBuddy, meetFriends: meetFriends, showMap: showMap, save: save };
mountBuddies();
updateCounts();
showMap(false);
setTimeout(function(){ pickVoice(); if (!arVoice && !Object.keys(CLIPS).length) $('#voiceWarn').hidden = false; }, 1500);
})();
