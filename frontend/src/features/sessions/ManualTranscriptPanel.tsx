"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";

type ManualTranscriptPanelProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ManualTranscriptPanel({
  value,
  onChange,
}: ManualTranscriptPanelProps) {
  const [localTranscript, setLocalTranscript] = useState("");
  const transcript = value ?? localTranscript;

  function handleChange(nextValue: string) {
    if (onChange) {
      onChange(nextValue);
      return;
    }

    setLocalTranscript(nextValue);
  }

  return (
    <Panel className="flex h-full min-h-75 flex-col p-0! overflow-hidden">
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Manual Transcript
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Paste or type notes from your pressure session here. This fallback ensures you have a record even if the live transcript fails.
        </p>
      </div>

      <textarea
        className="w-full flex-1 resize-none bg-zinc-950 p-4 font-sans text-sm leading-relaxed text-zinc-300 placeholder-zinc-700 focus:outline-none focus:ring-0"
        placeholder="Type session notes, key questions asked, or paste a rough transcript..."
        value={transcript}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Panel>
  );
}
