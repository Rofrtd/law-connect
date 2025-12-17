"use client";

import { deleteRecordAction } from "@/app/_actions/records/deleteRecordAction";
import { updateRecordAction } from "@/app/_actions/records/updateRecordAction";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

type Props = {
  id: string;
  title: string | null;
  body: string;
};

export default function RecordCard({ id, title, body }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-shadow">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-zinc-100">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {!isEditing ? (
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {body}
          </p>
        ) : (
          <form
            action={updateRecordAction}
            className="space-y-4"
            onSubmit={() => setIsEditing(false)}
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="title" value={title ?? ""} />
            <Textarea
              name="body"
              aria-label="Body"
              className="min-h-32 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:border-zinc-600 focus-visible:ring-zinc-600/50 placeholder:text-zinc-500"
              defaultValue={body}
            />
            <div className="flex gap-3">
              <Button type="submit" variant="default" className="flex-1">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="flex gap-3 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-zinc-700 hover:bg-zinc-800"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-100">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete
                  this record from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-700 hover:bg-zinc-800">
                  Cancel
                </AlertDialogCancel>
                <form action={deleteRecordAction}>
                  <input type="hidden" name="id" value={id} />
                  <AlertDialogAction asChild>
                    <Button type="submit" variant="destructive">
                      Delete Record
                    </Button>
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
