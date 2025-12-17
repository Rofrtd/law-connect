import { describe, it, expect } from "vitest";
import { nanoid } from "nanoid";
import { prompts, records } from "@/db/schema";
import { updateRecordById } from "./updateRecord";
import { db, sqlite } from "@/db";

describe("updateRecordById", () => {
  it("updates title/body for a record", () => {
    const promptId = nanoid();
    db.insert(prompts)
      .values({ id: promptId, text: "p", createdAt: new Date() })
      .run();

    const id = nanoid();
    db.insert(records)
      .values({ id, promptId, title: "t", body: "b", order: 0 })
      .run();

    updateRecordById(id, { body: "Updated body" });

    const updated = db.select().from(records).all()[0];
    expect(updated?.body).toBe("Updated body");

    sqlite.close();
  });
});
