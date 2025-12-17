import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import { db } from "@/db";

export async function updateRecordById(
  id: string,
  patch: { title?: string; body?: string }
): Promise<void> {
  try {
    const result = await db
      .update(records)
      .set(patch)
      .where(eq(records.id, id))
      .run();

    if (result.changes === 0) {
      throw new Error("Record not found or no changes made");
    }
  } catch (error) {
    console.error("Database error updating record:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update record in database"
    );
  }
}
