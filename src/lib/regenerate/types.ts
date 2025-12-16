export type RecordDTO = {
  id: string;
  title: string | null;
  body: string;
  order: number;
};

export type RegenerateResult = {
  promptId: string;
  promptText: string;
  records: RecordDTO[];
};
