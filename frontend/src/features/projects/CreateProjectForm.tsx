"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { EvidenceInput } from "./EvidenceInput";
import { saveProject } from "@/lib/project-store";
import { mockSessionTypes } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function CreateProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionTypeId, setSessionTypeId] = useState(mockSessionTypes[0]?.id ?? "");
  const [evidence, setEvidence] = useState("");
  
  const isValid = title.trim() !== "" && description.trim() !== "" && sessionTypeId !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Create a new project and save to local storage
    const now = new Date().toISOString();
    saveProject({
      id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description.trim(),
      sessionTypeId,
      evidenceCount: evidence.trim() ? 1 : 0,
      sourceText: evidence.trim() || undefined,
      status: "draft",
      lastVerdict: "Not tested yet",
      createdAt: now,
      updatedAt: now,
    });

    router.push(routes.dashboard);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 Earnings Script, Product Launch Deck"
            className="mt-1.5 block w-full rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Context & Goals
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are we trying to achieve? Who is the audience?"
            className="mt-1.5 block h-20 w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50"
          />
        </div>
      </div>

      <SessionTypeSelector value={sessionTypeId} onChange={setSessionTypeId} />

      <EvidenceInput value={evidence} onChange={setEvidence} />

      <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(routes.dashboard)}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={!isValid}>
          Create Case File
        </Button>
      </div>
    </form>
  );
}
