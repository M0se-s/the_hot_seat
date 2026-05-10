"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "./ProjectCard";
import { getProjects, getSessionTypes } from "@/lib/api";
import { productTagline } from "@/styles/design-tokens";
import { routes } from "@/lib/routes";
import type { Project, SessionType } from "@/lib/types";

export function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const [projectData, sessionTypeData] = await Promise.all([
          getProjects(),
          getSessionTypes(),
        ]);

        setProjects(projectData);
        setSessionTypes(sessionTypeData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AppShell>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
          Command Center
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Case files ready for pressure testing.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
          {productTagline}
        </p>

        <div className="mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(routes.newProject)}
          >
            + New Case File
          </Button>
        </div>
      </div>

      {/* ── Status Row ──────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="neutral">Evidence mode: Source files</Badge>
        <Badge variant={error ? "danger" : "success"}>
          Backend: {error ? "Unavailable" : "Connected"}
        </Badge>
        <Badge variant="neutral">Runway: Not connected</Badge>
        <Badge variant="neutral">Featherless: Ready</Badge>
      </div>

      {/* ── Backend error ────────────────────────────────────────── */}
      {error && !isLoading && (
        <Panel className="mb-6 border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Backend unavailable.
          </p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            Make sure FastAPI is running at http://localhost:8000. {error}
          </p>
        </Panel>
      )}

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Case Files (2/3) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Open Case Files
            </h2>
            {!isLoading && !error && (
              <span className="text-xs text-zinc-400 dark:text-zinc-600">
                {projects.length} case{projects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="space-y-4">
              <Panel className="py-4 text-center">
                <p className="text-sm font-semibold text-zinc-500">
                  Loading case files...
                </p>
              </Panel>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/50"
                />
              ))}
            </div>
          )}

          {!isLoading && !error && projects.length === 0 && (
            <Panel className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-500">
                No case files yet.
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-600">
                Create one source-backed case before entering the Hot Seat.
              </p>
              <div className="mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(routes.newProject)}
                >
                  + New Case File
                </Button>
              </div>
            </Panel>
          )}

          {!isLoading &&
            !error &&
            projects.map((project) => {
              const sessionType = sessionTypes.find(
                (st) => st.id === project.sessionTypeId
              );
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  sessionType={sessionType}
                />
              );
            })}
        </div>

        {/* Right: Active Judges (1/3) */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Active Judges
          </h2>

          <Panel as="aside" className="space-y-3">
            {sessionTypes.length === 0 && !isLoading && (
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                No judges loaded.
              </p>
            )}
            {sessionTypes
              .flatMap((st) => st.judges)
              .filter(
                (judge, i, arr) =>
                  arr.findIndex((j) => j.id === judge.id) === i
              )
              .map((judge) => (
                <div key={judge.id} className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500/60" />
                  <span className="text-xs text-zinc-700 dark:text-zinc-400">
                    {judge.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                    {judge.roleName}
                  </span>
                </div>
              ))}
          </Panel>

          <Panel as="aside" className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Demo Flow
            </h3>
            {[
              "Create or open a case file",
              "Upload or paste source material",
              "Generate evidence context",
              "Generate pressure questions",
              "Enter Hot Seat",
              "Connect Runway Character",
              "End session with transcript",
              "Generate credibility report",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="mt-0.5 shrink-0 font-semibold text-red-500/70">
                  {i + 1}.
                </span>
                <span className="text-zinc-500 dark:text-zinc-500">{step}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
