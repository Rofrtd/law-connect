"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { revalidatePrompt } from "@/app/_actions/regenerate/revalidatePromptAction";

type Props = {
  promptId: string;
  initialPrompt: string;
  onSuccess: () => void;
};

export default function EditPromptForm({
  promptId,
  initialPrompt,
  onSuccess,
}: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("promptId", promptId);
        formData.append("prompt", prompt);
        await revalidatePrompt(formData);
        onSuccess();
      } catch (err: any) {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isPending}
        className="min-h-20 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:border-zinc-600 focus-visible:ring-zinc-600/50 placeholder:text-zinc-500"
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || prompt.trim() === initialPrompt.trim()}
          className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
        >
          {isPending ? "Regenerating..." : "Regenerate"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800"
          onClick={() => {
            setPrompt(initialPrompt);
            onSuccess();
          }}
        >
          Cancel
        </Button>
      </div>
      {error && (
        <div className="text-red-400 text-xs bg-red-950/30 border border-red-900/50 rounded p-2">
          {error}
        </div>
      )}
    </form>
  );
}
