import { describe, it, expect } from "vitest";
import { createDb } from "@/db/client";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { updateRecordById } from "./updateRecord";

describe("updateRecordById", () => {
  it("updates title/body for a record", () => {
    const { db, sqlite } = createDb(":memory:");

    const promptId = nanoid();
    db.insert(prompts).values({ id: promptId, text: "p" }).run();

    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "t", body: "b", order: 0 })
      .run();

    updateRecordById(db, id, { body: "Updated body" });

    const updated = db.select().from(records).all()[0];
    expect(updated?.body).toBe("Updated body");

    sqlite.close();
  });
});
