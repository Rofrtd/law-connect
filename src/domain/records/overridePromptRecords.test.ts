import { describe, it, expect, beforeEach } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { overridePromptRecords } from "./overridePromptRecords";
import { db, sqlite } from "@/db";
import { eq } from "drizzle-orm";

describe("overridePromptRecords", () => {
  let promptId: string;

  beforeEach(() => {
    // Clear tables before each test
    db.delete(records).run();
    db.delete(prompts).run();

    // Create a prompt for testing
    promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "old prompt text", createdAt: new Date() })
      .run();
  });

  it("updates prompt text", () => {
    const newText = "updated prompt text";

    overridePromptRecords(newText, promptId, [
      { id: "new1", promptId, title: "new", body: "new", order: 0 },
    ]);

    const prompt = db.select().from(prompts).all()[0];
    expect(prompt?.text).toBe(newText);
  });

  it("deletes old records and inserts new ones", () => {
    // Insert old records
    db.insert(records)
      .values({ id: "old1", promptId, title: "old", body: "old", order: 0 })
      .run();
    db.insert(records)
      .values({ id: "old2", promptId, title: "old", body: "old", order: 1 })
      .run();

    // Override with new records
    const newRecords = [
      { id: "new1", promptId, title: "new", body: "new", order: 0 },
      { id: "new2", promptId, title: "new", body: "new", order: 1 },
      { id: "new3", promptId, title: "new", body: "new", order: 2 },
    ];

    overridePromptRecords("new text", promptId, newRecords);

    const allRecords = db.select().from(records).all();
    expect(allRecords).toHaveLength(3);
    expect(allRecords[0].id).toBe("new1");
    expect(allRecords[1].id).toBe("new2");
    expect(allRecords[2].id).toBe("new3");
  });

  it("only affects records for the specified prompt", () => {
    const otherPromptId = nanoid();
    db.insert(prompts)
      .values({ id: otherPromptId, text: "other", createdAt: new Date() })
      .run();

    // Insert records for both prompts
    db.insert(records)
      .values({ id: "1", promptId, title: "t1", body: "b1", order: 0 })
      .run();
    db.insert(records)
      .values({
        id: "2",
        promptId: otherPromptId,
        title: "t2",
        body: "b2",
        order: 0,
      })
      .run();

    // Override only the first prompt's records
    overridePromptRecords("new", promptId, [
      { id: "3", promptId, title: "new", body: "new", order: 0 },
    ]);

    const recordsForPrompt = db
      .select()
      .from(records)
      .where(eq(records.promptId, promptId))
      .all();
    const recordsForOther = db
      .select()
      .from(records)
      .where(eq(records.promptId, otherPromptId))
      .all();

    expect(recordsForPrompt).toHaveLength(1);
    expect(recordsForPrompt[0].id).toBe("3");
    expect(recordsForOther).toHaveLength(1);
    expect(recordsForOther[0].id).toBe("2");
  });

  it("handles multiple new records with correct ordering", () => {
    const newRecords = [
      { id: "1", promptId, title: "first", body: "b1", order: 0 },
      { id: "2", promptId, title: "second", body: "b2", order: 1 },
      { id: "3", promptId, title: "third", body: "b3", order: 2 },
      { id: "4", promptId, title: "fourth", body: "b4", order: 3 },
    ];

    overridePromptRecords("test", promptId, newRecords);

    const allRecords = db.select().from(records).all();
    expect(allRecords).toHaveLength(4);
    allRecords.forEach((record, index) => {
      expect(record.order).toBe(index);
    });

    sqlite.close();
  });
});
