import { describe, it, expect } from "vitest";
import { createDb } from "@/db/client";
import { regenerateFromPrompt } from "./regenerate";

describe("regenerateFromPrompt", () => {
  it("replaces existing records when regenerating", async () => {
    const { db, sqlite } = createDb(":memory:");

    sqlite.exec(`
      CREATE TABLE prompts (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL
      );

      CREATE TABLE records (
        id TEXT PRIMARY KEY,
        prompt_id TEXT NOT NULL,
        title TEXT,
        body TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);

    const first = await regenerateFromPrompt(db, "first prompt");
    const second = await regenerateFromPrompt(db, "second prompt");

    expect(first.records.length).toBeGreaterThan(0);
    expect(second.records.length).toBeGreaterThan(0);
    expect(second.records).not.toEqual(first.records);
  });
});
