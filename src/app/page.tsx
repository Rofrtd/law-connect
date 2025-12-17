import { db } from "@/db";
import { prompts, records } from "@/db/schema";
import { eq } from "drizzle-orm";
import GenerateForm from "@/components/GenerateForm";
import PromptGroup from "@/components/PromptGroup";

export default async function Page() {
  const allPrompts = db
    .select()
    .from(prompts)
    .orderBy(prompts.createdAt)
    .all()
    .reverse();

  const promptsWithRecords = allPrompts.map((prompt) => {
    const promptRecords = db
      .select()
      .from(records)
      .where(eq(records.promptId, prompt.id))
      .orderBy(records.order)
      .all();

    return {
      prompt,
      records: promptRecords,
    };
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            LawConnect LLM Tool
          </h1>
          <p className="text-zinc-400">
            Generate and manage legal documents with AI
          </p>
        </header>

        <section className="space-y-6">
          <GenerateForm />
        </section>

        {promptsWithRecords.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-200">
              Your Prompts & Results
            </h2>
            <div className="space-y-4">
              {promptsWithRecords.map(({ prompt, records: promptRecords }) => (
                <PromptGroup
                  key={prompt.id}
                  prompt={prompt}
                  records={promptRecords}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
