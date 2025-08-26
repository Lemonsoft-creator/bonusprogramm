import fs from 'fs';
import path from 'path';

const dbFile = path.join(process.cwd(), 'db.json');

/**
 * Lies die Datenbankdatei und gibt das geparste JSON zurück.
 */
export function readDb() {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // Falls die Datei nicht existiert, initialisiere sie
    const initial = { users: [], points: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2));
    return initial;
  }
}

/**
 * Speichert den gegebenen Objektzustand in der Datenbankdatei.
 * @param {Object} db
 */
export function writeDb(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}
