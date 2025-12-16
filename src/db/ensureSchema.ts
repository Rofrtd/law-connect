import { db } from "./index";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";

let initialized = false;

export function ensureSchema() {
  if (initialized) return;
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  initialized = true;
}
