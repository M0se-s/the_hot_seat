import { Panel } from "@/components/ui/Panel";

interface TranscriptPanelProps {
  transcript: string;
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  return (
    <Panel className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Session Transcript
      </h2>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-4">
        {transcript ? (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-400">
            {transcript}
          </pre>
        ) : (
          <p className="text-sm italic text-zinc-600">
            No transcript recorded for this session.
          </p>
        )}
      </div>
    </Panel>
  );
}
