import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const prompts = sqliteTable("prompts", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const records = sqliteTable("records", {
  id: text("id").primaryKey(),
  promptId: text("prompt_id")
    .notNull()
    .references(() => prompts.id, { onDelete: "cascade" }),
  title: text("title"),
  body: text("body").notNull(),
  order: integer("order").notNull(),
});
