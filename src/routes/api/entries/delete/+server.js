import Database from "better-sqlite3";
import { env } from "process";

// Абсолютный путь к файлу базы
const dbPath = env.DB_PATH || "default.db"; // Путь до БД на ПК и защита от отсутствия файла
const db = new Database(dbPath);

export async function DELETE({ request }) {
  const { id } = await request.json();

  const stmt = db.prepare("DELETE FROM entries WHERE id = ?");
  const info = stmt.run(id);

  return new Response(JSON.stringify({ id: info.changes }), {
    headers: { "Content-Type": "application/json" }
  });
}