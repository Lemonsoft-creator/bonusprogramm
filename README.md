# All in Sport Bonusprogramm Webapp

Diese Repository enthält einen funktionsfähigen Prototyp für das Bonusprogramm **„All in Sport“**. Die Anwendung kombiniert ein Node‑/Express‑Backend mit einer einfachen HTML/CSS/JavaScript‑Oberfläche für Endnutzer und Administratoren. Sie basiert auf den bereitgestellten PDF‑ und DOCX‑Dokumenten und dient als Grundlage für eine digitale Bonusplattform, die Trainingseinträge verwaltet, Punkte vergibt und Belohnungen ausgibt.

## Aufbau

* **`webapp/backend`** – Node‑/Express‑Server mit einer JSON‑Datei (`db.json`) als Datenbank. Stellt REST‑Endpunkte bereit für Registrierung/Login, Anlegen von Trainingseinträgen, Punktevergaben durch Admins sowie Abruf des Punktestands und der Leaderboards.
* **`webapp/frontend`** – Schlanke HTML/CSS/JS‑Oberfläche für Benutzer‑ und Admin‑Funktionen. Enthält die Seiten `index.html` (Registrierung/Login), `dashboard.html` (Punktestand, Trainingseintrag & Rewards) und `admin.html` (Admin‑Cockpit für Punktevergabe und Bestätigungen) sowie das Stylesheet `style.css`.
* **`vercel.json`** – Konfigurationsdatei für Vercel. Definiert, wie das Express‑Backend als Serverless‑Funktion eingebunden wird und welche statischen Routen für die Frontend‑Seiten gelten. Mit dieser Datei kann die komplette App direkt auf Vercel deployed werden.

## Lokale Nutzung

1. Installiere Node .js (Version 16 oder höher) und npm.
2. Wechsle ins Backend‑Verzeichnis:

   ```bash
   cd webapp/backend
   ```

3. Installiere die Abhängigkeiten:

   ```bash
   npm install
   ```

4. Starte den Server:

   ```bash
   npm start
   ```

   Der Express‑Server läuft dann unter `http://localhost:3000` und bedient sowohl die API‑Endpunkte als auch die statischen HTML‑Seiten aus `webapp/frontend`.

5. Öffne anschließend `http://localhost:3000/index.html` in deinem Browser. Du kannst dich registrieren oder als Admin anmelden (der Admin‑Code ist in `webapp/backend/db.json` hinterlegt, standardmäßig `ALLIN2024ADMIN`).

6. Nach dem Login gelangst du als normaler Nutzer zum `dashboard.html` und als Administrator zum `admin.html`.

## Deployment auf Vercel

Diese Webapp ist für die Bereitstellung auf **Vercel** vorbereitet. Die Datei `vercel.json` konfiguriert das Node‑Backend als Serverless‑Funktion und stellt die statischen Frontend‑Seiten bereit. Um die App zu deployen:

1. Melde dich bei Vercel an und importiere dieses GitHub‑Repository als neues Projekt.
2. Vercel erkennt die `vercel.json`‑Konfiguration automatisch. Es werden zwei Builds erzeugt: eine Node‑Serverless‑Funktion für `webapp/backend/server.js` und ein statisches Frontend aus `webapp/frontend`.
3. Nach dem Deployment erreichst du die Anwendung über die bereitgestellte Vercel‑URL. Die API ist unter `/api/*` verfügbar, das Frontend unter `/`, `/dashboard` und `/admin`.

## Nächste Schritte

Dieser Prototyp kann weiter ausgebaut werden. Mögliche Erweiterungen sind unter anderem:

* Integration einer echten Datenbank (z. B. MongoDB oder PostgreSQL) statt der JSON‑Datei.
* Verbesserte Validierung und Passwort‑Hashing für erhöhte Sicherheit.
* Responsive UI und modernere Gestaltung der Frontend‑Seiten.
* Automatische Zurücksetzung der Monatspunkte zum Monatsanfang und periodische Leaderboard‑Benachrichtigungen.

Feedback und Vorschläge zur Erweiterung des Bonusprogramms sind jederzeit willkommen.