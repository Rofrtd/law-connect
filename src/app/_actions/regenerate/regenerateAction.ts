"use server";
import { getLlmClient } from "@/domain/llm/getLlmClient";
import { regenerateFromPrompt } from "@/domain/regenerate/regenerate";
import { revalidatePath } from "next/cache";

export async function regenerateAction(formData: FormData) {
  const promptText = String(formData.get("prompt") ?? "").trim();
  if (!promptText) throw new Error("Prompt is required");

  const llm = getLlmClient();

  await regenerateFromPrompt(llm, promptText);
  revalidatePath("/");
}
