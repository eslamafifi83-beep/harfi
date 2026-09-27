// Turns voices/lines.json into MP3 clips in app/audio/.
// Provider is set in voices/voices.json: "elevenlabs" (free plan, no card) or "azure" (Egyptian voices).
// Keys come from environment variables or a .env file: ELEVENLABS_API_KEY, or AZURE_SPEECH_KEY + AZURE_SPEECH_REGION.
// Free-plan friendly: only missing clips are made, and when the month's free credits run out it stops cleanly,
// keeps what it made, and the rest are made next month (GitHub runs this monthly). Lines without a clip use the device voice.
// Run:  npm run voices              make any clips that are missing
//       npm run voices -- --only "توتة"   remake clips for one piece of text
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const audioDir = path.join(root, 'app', 'audio');
mkdirSync(audioDir, { recursive: true });

const env = {};
const envFile = path.join(root, '.env');
if (existsSync(envFile)) for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const cfg = JSON.parse(readFileSync(path.join(here, 'voices.json'), 'utf8'));
const PROVIDER = cfg.provider || 'elevenlabs';
const get = k => process.env[k] || env[k];
const KEY = PROVIDER === 'azure' ? get('AZURE_SPEECH_KEY') : get('ELEVENLABS_API_KEY');
const REGION = get('AZURE_SPEECH_REGION') || 'australiaeast';
if (!KEY) { console.error(PROVIDER === 'azure' ? 'Add AZURE_SPEECH_KEY first (see .env.example).' : 'Add ELEVENLABS_API_KEY first (see .env.example).'); process.exit(1); }

const lines = JSON.parse(readFileSync(path.join(here, 'lines.json'), 'utf8'));
const indexFile = path.join(audioDir, 'index.json');
const index = existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, 'utf8')) : {};
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
// Phonics lines (letter names and sounds, syllables, words to read) keep the standard voices,
// so ج stays "j" and ق stays "q". Everything else is chat and uses the friend's Egyptian voice (chat_voice_ids).
const clean = t => t.replace(/[!؟?…]/g, ' ').replace(/\s+/g, ' ').trim();
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'app', 'content.js'), 'utf8'), sandbox);
const C = sandbox.window.HARFI_CONTENT, PHONICS = new Set();
Object.values(C.L).forEach(l => [l.name, l.snd, l.ch].forEach(t => PHONICS.add(clean(t))));
Object.values(C.W).forEach(w => { PHONICS.add(clean(w.word)); w.syl.forEach(s => PHONICS.add(clean(s.t))); });
const isPhonics = l => PHONICS.has(l.text) || (l.text.length <= 3 && !l.text.includes(' ')) || /^[\u0621-\u064A][\u064B-\u0652]+$/.test(l.text);
const kindOf = l => (!isPhonics(l) && cfg.provider !== 'azure' && cfg.elevenlabs.speakers[l.speaker].chat_voice_ids) ? 'chat' : 'std';
const textFor = line => (cfg.pronounce && cfg.pronounce[line.text]) || line.text;

class OutOfCredits extends Error {}
class PaidVoice extends Error {}

// ---------- ElevenLabs ----------
async function eleven(line, voiceId, tries = 0) {
  const v = cfg.elevenlabs.speakers[line.speaker];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({ text: textFor(line), model_id: cfg.elevenlabs.model,
      voice_settings: { stability: v.stability, similarity_boost: 0.8, style: v.style, speed: cfg.elevenlabs.speeds[line.speed] || 1 } })
  });
  if (res.status === 429 && tries < 6) { await new Promise(r => setTimeout(r, 3000 * (tries + 1))); return eleven(line, voiceId, tries + 1); }
  if (!res.ok) {
    const body = (await res.text()).slice(0, 400);
    if (/quota_exceeded|insufficient|credits/i.test(body)) throw new OutOfCredits(body);
    if (res.status === 402 || /paid_plan_required|payment_required/i.test(body)) throw new PaidVoice(body);
    throw new Error(`${res.status} ${body}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
// pick the first voice in each friend's list that works on this plan (costs one short test clip each)
const resolved = {};   // resolved['b:std'], resolved['b:chat'] ...
async function resolveVoices() {
  for (const who of Object.keys(cfg.elevenlabs.speakers)) {
    const sp = cfg.elevenlabs.speakers[who];
    for (const kind of ['std', 'chat']) {
      const ids = kind === 'std' ? [].concat(sp.voice_ids || sp.voice_id) : [].concat(sp.chat_voice_ids || []);
      if (!ids.length) continue;
      for (const id of ids) {
        try { await eleven({ speaker: who, speed: 'normal', text: 'أ' }, id); resolved[who + ':' + kind] = id; break; }
        catch (e) { if (e instanceof OutOfCredits) throw e; console.log(`  voice ${id} not usable for ${sp.name} (${kind}): ${e.message.slice(0, 80)}`); }
      }
      if (!resolved[who + ':' + kind]) throw new Error(`No usable ${kind} voice for ${sp.name}. Add a free voice ID to voices.json.`);
      console.log(`${sp.name} (${kind === 'std' ? 'letters and words' : 'Egyptian chat'}): voice ${resolved[who + ':' + kind]}`);
    }
  }
}

// ---------- Azure ----------
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function azure(line, tries = 0) {
  const v = cfg.azure.speakers[line.speaker], rate = parseFloat(v.rate || 0) + parseFloat(cfg.azure.speeds[line.speed] || 0);
  const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'harfi-voices' },
    body: `<speak version="1.0" xml:lang="ar-EG" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="${v.voice}"><prosody pitch="${v.pitch}" rate="${rate}%">${esc(textFor(line))}</prosody></voice></speak>`
  });
  if (res.status === 429 && tries < 6) { await new Promise(r => setTimeout(r, 1500 * (tries + 1))); return azure(line, tries + 1); }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------- run ----------
if (PROVIDER !== 'azure') await resolveVoices();
const voiceOf = l => PROVIDER === 'azure' ? cfg.azure.speakers[l.speaker].voice : resolved[l.speaker + ':' + kindOf(l)];
// the file name includes the voice, so changing a voice remakes only the clips that voice says
const fileFor = l => createHash('sha1').update(l.key + '|' + voiceOf(l)).digest('hex').slice(0, 12) + '.mp3';

console.log(`${lines.filter(l => kindOf(l) === 'chat').length} chat lines use the Egyptian voices, ${lines.filter(l => kindOf(l) === 'std').length} letter/word lines use the standard voices.`);
// a clip counts as made if it exists, either as recorded or trimmed by voices/fix-clips.py (name ending -t.mp3)
const have = l => [fileFor(l), fileFor(l).replace(/\.mp3$/, '-t.mp3')].some(f => index[l.key] === f && existsSync(path.join(audioDir, f)));
const todo = lines.filter(l => only ? l.text === only : !have(l));
const allChars = lines.reduce((n, l) => n + l.text.length, 0);
console.log(`${todo.length} clip(s) to make (${todo.reduce((n, l) => n + l.text.length, 0)} characters), ${lines.length} lines in total (${allChars} characters).`);
let done = 0, failed = 0, chars = 0, outOfCredits = false;
async function worker() {
  while (todo.length && !outOfCredits) {
    const l = todo.shift();
    try {
      const buf = PROVIDER === 'azure' ? await azure(l) : await eleven(l, voiceOf(l));
      writeFileSync(path.join(audioDir, fileFor(l)), buf);
      index[l.key] = fileFor(l); chars += l.text.length; done++;
      if (done % 25 === 0) console.log(`  ${done} made...`);
    } catch (e) {
      if (e instanceof OutOfCredits) { outOfCredits = true; console.log('  This month\'s free credits are used up. Stopping here; the rest will be made next month.'); break; }
      failed++; console.error(`  could not make "${l.text}" (${l.speaker}, ${l.speed}): ${e.message.slice(0, 200)}`);
    }
  }
}
await Promise.all((PROVIDER === 'azure' ? [1, 2, 3, 4] : [1, 2]).map(worker));
// keep only clips that are still used
const keys = new Set(lines.map(l => l.key));
for (const k of Object.keys(index)) if (!keys.has(k)) delete index[k];
const used = new Set(Object.values(index));
for (const f of readdirSync(audioDir)) if (f.endsWith('.mp3') && !used.has(f)) unlinkSync(path.join(audioDir, f));
writeFileSync(indexFile, JSON.stringify(index, null, 1));
const left = lines.filter(l => !index[l.key]).length;
console.log(`Made ${done} clip(s)${failed ? `, ${failed} failed` : ''}, about ${chars} characters. ${left ? left + ' still to make.' : 'All clips are ready.'}`);
