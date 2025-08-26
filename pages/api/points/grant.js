import { readDb, writeDb } from '../../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, email, points } = req.body || {};
  const pts = Number(points);
  if (!userId && !email) {
    return res.status(400).json({ error: 'userId oder email muss angegeben werden.' });
  }
  if (!pts || pts <= 0) {
    return res.status(400).json({ error: 'Punkte müssen größer als 0 sein.' });
  }
  const db = readDb();
  let user = null;
  if (userId) {
    user = db.users.find((u) => u.id === userId);
  }
  if (!user && email) {
    user = db.users.find((u) => u.email === email);
  }
  if (!user) {
    return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
  }
  user.points = (user.points || 0) + pts;
  db.points.push({ userId: user.id, points: pts, timestamp: new Date().toISOString() });
  writeDb(db);
  res.status(200).json({ success: true, points: user.points });
}
