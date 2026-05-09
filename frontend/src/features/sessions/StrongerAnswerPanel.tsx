import { Panel } from "@/components/ui/Panel";

interface StrongerAnswerPanelProps {
  weakestAnswer: string;
  strongerAnswer: string;
}

export function StrongerAnswerPanel({ weakestAnswer, strongerAnswer }: StrongerAnswerPanelProps) {
  return (
    <Panel className="space-y-4 border-zinc-800 bg-zinc-900/50">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-500/80">
          Weakest Answer
        </h3>
        <p className="text-sm leading-relaxed text-zinc-400">{weakestAnswer}</p>
      </div>
      <div className="border-t border-zinc-800/60 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-500/80">
          Stronger Answer
        </h3>
        <p className="text-sm leading-relaxed text-zinc-300">{strongerAnswer}</p>
      </div>
    </Panel>
  );
}
