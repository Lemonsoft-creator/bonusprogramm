import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        const role = data.isAdmin ? 'Admin' : 'Benutzer';
        setMessage(`Anmeldung erfolgreich (${role}). Punkte: ${data.points}`);
      } else {
        setMessage(data.error || 'Fehler bei der Anmeldung.');
      }
    } catch (err) {
      setMessage('Netzwerkfehler bei der Anmeldung.');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Anmelden</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '400px'
        }}
      >
        <label>
          E-Mail
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
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Anmelden
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </main>
  );
}
