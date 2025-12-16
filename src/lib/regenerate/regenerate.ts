import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { prompts, records } from "@/db/schema";
import type { RegenerateResult } from "./types";

type Db = {
  insert: any;
  delete: any;
  select: any;
};

export async function regenerateFromPrompt(
  db: Db,
  promptText: string
): Promise<RegenerateResult> {
  const promptId = nanoid();

  // delete all existing records + prompts (single-user)
  await db.delete(records);
  await db.delete(prompts);

  await db.insert(prompts).values({ id: promptId, text: promptText });

  // deterministic “LLM output” for now
  const newRecords = [
    {
      id: nanoid(),
      promptId,
      title: "Generated",
      body: `From: ${promptText}`,
      order: 0,
    },
  ];

  await db.insert(records).values(
    newRecords.map((r) => ({
      id: r.id,
      promptId: r.promptId,
      title: r.title,
      body: r.body,
      order: r.order,
    }))
  );

  const inserted = await db
    .select()
    .from(records)
    .where(eq(records.promptId, promptId))
    .orderBy(records.order);

  return {
    promptId,
    promptText,
    records: inserted,
  };
}
