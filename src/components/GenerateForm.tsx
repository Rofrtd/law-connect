"use client";
import { useState, useTransition } from "react";
import { regenerateAction } from "@/app/_actions/regenerate/regenerateAction";

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="prompt"
        aria-label="Prompt"
        className="w-full border p-2 rounded"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isPending}
      />
      <button
        type="submit"
        className="border px-4 py-2 rounded"
        disabled={prompt.trim().length === 0 || isPending}
      >
        {isPending ? "Generating..." : "Generate"}
      </button>
      {error && (
        <div className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
