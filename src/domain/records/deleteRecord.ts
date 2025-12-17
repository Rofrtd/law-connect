import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import { db } from "@/db";

export function deleteRecordById(id: string) {
  db.delete(records).where(eq(records.id, id)).run();
}
