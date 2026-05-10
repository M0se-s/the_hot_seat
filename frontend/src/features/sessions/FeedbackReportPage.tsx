"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { VerdictSummary } from "./VerdictSummary";
import { JudgeScorePanel } from "./JudgeScorePanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { StrongerAnswerPanel } from "./StrongerAnswerPanel";
import { TrustRiskPanel } from "./TrustRiskPanel";
import { getProject, getSession, getSessionFeedback } from "@/lib/api";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { FeedbackReport, Project, Session } from "@/lib/types";

type FeedbackReportPageProps = {
  sessionId: string;
};
  
export function FeedbackReportPage({ sessionId }: FeedbackReportPageProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);

        const foundSession = await getSession(sessionId);
        if (foundSession) {
          setSession(foundSession);
          const foundProject = await getProject(foundSession.projectId);
          setProject(foundProject);

          const feedback = await getSessionFeedback(sessionId);
          setReport(feedback);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to reach backend. Make sure FastAPI is running at http://localhost:8000."
        );
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, [sessionId]);

  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Loading feedback report...
          </p>
        </div>
      </AppShell>
    );
  }
  
  if (!session || !project) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-200">Session not found</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {error
              ? "Unable to reach backend. Make sure FastAPI is running at http://localhost:8000."
              : "The requested session report could not be loaded."}
          </p>
        </div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl space-y-6 py-20">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-zinc-200">
              Feedback generation is not connected yet.
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Sprint 11 will analyze this transcript with Featherless.
            </p>
            <div className="mt-6">
              <Link href={routes.project(project.id)}>
                <Button variant="secondary" size="sm">
                  Back to Case File
                </Button>
              </Link>
            </div>
          </div>

          <TranscriptPanel
            transcript={
              session.transcript.length > 0
                ? session.transcript.join("\n\n")
                : "No transcript was saved for this session."
            }
          />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-200">
            Unable to reach backend.
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Make sure FastAPI is running at http://localhost:8000.
          </p>
          <div className="mt-6">
            <Link href={routes.project(project.id)}>
              <Button variant="secondary" size="sm">
                Back to Case File
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
              Post-Session Report
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Mock feedback data based on The Hot Seat demo pitch.
            </p>
          </div>
          <Link href={routes.dashboard}>
            <Button variant="secondary" size="sm">
              Return to Command Center
            </Button>
          </Link>
        </div>

        {/* Top Section: Verdict & Scores */}
        <div className="space-y-6">
          <VerdictSummary 
            verdict={report.finalVerdict}
            score={report.overallScore}
            worstDodge={report.weakestMoment}
            bestRecovery={report.bestMoment}
          />
          
          <JudgeScorePanel scores={report.scoring.judges.map(j => ({
            judgeId: j.judgeName,
            name: j.judgeName,
            role: j.category,
            score: j.score,
            feedback: j.notes,
            sourceSupport: j.label === "High Support" ? "High" : j.label === "Medium Support" ? "Medium" : "Low"
          }))} />
        </div>

        {/* Middle Section: Coach-cut Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <TrustRiskPanel 
            unsupportedClaim={report.feedback[1] ?? ""}
            trustLoss={report.feedback[0] ?? ""}
          />
          <StrongerAnswerPanel 
            weakestAnswer={report.weaknesses[0] ?? ""}
            strongerAnswer={report.suggestedStrongerAnswers[0] ?? ""}
          />
        </div>

        {/* Bottom Section: Transcript */}
        <TranscriptPanel transcript={report.transcript.join("\n\n")} />

      </div>
    </AppShell>
  );
}
