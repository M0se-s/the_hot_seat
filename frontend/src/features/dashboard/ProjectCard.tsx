import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { verdictTone } from "@/styles/design-tokens";
import type { Project, SessionType, VerdictLabel } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  sessionType: SessionType | undefined;
}

function statusLabel(status: string): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "ready":
      return "Ready";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProjectCard({ project, sessionType }: ProjectCardProps) {
  const tone = verdictTone[project.lastVerdict as VerdictLabel] ?? "neutral";

  return (
    <Panel className="group transition-colors duration-200 hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight text-zinc-100">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {project.description}
          </p>
        </div>

        <Badge variant={tone as "neutral" | "danger" | "warning" | "success"}>
          {project.lastVerdict}
        </Badge>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
        {sessionType && (
          <span>
            <span className="text-zinc-600">Panel:</span>{" "}
            <span className="text-zinc-400">{sessionType.name}</span>
          </span>
        )}
        <span>
          <span className="text-zinc-600">Evidence:</span>{" "}
          <span className="text-zinc-400">
            {project.evidenceCount === 0
              ? "None"
              : `${project.evidenceCount} source${project.evidenceCount > 1 ? "s" : ""}`}
          </span>
        </span>
        <span>
          <span className="text-zinc-600">Case status:</span>{" "}
          <span className="text-zinc-400">{statusLabel(project.status)}</span>
        </span>
        <span>
          <span className="text-zinc-600">Updated:</span>{" "}
          <span className="text-zinc-400">{formatDate(project.updatedAt)}</span>
        </span>
      </div>

      {/* CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="text-xs text-zinc-500">
          {project.evidenceCount > 0
            ? `${project.evidenceCount} source attached`
            : "No evidence yet"}
        </span>
        <span className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-red-400">
          View case →
        </span>
      </div>
    </Panel>
  );
}
