// From pages/api/points/summary.js, the lib directory is three levels up.
import { supabase } from '../../../lib/supabaseClient.js';

/**
 * API route to provide a summary of user points.
 *
 * Accepts GET requests.  Without a `userId` query parameter, it returns a
 * list of all users with their basic information and total points.  When
 * `userId` is supplied, it returns the specified user along with a
 * chronological list of their individual point transactions.  The
 * transactions are ordered by timestamp descending so the most recent
 * entries appear first.  Errors encountered during Supabase operations
 * generate a 5xx response.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId } = req.query;
  try {
    if (userId) {
      const parsedId = parseInt(userId, 10);
      // Fetch the user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', parsedId)
        .single();
      if (userError) {
        console.error('Supabase user fetch error:', userError.message);
        return res.status(500).json({ error: 'Interner Fehler beim Abrufen des Benutzers.' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Benutzer wurde nicht gefunden.' });
      }
      // Fetch transactions for this user, sorted by timestamp descending
      const { data: transactions, error: pointsError } = await supabase
        .from('points')
        .select('*')
        .eq('user_id', parsedId)
        .order('timestamp', { ascending: false });
      if (pointsError) {
        console.error('Supabase points fetch error:', pointsError.message);
        return res
          .status(500)
          .json({ error: 'Interner Fehler beim Abrufen der Punktehistorie.' });
      }
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.is_admin,
          points: user.points,
        },
        transactions: transactions || [],
      });
    }
    // No userId – return all users with basic info
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, is_admin, points');
    if (usersError) {
      console.error('Supabase users fetch error:', usersError.message);
      return res.status(500).json({ error: 'Interner Fehler beim Abrufen der Benutzer.' });
    }
    const mapped = (users || []).map((u) => ({
      id: u.id,
      email: u.email,
      isAdmin: u.is_admin,
      points: u.points,
    }));
    return res.status(200).json({ users: mapped });
  } catch (err) {
    console.error('Summary handler unexpected error:', err);
    return res.status(500).json({ error: 'Unerwarteter Serverfehler.' });
  }
}