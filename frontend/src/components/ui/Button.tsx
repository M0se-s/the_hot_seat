import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 border border-red-700",
  secondary:
    "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-900 dark:border-zinc-700",
  ghost:
    "bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50 border border-transparent dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50",
  danger:
    "bg-red-100/60 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-300/50 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 dark:active:bg-red-900/80 dark:border-red-800/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "pointer-events-none opacity-40",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
