import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const sqlite = new Database(process.env.SQLITE_PATH ?? "db.sqlite");
export const db = drizzle(sqlite);

export type DB = typeof db;
