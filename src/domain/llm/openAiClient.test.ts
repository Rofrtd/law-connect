import { describe, it, expect, vi } from "vitest";
import { OpenAiLlmClient } from "./openAiClient";

describe("OpenAiLlmClient", () => {
  it("calls fetchRaw and returns parsed records", async () => {
    const fetchRaw = vi.fn(async (_prompt: string) => {
      return JSON.stringify({
        records: [
          { title: "T1", body: "B1" },
          { title: null, body: "B2" },
        ],
      });
    });

    const client = new OpenAiLlmClient({ fetchRaw });

    const records = await client.generateRecords("hello");

    expect(fetchRaw).toHaveBeenCalledTimes(1);
    expect(fetchRaw).toHaveBeenCalledWith("hello");

    expect(records).toEqual([
      { title: "T1", body: "B1" },
      { title: null, body: "B2" },
    ]);
  });

  it("throws when fetchRaw returns invalid JSON", async () => {
    const fetchRaw = vi.fn(async () => "not json");

    const client = new OpenAiLlmClient({ fetchRaw });

    await expect(client.generateRecords("hello")).rejects.toThrow();
  });

  it("throws when JSON is missing records", async () => {
    const fetchRaw = vi.fn(async () => JSON.stringify({ nope: [] }));

    const client = new OpenAiLlmClient({ fetchRaw });

    await expect(client.generateRecords("hello")).rejects.toThrow();
  });
});
