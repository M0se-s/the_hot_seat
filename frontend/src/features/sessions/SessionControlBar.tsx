import { Button } from "@/components/ui/Button";

interface SessionControlBarProps {
  onEndSession: () => void;
}

export function SessionControlBar({ onEndSession }: SessionControlBarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-red-900/20 bg-red-950/10 p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </div>
        <div>
          <span className="block text-sm font-medium text-red-500/90">Live Session Active</span>
          <span className="text-xs text-zinc-500">Recording audio for transcript</span>
        </div>
      </div>
      
      <Button variant="danger" onClick={onEndSession}>
        End Session
      </Button>
    </div>
  );
}
