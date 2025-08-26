const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, 'db.json');

// Helper to read/write DB
function readDb() {
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Utility to generate next user ID
function nextUserId(users) {
  return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// API Endpoints

// User registration
app.post('/api/register', (req, res) => {
  const { title, firstName, lastName, gym, phone, email, password, adminCode } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email und Passwort sind erforderlich.' });
  }
  const db = readDb();
  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Ein Benutzer mit dieser E‑Mail existiert bereits.' });
  }
  const id = nextUserId(db.users);
  const isAdmin = adminCode && adminCode === db.adminCode;
  const newUser = {
    id,
    title,
    firstName,
    lastName,
    gym,
    phone,
    email,
    password,
    admin: isAdmin,
    monthPoints: 0,
    yearPoints: 0,
    rewardsClaimed: []
  };
  db.users.push(newUser);
  writeDb(db);
  return res.json({ success: true, userId: id, admin: isAdmin });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
  }
  return res.json({ success: true, userId: user.id, admin: user.admin });
});

// Get user data by ID
app.get('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = readDb();
  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden' });
  }
  // Exclude password before returning
  const { password, ...publicUser } = user;
  return res.json({ success: true, user: publicUser });
});

// Submit training entry (pending points)
app.post('/api/training', (req, res) => {
  const { userId, date } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.id == userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden' });
  }
  const pendingId = db.pendingPoints.length > 0 ? Math.max(...db.pendingPoints.map(p => p.id)) + 1 : 1;
  db.pendingPoints.push({ id: pendingId, userId: user.id, points: 1, category: 'Training', status: 'pending' });
  writeDb(db);
  return res.json({ success: true, pendingId });
});

// Award points by admin for other categories (immediate)
app.post('/api/award', (req, res) => {
  const { adminId, userId, category } = req.body;
  const db = readDb();
  const admin = db.users.find(u => u.id == adminId && u.admin);
  if (!admin) {
    return res.status(403).json({ success: false, message: 'Nicht autorisiert' });
  }
  const user = db.users.find(u => u.id == userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden' });
  }
  let points = 0;
  switch (category) {
    case 'Neukunde':
      points = 50;
      break;
    case 'Firmentraining':
      points = 75;
      break;
    case 'Spezialtraining':
      points = 5;
      break;
    case 'Privattraining':
      points = 10;
      break;
    default:
      return res.status(400).json({ success: false, message: 'Unbekannte Kategorie' });
  }
  user.monthPoints += points;
  user.yearPoints += points;
  writeDb(db);
  return res.json({ success: true, points });
});

// Confirm or reject pending training entries
app.post('/api/confirm', (req, res) => {
  const { adminId, pendingId, approve } = req.body;
  const db = readDb();
  const admin = db.users.find(u => u.id == adminId && u.admin);
  if (!admin) {
    return res.status(403).json({ success: false, message: 'Nicht autorisiert' });
  }
  const idx = db.pendingPoints.findIndex(p => p.id == pendingId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Eintrag nicht gefunden' });
  }
  const pending = db.pendingPoints[idx];
  if (approve) {
    const user = db.users.find(u => u.id == pending.userId);
    if (user) {
      user.monthPoints += pending.points;
      user.yearPoints += pending.points;
    }
  }
  db.pendingPoints.splice(idx, 1);
  writeDb(db);
  return res.json({ success: true });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const period = req.query.period || 'month';
  const limit = parseInt(req.query.limit || 10, 10);
  const db = readDb();
  const users = [...db.users];
  users.sort((a, b) => {
    const valA = period === 'year' ? a.yearPoints : a.monthPoints;
    const valB = period === 'year' ? b.yearPoints : b.monthPoints;
    return valB - valA;
  });
  const result = users.slice(0, limit).map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, points: period === 'year' ? u.yearPoints : u.monthPoints }));
  return res.json({ success: true, leaderboard: result });
});

// Rewards list for user
app.get('/api/rewards/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden' });
  }
  const currentPoints = user.yearPoints;
  const rewards = db.rewards.map(r => {
    const eligible = currentPoints >= r.min;
    return { ...r, eligible };
  });
  return res.json({ success: true, points: currentPoints, rewards });
});

// Pending points list (admin)
app.get('/api/pending', (req, res) => {
  const db = readDb();
  return res.json({ success: true, pending: db.pendingPoints });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});