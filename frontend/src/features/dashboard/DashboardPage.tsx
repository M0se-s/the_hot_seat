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
import { Project, SessionType } from "@/lib/types";

export function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [fetchedProjects, fetchedSessionTypes] = await Promise.all([
        getProjects(),
        getSessionTypes(),
      ]);
      setProjects(fetchedProjects);
      setSessionTypes(fetchedSessionTypes);
      setLoaded(true);
    }
    loadData();
  }, []);

  return (
    <AppShell>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
          Command Center
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Case files ready for pressure testing.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
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
        <Badge variant="neutral">Evidence mode: Manual sources</Badge>
        <Badge variant="neutral">Active character: Mock only</Badge>
        <Badge variant="warning">Backend: Pending</Badge>
        <Badge variant="danger">Runway: Not connected</Badge>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Case Files (2/3) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Open Case Files
            </h2>
            {loaded && (
              <span className="text-xs text-zinc-600">
                {projects.length} case{projects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {!loaded && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {loaded && projects.length === 0 && (
            <Panel className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-500">No case files loaded.</p>
              <p className="mt-1 text-xs text-zinc-600">
                A Hot Seat session requires a case file to begin.
              </p>
            </Panel>
          )}

          {/* Project list */}
          {loaded &&
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

        {/* Right: Readiness Notes (1/3) */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Readiness Notes
          </h2>

          <Panel as="aside" className="space-y-3">
            <ReadinessItem>
              Sprint 2 — case file creation from pasted source material.
            </ReadinessItem>
            <ReadinessItem>
              Projects are stored in localStorage (no backend yet).
            </ReadinessItem>
            <ReadinessItem>
              File upload will be enabled after backend storage is connected.
            </ReadinessItem>
          </Panel>

          <Panel as="aside">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Active Judges
            </h3>
            <div className="space-y-2">
              {sessionTypes
                .flatMap((st) => st.judges)
                .filter(
                  (judge, i, arr) =>
                    arr.findIndex((j) => j.id === judge.id) === i
                )
                .map((judge) => (
                  <div key={judge.id} className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    <span className="text-xs text-zinc-400">{judge.name}</span>
                    <span className="text-[10px] text-zinc-600">
                      {judge.roleName}
                    </span>
                  </div>
                ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

// ─── Internal helper ───────────────────────────────────────────────────────────

function ReadinessItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs leading-relaxed">
      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
      <span className="text-zinc-400">{children}</span>
    </div>
  );
}
