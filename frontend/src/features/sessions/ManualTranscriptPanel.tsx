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
    <Panel className="flex min-h-[400px] flex-col p-0!">
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Manual Transcript Fallback
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Runway transcript may be incomplete. Paste or type key judge/user exchanges here before ending the session.
        </p>
      </div>

      <textarea
        className="w-full flex-1 resize-none bg-zinc-950 p-4 font-sans text-sm leading-relaxed text-zinc-300 placeholder-zinc-700 focus:outline-none focus:ring-0"
        placeholder="Paste live session notes or a rough transcript here..."
        value={transcript}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Panel>
  );
}
