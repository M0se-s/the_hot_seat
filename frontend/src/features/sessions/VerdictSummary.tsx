import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { verdictTone } from "@/styles/design-tokens";
import type { VerdictLabel } from "@/lib/types";

interface VerdictSummaryProps {
  verdict: string;
  score: number;
  worstDodge: string;
  bestRecovery: string;
}

export function VerdictSummary({ verdict, score, worstDodge, bestRecovery }: VerdictSummaryProps) {
  const tone = verdictTone[verdict as VerdictLabel] ?? "neutral";

  return (
    <Panel className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Final Verdict</h2>
          <div className="flex items-center gap-4">
            <div className="text-lg">
              <Badge variant={tone as "neutral" | "danger" | "warning" | "success"}>
                {verdict}
              </Badge>
            </div>
            <div className="text-sm font-medium text-zinc-400">
              Score: <span className="text-zinc-100">{score}/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 border-t border-zinc-800 pt-6">
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-red-500/80 mb-1.5">Worst Dodge</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{worstDodge}</p>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/80 mb-1.5">Best Recovery</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{bestRecovery}</p>
        </div>
      </div>
    </Panel>
  );
}
