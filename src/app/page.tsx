import { db } from "@/db";
import { records } from "@/db/schema";
import { initDb } from "@/db/init";
import { deleteRecordAction } from "./deleteRecordAction";
import GenerateForm from "@/components/GenerateForm";

initDb();

export default async function Page() {
  const allRecords = db.select().from(records).orderBy(records.order).all();

  return (
    <main className="p-6 space-y-6">
      <GenerateForm />

      <section className="space-y-2">
        {allRecords.map((r) => (
          <article key={r.id} className="border p-3 rounded space-y-2">
            {r.title ? <h3 className="font-semibold">{r.title}</h3> : null}
            <p>{r.body}</p>

            <form action={deleteRecordAction}>
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" className="border px-3 py-1 rounded">
                Delete
              </button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
