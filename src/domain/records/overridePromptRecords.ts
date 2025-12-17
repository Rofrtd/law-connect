import { db } from "@/db";
import { prompts, records } from "@/db/schema";
import { eq } from "drizzle-orm";

export function overridePromptRecords(
  promptText: string,
  promptId: string,
  newRecords: any[]
) {
  db.transaction((tx) => {
    // Update the prompt text
    tx.update(prompts)
      .set({ text: promptText })
      .where(eq(prompts.id, promptId))
      .run();

    // Delete old records for this prompt
    tx.delete(records).where(eq(records.promptId, promptId)).run();

    // Insert new records
    tx.insert(records).values(newRecords).run();
  });
}
