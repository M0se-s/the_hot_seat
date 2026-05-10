import { AppShell } from "@/components/layout/AppShell";
import { CreateProjectForm } from "./CreateProjectForm";
import Link from "next/link";
import { routes } from "@/lib/routes";

export function NewProjectPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href={routes.dashboard}
            className="mb-4 inline-flex items-center text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Command Center
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Open New Case File
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Define the scenario, select the pressure panel, and paste source material.
          </p>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <CreateProjectForm />
      </div>
    </AppShell>
  );
}
