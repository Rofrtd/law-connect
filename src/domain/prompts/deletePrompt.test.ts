import { describe, it, expect, beforeEach } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { deletePromptById } from "./deletePrompt";
import { db, sqlite } from "@/db";

describe("deletePromptById", () => {
  beforeEach(() => {
    // Clear tables before each test
    db.delete(records).run();
    db.delete(prompts).run();
  });

  it("throws error when prompt does not exist", async () => {
    await expect(deletePromptById("nonexistent-id")).rejects.toThrow(
      "Prompt not found"
    );
  });

  it("deletes a prompt by id", async () => {
    const id = nanoid();
    db.insert(prompts)
      .values({ id, text: "test prompt", createdAt: new Date() })
      .run();

    await deletePromptById(id);

    const remaining = db.select().from(prompts).all();
    expect(remaining).toHaveLength(0);
  });

  it("only deletes the specified prompt", async () => {
    const id1 = nanoid();
    const id2 = nanoid();

    db.insert(prompts)
      .values({ id: id1, text: "prompt 1", createdAt: new Date() })
      .run();
    db.insert(prompts)
      .values({ id: id2, text: "prompt 2", createdAt: new Date() })
      .run();

    await deletePromptById(id1);

    const remaining = db.select().from(prompts).all();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(id2);
  });

  it("cascades deletion to associated records", async () => {
    const promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "test prompt", createdAt: new Date() })
      .run();

    // Insert records associated with the prompt
    db.insert(records)
      .values({
        id: nanoid(),
        promptId,
        title: "Record 1",
        body: "Body 1",
        order: 0,
      })
      .run();
    db.insert(records)
      .values({
        id: nanoid(),
        promptId,
        title: "Record 2",
        body: "Body 2",
        order: 1,
      })
      .run();

    await deletePromptById(promptId);

    const remainingPrompts = db.select().from(prompts).all();
    const remainingRecords = db.select().from(records).all();
    expect(remainingPrompts).toHaveLength(0);
    expect(remainingRecords).toHaveLength(0);
  });

  it("only deletes records for the specified prompt", async () => {
    const promptId1 = nanoid();
    const promptId2 = nanoid();

    db.insert(prompts)
      .values({ id: promptId1, text: "prompt 1", createdAt: new Date() })
      .run();
    db.insert(prompts)
      .values({ id: promptId2, text: "prompt 2", createdAt: new Date() })
      .run();

    db.insert(records)
      .values({
        id: nanoid(),
        promptId: promptId1,
        title: "Record 1-1",
        body: "Body 1-1",
        order: 0,
      })
      .run();
    db.insert(records)
      .values({
        id: nanoid(),
        promptId: promptId2,
        title: "Record 2-1",
        body: "Body 2-1",
        order: 0,
      })
      .run();

    await deletePromptById(promptId1);

    const remainingRecords = db.select().from(records).all();
    expect(remainingRecords).toHaveLength(1);
    expect(remainingRecords[0].promptId).toBe(promptId2);

    sqlite.close();
  });
});
