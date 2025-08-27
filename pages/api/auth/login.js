// From pages/api/auth/login.js, the lib directory is three levels up.
import { supabase } from '../../../lib/supabaseClient.js';

/**
 * API route for user login.
 *
 * Validates POST requests with `email` and `password` and attempts to find a
 * matching record in the Supabase `users` table.  On success it returns
 * basic user information; otherwise an error code is returned.  Note that
 * credentials are compared as plain text, matching the original logic.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich.' });
  }
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password);
    if (error) {
      console.error('Supabase query error:', error.message);
      return res.status(500).json({ error: 'Interner Fehler beim Abrufen des Benutzers.' });
    }
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    }
    const user = users[0];
    return res
      .status(200)
      .json({ id: user.id, email: user.email, isAdmin: user.is_admin, points: user.points });
  } catch (err) {
    console.error('Login handler unexpected error:', err);
    return res.status(500).json({ error: 'Unerwarteter Serverfehler.' });
  }
}