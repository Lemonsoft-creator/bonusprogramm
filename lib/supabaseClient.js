import fs from 'fs';
import path from 'path';

// Simple JSON-based client that mimics a subset of the Supabase API used
// in this project. Data is persisted in the root-level db.json file.
const DB_PATH = path.join(process.cwd(), 'db.json');

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { users: [], points: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

class Query {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.operation = 'select';
    this.payload = null;
    this.columns = '*';
    this.orderBy = null;
  }

  eq(column, value) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  gte(column, value) {
    this.filters.push((row) => row[column] >= value);
    return this;
  }

  in(column, values) {
    this.filters.push((row) => values.includes(row[column]));
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderBy = { column, ascending };
    return this;
  }

  select(columns = '*') {
    this.columns = columns;
    return this;
  }

  insert(rows) {
    this.operation = 'insert';
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(values) {
    this.operation = 'update';
    this.payload = values;
    return this;
  }

  async single() {
    const { data, error } = await this._execute();
    return { data: data[0] || null, error };
  }

  async _execute() {
    const db = readDB();
    const table = db[this.table] || [];

    const applyFilters = (rows) =>
      rows.filter((row) => this.filters.every((fn) => fn(row)));

    let rows;
    if (this.operation === 'insert') {
      const t = db[this.table] || (db[this.table] = []);
      const nextId = t.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
      this.payload.forEach((r, i) => {
        if (r.id == null) r.id = nextId + i;
        t.push({ ...r });
      });
      writeDB(db);
      rows = this.payload;
    } else if (this.operation === 'update') {
      const t = db[this.table] || [];
      rows = [];
      t.forEach((row) => {
        if (applyFilters([row]).length) {
          Object.assign(row, this.payload);
          rows.push(row);
        }
      });
      writeDB(db);
    } else {
      rows = applyFilters(table);
    }

    if (this.orderBy) {
      const { column, ascending } = this.orderBy;
      rows.sort((a, b) => {
        const va = a[column];
        const vb = b[column];
        if (va < vb) return ascending ? -1 : 1;
        if (va > vb) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (this.columns && this.columns !== '*') {
      const cols = this.columns.split(',').map((c) => c.trim());
      rows = rows.map((r) => {
        const obj = {};
        cols.forEach((c) => {
          obj[c] = r[c];
        });
        return obj;
      });
    }

    return { data: rows, error: null };
  }

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }
}

export const supabase = {
  from(table) {
    return new Query(table);
  },
};
