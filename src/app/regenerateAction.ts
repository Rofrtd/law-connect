"use server";

import { db } from "@/db";
import { getLlmClient } from "@/lib/llm/getLlmClient";
import { regenerateFromPrompt } from "@/lib/regenerate/regenerate";
import { revalidatePath } from "next/cache";

export async function regenerateAction(formData: FormData) {
  const promptText = String(formData.get("prompt") ?? "").trim();
  if (!promptText) throw new Error("Prompt is required");

  const llm = getLlmClient();

  await regenerateFromPrompt(db, llm, promptText);
  revalidatePath("/");
}
