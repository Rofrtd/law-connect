import { z } from "zod";

export const LlmResponseSchema = z.object({
  records: z.array(
    z.object({
      title: z.string().nullable().optional(),
      body: z.string(),
    })
  ),
});

export type LlmParsed = z.infer<typeof LlmResponseSchema>;
