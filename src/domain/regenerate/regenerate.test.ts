import { describe, it, expect } from "vitest";
import { createDb } from "@/db/client";
import { regenerateFromPrompt } from "./regenerate";

import type { LlmClient } from "@/domain/llm/contracts";

const fakeLlm: LlmClient = {
  async generateRecords(promptText: string) {
    return [{ title: "Generated", body: `From: ${promptText}` }];
  },
};

describe("regenerateFromPrompt", () => {
  it("replaces existing records when regenerating", async () => {
    const { db, sqlite } = createDb(":memory:");

    const first = await regenerateFromPrompt(db, fakeLlm, "first prompt");
    const second = await regenerateFromPrompt(db, fakeLlm, "second prompt");

    expect(first.records.length).toBeGreaterThan(0);
    expect(second.records.length).toBeGreaterThan(0);
    expect(second.records).not.toEqual(first.records);
  });
});
