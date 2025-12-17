import { db } from "@/db";
import { records } from "@/db/schema";
import GenerateForm from "@/components/GenerateForm";
import RecordCard from "@/components/RecordCard";

export default async function Page() {
  const allRecords = db.select().from(records).orderBy(records.order).all();

  return (
    <main className="p-6 space-y-6">
      <GenerateForm />

      <section className="space-y-2">
        {allRecords.map((r) => (
          <div key={r.id} className="space-y-2">
            <RecordCard id={r.id} title={r.title} body={r.body} />
          </div>
        ))}
      </section>
    </main>
  );
}
