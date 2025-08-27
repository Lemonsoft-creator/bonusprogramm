// Use a relative import: from pages/api/leaderboard.js the lib directory is two levels up.
import { supabase } from '../../lib/supabaseClient.js';

/**
 * API route to return a leaderboard of users by points.
 *
 * Handles GET requests and optionally accepts a `period` query parameter
 * (`month` or `year`) to limit the aggregation to the current month or
 * current calendar year respectively.  Without a period parameter, the
 * leaderboard reflects total points across all time.  The response
 * contains an array of objects with `userId`, `email` and `totalPoints`,
 * sorted descending by total points.  A limited subset of user fields is
 * returned to minimise data leakage.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { period } = req.query;
  // Determine start date filter based on period
  let fromDate = null;
  if (period === 'month') {
    const now = new Date();
    fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  } else if (period === 'year') {
    const now = new Date();
    fromDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  }
  try {
    // Build query for points entries, optionally filtering by timestamp
    let query = supabase.from('points').select('user_id, points, timestamp');
    if (fromDate) {
      // Convert date to ISO string to compare against timestamptz
      query = query.gte('timestamp', fromDate.toISOString());
    }
    const { data: entries, error: pointsError } = await query;
    if (pointsError) {
      console.error('Supabase points fetch error:', pointsError.message);
      return res
        .status(500)
        .json({ error: 'Interner Fehler beim Abrufen der Punkte.' });
    }
    // Aggregate total points per user
    const totals = {};
    for (const entry of entries || []) {
      const uid = entry.user_id;
      const pts = entry.points || 0;
      totals[uid] = (totals[uid] || 0) + pts;
    }
    // No points data – early return with empty leaderboard
    if (Object.keys(totals).length === 0) {
      return res.status(200).json({ leaderboard: [] });
    }
    // Fetch user records for all user IDs involved
    const userIds = Object.keys(totals).map((id) => parseInt(id, 10));
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('id', userIds);
    if (usersError) {
      console.error('Supabase users fetch error:', usersError.message);
      return res
        .status(500)
        .json({ error: 'Interner Fehler beim Abrufen der Benutzer.' });
    }
    // Map user ID to email for quick lookup
    const emailMap = {};
    (users || []).forEach((u) => {
      emailMap[u.id] = u.email;
    });
    // Compose leaderboard array
    const leaderboard = userIds.map((uid) => ({
      userId: uid,
      email: emailMap[uid] || null,
      totalPoints: totals[uid] || 0,
    }));
    // Sort descending by totalPoints
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    return res.status(200).json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard handler unexpected error:', err);
    return res.status(500).json({ error: 'Unerwarteter Serverfehler.' });
  }
}