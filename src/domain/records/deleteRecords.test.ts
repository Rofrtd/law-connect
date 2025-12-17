import { describe, it, expect, vi, beforeEach } from "vitest";
import { records, prompts } from "@/db/schema";
import { nanoid } from "nanoid";
import { deleteRecordById } from "./deleteRecord";
import { db, sqlite } from "@/db";

describe("deleteRecordById", () => {
  let promptId: string;

  beforeEach(() => {
    // Clear tables before each test
    db.delete(records).run();
    db.delete(prompts).run();

    // Create a prompt for testing
    promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "test prompt", createdAt: new Date() })
      .run();
  });

  it("deletes a record by id", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "t", body: "b", order: 0 })
      .run();

    await deleteRecordById(id);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(0);

    sqlite.close();
  });

  it("throws error when record does not exist", async () => {
    const nonExistentId = nanoid();

    await expect(deleteRecordById(nonExistentId)).rejects.toThrow(
      "Record not found"
    );

    sqlite.close();
  });

  it("does not delete other records", async () => {
    const id1 = nanoid();
    const id2 = nanoid();

    db.insert(records)
      .values({ id: id1, promptId, title: "t1", body: "b1", order: 0 })
      .run();
    db.insert(records)
      .values({ id: id2, promptId, title: "t2", body: "b2", order: 1 })
      .run();

    await deleteRecordById(id1);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.id).toBe(id2);

    sqlite.close();
  });
});
