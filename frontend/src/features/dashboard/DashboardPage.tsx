"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/Panel";

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
          The Hot Seat
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


      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="space-y-4">
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
    </AppShell>
  );
}
