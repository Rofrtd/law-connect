"use server";

import { db } from "@/db";
import { regenerateFromPrompt } from "@/lib/regenerate/regenerate";
import type { LlmClient } from "@/lib/llm/port";
import { revalidatePath } from "next/cache";

export async function regenerateAction(formData: FormData) {
  const promptText = String(formData.get("prompt") ?? "").trim();
  if (!promptText) throw new Error("Prompt is required");

  // Deterministic LLM for now (keeps E2E reliable)
  const llm: LlmClient = {
    async generateRecords(prompt) {
      return [{ title: "Generated", body: `From: ${prompt}` }];
    },
  };

  await regenerateFromPrompt(db, llm, promptText);

  // revalidate the main page to show new records
  revalidatePath("/");
}

// "use server";

// import { db } from "@/db";
// import { OpenAiLlmClient } from "@/lib/llm/openAiClient";
// import { regenerateFromPrompt } from "@/lib/regenerate/regenerate";
// import OpenAI from "openai";

// export async function regenerateAction(formData: FormData) {
//   const promptText = String(formData.get("prompt") ?? "").trim();
//   if (!promptText) throw new Error("Prompt is required");

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

//   const openai = new OpenAI({ apiKey });

//   const llm = new OpenAiLlmClient({
//     fetchRaw: async (prompt) => {
//       const res = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         temperature: 0.2,
//         messages: [
//           {
//             role: "system",
//             content:
//               'Return ONLY valid JSON: {"records":[{"title":string|null,"body":string}]}',
//           },
//           { role: "user", content: prompt },
//         ],
//       });

//       const raw = res.choices[0]?.message?.content;
//       if (!raw) throw new Error("Empty LLM response");
//       return raw;
//     },
//   });

//   await regenerateFromPrompt(db, llm, promptText);
// }
