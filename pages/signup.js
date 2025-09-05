import { useState } from "react";
import Nav from "@/components/Nav";

export default function Signup(){
  const [form, setForm] = useState({
    salutation: "Herr", firstName: "", lastName: "",
    gym: "", phone: "", email: "", password: "", confirm: "", adminCode: ""
  });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (form.password !== form.confirm){
      setMsg("Passwörter stimmen nicht überein."); return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salutation: form.salutation,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gym: form.gym,
        phone: form.phone || null,
        email: form.email.toLowerCase(),
        password: form.password,
        adminCode: form.adminCode || undefined
      })
    });
    const data = await res.json();
    if (res.ok) setMsg("Registrierung erfolgreich. Bitte einloggen.");
    else setMsg(data.error || "Fehler.");
  };

  return (
    <main className="page">
      <Nav />
      <form onSubmit={onSubmit} className="card w-full max-w-2xl space-y-4">
        <h1 className="text-2xl text-cyan-300 font-semibold">Konto erstellen</h1>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span>Anrede</span>
            <select name="salutation" value={form.salutation} onChange={onChange} className="input">
              <option>Herr</option><option>Frau</option><option>Divers</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span>Gym</span>
            <select name="gym" value={form.gym} onChange={onChange} className="input" required>
              <option value="">Bitte wählen…</option>
              <option>All-in-Sport Bern</option>
              <option>TsT-Fitness</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span>Vorname</span>
            <input name="firstName" value={form.firstName} onChange={onChange} className="input" required minLength={2} maxLength={50} />
          </label>
          <label className="flex flex-col">
            <span>Nachname</span>
            <input name="lastName" value={form.lastName} onChange={onChange} className="input" required minLength={2} maxLength={50} />
          </label>
          <label className="flex flex-col col-span-2">
            <span>Telefon (optional)</span>
            <input name="phone" value={form.phone} onChange={onChange} className="input" placeholder="+41…" />
          </label>
          <label className="flex flex-col">
            <span>E-Mail</span>
            <input type="email" name="email" value={form.email} onChange={onChange} className="input" required />
          </label>
          <label className="flex flex-col">
            <span>Passwort</span>
            <input type="password" name="password" value={form.password} onChange={onChange} className="input" required />
          </label>
          <label className="flex flex-col">
            <span>Passwort wiederholen</span>
            <input type="password" name="confirm" value={form.confirm} onChange={onChange} className="input" required />
          </label>
          <label className="flex flex-col">
            <span>Admin-Code (optional)</span>
            <input name="adminCode" value={form.adminCode} onChange={onChange} className="input" />
          </label>
        </div>

        <button className="btn-primary">Registrieren</button>
        {msg && <p className="small">{msg}</p>}
      </form>
    </main>
  );
}
