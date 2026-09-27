// Tries different voices and spellings for letter sounds before remaking every clip, so nothing is wasted.
// Reads voices/tryout.json, makes any missing clips into app/tryout/, and writes app/tryout/list.json for the
// listening page at /tryout/. Runs in the "Voices and publish" workflow; does nothing when every clip exists.
// Items with "provider": "gemini" use Gemini TTS (free tier, GEMINI_API_KEY); the rest use ElevenLabs.
// Run locally:  node voices/tryout.mjs   (keys in .env)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gemini, GEMINI_KEY } from './gemini.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const listFile = path.join(here, 'tryout.json');
if (!existsSync(listFile)) process.exit(0);
const outDir = path.join(root, 'app', 'tryout');
mkdirSync(outDir, { recursive: true });

const env = {};
const envFile = path.join(root, '.env');
if (existsSync(envFile)) for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const KEY = process.env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY;
const cfg = JSON.parse(readFileSync(path.join(here, 'voices.json'), 'utf8'));
const T = JSON.parse(readFileSync(listFile, 'utf8'));
const fileOf = it => it.id + (it.provider === 'gemini' ? '.wav' : '.mp3');

async function eleven(it) {
  const sp = cfg.elevenlabs.speakers[it.speaker];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${sp.voice_ids[0]}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({ text: it.text, model_id: it.model || cfg.elevenlabs.model,
      voice_settings: { stability: it.stability ?? sp.stability, similarity_boost: 0.8, style: sp.style, speed: it.speed ?? 1 } })
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}

let made = 0, failed = 0, stop = { gemini: !GEMINI_KEY, eleven: !KEY };
if (stop.gemini) console.log('No GEMINI_API_KEY: skipping Gemini tryout clips.');
for (const it of T.items) {
  const kind = it.provider === 'gemini' ? 'gemini' : 'eleven';
  if (existsSync(path.join(outDir, fileOf(it))) || stop[kind]) continue;
  try {
    const buf = kind === 'gemini' ? await gemini({ text: it.text, voice: it.voice, style: it.style }) : await eleven(it);
    writeFileSync(path.join(outDir, fileOf(it)), buf); made++;
  } catch (e) {
    failed++; console.log(`  could not make ${it.id}: ${e.message.slice(0, 300)}`);
    // out of credits or daily limit: stop this provider; the rest are made on the next run
    if (/quota|insufficient|credits|RESOURCE_EXHAUSTED|429|40[013]/i.test(e.message)) stop[kind] = true;
  }
}
const list = T.items.filter(it => existsSync(path.join(outDir, fileOf(it)))).map(it => Object.assign({ file: fileOf(it) }, it));
writeFileSync(path.join(outDir, 'list.json'), JSON.stringify(list, null, 1));
console.log(`Tryout: made ${made} clip(s)${failed ? `, ${failed} failed` : ''}; ${list.length} of ${T.items.length} ready.`);
