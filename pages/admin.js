import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function Admin(){
  const [me, setMe] = useState(null);
  const [lb, setLb] = useState([]);
  const [form, setForm] = useState({ userId:"", amount:10, reason:"Training" });
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    (async()=>{
      const m = await (await fetch("/api/me")).json(); setMe(m);
      const l = await (await fetch("/api/leaderboard?period=month")).json(); setLb(l);
    })();
  },[]);

  const addPoints = async (e)=>{
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/points/add",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ userId: form.userId, amount: Number(form.amount), reason: form.reason })
    });
    const d = await res.json();
    setMsg(res.ok ? "Punkte vergeben." : (d.error || "Fehler"));
  };

  if (!me) return <main className="page"><Nav /><section className="card"><p className="small">Lade…</p></section></main>;
  if (!me.isAdmin) return <main className="page"><Nav authed /><section className="card"><p className="small">Kein Zugriff.</p></section></main>;

  return (
    <main className="page">
      <Nav authed isAdmin />
      <section className="card w-full max-w-4xl text-slate-200 space-y-6">
        <h1 className="text-2xl font-semibold">Admin: Punkte vergeben</h1>
        <form onSubmit={addPoints} className="grid grid-cols-4 gap-3">
          <input className="input col-span-2" placeholder="User ID (uuid)" value={form.userId} onChange={e=>setForm({...form, userId:e.target.value})} required />
          <input className="input" type="number" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
          <input className="input" placeholder="Grund" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
          <button className="btn-primary col-span-4">Punkte hinzufügen</button>
        </form>

        <h2 className="text-xl font-semibold">Leaderboard (Monat)</h2>
        <div className="space-y-2">
          {lb.map((x, i)=>(
            <div key={x.user_id} className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-base-900 grid place-items-center font-bold">{i+1}</div>
                <div>{x.first_name} {x.last_name}</div>
              </div>
              <div className="font-mono">{x.total}</div>
            </div>
          ))}
        </div>
        {msg && <p className="small">{msg}</p>}
      </section>
    </main>
  );
}
