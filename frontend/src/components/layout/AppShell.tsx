import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100" suppressHydrationWarning>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
