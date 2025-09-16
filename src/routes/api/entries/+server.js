import Database from "better-sqlite3";
import { env } from "process";

// Абсолютный путь к файлу базы
const dbPath = env.DB_PATH || "default.db"; // Путь до БД на ПК и защита от отсутствия файла
const db = new Database(dbPath);

// Создаём таблицу, если нет
db.prepare(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// GET /api/entries
export function GET() {
  const rows = db.prepare("SELECT * FROM entries ORDER BY created_at DESC").all();
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}

// POST /api/entries
export async function POST({ request }) {
  const { title, content } = await request.json();
  const stmt = db.prepare("INSERT INTO entries (title, content) VALUES (?, ?)");
  const info = stmt.run(title, content);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { headers: { "Content-Type": "application/json" } });
}
