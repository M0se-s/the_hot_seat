import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";

interface PressureQuestionsPanelProps {
  questions: string[];
}

export function PressureQuestionsPanel({ questions }: PressureQuestionsPanelProps) {

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Pressure Questions
        </h2>
        <Badge variant="neutral">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        These are the questions the panel will use to stress-test your case.
        Prepare your answers before entering the Hot Seat.
      </p>

      {questions.length > 0 ? (
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Panel key={index} className="flex items-start gap-3 p-4!">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-bold text-zinc-400">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-zinc-300">
                {question}
              </p>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel className="py-8 text-center">
          <p className="text-sm text-zinc-500">
            No pressure questions available for this session type.
          </p>
        </Panel>
      )}

      {/* Disclaimer */}
      <div className="rounded-md border border-zinc-800/60 bg-zinc-950/50 px-4 py-3">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs leading-relaxed text-zinc-500">
            Review these questions before entering the Hot Seat.
            Regenerate after updating source material.
          </p>
        </div>
      </div>
    </div>
  );
}
