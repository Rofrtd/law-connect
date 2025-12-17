import { describe, it, expect, beforeEach } from "vitest";
import { nanoid } from "nanoid";
import { prompts } from "@/db/schema";
import { getPrompts } from "./getPrompts";
import { db, sqlite } from "@/db";

describe("getPrompts", () => {
  beforeEach(() => {
    // Clear prompts table before each test
    db.delete(prompts).run();
  });

  it("returns empty array when no prompts exist", () => {
    const result = getPrompts();
    expect(result).toEqual([]);
  });

  it("returns prompts ordered by creation date (newest first)", () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    db.insert(prompts)
      .values({ id: "1", text: "oldest", createdAt: twoDaysAgo })
      .run();
    db.insert(prompts)
      .values({ id: "2", text: "middle", createdAt: yesterday })
      .run();
    db.insert(prompts)
      .values({ id: "3", text: "newest", createdAt: now })
      .run();

    const result = getPrompts();

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("3"); // newest first
    expect(result[1].id).toBe("2");
    expect(result[2].id).toBe("1"); // oldest last
  });

  it("returns single prompt when only one exists", () => {
    const id = nanoid();
    const now = new Date();

    db.insert(prompts)
      .values({ id, text: "single prompt", createdAt: now })
      .run();

    const result = getPrompts();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(id);
    expect(result[0].text).toBe("single prompt");
  });

  it("returns all prompt fields correctly", () => {
    const id = nanoid();
    const now = new Date();
    const text = "test prompt text";

    db.insert(prompts).values({ id, text, createdAt: now }).run();

    const result = getPrompts();

    expect(result[0]).toHaveProperty("id", id);
    expect(result[0]).toHaveProperty("text", text);
    expect(result[0]).toHaveProperty("createdAt");
    expect(result[0].createdAt).toEqual(now);

    sqlite.close();
  });
});
