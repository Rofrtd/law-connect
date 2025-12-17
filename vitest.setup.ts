import { createDb } from "@/db/client";
import { vi } from "vitest";

vi.mock(import("@/db"), () => {
  return {
    db: createDb(":memory:").db,
    sqlite: createDb(":memory:").sqlite,
  };
});
