import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { prompts, records } from "@/db/schema";
import type { RegenerateResult } from "./types";
import type { DB } from "@/db";

export async function regenerateFromPrompt(
  db: DB,
  promptText: string
): Promise<RegenerateResult> {
  const promptId = nanoid();

  const newRecords = [
    {
      id: nanoid(),
      promptId,
      title: "Generated",
      body: `From: ${promptText}`,
      order: 0,
    },
  ];

  db.transaction((tx) => {
    // single-user: wipe previous data
    tx.delete(records).run();
    tx.delete(prompts).run();

    tx.insert(prompts).values({ id: promptId, text: promptText }).run();

    // no mapping needed if object shape matches schema columns
    tx.insert(records).values(newRecords).run();
  });

  const inserted = db
    .select()
    .from(records)
    .where(eq(records.promptId, promptId))
    .orderBy(records.order)
    .all();

  return {
    promptId,
    promptText,
    records: inserted,
  };
}
