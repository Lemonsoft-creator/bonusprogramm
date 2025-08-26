# All in Sport Bonusprogramm Webapp

Dieses Repository enthält eine Webapplikation für das Bonusprogramm „All in Sport“. Sie ermöglicht die Verwaltung von Punkten, Trainingseinträgen und Belohnungen für Benutzer sowie ein Admin‑Cockpit für die Punktevergabe. Die Applikation besteht aus einem Node/Express‑Backend und einer schlanken HTML/CSS/JS‑Oberfläche.

## Struktur

- `webapp/backend` – Node.js‑Express‑Server mit einer JSON‑Datenbank (`db.json`). Stellt REST‑Endpoints zur Nutzerverwaltung, Login, Punktevergabe und Trainingseinträge bereit.
- `webapp/frontend` – Statische HTML‑Seiten für Benutzer (Dashboard, Trainingseintrag) und Administratoren (Punktevergabe, Bestätigungen). Die Dateien `index.html`, `dashboard.html`, `admin.html` und `style.css` gehören hierzu.

## Lokale Entwicklung

1. Navigiere in der Konsole in das Backend‑Verzeichnis:
   ```bash
   cd webapp/backend
   npm install
   npm start
   ```
   Der Express‑Server läuft danach auf `http://localhost:3000/` und verwendet `db.json` als persistenten Datenspeicher.

2. Öffne `webapp/frontend/index.html` (oder `dashboard.html` bzw. `admin.html`) in deinem Browser. Bei Bedarf passe in den JavaScript‑Dateien die Basis‑URL für API‑Anfragen (`const API_BASE = "http://localhost:3000"`) an.

## Deployment

- **GitHub**: Alle Dateien werden in diesem Repository verwaltet.
- **Vercel/Andere**: Für den Betrieb auf Vercel muss eine Node‑Backend‑Funktion eingerichtet werden oder der Server auf einer Plattform wie Heroku/Render laufen. Die Frontend‑Dateien können separat gehostet werden. Alternativ kann das Backend mit Vercel Serverless Functions betrieben werden; passe die API‑Routen entsprechend an.

## Admin‑Zugang und Beispiel‑Daten

Die Datei `db.json` enthält Beispielnutzer und einen Admin‑Account, der mit dem Feld `admin: true` gekennzeichnet ist. Das Feld `adminCode` legt den Geheimcode fest, den Admins beim Login eingeben müssen. Für Tests können die vorhandenen Benutzer und Punktewerte genutzt werden.
