"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RunwayCharacterStage } from "./RunwayCharacterStage";
import { HotSeatTimer } from "./HotSeatTimer";
import { SessionControlBar } from "./SessionControlBar";
import { ManualTranscriptPanel } from "./ManualTranscriptPanel";
import { endRunwaySession, endSession, getProject, getSession, getSessionType, startSession } from "@/lib/api";
import { routes } from "@/lib/routes";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import type { Project, Session, SessionType } from "@/lib/types";

type LiveSessionPageProps = {
  sessionId: string;
};

export function LiveSessionPage({ sessionId }: LiveSessionPageProps) {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runwayConnected, setRunwayConnected] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  // Silence handling
  const [lastActivityAt, setLastActivityAt] = useState<number>(Date.now());
  const [silenceDuration, setSilenceDuration] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setError(null);

        const foundSession = await getSession(sessionId);
        if (!foundSession) {
          setLoaded(true);
          return;
        }

        const activeSession =
          foundSession.state === "created"
            ? await startSession(foundSession.id)
            : foundSession;

        setSession(activeSession);
        setTranscriptText(activeSession.transcript.join("\n"));

        const foundProject = await getProject(activeSession.projectId);
        if (foundProject) {
          setProject(foundProject);
          const foundSessionType = await getSessionType(foundProject.sessionTypeId);
          if (foundSessionType) {
            setSessionType(foundSessionType);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Backend unavailable. Make sure FastAPI is running at http://localhost:8000."
        );
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, [sessionId]);

  // Silence timer logic
  useEffect(() => {
    setLastActivityAt(Date.now());
    setSilenceDuration(0);
  }, [transcriptText]);

  useEffect(() => {
    if (!runwayConnected) return;
    
    const interval = setInterval(() => {
      setSilenceDuration(Math.floor((Date.now() - lastActivityAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [runwayConnected, lastActivityAt]);

  const handleMarkUnanswered = () => {
    setTranscriptText((prev) => prev + (prev ? "\n" : "") + "[Silence / unanswered question]");
    setLastActivityAt(Date.now());
    setSilenceDuration(0);
  };

  const handleEndSession = async () => {
    if (!session || isEnding) return;

    if (!transcriptText.trim() && !showEmptyWarning) {
      setShowEmptyWarning(true);
      return;
    }

    try {
      setIsEnding(true);
      setError(null);
      try {
        await endRunwaySession(session.id);
      } catch {
        // Runway cleanup failed — manual transcript still works.
      }
      await endSession(session.id, {
        transcript: transcriptText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      });
      router.push(routes.feedback(session.id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to end session. The transcript is still saved. Try again."
      );
      setIsEnding(false);
    }
  };

  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Creating Hot Seat session...
          </p>
        </div>
      </AppShell>
    );
  }

  if (!session || !project || !sessionType) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Session not found.
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {error
              ? "Backend unavailable. Make sure FastAPI is running at http://localhost:8000."
              : "The requested session could not be loaded."}
          </p>
        </div>
      </AppShell>
    );
  }

  const panelJudges = sessionType.judges.slice(1);

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80 mb-1">
                The Hot Seat • Live
              </p>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {project.title}
              </h1>
            </div>
            <Badge variant="warning">Recording</Badge>
          </div>
        </div>

        {/* Main Layout - Normal Scrolling */}
        <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          
          {/* Left Column: Stage (Sticky) & Transcript */}
          <section className="min-w-0 space-y-6">
            <div className="lg:sticky lg:top-24 z-10">
              <RunwayCharacterStage 
                sessionId={sessionId} 
                onConnected={() => setRunwayConnected(true)} 
                onTranscriptChange={setTranscriptText} 
              />
              
              {error && (
                <Panel className="mt-4 border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    {error}
                  </p>
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    Runway connection became unstable. Manual transcript mode is still available.
                  </p>
                </Panel>
              )}
            </div>

            <div className="space-y-6">
              {/* Silence Warning (also scrolls or could be made sticky if needed, but per-prompt scrolls with content) */}
              {silenceDuration >= 10 && runwayConnected && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    No answer captured. In a real Hot Seat, silence counts as unanswered.
                  </p>
                  {silenceDuration >= 20 && (
                    <button
                      onClick={handleMarkUnanswered}
                      className="mt-3 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                    >
                      Mark unanswered
                    </button>
                  )}
                </div>
              )}

              <ManualTranscriptPanel
                value={transcriptText}
                onChange={setTranscriptText}
              />

              <div className="space-y-4">
                {showEmptyWarning && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-950/20">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                      No transcript saved. Add notes before generating the credibility report.
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Click End Session again if you wish to proceed with an empty transcript.
                    </p>
                  </div>
                )}
                <SessionControlBar onEndSession={handleEndSession} isEnding={isEnding} />
              </div>
            </div>
          </section>

          {/* Right Column: Timer & Metadata Panels */}
          <aside className="space-y-6">
            <HotSeatTimer initialSeconds={300} started={runwayConnected} />

            {/* Listening Panel */}
            <Panel>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Listening Panel
              </h3>
              {panelJudges.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">
                  No additional panel judges for this session type.
                </p>
              ) : (
                <div className="space-y-4">
                  {panelJudges.map(judge => (
                    <div key={judge.id} className="flex flex-col gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800/60 dark:bg-zinc-900/60">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">{judge.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{judge.roleName}</span>
                      <span className="mt-1 text-xs italic text-zinc-400 dark:text-zinc-500">&ldquo;{judge.signaturePressure}&rdquo;</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Evidence Quick Ref */}
            <Panel>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Source Context
              </h3>
              {project.extractedContext && project.extractedContext.length > 0 ? (
                <ul className="space-y-2">
                  {project.extractedContext.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-zinc-400 dark:text-zinc-600">
                  No source material loaded. Add pasted text or upload a PDF/TXT source before the next session.
                </p>
              )}
            </Panel>
          </aside>
        </main>
      </div>
    </AppShell>
  );
}
