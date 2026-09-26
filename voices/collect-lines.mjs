// Plays through every level automatically and records every line the friends say,
// then adds the core phonics items (letters, syllables, words) at every speed for both friends.
// Output: voices/lines.json, which voices/generate.mjs turns into audio clips.
// Run:  npm run lines      (needs:  npm install  once, for Playwright)
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const appUrl = pathToFileURL(path.join(here, '..', 'app', 'index.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
await page.clock.install();
await page.goto(appUrl);
await page.evaluate(() => { localStorage.clear(); window.HARFI_LOG = []; });
const tick = (ms = 700) => page.clock.runFor(ms);

// One bot action per call: try something (sometimes wrong on purpose, to hear the hints), else wait.
async function act() {
  return page.evaluate(() => {
    const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
    const down = (el, x, y) => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    if (q('.reward')) return 'reward';
    const card = qa('.lcard:not(.was)')[0]; if (card) { card.click(); return 'card'; }
    const go = q('#footAct .go:not([disabled])');
    if (q('.lcard') && go) { go.click(); return 'go'; }
    if (q('.sky')) {
      const tg = q('.tg').textContent.trim(), bs = qa('.balloon:not(.popped)');
      if (!window.__wrongB) { const w = bs.find(b => b.textContent.trim() !== tg); if (w) { down(w); window.__wrongB = 1; return 'wrong balloon'; } }
      const t = bs.find(b => b.textContent.trim() === tg); if (t) { down(t); return 'pop'; }
      return 'wait';
    }
    const yes = q('#turn .go.teal');
    if (yes) { if (!window.__again) { window.__again = 1; q('#turn .ghost').click(); return 'again'; } yes.click(); return 'yes'; }
    const ch = qa('.choice');
    if (ch.length && !q('.choice.right')) { const u = ch.find(c => !c.dataset.tried); if (u) { u.dataset.tried = 1; u.click(); return 'choice'; } }
    const svg = q('#tsv');
    if (svg) {
      const g = q('#guide');
      if (!q('.dotT') && !window.__traced) {
        const L = g.getTotalLength(), m = svg.getScreenCTM();
        const pt = i => { const p = g.getPointAtLength(L * i / 80), s = svg.createSVGPoint(); s.x = p.x; s.y = p.y; return s.matrixTransform(m); };
        if (!window.__offStart) { window.__offStart = 1; const r = svg.getBoundingClientRect(); down(svg, r.left + 5, r.top + 5); return 'off start'; }
        let p = pt(0); down(svg, p.x, p.y);
        for (let i = 1; i <= 80; i++) { p = pt(i); svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: p.x, clientY: p.y, pointerId: 1 })); }
        svg.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
        return 'trace';
      }
      const d = qa('.dotT').find(x => !x.dataset.done); if (d) { down(d); return 'dot'; }
      return 'wait';
    }
    const tiles = qa('.tile');
    if (tiles.length && q('.tiles').style.visibility !== 'hidden') { window.__ti = (window.__ti || 0) + 1; tiles[window.__ti % tiles.length].click(); return 'tile'; }
    return 'wait';
  });
}

// Intro with the two friends, then every level.
await page.click('#startBtn', { force: true }); await tick(30000);
await page.evaluate(() => { const b = document.querySelector('#footAct .go'); if (b) b.click(); });
await tick(3000);
const levels = await page.evaluate(() => window.HARFI_DEBUG.LEVELS.length);
for (let i = 0; i < levels; i++) {
  await page.evaluate(i => { ['__wrongB', '__again', '__offStart', '__traced', '__ti'].forEach(k => delete window[k]); window.HARFI_DEBUG.startLevel(i); }, i);
  let last = '', guard = 0;
  while (guard++ < 600) {
    const r = await act();
    if (r === 'reward') { await tick(6000); break; }
    if (r === 'trace' || r === 'dot') await page.evaluate(() => { if (document.querySelector('.dotT')) window.__traced = 1; });
    if (last === 'reward') break;
    last = r;
    await tick(r === 'wait' ? 900 : 500);
    // a new trace round starts fresh
    await page.evaluate(() => { if (document.querySelector('#tsv') && !document.querySelector('.dotT')) { window.__traced = 0; } });
  }
  process.stdout.write(`level ${i + 1} done\n`);
}
// Map greetings for each stage of progress, and the locked-level message.
for (let n = 0; n <= levels; n++) {
  await page.evaluate(n => { const d = window.HARFI_DEBUG; d.save.done = {}; d.LEVELS.slice(0, n).forEach(l => d.save.done[l.id] = 3); d.showMap(true); }, n);
  await tick(2500);
}
await page.evaluate(() => { const l = document.querySelector('.node.locked'); if (l) l.click(); });
await tick(2500);

const logged = await page.evaluate(() => window.HARFI_LOG);
const data = await page.evaluate(() => {
  const d = window.HARFI_DEBUG, out = [];
  const speeds = ['slow', 'calm', 'normal'];
  const items = [];
  Object.values(d.L).forEach(l => items.push(l.name, l.snd));
  ['ba', 'ta', 'tha', 'alif'].forEach(k => d.VOW.forEach(v => items.push(d.L[k].ch + v.mark)));
  Object.values(d.W).forEach(w => { items.push(w.word); w.syl.forEach(s => items.push(s.t)); });
  ['f', 'b'].forEach(who => speeds.forEach(sp => items.forEach(t => out.push(who + '|' + sp + '|' + t))));
  // balloon-game hints: every wrong letter for every target
  ['ba', 'ta', 'alif'].forEach(t => Object.keys(d.L).filter(k => k !== t).forEach(k => ['f', 'b'].forEach(who =>
    out.push(who + '|normal|' + ('ده حرف ال' + d.L[k].name.replace(/^ال/, '') + ' دوّري على ال' + d.L[t].name)))));
  ['f', 'b'].forEach(who => out.push(who + '|normal|لسّه مقفولة'));
  d.PRAISE.forEach(p => ['f', 'b'].forEach(who => out.push(who + '|normal|' + p[0].replace(/[!؟?…]/g, ' ').replace(/\s+/g, ' ').trim())));
  Object.keys(d.JOKES).forEach(who => d.JOKES[who].forEach(j => out.push(who + '|normal|' + j[0].replace(/[!؟?…]/g, ' ').replace(/\s+/g, ' ').trim())));
  return out;
});
await browser.close();

const keys = [...new Set([...logged, ...data])].filter(k => k.split('|')[2]);
const lines = keys.sort().map(k => { const [speaker, speed, ...rest] = k.split('|'); return { key: k, speaker, speed, text: rest.join('|') }; });
writeFileSync(path.join(here, 'lines.json'), JSON.stringify(lines, null, 1));
console.log(`${lines.length} lines written to voices/lines.json (${logged.length} heard during play)`);
