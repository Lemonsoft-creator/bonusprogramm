import { useState } from "react";
import Nav from "@/components/Nav";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email: email.toLowerCase(), password })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Anmeldung erfolgreich (${data.isAdmin ? "Admin":"Benutzer"}). Punkte: ${data.points}`);
      location.href = "/dashboard";
    } else setMsg(data.error || "Fehler bei der Anmeldung.");
  };

  return (
    <main className="page">
      <Nav />
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl text-cyan-300 font-semibold">Anmelden</h1>
        <label className="flex flex-col">
          <span>E-Mail</span>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label className="flex flex-col">
          <span>Passwort</span>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button className="btn-primary">Login</button>
        {msg && <p className="small">{msg}</p>}
      </form>
    </main>
  );
}
