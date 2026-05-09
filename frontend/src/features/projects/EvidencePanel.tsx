import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface EvidencePanelProps {
  sourceText?: string;
  evidenceCount: number;
}

export function EvidencePanel({ sourceText, evidenceCount }: EvidencePanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Source Materials
        </h2>
        <Badge variant={evidenceCount > 0 ? "neutral" : "warning"}>
          {evidenceCount > 0
            ? `${evidenceCount} source${evidenceCount > 1 ? "s" : ""}`
            : "No sources"}
        </Badge>
      </div>

      {sourceText ? (
        <Panel className="max-h-64 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
            {sourceText}
          </pre>
        </Panel>
      ) : (
        <Panel className="py-8 text-center">
          <svg
            className="mx-auto mb-2 h-6 w-6 text-zinc-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-semibold text-zinc-500">No evidence loaded.</p>
          <p className="mt-1 text-xs text-zinc-600">
            A Hot Seat session needs source material before interrogation.
          </p>
        </Panel>
      )}
    </div>
  );
}
