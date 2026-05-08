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
    "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700",
  ghost:
    "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent",
  danger:
    "bg-red-900/40 text-red-300 hover:bg-red-900/60 active:bg-red-900/80 border border-red-800/50",
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
