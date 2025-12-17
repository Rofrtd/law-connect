import { eq } from "drizzle-orm";
import { prompts } from "@/db/schema";
import { db } from "@/db";

export async function deletePromptById(id: string): Promise<void> {
  try {
    const result = await db.delete(prompts).where(eq(prompts.id, id)).run();

    if (result.changes === 0) {
      throw new Error("Prompt not found");
    }
  } catch (error) {
    console.error("Database error deleting prompt:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete prompt from database"
    );
  }
}
