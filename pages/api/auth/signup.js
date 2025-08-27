// From pages/api/auth/signup.js, the lib directory is three levels up.
import { supabase } from '../../../lib/supabaseClient.js';

/**
 * API route for user registration.
 *
 * This route registers a new user in the Supabase `users` table.  It refuses
 * non‑POST requests with a 405 and validates that both email and password are
 * provided.  Existing accounts are detected by querying Supabase for the
 * provided email.  Optionally an `admin_code` can be supplied which,
 * when matching the secret ADMIN_CODE environment variable, flags the new
 * account as an administrator.  Passwords are stored in plain text here
 * (mirroring the original implementation); for production use consider
 * hashing them instead.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, admin_code } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich.' });
  }
  try {
    // check if a user with the same email already exists
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    if (fetchError) {
      console.error('Supabase fetch error:', fetchError.message);
      return res.status(500).json({ error: 'Interner Fehler beim Überprüfen des Benutzers.' });
    }
    if (users && users.length > 0) {
      return res.status(400).json({ error: 'Ein Benutzer mit dieser E‑Mail existiert bereits.' });
    }
    const isAdmin = Boolean(admin_code && admin_code === process.env.ADMIN_CODE);
    // insert new user
    const { data: inserted, error: insertError } = await supabase
      .from('users')
      .insert({ email, password, is_admin: isAdmin, points: 0 })
      .select('*');
    if (insertError) {
      console.error('Supabase insert error:', insertError.message);
      return res.status(500).json({ error: 'Interner Fehler beim Erstellen des Benutzers.' });
    }
    const newUser = inserted && inserted[0];
    return res
      .status(201)
      .json({ id: newUser.id, email: newUser.email, isAdmin: newUser.is_admin });
  } catch (err) {
    console.error('Signup handler unexpected error:', err);
    return res.status(500).json({ error: 'Unerwarteter Serverfehler.' });
  }
}