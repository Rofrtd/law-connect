"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import RecordCard from "./RecordCard";
import EditPromptForm from "./EditPromptForm";

type Record = {
  id: string;
  promptId: string;
  title: string | null;
  body: string;
  order: number;
};

type Prompt = {
  id: string;
  text: string;
  createdAt: Date;
};

type Props = {
  prompt: Prompt;
  records: Record[];
};

export default function PromptGroup({ prompt, records }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const createdDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-3">
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center rounded hover:bg-zinc-800 transition-colors p-1"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                <CardTitle className="text-lg text-zinc-100">
                  {isEditingPrompt ? (
                    <EditPromptForm
                      promptId={prompt.id}
                      initialPrompt={prompt.text}
                      onSuccess={() => setIsEditingPrompt(false)}
                    />
                  ) : (
                    <span className="word-break">{prompt.text}</span>
                  )}
                </CardTitle>
              </div>
              <p className="text-xs text-zinc-500 mt-2 ml-8">
                {createdDate} • {records.length} result
                {records.length !== 1 ? "s" : ""}
              </p>
            </div>
            {!isEditingPrompt && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-zinc-700 hover:bg-zinc-800 shrink-0"
                onClick={() => setIsEditingPrompt(true)}
              >
                Edit & Regenerate
              </Button>
            )}
          </div>
        </CardHeader>

        {isOpen && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {records.length > 0 ? (
                records.map((record) => (
                  <RecordCard
                    key={record.id}
                    id={record.id}
                    title={record.title}
                    body={record.body}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-zinc-400">
                  No results generated yet
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
