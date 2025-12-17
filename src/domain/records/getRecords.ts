import { records } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export function getRecords(promptId: string) {
  return db
    .select()
    .from(records)
    .where(eq(records.promptId, promptId))
    .orderBy(records.order)
    .all();
}
