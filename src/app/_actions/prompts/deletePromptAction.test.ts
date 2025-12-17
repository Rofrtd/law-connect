import { describe, it, expect, beforeEach, vi } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { deletePromptAction } from "./deletePromptAction";
import { db, sqlite } from "@/db";

// Mock Next.js revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deletePromptAction", () => {
  beforeEach(() => {
    // Clear tables before each test
    db.delete(records).run();
    db.delete(prompts).run();
  });

  it("successfully deletes a prompt with valid id", async () => {
    const id = nanoid();
    db.insert(prompts)
      .values({ id, text: "test prompt", createdAt: new Date() })
      .run();

    const formData = new FormData();
    formData.append("promptId", id);

    await deletePromptAction(formData);

    const remaining = db.select().from(prompts).all();
    expect(remaining).toHaveLength(0);
  });

  it("deletes associated records when deleting prompt", async () => {
    const promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "test prompt", createdAt: new Date() })
      .run();

    db.insert(records)
      .values({
        id: nanoid(),
        promptId,
        title: "Record 1",
        body: "Body 1",
        order: 0,
      })
      .run();

    const formData = new FormData();
    formData.append("promptId", promptId);

    await deletePromptAction(formData);

    const remainingPrompts = db.select().from(prompts).all();
    const remainingRecords = db.select().from(records).all();
    expect(remainingPrompts).toHaveLength(0);
    expect(remainingRecords).toHaveLength(0);
  });

  it("throws error when promptId is missing", async () => {
    const formData = new FormData();

    await expect(deletePromptAction(formData)).rejects.toThrow(
      "Prompt ID is required"
    );
  });

  it("throws error when prompt does not exist", async () => {
    const formData = new FormData();
    formData.append("promptId", "nonexistent-id");

    await expect(deletePromptAction(formData)).rejects.toThrow();
  });

  it("handles empty promptId string", async () => {
    const formData = new FormData();
    formData.append("promptId", "   ");

    await expect(deletePromptAction(formData)).rejects.toThrow(
      "Prompt ID is required"
    );

    sqlite.close();
  });
});
