import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { prompts, records } from "@/db/schema";
import type { RegenerateResult } from "./types";
import { LlmClient } from "../llm/interface";
import { db } from "@/db";

export async function regenerateFromPrompt(
  llm: LlmClient,
  promptText: string
): Promise<RegenerateResult> {
  const promptId = nanoid();

  const generated = await llm.generateRecords(promptText);

  const newRecords = generated.map((r, index) => ({
    id: nanoid(),
    promptId,
    title: r.title,
    body: r.body,
    order: index,
  }));

  db.transaction((tx) => {
    tx.insert(prompts)
      .values({ id: promptId, text: promptText, createdAt: new Date() })
      .run();

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
