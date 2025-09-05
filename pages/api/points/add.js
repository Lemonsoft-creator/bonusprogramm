import { getSession } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabaseAdmin";

export default async function handler(req, res){
  if (req.method !== "POST"){
    res.setHeader("Allow", ["POST"]); return res.status(405).json({ error: "Method not allowed" });
  }
  const sess = getSession(req);
  if (!sess) return res.status(401).json({ error: "Nicht eingeloggt." });
  const supa = getSupabaseServer();
  const { data: me } = await supa.from("users").select("is_admin").eq("id", sess.id).maybeSingle();
  if (!me?.is_admin) return res.status(403).json({ error: "Nur Admins dürfen Punkte vergeben." });

  const { userId, amount, reason } = req.body || {};
  if (!userId || !amount) return res.status(400).json({ error: "userId und amount erforderlich." });
  const { error } = await supa.from("points").insert({ user_id: userId, amount, reason: reason || null });
  if (error) return res.status(500).json({ error: "DB-Fehler beim Einfügen." });
  return res.status(200).json({ ok: true });
}
