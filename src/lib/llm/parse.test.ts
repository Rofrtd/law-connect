import { describe, it, expect } from "vitest";
import { parseLlmJson } from "./parse";

describe("parseLlmJson", () => {
  it("throws on invalid JSON", () => {
    expect(() => parseLlmJson("not-json")).toThrow();
  });

  it("throws on invalid shape", () => {
    const raw = JSON.stringify({ nope: true });
    expect(() => parseLlmJson(raw)).toThrow();
  });

  it("parses valid JSON into records", () => {
    const raw = JSON.stringify({
      records: [{ title: "A", body: "B" }, { body: "Only body" }],
    });

    const result = parseLlmJson(raw);

    expect(result.records).toEqual([
      { title: "A", body: "B" },
      { title: null, body: "Only body" },
    ]);
  });
});
