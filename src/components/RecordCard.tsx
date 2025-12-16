"use client";

import { deleteRecordAction } from "@/app/_actions/records/deleteRecordAction";
import { updateRecordAction } from "@/app/_actions/records/updateRecordAction";
import { useState } from "react";

type Props = {
  id: string;
  title: string | null;
  body: string;
};

export default function RecordCard({ id, title, body }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article className="border p-3 rounded space-y-2">
      {title ? <h3 className="font-semibold">{title}</h3> : null}

      {!isEditing ? (
        <>
          <p>{body}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="border px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <form action={deleteRecordAction}>
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="border px-3 py-1 rounded">
                Delete
              </button>
            </form>
          </div>
        </>
      ) : (
        <form
          action={updateRecordAction}
          className="space-y-2"
          onSubmit={() => setIsEditing(false)}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="title" value={title ?? ""} />

          <textarea
            name="body"
            aria-label="Body"
            className="w-full border p-2 rounded"
            defaultValue={body}
          />

          <div className="flex gap-2">
            <button type="submit" className="border px-3 py-1 rounded">
              Save
            </button>
            <button
              type="button"
              className="border px-3 py-1 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
