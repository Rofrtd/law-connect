import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import type { DB } from "@/db";

export function updateRecordById(
  db: DB,
  id: string,
  patch: { title?: string; body?: string }
) {
  db.update(records).set(patch).where(eq(records.id, id)).run();
}
