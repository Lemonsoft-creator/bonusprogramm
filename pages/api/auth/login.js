import { getSupabaseServer } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export default async function handler(req, res){
  if (req.method !== "POST"){
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email und Passwort sind erforderlich." });
  try{
    const supa = getSupabaseServer();
    const { data: user } = await supa.from("users").select("id,email,password_hash,is_admin,first_name,last_name,gym").eq("email", email).maybeSingle();
    if (!user) return res.status(401).json({ error: "Ungültige Anmeldedaten." });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Ungültige Anmeldedaten." });
    // Punkte total
    const { data: pts } = await supa.from("v_user_points").select("total").eq("user_id", user.id).maybeSingle();
    setSession(res, { id: user.id, email: user.email, isAdmin: user.is_admin });
    return res.status(200).json({ id: user.id, email: user.email, isAdmin: user.is_admin, points: (pts?.total||0) });
  }catch(err){
    return res.status(500).json({ error: "Serverfehler." });
  }
}
