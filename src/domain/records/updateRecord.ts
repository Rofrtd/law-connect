import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import { db } from "@/db";

export function updateRecordById(
  id: string,
  patch: { title?: string; body?: string }
) {
  db.update(records).set(patch).where(eq(records.id, id)).run();
}
