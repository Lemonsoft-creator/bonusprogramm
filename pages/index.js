import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home(){
  return (
    <main className="page">
      <Nav />
      <section className="card w-full max-w-2xl text-slate-200">
        <h1 className="text-3xl font-semibold mb-2">All in Sport Bonusprogramm</h1>
        <p className="small mb-4">
          Sammle Punkte fürs Training, Empfehlungen & Firmen-Deals. Löse Belohnungen ein und klettere im Leaderboard nach oben.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link className="btn-primary text-center" href="/login">Login</Link>
          <Link className="btn-primary text-center" href="/signup">Registrieren</Link>
        </div>
      </section>
    </main>
  );
}
