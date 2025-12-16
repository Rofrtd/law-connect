export type GeneratedRecord = {
  title: string | null;
  body: string;
};

export interface LlmClient {
  generateRecords(promptText: string): Promise<GeneratedRecord[]>;
}
