"use server";

import { getLlmClient } from "@/domain/llm/getLlmClient";
import { overridePromptRecords } from "@/domain/records/overridePromptRecords";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function revalidatePrompt(formData: FormData) {
  const promptId = String(formData.get("promptId") ?? "").trim();
  const promptText = String(formData.get("prompt") ?? "").trim();

  if (!promptId) throw new Error("Prompt ID is required");
  if (!promptText) throw new Error("Prompt is required");

  const llm = getLlmClient();

  // Generate new records
  const generated = await llm.generateRecords(promptText);

  const newRecords = generated.map((r, index) => ({
    id: nanoid(),
    promptId,
    title: r.title,
    body: r.body,
    order: index,
  }));

  // Update the prompt text and delete old records, then insert new ones

  overridePromptRecords(promptId, promptText, newRecords);

  revalidatePath("/");
}
