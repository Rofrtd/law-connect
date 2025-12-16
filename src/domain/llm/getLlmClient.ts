import OpenAI from "openai";
import type { LlmClient } from "./contracts";
import { OpenAiLlmClient } from "./openAiClient";

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
      const res = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: 'Return ONLY valid JSON: {"records":[{"title":string|null,"body":string}]}',
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
      });

      const raw = res.output_text;
      if (!raw) throw new Error("Empty LLM response");
      return raw;
    },
  });
}
