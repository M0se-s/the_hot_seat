import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "danger" | "warning" | "success" | "accent";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  danger:
    "bg-red-100/80 text-red-700 border-red-300/60 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/50",
  warning:
    "bg-amber-100/80 text-amber-700 border-amber-300/60 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/40",
  success:
    "bg-emerald-100/80 text-emerald-700 border-emerald-300/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/40",
  accent:
    "bg-red-100/60 text-red-700 border-red-300/40 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}
