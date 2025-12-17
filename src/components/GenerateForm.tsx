"use client";

import { useState, useTransition } from "react";
import { regenerateAction } from "@/app/_actions/regenerate/regenerateAction";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData(e.currentTarget);
        await regenerateAction(formData);
        setPrompt(""); // Optionally clear input after submit
      } catch (err: any) {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-zinc-300">
            Enter Your Prompt
          </label>
          <Textarea
            id="prompt"
            name="prompt"
            aria-label="Prompt"
            className="min-h-32 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:border-zinc-600 focus-visible:ring-zinc-600/50 placeholder:text-zinc-500"
            placeholder="Describe the legal document you need..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-semibold"
          disabled={prompt.trim().length === 0 || isPending}
        >
          {isPending ? (
            <>
              <span className="animate-pulse">Generating...</span>
            </>
          ) : (
            "Generate Document"
          )}
        </Button>
        {error && (
          <div
            className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-lg p-3"
            role="alert"
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
