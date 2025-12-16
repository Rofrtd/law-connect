import { ensureSchema } from "@/db/ensureSchema";

ensureSchema();
console.log("Migrations applied");
