"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { VerdictSummary } from "./VerdictSummary";
import { JudgeScorePanel } from "./JudgeScorePanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { StrongerAnswerPanel } from "./StrongerAnswerPanel";
import { TrustRiskPanel } from "./TrustRiskPanel";
import { analyzeSession, getProject, getSession, getSessionFeedback } from "@/lib/api";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
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

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

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
            : "Backend unavailable. Make sure FastAPI is running at http://localhost:8000."
        );
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, [sessionId]);

  async function handleAnalyze() {
    try {
      setAnalyzing(true);
      setAnalyzeError(null);
      const generated = await analyzeSession(sessionId);
      setReport(generated);
    } catch {
      setAnalyzeError(
        "Feedback generation failed. The transcript is still saved. You can retry analysis."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Analyzing transcript against project materials...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error && (!session || !project)) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Backend unavailable.
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Make sure FastAPI is running at http://localhost:8000.
          </p>
        </div>
      </AppShell>
    );
  }

  if (!session || !project) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Session not found.
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            The requested session report could not be loaded.
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
            {analyzing ? (
              <>
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                <p className="mt-2 text-sm text-zinc-500">
                  Analyzing transcript against project materials...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Session ended. Ready for review.
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  {session.transcript.length === 0
                    ? "No transcript saved. End the session with manual transcript notes to generate a credibility report."
                    : "Generate the credibility report when ready."}
                </p>
                {analyzeError && (
                  <Panel className="mt-4 border-red-200 bg-red-50 text-left dark:border-red-900/40 dark:bg-red-950/20">
                    <p className="text-sm text-red-700 dark:text-red-300">{analyzeError}</p>
                  </Panel>
                )}
                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={session.transcript.length === 0}
                  >
                    Generate credibility report
                  </Button>
                  <Link href={routes.project(project.id)}>
                    <Button variant="secondary">Back to Case File</Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {!analyzing && session.transcript.length > 0 && (
            <TranscriptPanel
              transcript={session.transcript.join("\n\n")}
            />
          )}

          {!analyzing && session.transcript.length === 0 && (
            <Panel>
              <p className="text-sm text-zinc-500 italic">
                No transcript saved for this session.
              </p>
            </Panel>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
              Post-Session Report
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {project.title}
            </h1>
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

        {/* Middle Section: Strengths & Weaknesses */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/20 dark:bg-emerald-950/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Strengths
            </h3>
            {report.strengths.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">None identified.</p>
            ) : (
              <ul className="list-inside list-disc space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {report.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Weaknesses */}
          <div className="space-y-4 rounded-xl border border-red-200 bg-red-50/60 p-6 dark:border-red-900/20 dark:bg-red-950/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
              Weaknesses
            </h3>
            {report.weaknesses.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">None identified.</p>
            ) : (
              <ul className="list-inside list-disc space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {report.weaknesses.map((wk, i) => (
                  <li key={i}>{wk}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <StrongerAnswerPanel
          weakestAnswer={report.weaknesses[0] ?? report.weakestMoment}
          strongerAnswer={report.suggestedStrongerAnswers.join("\n\n")}
        />

        {/* Bottom Section: Transcript */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Session transcript
          </h3>
          <TranscriptPanel transcript={report.transcript.join("\n\n")} />
        </div>

      </div>
    </AppShell>
  );
}
