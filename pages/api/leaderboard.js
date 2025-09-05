import { getSupabaseServer } from "@/lib/supabaseAdmin";

export default async function handler(req, res){
  const period = (req.query.period||"month").toLowerCase();
  const supa = getSupabaseServer();
  let from = null;
  const now = new Date();
  if (period === "year"){
    from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  } else {
    from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
  // Query: join users + points filtered by created_at >= from
  const { data, error } = await supa.rpc("leaderboard_from", { from_ts: from.toISOString() });
  if (error) return res.status(500).json({ error: "DB-Fehler Leaderboard." });
  res.status(200).json(data || []);
}
