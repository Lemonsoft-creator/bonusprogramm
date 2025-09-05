import { getSupabaseServer } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export default async function handler(req, res){
  if (req.method !== "POST"){
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { salutation, firstName, lastName, gym, phone, email, password, adminCode } = req.body || {};
  if (!salutation || !firstName || !lastName || !gym || !email || !password)
    return res.status(400).json({ error: "Bitte alle Pflichtfelder ausfüllen." });
  try{
    const supa = getSupabaseServer();
    const { data: exists } = await supa.from("users").select("id").eq("email", email).maybeSingle();
    if (exists) return res.status(409).json({ error: "E-Mail bereits registriert." });
    const password_hash = await bcrypt.hash(password, 10);
    const is_admin = !!(adminCode && process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE);
    const { data, error } = await supa.from("users").insert({
      salutation, first_name: firstName, last_name: lastName, gym, phone, email, password_hash, is_admin
    }).select("id,email,is_admin").maybeSingle();
    if (error) return res.status(500).json({ error: "DB-Fehler beim Erstellen." });
    return res.status(201).json({ id: data.id, email: data.email, isAdmin: data.is_admin });
  }catch(err){
    return res.status(500).json({ error: "Serverfehler." });
  }
}
