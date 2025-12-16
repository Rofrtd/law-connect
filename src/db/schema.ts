import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const prompts = sqliteTable("prompts", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
});

export const records = sqliteTable("records", {
  id: text("id").primaryKey(),
  promptId: text("prompt_id").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  order: integer("order").notNull(),
});
