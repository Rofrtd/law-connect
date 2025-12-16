"use client";
import { regenerateAction } from "@/app/_actions/regenerate/regenerateAction";
import { useState } from "react";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");

  return (
    <form action={regenerateAction} className="space-y-3">
      <textarea
        name="prompt"
        aria-label="Prompt"
        className="w-full border p-2 rounded"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="border px-4 py-2 rounded"
        disabled={prompt.trim().length === 0}
      >
        Generate
      </button>
    </form>
  );
}
