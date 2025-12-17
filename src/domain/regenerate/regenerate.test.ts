import { describe, it, expect } from "vitest";
import { createDb } from "@/db/client";
import { regenerateFromPrompt } from "./regenerate";
import type { LlmClient } from "@/domain/llm/interface";

const fakeLlm: LlmClient = {
  async generateRecords(promptText: string) {
    return [{ title: "Generated", body: `From: ${promptText}` }];
  },
};

describe("regenerateFromPrompt", () => {
  it("replaces existing records when regenerating", async () => {
    const { sqlite } = createDb(":memory:");

    const first = await regenerateFromPrompt(fakeLlm, "first prompt");
    const second = await regenerateFromPrompt(fakeLlm, "second prompt");

    expect(first.records.length).toBeGreaterThan(0);
    expect(second.records.length).toBeGreaterThan(0);
    expect(second.records).not.toEqual(first.records);
  });
});
