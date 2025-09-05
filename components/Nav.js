import Link from "next/link";
export default function Nav({ authed, isAdmin }){
  return (
    <nav className="fixed top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-md border-b border-white/10">
      <Link className="text-cyan-300 font-semibold" href="/">All-in-Sport Bonus</Link>
      <div className="flex gap-3">
        {authed ? (
          <>
            <Link className="link" href="/dashboard">Dashboard</Link>
            {isAdmin && <Link className="link" href="/admin">Admin</Link>}
            <a className="link" href="/api/auth/logout">Logout</a>
          </>
        ) : (
          <>
            <Link className="link" href="/login">Login</Link>
            <Link className="link" href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
