"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { VerdictSummary } from "./VerdictSummary";
import { JudgeScorePanel } from "./JudgeScorePanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { StrongerAnswerPanel } from "./StrongerAnswerPanel";
import { TrustRiskPanel } from "./TrustRiskPanel";
import { getProject, getSessionFeedback } from "@/lib/api";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Project, FeedbackReport } from "@/lib/types";

export function FeedbackReportPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params.sessionId) return;
      
      const foundProject = await getProject(params.sessionId);
      if (foundProject) {
        setProject(foundProject);
        if (foundProject.lastVerdict !== "Not tested yet") {
          const feedback = await getSessionFeedback(params.sessionId);
          setReport(feedback);
        }
      }
      setLoaded(true);
    }
    load();
  }, [params.sessionId]);

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
  
  if (!project) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-200">Session not found</h2>
          <p className="mt-2 text-sm text-zinc-500">The requested session report could not be loaded.</p>
        </div>
      </AppShell>
    );
  }

  if (project.lastVerdict === "Not tested yet" || !report) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-200">Feedback unavailable</h2>
          <p className="mt-2 text-sm text-zinc-500">No feedback yet.</p>
          <p className="mt-1 text-xs text-zinc-600">Complete a Hot Seat session to generate a coach-cut report.</p>
          <div className="mt-6">
            <Link href={routes.project(project.id)}>
              <Button variant="secondary" size="sm">
                ← Back to Case File
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
