"use server";

import { deletePromptById } from "@/domain/prompts/deletePrompt";
import { revalidatePath } from "next/cache";

export async function deletePromptAction(formData: FormData) {
  const promptId = String(formData.get("promptId") ?? "").trim();

  if (!promptId) {
    throw new Error("Prompt ID is required");
  }

  try {
    await deletePromptById(promptId);
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting prompt:", error);
    throw error;
  }
}
