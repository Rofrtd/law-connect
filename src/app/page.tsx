import { db } from "@/db";
import { records } from "@/db/schema";
import GenerateForm from "@/components/GenerateForm";
import RecordCard from "@/components/RecordCard";

export default async function Page() {
  const allRecords = db.select().from(records).orderBy(records.order).all();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
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

        {allRecords.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-200">
              Your Records
            </h2>
            <div className="space-y-4">
              {allRecords.map((r) => (
                <RecordCard
                  key={r.id}
                  id={r.id}
                  title={r.title}
                  body={r.body}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
