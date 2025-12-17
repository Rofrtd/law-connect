import { describe, it, expect, beforeEach } from "vitest";
import { regenerateFromPrompt } from "./regenerate";
import { db } from "@/db";
import { prompts, records } from "@/db/schema";
import type { LlmClient } from "@/domain/llm/interface";
import { eq } from "drizzle-orm";

const fakeLlm: LlmClient = {
  async generateRecords(promptText: string) {
    return [{ title: "Generated", body: `From: ${promptText}` }];
  },
};

const multiRecordLlm: LlmClient = {
  async generateRecords(promptText: string) {
    return [
      { title: "First", body: "First body" },
      { title: "Second", body: "Second body" },
      { title: "Third", body: "Third body" },
    ];
  },
};

const noTitleLlm: LlmClient = {
  async generateRecords(promptText: string) {
    return [{ title: null, body: "Body without title" }];
  },
};

describe("regenerateFromPrompt", () => {
  beforeEach(() => {
    // Reset database for each test
    db.delete(records).run();
    db.delete(prompts).run();
  });

  it("creates a new prompt with the provided text", async () => {
    const promptText = "test prompt";

    const result = await regenerateFromPrompt(fakeLlm, promptText);

    expect(result.promptText).toBe(promptText);

    const prompt = db
      .select()
      .from(prompts)
      .where(eq(prompts.id, result.promptId))
      .get();
    expect(prompt).toBeDefined();
    expect(prompt?.text).toBe(promptText);
  });

  it("creates records with correct structure and ordering", async () => {
    const result = await regenerateFromPrompt(multiRecordLlm, "test");

    expect(result.records).toHaveLength(3);

    // Verify ordering
    expect(result.records[0].order).toBe(0);
    expect(result.records[1].order).toBe(1);
    expect(result.records[2].order).toBe(2);

    // Verify content
    expect(result.records[0].title).toBe("First");
    expect(result.records[1].title).toBe("Second");
    expect(result.records[2].title).toBe("Third");
  });

  it("assigns unique IDs to each record", async () => {
    const result = await regenerateFromPrompt(multiRecordLlm, "test");

    const ids = result.records.map((r) => r.id);
    const uniqueIds = new Set(ids);

    expect(ids).toHaveLength(result.records.length);
    expect(uniqueIds.size).toBe(result.records.length);
  });

  it("handles null titles from LLM", async () => {
    const result = await regenerateFromPrompt(noTitleLlm, "test");

    expect(result.records).toHaveLength(1);
    expect(result.records[0].title).toBeNull();
    expect(result.records[0].body).toBe("Body without title");
  });

  it("returns records in the correct order", async () => {
    const result = await regenerateFromPrompt(multiRecordLlm, "test");

    for (let i = 0; i < result.records.length; i++) {
      expect(result.records[i].order).toBe(i);
    }
  });

  it("stores prompt with current timestamp", async () => {
    const beforeTime = new Date();

    const result = await regenerateFromPrompt(fakeLlm, "test");

    const afterTime = new Date();

    const prompt = db
      .select()
      .from(prompts)
      .where(eq(prompts.id, result.promptId))
      .get();

    expect(prompt?.createdAt).toBeDefined();
    expect(prompt!.createdAt.getTime()).toBeGreaterThanOrEqual(
      beforeTime.getTime()
    );
    expect(prompt!.createdAt.getTime()).toBeLessThanOrEqual(
      afterTime.getTime()
    );
  });

  it("replaces existing records when regenerating", async () => {
    const first = await regenerateFromPrompt(fakeLlm, "first prompt");
    const second = await regenerateFromPrompt(fakeLlm, "second prompt");

    expect(first.records.length).toBeGreaterThan(0);
    expect(second.records.length).toBeGreaterThan(0);
    expect(second.records).not.toEqual(first.records);
  });

  it("persists records to database", async () => {
    const result = await regenerateFromPrompt(multiRecordLlm, "test");

    const savedRecords = db
      .select()
      .from(records)
      .where(eq(records.promptId, result.promptId))
      .all();

    expect(savedRecords).toHaveLength(3);
    expect(savedRecords.map((r) => r.id)).toEqual(
      result.records.map((r) => r.id)
    );
  });
});
