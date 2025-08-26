import { readDb, writeDb } from '../../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, admin_code } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich.' });
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Ein Benutzer mit dieser E‑Mail existiert bereits.' });
  }

  const isAdmin = !!admin_code && admin_code === process.env.ADMIN_CODE;
  const id = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id,
    email,
    password,
    isAdmin,
    points: 0,
  };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin });
}
