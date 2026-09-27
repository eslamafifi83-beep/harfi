// Gemini text-to-speech (free tier, key from Google AI Studio). Returns WAV audio (24 kHz, mono, 16-bit).
// Key: GEMINI_API_KEY from the environment (GitHub secret) or the git-ignored .env file.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
const envFile = path.join(root, '.env');
if (existsSync(envFile)) for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
export const GEMINI_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
export const GEMINI_MODEL = 'gemini-3.8-flash-tts';

export class GeminiError extends Error {}

export async function gemini({ text, voice, style, model = GEMINI_MODEL }, tries = 0) {
  if (!GEMINI_KEY) throw new GeminiError('No GEMINI_API_KEY (add it to .env as GEMINI_API_KEY=... or as a GitHub secret).');
  const content = { type: 'text', text };
  if (style) content.annotations = [{ type: 'speech_metadata', style }];
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': GEMINI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: [{ type: 'user_input', content: [content] }],
      response_format: { type: 'audio' }, generation_config: { speech_config: [{ voice }] } })
  });
  if ((res.status === 429 || res.status >= 500) && tries < 5) { await new Promise(r => setTimeout(r, 4000 * (tries + 1))); return gemini({ text, voice, style, model }, tries + 1); }
  const body = await res.text();
  if (!res.ok) throw new GeminiError(`${res.status} ${body.slice(0, 300)}`);
  const j = JSON.parse(body);
  for (const s of j.steps || []) for (const c of s.content || []) if (c.data) return Buffer.from(c.data, 'base64');
  throw new GeminiError('No audio in the reply: ' + body.slice(0, 300));
}
