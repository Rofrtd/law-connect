import { describe, it, expect } from "vitest";
import { OpenAiLlmClient } from "./openAiClient";

describe("OpenAiLlmClient", () => {
  it("returns parsed records from raw JSON", async () => {
    const client = new OpenAiLlmClient({
      fetchRaw: async () =>
        JSON.stringify({
          records: [{ title: "A", body: "B" }],
        }),
    });

    const records = await client.generateRecords("ignored");

    expect(records).toEqual([{ title: "A", body: "B" }]);
  });
});
