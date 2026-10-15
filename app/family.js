/* Family portraits (being tried out): big, clear half-body drawings in the sticker style.
   Loaded after content.js; game.js swaps them in only with the demo link ?try=feedpics. */
(function(){
'use strict';
var INK = '#2B1B48', SKIN = '#EDBB8E', SKIN_D = '#B07A50';
function sv(inner){ return '<svg viewBox="0 0 200 200" aria-hidden="true">' + inner + '</svg>'; }
function shoulders(fill, extra){ return '<path d="M24 200 C26 158 58 146 100 146 C142 146 174 158 176 200 Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' + (extra || ''); }
function neck(){ return '<path d="M86 122 L86 150 Q100 158 114 150 L114 122 Z" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>'; }
function eyes(y, lashes){
  var e = function(x){ return '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="8" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle cx="' + (x + 1) + '" cy="' + (y + 1.5) + '" r="4.4" fill="' + INK + '"/><circle cx="' + (x - .8) + '" cy="' + (y - 1) + '" r="1.6" fill="#fff"/>'; };
  var l = lashes ? '<path d="M77 ' + (y - 6) + ' l-5 -4 M80 ' + (y - 8) + ' l-2 -5 M123 ' + (y - 6) + ' l5 -4 M120 ' + (y - 8) + ' l2 -5" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>' : '';
  return e(84) + e(116) + l;
}
function blush(y){ return '<ellipse cx="72" cy="' + y + '" rx="8" ry="5" fill="#FF9AA8" opacity=".75"/><ellipse cx="128" cy="' + y + '" rx="8" ry="5" fill="#FF9AA8" opacity=".75"/>'; }
function head(rx, ry){ return '<ellipse cx="100" cy="88" rx="' + rx + '" ry="' + ry + '" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="5"/>'; }
function ears(){ return '<ellipse cx="57" cy="92" rx="8" ry="11" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4.5"/><ellipse cx="143" cy="92" rx="8" ry="11" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4.5"/>'; }
function glasses(y){ return '<g fill="rgba(255,255,255,.25)" stroke="' + INK + '" stroke-width="4"><circle cx="84" cy="' + y + '" r="13"/><circle cx="116" cy="' + y + '" r="13"/></g><path d="M97 ' + y + ' Q100 ' + (y - 3) + ' 103 ' + y + '" stroke="' + INK + '" stroke-width="4" fill="none"/>'; }
function nose(y){ return '<path d="M100 ' + y + ' Q95 ' + (y + 11) + ' 102 ' + (y + 13) + '" stroke="' + SKIN_D + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; }

var FAMILY = {
  /* بابا: dark hair, thick brows, moustache, a little stubble, a shirt with a collar */
  dad: sv(shoulders('#22B5A6', '<path d="M82 148 L100 174 L118 148 Z" fill="#fff" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M100 174 L100 200" stroke="' + INK + '" stroke-width="3"/><circle cx="100" cy="186" r="3" fill="' + INK + '"/>') +
    neck() + ears() + head(44, 50) +
    '<path d="M60 104 C62 136 82 140 100 140 C118 140 138 136 140 104 C134 124 120 132 100 132 C80 132 66 124 60 104 Z" fill="' + INK + '" opacity=".16"/>' +
    '<path d="M55 84 C50 44 76 30 102 31 C130 30 152 46 146 84 C140 64 126 56 102 57 C80 56 62 64 55 84 Z" fill="' + INK + '"/>' +
    '<path d="M72 74 Q83 67 95 73 M105 73 Q117 67 128 74" stroke="' + INK + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
    eyes(88) + nose(94) + blush(112) +
    '<path d="M76 114 Q89 103 100 111 Q111 103 124 114 Q111 121 100 116 Q89 121 76 114 Z" fill="' + INK + '"/>' +
    '<path d="M86 123 Q100 135 114 123" stroke="#7A2E2E" stroke-width="4" fill="none" stroke-linecap="round"/>'),

  /* ماما: long dark hair with a fringe, earrings, pink lips, a pink top */
  mama: sv('<path d="M46 96 C36 36 164 36 154 96 L162 168 C140 180 60 180 38 168 Z" fill="#4A2A1C" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
    shoulders('#FF5AA0', '<path d="M78 148 Q100 172 122 148" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4"/><circle cx="100" cy="166" r="5" fill="#FFC93C" stroke="' + INK + '" stroke-width="2.5"/>') +
    neck() + head(41, 48) +
    '<path d="M58 84 C60 50 92 38 122 46 C140 52 146 68 142 86 C132 66 114 60 100 63 C86 58 70 66 58 84 Z" fill="#4A2A1C"/>' +
    '<circle cx="128" cy="52" r="7" fill="#FF7EB6" stroke="' + INK + '" stroke-width="3"/><circle cx="128" cy="52" r="2.5" fill="#FFC93C"/>' +
    '<path d="M74 76 Q83 72 93 76 M107 76 Q117 72 126 76" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
    eyes(90, true) + nose(97) + blush(110) +
    '<path d="M87 118 Q100 128 113 118 Q100 124 87 118 Z" fill="#E0457B" stroke="#B0306E" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<circle cx="60" cy="112" r="5" fill="#FFC93C" stroke="' + INK + '" stroke-width="2.5"/><circle cx="140" cy="112" r="5" fill="#FFC93C" stroke="' + INK + '" stroke-width="2.5"/>'),

  /* تاتا (baby steps): a happy toddler mid-step, arms out for balance, a curl on top, footprints behind */
  steps: sv('<path d="M86 150 L80 182 M114 150 L126 178" stroke="' + SKIN + '" stroke-width="13" stroke-linecap="round"/><path d="M86 150 L80 182 M114 150 L126 178" stroke="' + INK + '" stroke-width="17" stroke-linecap="round" opacity="0"/>' +
    '<ellipse cx="76" cy="186" rx="13" ry="7" fill="#FF7EB6" stroke="' + INK + '" stroke-width="4"/><ellipse cx="131" cy="182" rx="13" ry="7" fill="#FF7EB6" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M70 120 Q40 112 28 92 M130 120 Q160 112 172 92" stroke="' + SKIN + '" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="27" cy="90" r="9" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4"/><circle cx="173" cy="90" r="9" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M68 112 C68 104 132 104 132 112 L136 150 C136 160 64 160 64 150 Z" fill="#FFC93C" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M70 146 C70 164 130 164 130 146 Z" fill="#fff" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
    '<circle cx="100" cy="66" r="42" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M98 26 C90 14 104 8 108 16 C112 24 100 28 98 22" stroke="' + INK + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
    '<g transform="translate(0 -22)">' + eyes(88) + '</g>' + '<ellipse cx="74" cy="80" rx="8" ry="5" fill="#FF9AA8" opacity=".8"/><ellipse cx="126" cy="80" rx="8" ry="5" fill="#FF9AA8" opacity=".8"/>' +
    '<path d="M88 82 Q100 98 112 82 Z" fill="#7A2E2E" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M93 89 Q100 94 107 89" stroke="#FF7A8A" stroke-width="3" fill="none"/>'),

  /* جدّو: white hair at the sides, glasses, a bushy white moustache, a brown cardigan */
  grandpa: sv(shoulders('#A0703C', '<path d="M84 148 L100 200 L116 148 Z" fill="#fff" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><circle cx="74" cy="176" r="3.5" fill="' + INK + '"/><circle cx="126" cy="176" r="3.5" fill="' + INK + '"/>') +
    neck() + ears() + head(44, 50) +
    '<path d="M52 90 C50 64 62 56 70 58 C64 70 64 84 66 98 Z M148 90 C150 64 138 56 130 58 C136 70 136 84 134 98 Z" fill="#F4F2F8" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M86 44 Q100 38 114 44" stroke="' + SKIN_D + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M70 70 Q82 62 94 70 M106 70 Q118 62 130 70" stroke="#F4F2F8" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M70 70 Q82 62 94 70 M106 70 Q118 62 130 70" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/>' +
    eyes(88) + glasses(88) + nose(96) + blush(114) +
    '<path d="M72 118 Q86 104 100 113 Q114 104 128 118 Q114 128 100 121 Q86 128 72 118 Z" fill="#F4F2F8" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M88 128 Q100 136 112 128" stroke="#7A2E2E" stroke-width="4" fill="none" stroke-linecap="round"/>'),

  /* تيتة: grey hair in a bun, glasses, a big warm smile, a purple shawl and pearls */
  grandma: sv(shoulders('#8A5CF6', '<path d="M40 176 Q100 150 160 176" stroke="#B49CF9" stroke-width="10" fill="none"/>' +
      '<g fill="#fff" stroke="' + INK + '" stroke-width="2">' + [78, 89, 100, 111, 122].map(function(x, i){ return '<circle cx="' + x + '" cy="' + (156 + Math.abs(i - 2) * -2 + 4) + '" r="5"/>'; }).join('') + '</g>') +
    neck() +
    '<circle cx="100" cy="36" r="17" fill="#CFCAD9" stroke="' + INK + '" stroke-width="4.5"/>' +
    head(42, 48) +
    '<path d="M56 88 C52 50 76 40 100 41 C124 40 148 50 144 88 C138 66 120 58 100 60 C80 58 62 66 56 88 Z" fill="#CFCAD9" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M76 74 Q84 70 93 74 M107 74 Q116 70 124 74" stroke="#8C86A3" stroke-width="4" stroke-linecap="round" fill="none"/>' +
    eyes(90, true) + glasses(90) + nose(98) + blush(112) +
    '<path d="M84 118 Q100 134 116 118 Q100 126 84 118 Z" fill="#B0306E" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="58" cy="112" r="5" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><circle cx="142" cy="112" r="5" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>')
};
window.HARFI_FAMILY = FAMILY;
})();
