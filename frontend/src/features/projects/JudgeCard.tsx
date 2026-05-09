import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Judge } from "@/lib/types";

interface JudgeCardProps {
  judge: Judge;
  isActiveCharacter: boolean;
}

export function JudgeCard({ judge, isActiveCharacter }: JudgeCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-200",
        isActiveCharacter
          ? "border-red-500/40 bg-red-950/15"
          : "border-zinc-800 bg-zinc-900/50"
      )}
    >
      {/* Role badge */}
      <div className="mb-3 flex items-center justify-between">
        <Badge variant={isActiveCharacter ? "accent" : "neutral"}>
          {isActiveCharacter ? "Active Runway Character" : "Feedback panel"}
        </Badge>
      </div>

      {/* Name + role */}
      <h4 className="text-sm font-semibold text-zinc-100">{judge.name}</h4>
      <p className="mt-0.5 text-xs font-medium text-zinc-500">
        {judge.roleName}
      </p>

      {/* Description */}
      <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
        {judge.description}
      </p>

      {/* Personality */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {judge.personality.split(", ").map((trait) => (
          <span
            key={trait}
            className={cn(
              "rounded border px-1.5 py-0.5 text-[10px]",
              isActiveCharacter
                ? "border-red-900/40 bg-red-950/30 text-red-400/80"
                : "border-zinc-800/80 bg-zinc-900 text-zinc-600"
            )}
          >
            {trait}
          </span>
        ))}
      </div>

      {/* Signature pressure */}
      <div
        className={cn(
          "mt-3 rounded-md border px-3 py-2",
          isActiveCharacter
            ? "border-red-900/30 bg-red-950/10"
            : "border-zinc-800/60 bg-zinc-950/50"
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Signature pressure
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs italic leading-relaxed",
            isActiveCharacter ? "text-red-300/80" : "text-zinc-500"
          )}
        >
          &ldquo;{judge.signaturePressure}&rdquo;
        </p>
      </div>
    </div>
  );
}
