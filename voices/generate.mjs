// Turns voices/lines.json into MP3 clips in app/audio/.
// Provider is set in voices/voices.json: "elevenlabs" (free plan, no card) or "azure" (Egyptian voices).
// Keys come from environment variables or a .env file: ELEVENLABS_API_KEY, or AZURE_SPEECH_KEY + AZURE_SPEECH_REGION.
// Run:  npm run voices              make any clips that are missing
//       npm run voices -- --redo    remake every clip (after changing voices.json)
//       npm run voices -- --only "فلفل"   remake clips for one piece of text
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const audioDir = path.join(root, 'app', 'audio');
mkdirSync(audioDir, { recursive: true });

// --- settings ---
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
const redo = args.includes('--redo');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function ssml(line) {
  const v = cfg.azure.speakers[line.speaker], rate = cfg.azure.speeds[line.speed] || '0%';
  const say = (cfg.pronounce && cfg.pronounce[line.text]) || line.text;   // optional spelling fixes, see voices.json
  return `<speak version="1.0" xml:lang="ar-EG" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="${v.voice}">` +
    `<prosody pitch="${v.pitch}" rate="${addRates(v.rate, rate)}">${esc(say)}</prosody></voice></speak>`;
}
function addRates(a = '0%', b = '0%') { return (parseFloat(a) + parseFloat(b)) + '%'; }

async function elevenlabs(line, tries = 0) {
  const v = cfg.elevenlabs.speakers[line.speaker];
  const text = (cfg.pronounce && cfg.pronounce[line.text]) || line.text;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({
      text, model_id: cfg.elevenlabs.model,
      voice_settings: { stability: v.stability, similarity_boost: 0.8, style: v.style, speed: cfg.elevenlabs.speeds[line.speed] || 1 }
    })
  });
  if (res.status === 429 && tries < 6) { await new Promise(r => setTimeout(r, 3000 * (tries + 1))); return elevenlabs(line, tries + 1); }
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}
const tts = line => PROVIDER === 'azure' ? azure(line) : elevenlabs(line);

async function azure(line, tries = 0) {
  const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'harfi-voices'
    },
    body: ssml(line)
  });
  if (res.status === 429 && tries < 6) { await new Promise(r => setTimeout(r, 1500 * (tries + 1))); return azure(line, tries + 1); }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

const todo = lines.filter(l => {
  if (only) return l.text === only;
  const f = index[l.key];
  return redo || !f || !existsSync(path.join(audioDir, f));
});
console.log(`${todo.length} clip(s) to make, ${lines.length} lines in total.`);
let done = 0, failed = 0, chars = 0;
async function worker() {
  while (todo.length) {
    const l = todo.shift();
    const file = createHash('sha1').update(l.key).digest('hex').slice(0, 12) + '.mp3';
    try {
      writeFileSync(path.join(audioDir, file), await tts(l));
      index[l.key] = file; chars += l.text.length; done++;
      if (done % 20 === 0) console.log(`  ${done} made...`);
    } catch (e) { failed++; console.error(`  could not make "${l.text}" (${l.speaker}, ${l.speed}): ${e.message}`); }
  }
}
await Promise.all((PROVIDER === 'azure' ? [1, 2, 3, 4] : [1, 2]).map(worker));
if (failed && !done) process.exit(1);
writeFileSync(indexFile, JSON.stringify(index, null, 1));
console.log(`Made ${done} clip(s)${failed ? `, ${failed} failed` : ''}. About ${chars} characters used.`);
