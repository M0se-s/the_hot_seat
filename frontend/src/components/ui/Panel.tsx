import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}

export function Panel({ children, className, as: Tag = "div" }: PanelProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-zinc-800 bg-zinc-900/80 p-5",
        className
      )}
    >
      {children}
    </Tag>
  );
}
