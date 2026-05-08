import { Badge } from "@/components/ui/Badge";

export function TopBar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Command Center
      </span>

      <div className="flex items-center gap-3">
        <Badge variant="neutral">Backend: pending</Badge>
        <Badge variant="neutral">Runway: not connected</Badge>
      </div>
    </header>
  );
}
