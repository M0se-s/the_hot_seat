import { cn } from "@/lib/utils";
import { SessionType } from "@/lib/types";

interface SessionTypeSelectorProps {
  value: string;
  sessionTypes: SessionType[];
  onChange: (value: string) => void;
}

export function SessionTypeSelector({ value, sessionTypes, onChange }: SessionTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-300">
        Session Type
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        {sessionTypes.map((st) => {
          const isSelected = value === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onChange(st.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-red-500/60 bg-red-950/20"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
            >
              <span className={cn("text-sm font-semibold", isSelected ? "text-red-400" : "text-zinc-200")}>
                {st.name}
              </span>
              <span className="text-xs text-zinc-500 line-clamp-2">
                {st.description}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {st.judges.slice(0, 3).map((judge) => (
                  <span key={judge.id} className="text-[10px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800/80">
                    {judge.roleName}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
