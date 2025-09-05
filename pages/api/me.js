import { getSession } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabaseAdmin";

export default async function handler(req, res){
  const sess = getSession(req);
  if (!sess) return res.status(401).json({ error: "Nicht eingeloggt." });
  const supa = getSupabaseServer();
  const { data: user } = await supa.from("users").select("id,email,is_admin,first_name,last_name,gym").eq("id", sess.id).maybeSingle();
  const { data: pts } = await supa.from("v_user_points").select("total").eq("user_id", sess.id).maybeSingle();
  return res.status(200).json({
    id: user.id, email: user.email, isAdmin: user.is_admin,
    firstName: user.first_name, lastName: user.last_name, gym: user.gym,
    points: (pts?.total||0)
  });
}
