// From pages/api/points/grant.js, the lib directory is three levels up.
import { supabase } from '../../../lib/supabaseClient.js';

/**
 * API route for granting points to a user.
 *
 * Expects a POST request with a JSON body containing `userId` (the ID of the
 * recipient) and `points` (the integer amount to add).  It validates the
 * existence of the target user, increments their cumulative point total in
 * the `users` table, and records the transaction in the `points` table with
 * an automatic timestamp.  Returns a success message on completion.  Any
 * errors during Supabase operations are reported with appropriate HTTP
 * status codes.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, points } = req.body || {};
  const parsedUserId = parseInt(userId, 10);
  const parsedPoints = parseInt(points, 10);
  if (!parsedUserId || isNaN(parsedPoints)) {
    return res
      .status(400)
      .json({ error: 'userId und points müssen gültige numerische Werte sein.' });
  }
  try {
    // Fetch the user to ensure they exist and get current point total
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', parsedUserId)
      .single();
    if (userError) {
      console.error('Supabase user fetch error:', userError.message);
      return res.status(500).json({ error: 'Interner Fehler beim Abrufen des Benutzers.' });
    }
    if (!userData) {
      return res.status(404).json({ error: 'Benutzer wurde nicht gefunden.' });
    }
    // Update the user's cumulative points
    const newTotal = (userData.points || 0) + parsedPoints;
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newTotal })
      .eq('id', parsedUserId);
    if (updateError) {
      console.error('Supabase user update error:', updateError.message);
      return res
        .status(500)
        .json({ error: 'Interner Fehler beim Aktualisieren des Benutzers.' });
    }
    // Insert a row into the points table.  timestamp column uses default now().
    const { error: insertError } = await supabase
      .from('points')
      .insert({ user_id: parsedUserId, points: parsedPoints });
    if (insertError) {
      console.error('Supabase points insert error:', insertError.message);
      return res
        .status(500)
        .json({ error: 'Interner Fehler beim Eintragen der Punkte.' });
    }
    return res.status(200).json({ message: 'Punkte erfolgreich vergeben.' });
  } catch (err) {
    console.error('Grant handler unexpected error:', err);
    return res.status(500).json({ error: 'Unerwarteter Serverfehler.' });
  }
}