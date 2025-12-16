import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import type Database from "better-sqlite3";
import { db } from "./index";

export function runMigrations(sqlite: Database.Database) {
  migrate(db, { migrationsFolder: "drizzle" });
}
