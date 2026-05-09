import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import type { Judge } from "@/lib/types";

interface RunwayCharacterStageProps {
  activeJudge: Judge;
}

export function RunwayCharacterStage({ activeJudge }: RunwayCharacterStageProps) {
  return (
    <Panel className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden border-zinc-800 bg-zinc-950/80 p-6">
      {/* Subtle red spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <Badge variant="accent">Active Character</Badge>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">{activeJudge.name}</h2>
        <p className="mt-2 text-sm font-medium text-zinc-400">{activeJudge.roleName}</p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {activeJudge.personality.split(", ").map((trait) => (
            <span
              key={trait}
              className="rounded border border-red-900/40 bg-red-950/30 px-2 py-0.5 text-xs text-red-400/80"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-red-900/30 bg-red-950/20 p-5 max-w-md backdrop-blur-sm">
          <p className="text-sm leading-relaxed text-zinc-300">
            <span className="font-semibold text-red-400/90">Runway Character not connected yet.</span>
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            This stage will host the active judge during live sessions. For now, use the manual transcript to document the pressure session offline.
          </p>
        </div>
      </div>
    </Panel>
  );
}
