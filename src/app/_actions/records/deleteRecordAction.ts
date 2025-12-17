"use server";

import { revalidatePath } from "next/cache";
import { deleteRecordById } from "@/domain/records/deleteRecord";

type DeleteRecordResult = { success: true } | { success: false; error: string };

export async function deleteRecordAction(
  formData: FormData
): Promise<DeleteRecordResult> {
  try {
    const id = String(formData.get("id") ?? "").trim();

    if (!id) {
      return { success: false, error: "Record ID is required" };
    }

    await deleteRecordById(id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete record",
    };
  }
}
