import { readDb } from '../../lib/db.js';

function aggregate(db, scope) {
  const now = new Date();
  const results = {};
  for (const entry of db.points) {
    const ts = new Date(entry.timestamp);
    let include = false;
    if (scope === 'month') {
      include = ts.getFullYear() === now.getFullYear() && ts.getMonth() === now.getMonth();
    } else if (scope === 'year') {
      include = ts.getFullYear() === now.getFullYear();
    } else {
      include = true;
    }
    if (include) {
      results[entry.userId] = (results[entry.userId] || 0) + entry.points;
    }
  }
  // Map to user objects
  const list = db.users.map((u) => ({ id: u.id, email: u.email, points: results[u.id] || 0 }));
  list.sort((a, b) => b.points - a.points);
  return list;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { scope } = req.query;
  const db = readDb();
  const data = aggregate(db, scope);
  res.status(200).json(data);
}
