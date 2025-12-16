import { db } from "@/db";
import { records } from "@/db/schema";
import { regenerateAction } from "./action";
import { initDb } from "@/db/init";
initDb();

export default async function Page() {
  const allRecords = db.select().from(records).orderBy(records.order).all();

  return (
    <main className="p-6 space-y-6">
      <form action={regenerateAction} className="space-y-3">
        <textarea
          name="prompt"
          aria-label="Prompt"
          className="w-full border p-2 rounded"
          placeholder="Enter your prompt..."
        />
        <button type="submit" className="border px-4 py-2 rounded">
          Generate
        </button>
      </form>

      <section className="space-y-2">
        {allRecords.map((r) => (
          <article key={r.id} className="border p-3 rounded">
            {r.title ? <h3 className="font-semibold">{r.title}</h3> : null}
            <p>{r.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
