import { JudgeCard } from "./JudgeCard";
import type { Judge } from "@/lib/types";

interface JudgePanelProps {
  judges: Judge[];
}

export function JudgePanel({ judges }: JudgePanelProps) {
  if (judges.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Judge Panel
        </h2>
        <span className="text-xs text-zinc-600">
          {judges.length} judge{judges.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        The first judge is the{" "}
        <span className="font-medium text-red-400/80">Active Runway Character</span>{" "}
        who will conduct the live session. The others provide written feedback
        after the session.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {judges.map((judge, index) => (
          <JudgeCard
            key={judge.id}
            judge={judge}
            isActiveCharacter={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
