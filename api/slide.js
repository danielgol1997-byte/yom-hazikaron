import { readFileSync, writeFileSync } from 'fs';

// /tmp is writable in both vercel dev and lambda production.
// In production, a warm lambda instance reuses the same /tmp, so state
// persists across requests without needing an external database.
const STATE_FILE = '/tmp/yh-slides.json';

function getrooms() {
  try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); }
  catch { return {}; }
}

function setRooms(rooms) {
  try { writeFileSync(STATE_FILE, JSON.stringify(rooms)); }
  catch { /* /tmp unavailable — no-op */ }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const room = (req.query.room || 'default').slice(0, 32);
  const rooms = getrooms();

  if (req.method === 'GET') {
    return res.json({ slide: rooms[room] ?? 0 });
  }

  if (req.method === 'POST') {
    const { slide } = req.body ?? {};
    if (typeof slide === 'number' && slide >= 0) {
      rooms[room] = slide;
      setRooms(rooms);
    }
    return res.json({ slide: rooms[room] ?? 0 });
  }

  res.status(405).end();
}
