import { describe, it, expect, beforeEach, vi } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { updateRecordAction } from "./updateRecordAction";
import { db, sqlite } from "@/db";

// Mock Next.js revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateRecordAction", () => {
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

  it("successfully updates a record with valid data", async () => {
    const id = nanoid();
    db.insert(records)
      .values({
        id,
        promptId,
        title: "Original",
        body: "original body",
        order: 0,
      })
      .run();

    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", "Updated Title");
    formData.set("body", "Updated body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(true);

    const updated = db.select().from(records).all()[0];
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.body).toBe("Updated body");

    sqlite.close();
  });

  it("returns error when id is missing", async () => {
    const formData = new FormData();
    formData.set("body", "some body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record ID is required");
    }

    sqlite.close();
  });

  it("returns error when id is empty string", async () => {
    const formData = new FormData();
    formData.set("id", "   ");
    formData.set("body", "some body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record ID is required");
    }

    sqlite.close();
  });

  it("returns error when body is missing", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "Title", body: "body", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Body cannot be empty");
    }

    sqlite.close();
  });

  it("returns error when body is empty string", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "Title", body: "body", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);
    formData.set("body", "   ");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Body cannot be empty");
    }

    sqlite.close();
  });

  it("returns error when record does not exist", async () => {
    const nonExistentId = nanoid();

    const formData = new FormData();
    formData.set("id", nonExistentId);
    formData.set("body", "some body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Record not found or no changes made");
    }

    sqlite.close();
  });

  it("updates only body when title is not provided", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "Original", body: "original", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);
    formData.set("body", "Updated body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(true);

    const updated = db.select().from(records).all()[0];
    expect(updated?.title).toBe("Original"); // Title unchanged
    expect(updated?.body).toBe("Updated body");

    sqlite.close();
  });

  it("updates both title and body when both provided", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "Original", body: "original", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", "New Title");
    formData.set("body", "New body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(true);

    const updated = db.select().from(records).all()[0];
    expect(updated?.title).toBe("New Title");
    expect(updated?.body).toBe("New body");

    sqlite.close();
  });

  it("handles whitespace-only title by not updating it", async () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "Original", body: "original", order: 0 })
      .run();

    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", "   "); // whitespace only
    formData.set("body", "Updated body");

    const result = await updateRecordAction(formData);

    expect(result.success).toBe(true);

    const updated = db.select().from(records).all()[0];
    expect(updated?.title).toBe("Original"); // Title should remain unchanged
    expect(updated?.body).toBe("Updated body");

    sqlite.close();
  });
});
