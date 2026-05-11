"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

interface HotSeatTimerProps {
  initialSeconds?: number;
  /** Timer only counts down when this is true (Runway character connected). */
  started?: boolean;
}

export function HotSeatTimer({ initialSeconds = 300, started = false }: HotSeatTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [started, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 60 && timeLeft > 10;
  const isCritical = timeLeft <= 10;

  return (
    <Panel className={cn(
      "flex flex-col items-center justify-center p-6 transition-colors duration-500",
      isCritical ? "border-red-500/50 bg-red-950/20" :
      isWarning ? "border-amber-500/30 bg-amber-950/20" :
      "border-zinc-800 bg-zinc-900/50"
    )}>
      <span className={cn(
        "mb-2 text-xs font-semibold uppercase tracking-widest",
        isCritical ? "text-red-500" : isWarning ? "text-amber-500" : "text-zinc-500"
      )}>
        Session Timer
      </span>
      <div className={cn(
        "text-5xl font-mono font-bold tracking-tighter tabular-nums",
        isCritical ? "text-red-500 animate-pulse" :
        isWarning ? "text-amber-500" :
        "text-zinc-100"
      )}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      {!started && (
        <p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-600">
          Waiting for character…
        </p>
      )}
    </Panel>
  );
}
