import { describe, it, expect, vi } from "vitest";
import { records, prompts } from "@/db/schema";
import { nanoid } from "nanoid";
import { deleteRecordById } from "./deleteRecord";
import { db, sqlite } from "@/db";

describe("deleteRecordById", () => {
  it("deletes a record by id", () => {
    const promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "p", createdAt: new Date() })
      .run();

    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "t", body: "b", order: 0 })
      .run();

    deleteRecordById(id);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(0);

    sqlite.close();
  });
});
