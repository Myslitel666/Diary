import Database from "better-sqlite3";
import { env } from "process";

// Абсолютный путь к файлу базы
const dbPath = env.DB_PATH || "default.db"; // Путь до БД на ПК и защита от отсутствия файла
const db = new Database(dbPath);

// Создаём таблицу details, если её ещё нет
db.prepare(`
  CREATE TABLE IF NOT EXISTS details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    content TEXT,
    FOREIGN KEY(entry_id) REFERENCES entries(id) ON DELETE CASCADE
  )
`).run();

// GET /api/details?entry_id=5
export function GET({ url }) {
  const entry_id = url.searchParams.get("entry_id");
  if (!entry_id) {
    return new Response(JSON.stringify({ error: "entry_id required" }), { status: 400 });
  }
  const rows = db.prepare("SELECT * FROM details WHERE entry_id = ? ORDER BY id DESC").all(entry_id);
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}


// POST /api/details — создать новую деталь
export async function POST({ request }) {
  const { entry_id, content } = await request.json();
  const stmt = db.prepare("INSERT INTO details (entry_id, content) VALUES (?, ?)");
  const info = stmt.run(entry_id, content);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
    headers: { "Content-Type": "application/json" }
  });
}

// PUT /api/details — обновить деталь по id
export async function PUT({ request }) {
  const { content, id } = await request.json();
  const stmt = db.prepare(`
    UPDATE details
    SET content = ?
    WHERE id = ?
  `);
  const info = stmt.run(content, id);
  return new Response(JSON.stringify({ updated: info.changes }), {
    headers: { "Content-Type": "application/json" }
  });
}

// DELETE /api/details — удалить деталь по id
export async function DELETE({ request }) {
  const { id } = await request.json();
  const stmt = db.prepare("DELETE FROM details WHERE id = ?");
  const info = stmt.run(id);
  return new Response(JSON.stringify({ deleted: info.changes }), {
    headers: { "Content-Type": "application/json" }
  });
}
