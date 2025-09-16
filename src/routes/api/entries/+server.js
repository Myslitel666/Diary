import Database from "better-sqlite3";
import { env } from "process";

// Абсолютный путь к файлу базы
const dbPath = env.DB_PATH || "default.db"; // Путь до БД на ПК и защита от отсутствия файла
const db = new Database(dbPath);

// Создаём таблицу, если нет
db.prepare(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT
  )
`).run();

// GET /api/entries
export function GET() {
  const rows = db.prepare("SELECT * FROM entries ORDER BY date DESC").all();
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}

// POST /api/entries
export async function POST({ request }) {
  const { date, title, content } = await request.json();
  const stmt = db.prepare("INSERT INTO entries (date, title, content) VALUES (?, ?, ?)");
  const info = stmt.run(date, title, content);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { headers: { "Content-Type": "application/json" } });
}

export async function PUT({ request }) {
  const { id, date, title, content } = await request.json();

  const stmt = db.prepare(`
    UPDATE entries
    SET date = ?, title = ?, content = ?
    WHERE id = ?
  `);
  const info = stmt.run(date, title, content, id);

  return new Response(JSON.stringify({ id: info.changes }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function DELETE({ request }) {
  const { id } = await request.json();

  const stmt = db.prepare("DELETE FROM entries WHERE id = ?");
  const info = stmt.run(id);

  return new Response(JSON.stringify({ id: info.changes }), {
    headers: { "Content-Type": "application/json" }
  });
}