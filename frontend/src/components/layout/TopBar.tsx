"use client";

import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function TopBar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        Command Center
      </span>

      <div className="flex items-center gap-3">
        <Badge variant="neutral">Backend: live</Badge>
        <Badge variant="neutral">Runway: not connected</Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}
