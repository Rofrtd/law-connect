import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export function createDb(filename: string = "db.sqlite") {
  const sqlite = new Database(filename);
  const db = drizzle(sqlite);
  return { db, sqlite };
}
