import { describe, it, expect, beforeEach, vi } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { deleteRecordAction } from "./deleteRecordAction";
import { db, sqlite } from "@/db";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteRecordAction", () => {
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

  it("successfully deletes a record", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "title", body: "body", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);

    const result = await deleteRecordAction(formData);

    expect(result.success).toBe(true);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(0);

    sqlite.close();
  });

  it("returns error when id is missing", async () => {
    const formData = new FormData();
    // id is not set

    const result = await deleteRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record ID is required");
    }

    sqlite.close();
  });

  it("returns error when id is empty string", async () => {
    const formData = new FormData();
    formData.set("id", "   ");

    const result = await deleteRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record ID is required");
    }

    sqlite.close();
  });

  it("returns error when record does not exist", async () => {
    const nonExistentId = nanoid();
    const formData = new FormData();
    formData.set("id", nonExistentId);

    const result = await deleteRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record not found");
    }

    sqlite.close();
  });

  it("does not delete other records when deleting one", async () => {
    const id1 = nanoid();
    const id2 = nanoid();

    db.insert(records)
      .values({ id: id1, promptId, title: "t1", body: "b1", order: 0 })
      .run();
    db.insert(records)
      .values({ id: id2, promptId, title: "t2", body: "b2", order: 1 })
      .run();

    const formData = new FormData();
    formData.set("id", id1);

    const result = await deleteRecordAction(formData);

    expect(result.success).toBe(true);

    const remaining = db.select().from(records).all();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.id).toBe(id2);

    sqlite.close();
  });
});
