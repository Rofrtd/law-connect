import type { LlmClient } from "./contracts";
import { parseLlmJson } from "./parse";

type OpenAiLlmClientDeps = {
  fetchRaw: (promptText: string) => Promise<string>;
};

export class OpenAiLlmClient implements LlmClient {
  constructor(private deps: OpenAiLlmClientDeps) {}

  async generateRecords(promptText: string) {
    const raw = await this.deps.fetchRaw(promptText);
    return parseLlmJson(raw).records;
  }
}
