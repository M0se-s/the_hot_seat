import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface JudgeScore {
  judgeId: string;
  name: string;
  role: string;
  score: number;
  feedback: string;
  sourceSupport: string;
}

interface JudgeScorePanelProps {
  scores: JudgeScore[];
}

export function JudgeScorePanel({ scores }: JudgeScorePanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Judge Scoring</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {scores.map((judge, index) => (
          <Panel key={index} className="flex flex-col">
            <div className="mb-4 flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">{judge.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">{judge.role}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 text-sm font-bold text-zinc-300">
                {judge.score}
              </div>
            </div>
            
            <p className="flex-1 text-sm leading-relaxed text-zinc-400">
              &ldquo;{judge.feedback}&rdquo;
            </p>
            
            <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">Source Support</span>
              <Badge variant={judge.sourceSupport === "Low" ? "danger" : judge.sourceSupport === "Medium" ? "warning" : "success"}>
                {judge.sourceSupport}
              </Badge>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
