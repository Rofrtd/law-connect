import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import type { DB } from "@/db";

export function deleteRecordById(db: DB, id: string) {
  db.delete(records).where(eq(records.id, id)).run();
}
