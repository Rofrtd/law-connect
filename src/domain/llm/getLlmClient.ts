import OpenAI from "openai";
import type { LlmClient } from "./interface";
import { OpenAiLlmClient } from "./openAiClient";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { LlmResponseSchema } from "./llmResponseSchema.ts";

// keep tests/e2e deterministic
class FakeLlmClient implements LlmClient {
  async generateRecords(promptText: string) {
    return [{ title: "Generated", body: `From: ${promptText}` }];
  }
}

export function getLlmClient(): LlmClient {
  const mode = process.env.LLM_MODE ?? "openai"; // "openai" | "fake"
  if (mode === "fake") return new FakeLlmClient();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const openai = new OpenAI({ apiKey });

  return new OpenAiLlmClient({
    fetchRaw: async (prompt) => {
      const res = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: prompt,
        text: {
          format: zodTextFormat(LlmResponseSchema, "event"),
        },
      });

      const raw = res.output_text;
      if (!raw) throw new Error("Empty LLM response");
      return raw;
    },
  });
}
