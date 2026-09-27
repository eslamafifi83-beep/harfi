// Tries different spellings (and models) for a few sounds before remaking every clip, so credits aren't wasted.
// Reads voices/tryout.json, makes any missing clips into app/tryout/, and writes app/tryout/list.json for the
// listening page at /tryout/. Runs in the "Voices and publish" workflow; does nothing when every clip exists.
// Run locally:  node voices/tryout.mjs   (needs ELEVENLABS_API_KEY in .env)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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

let chars = 0, made = 0;
for (const it of T.items) {
  const file = it.id + '.mp3';
  if (existsSync(path.join(outDir, file))) continue;
  if (!KEY) { console.log('No ELEVENLABS_API_KEY: skipping tryout clips.'); break; }
  const sp = cfg.elevenlabs.speakers[it.speaker];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${sp.voice_ids[0]}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({ text: it.text, model_id: it.model || cfg.elevenlabs.model,
      voice_settings: { stability: it.stability ?? sp.stability, similarity_boost: 0.8, style: sp.style, speed: it.speed ?? 1 } })
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    console.log(`  could not make ${it.id}: ${res.status} ${body}`);
    if (/quota_exceeded|insufficient|credits/i.test(body)) break;
    continue;
  }
  writeFileSync(path.join(outDir, file), Buffer.from(await res.arrayBuffer()));
  chars += it.text.length; made++;
}
writeFileSync(path.join(outDir, 'list.json'), JSON.stringify(T.items.filter(it => existsSync(path.join(outDir, it.id + '.mp3'))), null, 1));
console.log(`Tryout: made ${made} clip(s), ${chars} characters.`);
