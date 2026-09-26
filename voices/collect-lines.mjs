// Plays every level of every unit automatically and records every line the friends say,
// then adds the core phonics items (letters, sounds, syllables, words) so nothing is missed by chance.
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
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.clock.install();
await page.goto(appUrl);
await page.evaluate(() => { localStorage.clear(); window.HARFI_LOG = []; });
const tick = (ms = 700) => page.clock.runFor(ms);

// One bot action per call: try something (sometimes wrong on purpose, to hear the hints), else wait.
async function act() {
  return page.evaluate(() => {
    const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
    const ev = (el, type, x, y) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    if (q('.reward')) return 'reward';
    const card = qa('.lcard:not(.was)')[0]; if (card) { card.click(); return 'card'; }
    const go = q('#footAct .go:not([disabled])');
    if (q('.lcard') && go && go.classList.contains('ready')) { go.click(); return 'go'; }
    if (q('.lcard')) return 'wait';
    if (q('.sky')) {
      const tg = q('.tg').textContent.trim(), bs = qa('.balloon:not(.popped)');
      if (!window.__wrongB) { const w = bs.find(b => b.textContent.trim() !== tg); if (w) { ev(w, 'pointerdown', 0, 0); window.__wrongB = 1; return 'wrong balloon'; } }
      const t = bs.find(b => b.textContent.trim() === tg); if (t) { ev(t, 'pointerdown', 0, 0); return 'pop'; }
      return 'wait';
    }
    const yes = q('#turn .go.teal');
    if (yes) { if (!window.__again) { window.__again = 1; q('#turn .ghost').click(); return 'again'; } yes.click(); return 'yes'; }
    const ch = qa('.choice');
    if (ch.length && !q('.choice.right')) { const u = ch.find(c => !c.dataset.tried); if (u) { u.dataset.tried = 1; u.click(); return 'choice'; } return 'wait'; }
    const cv = q('#cv');
    if (cv && cv.dataset.ready && !cv.dataset.swept) {
      // colour the whole board in rows, like a child scribbling over the letter
      const r = cv.getBoundingClientRect(); if (r.width < 40) return 'wait';
      cv.dataset.swept = 1;
      ev(cv, 'pointerdown', r.right - 5, r.top + 5);
      for (let y = r.top + 5; y < r.bottom; y += 14) { ev(cv, 'pointermove', r.left + 5, y); ev(cv, 'pointermove', r.right - 5, y + 7); }
      ev(cv, 'pointerup', 0, 0);
      return 'colour';
    }
    if (cv) return 'wait';
    const tiles = qa('.tile');
    if (tiles.length && q('.tiles').style.visibility !== 'hidden') { window.__ti = (window.__ti || 0) + 1; tiles[window.__ti % tiles.length].click(); return 'tile'; }
    return 'wait';
  });
}

// Intro with the two friends, then every level of every unit.
await page.click('#startBtn', { force: true }); await tick(40000);
await page.evaluate(() => { const b = document.querySelector('#footAct .go'); if (b) b.click(); });
await tick(3000);
const { units, levels } = await page.evaluate(() => ({ units: window.HARFI_DEBUG.UNITS.length, levels: window.HARFI_DEBUG.LEVELS.length }));
for (let u = 0; u < units; u++) {
  for (let i = 0; i < levels; i++) {
    await page.evaluate(([u, i]) => { ['__wrongB', '__again', '__ti'].forEach(k => delete window[k]); window.HARFI_DEBUG.startLevel(u, i); }, [u, i]);
    let guard = 0, finished = false;
    while (guard++ < 700) {
      const r = await act();
      if (r === 'reward') { await tick(6000); finished = true; break; }
      await tick(r === 'wait' ? 900 : 600);
    }
    process.stdout.write(`unit ${u + 1} level ${i + 1} ${finished ? 'done' : 'DID NOT FINISH'}\n`);
  }
}
// Map greetings for each stage of progress, and the locked messages.
await page.evaluate(() => { const d = window.HARFI_DEBUG; d.save.done = {}; d.showMap(true, 0); });
await tick(3000);
await page.evaluate(() => { const l = document.querySelector('.node.locked'); if (l) l.click(); });
await tick(3000);
await page.evaluate(() => { const l = document.querySelector('.uchip.locked'); if (l) l.click(); });
await tick(3000);
for (const n of [1, 6]) {
  await page.evaluate(n => { const d = window.HARFI_DEBUG; d.save.done = {}; d.LEVELS.slice(0, n).forEach(l => d.save.done['u1:' + l.id] = 3); d.LEVELS.forEach(l => d.save.done['u0:' + l.id] = 3); d.showMap(true, 1); }, n);
  await tick(3000);
}
await page.evaluate(() => { const d = window.HARFI_DEBUG; d.UNITS.forEach((U, u) => d.LEVELS.forEach(l => d.save.done['u' + u + ':' + l.id] = 3)); d.showMap(true, 0); });
await tick(3000);

const logged = await page.evaluate(() => window.HARFI_LOG);
const data = await page.evaluate(() => {
  const d = window.HARFI_DEBUG, out = [], clean = t => t.replace(/[!؟?…]/g, ' ').replace(/\s+/g, ' ').trim();
  const add = (who, speed, t) => out.push(who + '|' + speed + '|' + clean(t));
  // Toota teaches: every letter name and sound, the vowel syllables, and every word with its syllables
  Object.values(d.L).forEach(l => { add('b', 'calm', l.name); add('b', 'slow', l.snd); add('b', 'calm', l.snd); });
  d.UNITS.forEach((U, u) => {
    U.sounding.slice(0, 2).forEach(k => d.VOW.forEach(v => add('b', 'calm', d.L[k].ch + v.mark)));
    U.sounding.slice(0, 3).forEach(k => { add('f', 'calm', d.L[k].snd); add('f', 'normal', 'فرقعي بلالين ' + d.theName(d.L[k])); add('f', 'normal', 'مش ده دوّري على ' + d.theName(d.L[k])); add('b', 'normal', 'مش ده دوّري على ' + d.theName(d.L[k])); });
    U.letters.forEach(k => add('b', 'normal', 'لوّني ' + d.theName(d.L[k])));
    U.keywords.concat(U.words).forEach(k => { const w = d.W[k]; add('b', 'calm', w.word); w.syl.forEach(s => add('b', 'slow', s.t)); });
    U.words.forEach(k => add('f', 'calm', d.W[k].word));
  });
  ['filfil', 'toota', 'baba'].forEach(k => { const w = d.W[k]; add('b', 'calm', w.word); w.syl.forEach(s => add('b', 'slow', s.t)); });
  add('f', 'calm', d.W.filfil.word); add('f', 'calm', d.W.baba.word); d.W.filfil.syl.forEach(s => add('f', 'slow', s.t));
  d.PRAISE.forEach(p => { add('f', 'normal', p[0]); add('b', 'normal', p[0]); });
  Object.keys(d.JOKES).forEach(who => d.JOKES[who].forEach(j => add(who, 'normal', j[0])));
  return out;
});
await browser.close();
if (errors.length) { console.error('Script errors while playing:\n' + errors.join('\n')); process.exit(1); }

const keys = [...new Set([...logged, ...data])].filter(k => k.split('|')[2]);
const lines = keys.sort().map(k => { const [speaker, speed, ...rest] = k.split('|'); return { key: k, speaker, speed, text: rest.join('|') }; });
writeFileSync(path.join(here, 'lines.json'), JSON.stringify(lines, null, 1));
const chars = lines.reduce((n, l) => n + l.text.length, 0);
console.log(`${lines.length} lines (${chars} characters) written to voices/lines.json (${logged.length} heard during play)`);
