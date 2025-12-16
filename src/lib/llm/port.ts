export type LlmRecordInput = { title: string | null; body: string };

export interface LlmClient {
  generateRecords(promptText: string): Promise<LlmRecordInput[]>;
}
