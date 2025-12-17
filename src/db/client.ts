import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";

export function createDb(filename = process.env.SQLITE_PATH ?? "db.sqlite") {
  const sqlite = new Database(filename);
  const db = drizzle(sqlite);

  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  return { db, sqlite };
}
