"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JudgePanel } from "./JudgePanel";
import { EvidencePanel } from "./EvidencePanel";
import { PressureQuestionsPanel } from "./PressureQuestionsPanel";
import { getProject, getSessionType } from "@/lib/api";
import { verdictTone } from "@/styles/design-tokens";
import { routes } from "@/lib/routes";
import type { Project, SessionType, VerdictLabel } from "@/lib/types";

export function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params.projectId) return;
      const foundProject = await getProject(params.projectId);
      if (foundProject) {
        setProject(foundProject);
        const foundSessionType = await getSessionType(foundProject.sessionTypeId);
        setSessionType(foundSessionType);
      }
      setLoaded(true);
    }
    load();
  }, [params.projectId]);

  // ── Loading state ──────────────────────────────────────────
  if (!loaded) {
    return (
      <AppShell>
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-950">
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
              className="mx-auto mb-4 h-10 w-10 text-zinc-700"
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
            <h2 className="text-lg font-semibold text-zinc-200">
              Case file not found
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              The project you&apos;re looking for doesn&apos;t exist or was
              removed.
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
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                {project.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
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

        {/* ── Evidence ────────────────────────────────────────── */}
        <EvidencePanel
          sourceText={project.sourceText}
          evidenceCount={project.evidenceCount}
        />

        {/* ── Pressure Questions ──────────────────────────────── */}
        <PressureQuestionsPanel questions={project.suggestedQuestions ?? []} />

        {/* ── Enter Hot Seat CTA ──────────────────────────────── */}
        <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Ready to face the panel?
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                You&apos;ll enter a live session with{" "}
                <span className="font-medium text-red-400">{sessionType?.judges[0]?.name ?? "the active judge"}</span> as the
                Runway Character.
              </p>
            </div>
            <Link href={routes.liveSession(project.id)}>
              <Button variant="primary">
                Enter Hot Seat
              </Button>
            </Link>
          </div>
          <div className="mt-4 rounded-md border border-zinc-800/60 bg-zinc-950/50 px-3 py-2">
            <p className="text-[11px] leading-relaxed text-zinc-500">
              <span className="font-semibold text-zinc-400">Note:</span> Runway Character integration is pending backend storage. 
              The session will proceed with the timer, evidence, and manual transcript fallback.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
