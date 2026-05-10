"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RunwayCharacterStage } from "./RunwayCharacterStage";
import { HotSeatTimer } from "./HotSeatTimer";
import { SessionControlBar } from "./SessionControlBar";
import { ManualTranscriptPanel } from "./ManualTranscriptPanel";
import { getProject, getSessionType, endSession } from "@/lib/api";
import { routes } from "@/lib/routes";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import type { Project, SessionType } from "@/lib/types";

export function LiveSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params.sessionId) return;
      const foundProject = await getProject(params.sessionId);
      if (foundProject) {
        setProject(foundProject);
        const foundSession = await getSessionType(foundProject.sessionTypeId);
        if (foundSession) {
          setSessionType(foundSession);
        }
      }
      setLoaded(true);
    }
    load();
  }, [params.sessionId]);

  const handleEndSession = async () => {
    if (project) {
      await endSession(project.id, { transcript: [] });
    }
    router.push(routes.feedback(project?.id ?? ""));
  };

  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Loading session...
          </p>
        </div>
      </AppShell>
    );
  }
  
  if (!project || !sessionType) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-200">Session not found</h2>
          <p className="mt-2 text-sm text-zinc-500">The requested session could not be loaded.</p>
        </div>
      </AppShell>
    );
  }

  const activeJudge = sessionType.judges[0];
  const panelJudges = sessionType.judges.slice(1);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80 mb-1">
              The Hot Seat • Live
            </p>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              {project.title}
            </h1>
          </div>
          <Badge variant="warning">Recording</Badge>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* Left Column: Stage & Transcript */}
          <div className="flex flex-col gap-6">
            <RunwayCharacterStage activeJudge={activeJudge} />
            <div className="flex-1 min-h-75">
              <ManualTranscriptPanel />
            </div>
            <SessionControlBar onEndSession={handleEndSession} />
          </div>
          
          {/* Right Column: Timer & Sidebar */}
          <div className="flex flex-col gap-6">
            <HotSeatTimer initialSeconds={300} />
            
            {/* Listening Panel */}
            <Panel className="flex-1 bg-zinc-900/40">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Listening Panel
              </h3>
              <div className="space-y-4">
                {panelJudges.map(judge => (
                  <div key={judge.id} className="flex flex-col gap-1 rounded-md border border-zinc-800/60 bg-zinc-900/60 p-3">
                    <span className="text-sm font-semibold text-zinc-300">{judge.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{judge.roleName}</span>
                    <span className="mt-1 text-xs italic text-zinc-500">&ldquo;{judge.signaturePressure}&rdquo;</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Evidence Quick Ref */}
            <Panel className="flex-1 bg-zinc-900/40">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Evidence Sidebar
              </h3>
              <div className="max-h-48 overflow-y-auto text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap pr-2 custom-scrollbar">
                {project.sourceText || <span className="italic text-zinc-600">No source materials provided for this case.</span>}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
