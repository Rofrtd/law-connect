import { prompts } from "@/db/schema";
import { db } from "@/db";

export function getPrompts() {
  return db.select().from(prompts).orderBy(prompts.createdAt).all().reverse();
}
