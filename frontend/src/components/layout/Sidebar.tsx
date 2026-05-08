"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { productName } from "@/styles/design-tokens";

const navItems = [
  { label: "Dashboard", href: routes.dashboard, enabled: true },
  { label: "Case Files", href: "#", enabled: false },
  { label: "Sessions", href: "#", enabled: false },
  { label: "Reports", href: "#", enabled: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-800 px-5">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm font-bold tracking-tight text-zinc-100">
          {productName}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = item.enabled && pathname === item.href;

          if (!item.enabled) {
            return (
              <span
                key={item.label}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-600 cursor-not-allowed select-none"
              >
                {item.label}
                <span className="text-[10px] uppercase tracking-wider text-zinc-700">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100",
                isActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-5 py-3">
        <p className="text-[10px] uppercase tracking-widest text-zinc-700">
          Sprint 2 · Local storage
        </p>
      </div>
    </aside>
  );
}
