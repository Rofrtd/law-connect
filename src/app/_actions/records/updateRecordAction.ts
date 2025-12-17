"use server";

import { revalidatePath } from "next/cache";
import { updateRecordById } from "@/domain/records/updateRecord";

type UpdateRecordResult = { success: true } | { success: false; error: string };

export async function updateRecordAction(
  formData: FormData
): Promise<UpdateRecordResult> {
  try {
    const id = String(formData.get("id") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();

    if (!id) {
      return { success: false, error: "Record ID is required" };
    }

    if (!body) {
      return { success: false, error: "Body cannot be empty" };
    }

    await updateRecordById(id, {
      ...(title ? { title } : {}),
      body,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update record",
    };
  }
}
