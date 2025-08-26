import { readDb } from '../../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, email } = req.query;
  const db = readDb();
  // Wenn keine spezifische Nutzeranfrage vorliegt, gib alle Nutzer mit ihren Gesamtpunkten zurück
  if (!userId && !email) {
    return res.status(200).json(
      db.users.map((u) => ({
        id: u.id,
        email: u.email,
        points: u.points || 0,
        isAdmin: u.isAdmin,
      }))
    );
  }
  let user = null;
  if (userId) {
    const idNum = Number(userId);
    user = db.users.find((u) => u.id === idNum);
  }
  if (!user && email) {
    user = db.users.find((u) => u.email === email);
  }
  if (!user) {
    return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
  }
  res.status(200).json({ id: user.id, email: user.email, points: user.points || 0 });
}
