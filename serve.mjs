// Tiny local server so you can play Harfi on this computer or on a tablet on the same Wi-Fi.
// Run:  npm start    then open the address it prints.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = path.join(path.dirname(fileURLToPath(import.meta.url)), 'app');
const PORT = Number(process.env.PORT) || 5173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(app, path.normalize(p));
  if (!file.startsWith(app)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(PORT, () => {
  console.log(`Harfi is running:\n  on this computer:  http://localhost:${PORT}`);
  for (const nets of Object.values(networkInterfaces())) for (const n of nets || [])
    if (n.family === 'IPv4' && !n.internal) console.log(`  on a tablet (same Wi-Fi):  http://${n.address}:${PORT}`);
});
