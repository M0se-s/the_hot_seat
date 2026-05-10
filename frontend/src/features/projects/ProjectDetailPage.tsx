"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JudgePanel } from "./JudgePanel";
import { FileUploader } from "./FileUploader";
import { PressureQuestionsPanel } from "./PressureQuestionsPanel";
import {
  createSession,
  generateProjectContext,
  generateProjectQuestions,
  getProject,
  getSessionType,
} from "@/lib/api";
import { verdictTone } from "@/styles/design-tokens";
import { routes } from "@/lib/routes";
import type { Project, SessionType, UploadResponse, VerdictLabel } from "@/lib/types";

type ProjectDetailPageProps = {
  projectId: string;
};

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<UploadResponse | null>(null);
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const foundProject = await getProject(projectId);
      if (foundProject) {
        setProject(foundProject);
        const foundSessionType = await getSessionType(foundProject.sessionTypeId);
        setSessionType(foundSessionType);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach backend. Make sure FastAPI is running at http://localhost:8000.",
      );
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  const handleUploadSuccess = (result: UploadResponse) => {
    setLastUpload(result);
    load();
  };

  async function handleGenerateContext() {
    if (!project) return;

    try {
      setIsGeneratingContext(true);
      setGenerationError(null);
      await generateProjectContext(project.id);
      await load();
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Failed to generate context",
      );
    } finally {
      setIsGeneratingContext(false);
    }
  }

  async function handleGenerateQuestions() {
    if (!project) return;

    try {
      setIsGeneratingQuestions(true);
      setGenerationError(null);
      await generateProjectQuestions(project.id);
      await load();
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Failed to generate questions",
      );
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  async function handleEnterHotSeat() {
    if (!project || isStartingSession) return;

    try {
      setIsStartingSession(true);
      setError(null);
      const session = await createSession({ projectId: project.id });
      router.push(routes.liveSession(session.id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach backend. Make sure FastAPI is running at http://localhost:8000.",
      );
      setIsStartingSession(false);
    }
  }

  // ── Loading state ──────────────────────────────────────────
  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Loading case file...
          </p>
        </div>
      </AppShell>
    );
  }

  // ── Not found state ────────────────────────────────────────
  if (!project) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl">
          <div className="py-20 text-center">
            <svg
              className="mx-auto mb-4 h-10 w-10 text-zinc-400 dark:text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              Case file not found.
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {error
                ? "Backend unavailable. Make sure FastAPI is running at http://localhost:8000."
                : "The project you're looking for doesn't exist or was removed."}
            </p>
            <div className="mt-6">
              <Link href={routes.dashboard}>
                <Button variant="secondary" size="sm">
                  ← Back to Command Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const tone = verdictTone[project.lastVerdict as VerdictLabel] ?? "neutral";
  const hasSourceMaterials =
    (project.pastedTexts?.length ?? 0) > 0 ||
    (project.fileUrls?.length ?? 0) > 0 ||
    (project.extractedContext?.length ?? 0) > 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <div>
          <Link
            href={routes.dashboard}
            className="mb-4 inline-flex items-center text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Command Center
          </Link>
        </div>

        {/* ── Case Header ─────────────────────────────────────── */}
        <Panel as="section" className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
                Case File
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {project.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
            </div>
            <Badge
              variant={tone as "neutral" | "danger" | "warning" | "success"}
            >
              {project.lastVerdict}
            </Badge>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
            {sessionType && (
              <span>
                <span className="text-zinc-600">Panel:</span>{" "}
                <span className="text-zinc-300">{sessionType.name}</span>
              </span>
            )}
            <span>
              <span className="text-zinc-600">Evidence:</span>{" "}
              <span className="text-zinc-300">
                {project.evidenceCount === 0
                  ? "None"
                  : `${project.evidenceCount} source${
                      project.evidenceCount > 1 ? "s" : ""
                    }`}
              </span>
            </span>
            <span>
              <span className="text-zinc-600">Status:</span>{" "}
              <span className="text-zinc-300">
                {project.status === "draft"
                  ? "Draft"
                  : project.status === "ready"
                  ? "Ready"
                  : "Archived"}
              </span>
            </span>
            {sessionType && (
              <span>
                <span className="text-zinc-600">Duration:</span>{" "}
                <span className="text-zinc-300">
                  {Math.floor(sessionType.defaultDurationSeconds / 60)} min
                </span>
              </span>
            )}
          </div>
        </Panel>

        {/* ── Judge Panel ─────────────────────────────────────── */}
        {sessionType && <JudgePanel judges={sessionType.judges} />}

        {error && (
          <Panel className="border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              {error.includes("fetch")
                ? "Backend unavailable. Make sure FastAPI is running at http://localhost:8000."
                : error}
            </p>
          </Panel>
        )}

        {/* ── Source Materials & Generation ────────────────────── */}
        <div className="space-y-6">

          {/* Upload */}
          <Panel className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Source Materials</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Upload PDF or TXT files to provide context for the panel.
              </p>
            </div>
            <FileUploader projectId={projectId} onUploadSuccess={handleUploadSuccess} />
            {lastUpload && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-800/40 bg-emerald-950/20 px-4 py-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-emerald-400">
                    {lastUpload.filename} uploaded
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lastUpload.extractedText.length.toLocaleString()} characters extracted
                  </p>
                </div>
              </div>
            )}
          </Panel>

          <Panel className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Preparation</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Run analysis on your source materials to generate grounded context and pressure questions.
              </p>
            </div>

            {!hasSourceMaterials && (
              <p className="text-sm text-zinc-500 italic">
                No evidence loaded. Add pasted text or upload a PDF/TXT source before generating.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                id="btn-generate-context"
                onClick={handleGenerateContext}
                disabled={isGeneratingContext || !hasSourceMaterials}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-red-500 dark:hover:text-red-400"
              >
                {isGeneratingContext ? "Generating context…" : "Generate context"}
              </button>

              <button
                type="button"
                id="btn-generate-questions"
                onClick={handleGenerateQuestions}
                disabled={isGeneratingQuestions || !hasSourceMaterials}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-red-500 dark:hover:text-red-400"
              >
                {isGeneratingQuestions ? "Generating pressure questions…" : "Generate pressure questions"}
              </button>
            </div>

            {generationError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {generationError}
              </div>
            )}
          </Panel>

          {/* Evidence Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Generated context */}
            <Panel className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Evidence Review
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
                  Source-grounded context extracted from your materials.
                </p>
              </div>

              {project.extractedContext.length > 0 ? (
                <ul className="space-y-2">
                  {project.extractedContext.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                  No generated context yet. Add source material, then generate context.
                </p>
              )}
            </Panel>

            {/* Pressure Questions */}
            <Panel className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Pressure Questions
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
                  Questions your panel will use to pressure-test your answers.
                </p>
              </div>

              {project.suggestedQuestions.length > 0 ? (
                <ul className="space-y-2">
                  {project.suggestedQuestions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                  No pressure questions generated yet. Generate after adding source material.
                </p>
              )}
            </Panel>
          </div>
        </div>

        {/* ── Enter Hot Seat CTA ──────────────────────────────── */}
        <div className="rounded-lg border border-red-200 bg-red-50/60 p-6 dark:border-red-900/30 dark:bg-red-950/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Ready to face the panel?
              </h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                You&apos;ll enter a live session with{" "}
                <span className="font-medium text-red-600 dark:text-red-400">{sessionType?.judges[0]?.name ?? "the active judge"}</span> as the
                Runway Character.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleEnterHotSeat}
              disabled={isStartingSession || !sessionType}
            >
              {isStartingSession ? "Opening Hot Seat..." : "Enter Hot Seat"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
