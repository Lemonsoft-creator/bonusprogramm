import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, admin_code: adminCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registrierung erfolgreich!');
      } else {
        setMessage(data.error || 'Fehler bei der Registrierung.');
      }
    } catch (err) {
      setMessage('Netzwerkfehler beim Registrieren.');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Registrieren</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <label>
          E‑Mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <label>
          Passwort
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <label>
          Admin‑Code (optional)
          <input
            type="text"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Registrieren
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </main>
  );
}
