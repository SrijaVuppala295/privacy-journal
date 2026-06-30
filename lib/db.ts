import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
  locateFile: (file) => `/${file}`,
});

  // Try to load existing DB from browser storage (IndexedDB-backed)
  const savedData = localStorage.getItem('journal-db');
  if (savedData) {
    const buffer = Uint8Array.from(JSON.parse(savedData));
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem('journal-db', JSON.stringify(Array.from(data)));
}