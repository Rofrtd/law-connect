import { LlmRecordsSchema } from "./schema";

export class LlmParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LlmParseError";
  }
}

export function parseLlmJson(raw: string) {
  console.log("Raw LLM output:", raw);
  let json: unknown;

  try {
    json = JSON.parse(raw);
  } catch {
    throw new LlmParseError("LLM output was not valid JSON");
  }

  const result = LlmRecordsSchema.safeParse(json);
  if (!result.success) {
    throw new LlmParseError("LLM JSON did not match expected shape");
  }

  // normalize title to null (not undefined)
  return {
    records: result.data.records.map((r) => ({
      title: r.title ?? null,
      body: r.body,
    })),
  };
}
