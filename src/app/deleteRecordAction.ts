"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { deleteRecordById } from "@/lib/records/deleteRecord";

export async function deleteRecordAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Record id is required");

  deleteRecordById(db, id);
  revalidatePath("/");
}
