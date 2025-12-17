"use server";

import { revalidatePath } from "next/cache";
import { updateRecordById } from "@/domain/records/updateRecord";

export async function updateRecordAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!id) throw new Error("Record id is required");

  updateRecordById(id, {
    ...(title ? { title } : {}),
    ...(body ? { body } : {}),
  });

  revalidatePath("/");
}
