import { eq } from "drizzle-orm";
import { records } from "@/db/schema";
import { db } from "@/db";

export async function deleteRecordById(id: string): Promise<void> {
  try {
    const result = await db.delete(records).where(eq(records.id, id)).run();

    if (result.changes === 0) {
      throw new Error("Record not found");
    }
  } catch (error) {
    console.error("Database error deleting record:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete record from database"
    );
  }
}
