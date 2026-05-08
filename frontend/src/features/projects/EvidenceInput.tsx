import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface EvidenceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EvidenceInput({ value, onChange }: EvidenceInputProps) {
  return (
    <Panel className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-200">Source Material</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Paste the raw claims, copy, or transcript you want to pressure test.
          </p>
        </div>
        <Badge variant="neutral">Manual text only</Badge>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your source material here..."
        className="h-48 w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50"
      />

      <div className="rounded-md border border-zinc-800/60 bg-zinc-950/50 px-4 py-3">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-4 w-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="font-medium text-zinc-400">File uploads are disabled.</span> PDF and TXT uploads will be enabled after backend storage is connected in a future sprint.
          </p>
        </div>
      </div>
    </Panel>
  );
}
