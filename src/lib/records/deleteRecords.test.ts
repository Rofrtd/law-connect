import { describe, it, expect } from "vitest";
import { createDb } from "@/db/client";
import { records, prompts } from "@/db/schema";
import { nanoid } from "nanoid";
import { deleteRecordById } from "./deleteRecord";

describe("deleteRecordById", () => {
  it("deletes a record by id", () => {
    const { db, sqlite } = createDb(":memory:");

    // setup schema (if your createDb already migrates, great; if not, call initDb for tests)
    // If you already have a helper in tests that runs migrations, reuse it.

    const promptId = nanoid();
    db.insert(prompts).values({ id: promptId, text: "p" }).run();

    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "t", body: "b", order: 0 })
      .run();

    deleteRecordById(db, id);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(0);

    sqlite.close();
  });
});
