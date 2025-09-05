import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function Dashboard(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    (async ()=>{
      const res = await fetch("/api/me");
      const d = await res.json();
      setData(d); setLoading(false);
    })();
  },[]);
  return (
    <main className="page">
      <Nav authed={true} isAdmin={data?.isAdmin} />
      <section className="card w-full max-w-2xl text-slate-200 space-y-3">
        <h1 className="text-2xl font-semibold">Mein Dashboard</h1>
        {loading ? <p className="small">Lade…</p> : (
          <>
            <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>Gym:</strong> {data.gym}</p>
            <p><strong>Punkte gesamt:</strong> {data.points}</p>
          </>
        )}
      </section>
    </main>
  );
}
