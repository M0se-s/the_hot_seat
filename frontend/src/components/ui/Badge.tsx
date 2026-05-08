import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "danger" | "warning" | "success" | "accent";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-zinc-800 text-zinc-400 border-zinc-700",
  danger: "bg-red-950/60 text-red-400 border-red-900/50",
  warning: "bg-amber-950/50 text-amber-400 border-amber-900/40",
  success: "bg-emerald-950/50 text-emerald-400 border-emerald-900/40",
  accent: "bg-red-950/40 text-red-300 border-red-800/40",
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
