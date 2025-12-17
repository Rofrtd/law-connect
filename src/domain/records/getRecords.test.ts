import { describe, it, expect, beforeEach } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { getRecords } from "./getRecords";
import { db, sqlite } from "@/db";

describe("getRecords", () => {
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

  it("returns empty array when no records exist for a prompt", () => {
    const result = getRecords(promptId);
    expect(result).toEqual([]);
  });

  it("returns records ordered by order field", () => {
    db.insert(records)
      .values({ id: "1", promptId, title: "first", body: "b1", order: 2 })
      .run();
    db.insert(records)
      .values({ id: "2", promptId, title: "second", body: "b2", order: 1 })
      .run();
    db.insert(records)
      .values({ id: "3", promptId, title: "third", body: "b3", order: 3 })
      .run();

    const result = getRecords(promptId);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("2"); // order: 1
    expect(result[1].id).toBe("1"); // order: 2
    expect(result[2].id).toBe("3"); // order: 3
  });

  it("returns only records for the specified prompt", () => {
    const otherPromptId = nanoid();
    db.insert(prompts)
      .values({
        id: otherPromptId,
        text: "other prompt",
        createdAt: new Date(),
      })
      .run();

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

    const result = getRecords(promptId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("returns single record when only one exists", () => {
    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "title", body: "body", order: 0 })
      .run();

    const result = getRecords(promptId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(id);
    expect(result[0].title).toBe("title");
    expect(result[0].body).toBe("body");
  });

  it("returns all record fields correctly", () => {
    const id = nanoid();
    const title = "test title";
    const body = "test body";
    const order = 5;

    db.insert(records).values({ id, promptId, title, body, order }).run();

    const result = getRecords(promptId);

    expect(result[0]).toHaveProperty("id", id);
    expect(result[0]).toHaveProperty("promptId", promptId);
    expect(result[0]).toHaveProperty("title", title);
    expect(result[0]).toHaveProperty("body", body);
    expect(result[0]).toHaveProperty("order", order);

    sqlite.close();
  });
});
