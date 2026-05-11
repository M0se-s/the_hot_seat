/**
 * api.ts — Frontend API layer
 *
 * Two-tier strategy for the current build phase:
 *
 * TIER 1 — Backend routes that exist (Sprint 8):
 *   GET /health, /judges, /session-types, /demo-user
 *   These hit the real FastAPI server.
 *
 * TIER 2 — Backend routes not yet implemented:
 *   /projects, /sessions, /sessions/:id/analyze, /sessions/:id/runway/*
 *   These use localStorage via storage.ts until Sprint 9+ backend routes land.
 *   Replacing them later is a one-file change in this file only.
 *
 * Pages never know which tier they're on — they just call these functions.
 */

import {
  mapFeedbackReportFromApi,
  mapProjectContextGenerationFromApi,
  mapProjectQuestionsGenerationFromApi,
  mapRunwayStartFromApi,
  mapSessionTypeFromApi,
  mapUploadResponseFromApi,
} from "@/lib/api-mappers";

import {
  getStoredProjects,
  saveStoredProjects,
  getStoredSessions,
  saveStoredSessions,
  getStoredFeedback,
  saveStoredFeedback,
} from "@/lib/storage";

import {
  mockFeedbackReport,
  mockPressureQuestions,
  mockSessionTypes,
} from "@/lib/mock-data";

import type {
  ApiFeedbackReport,
  ApiRunwayStartResponse,
  ApiProjectContextGeneration,
  ApiProjectQuestionsGeneration,
  ApiSessionType,
  ApiUploadResponse,
  CreateProjectInput,
  CreateSessionInput,
  EndSessionInput,
  FeedbackReport,
  Project,
  ProjectContextGeneration,
  ProjectQuestionsGeneration,
  RunwayStartResponse,
  Session,
  SessionType,
  UploadResponse,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // Keep default error message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// ─── TIER 1: Session types — from real backend ────────────────────────────────

export async function getSessionTypes(): Promise<SessionType[]> {
  const sessionTypes = await request<ApiSessionType[]>("/session-types");
  return sessionTypes.map(mapSessionTypeFromApi);
}

export async function getSessionType(
  sessionTypeId: string,
): Promise<SessionType | null> {
  try {
    const sessionTypes = await getSessionTypes();
    const found = sessionTypes.find((type) => type.id === sessionTypeId);
    if (found) return found;
  } catch {
    // Backend fetch failed, fall through to mock data
  }

  // Fallback: Try to find in mock session types (for demo/development)
  const found = mockSessionTypes.find((type) => type.id === sessionTypeId);
  return found ?? null;
}

// ─── TIER 2: Projects — localStorage until backend route exists ───────────────

export async function getProjects(): Promise<Project[]> {
  return getStoredProjects();
}

export async function getProject(projectId: string): Promise<Project | null> {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === projectId) ?? null;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const projects = getStoredProjects();

  const project: Project = {
    id: makeId("project"),
    title: input.title,
    description: input.description,
    sessionTypeId: input.sessionTypeId,
    pastedTexts: input.pastedTexts,
    fileUrls: input.fileUrls ?? [],
    extractedContext: [],
    suggestedQuestions: mockPressureQuestions[input.sessionTypeId] ?? [],
    evidenceCount:
      input.pastedTexts.filter(Boolean).length + (input.fileUrls?.length ?? 0),
    status: "draft",
    lastVerdict: "Not tested yet",
    updatedAt: new Date().toISOString(),
  };

  saveStoredProjects([project, ...projects]);
  return project;
}

export async function updateProject(
  projectId: string,
  patch: Partial<Project>,
): Promise<Project> {
  const projects = getStoredProjects();
  const updated = projects.map((p) =>
    p.id === projectId
      ? { ...p, ...patch, updatedAt: new Date().toISOString() }
      : p,
  );
  saveStoredProjects(updated);
  const found = updated.find((p) => p.id === projectId);
  if (!found) throw new Error("Project not found");
  return found;
}

// ─── TIER 2: Sessions — localStorage until backend route exists ───────────────

export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const sessions = getStoredSessions();

  const session: Session = {
    id: makeId("session"),
    projectId: input.projectId,
    state: "created",
    durationSeconds: 300,
    activeJudgeId: "",
    transcript: [],
    startedAt: undefined,
    endedAt: undefined,
  };

  saveStoredSessions([session, ...sessions]);
  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = getStoredSessions();
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export async function startSession(sessionId: string): Promise<Session> {
  const sessions = getStoredSessions();
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session not found");

  const updated: Session = {
    ...session,
    state: "running",
    startedAt: new Date().toISOString(),
  };

  saveStoredSessions(sessions.map((s) => (s.id === sessionId ? updated : s)));
  return updated;
}

export async function endSession(
  sessionId: string,
  input: EndSessionInput,
): Promise<Session> {
  const sessions = getStoredSessions();
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session not found");

  const updated: Session = {
    ...session,
    state: "ended",
    transcript: input.transcript,
    endedAt: new Date().toISOString(),
  };

  saveStoredSessions(sessions.map((s) => (s.id === sessionId ? updated : s)));

  // Persist mock feedback so the report page has data immediately
  saveStoredFeedback(sessionId, mockFeedbackReport);

  // Update project status
  await updateProject(session.projectId, {
    status: "ready",
    lastVerdict: mockFeedbackReport.finalVerdict as
      | "Not tested yet"
      | "Not ready"
      | "Promising but weak"
      | "Strong with gaps"
      | "Demo-ready",
  });

  return updated;
}

// ─── TIER 2: Feedback — localStorage until Featherless route exists ───────────

export async function getSessionFeedback(
  sessionId: string,
): Promise<FeedbackReport | null> {
  return getStoredFeedback(sessionId);
}

export async function saveSessionFeedbackLocal(
  sessionId: string,
  feedback: FeedbackReport,
): Promise<FeedbackReport> {
  saveStoredFeedback(sessionId, feedback);
  return feedback;
}

export async function analyzeSession(
  sessionId: string,
): Promise<FeedbackReport> {
  try {
    const report = await request<ApiFeedbackReport>(
      `/sessions/${sessionId}/analyze`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
    const mapped = mapFeedbackReportFromApi(report);
    saveStoredFeedback(sessionId, mapped);
    return mapped;
  } catch {
    // Featherless fallback — return saved mock report
    const saved = getStoredFeedback(sessionId);
    if (saved) return saved;
    saveStoredFeedback(sessionId, mockFeedbackReport);
    return mockFeedbackReport;
  }
}

// ─── TIER 1+2: Runway — real backend, Runway SDK ─────────────────────────────

export async function startRunwaySession(
  sessionId: string,
): Promise<RunwayStartResponse> {
  if (sessionId.startsWith("session-")) {
    return {
      sessionId,
      sessionKey: null,
      conversationId: sessionId,
      state: "running",
      raw: {},
    };
  }

  const response = await request<ApiRunwayStartResponse>(
    `/sessions/${sessionId}/runway/start`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  return mapRunwayStartFromApi(response);
}

export async function endRunwaySession(sessionId: string): Promise<void> {
  if (sessionId.startsWith("session-")) {
    return;
  }

  try {
    await request<{ status: string }>(`/sessions/${sessionId}/runway/end`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  } catch {
    // Runway cleanup failure is non-fatal — manual transcript mode continues.
  }
}

// ─── TIER 1: File uploads — real Supabase upload via backend ─────────────────

export async function uploadProjectFile(
  projectId: string,
  file: File,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/uploads`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let message = `Upload failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // Keep default
    }
    throw new Error(message);
  }

  const result = (await response.json()) as ApiUploadResponse;
  return mapUploadResponseFromApi(result);
}

// ─── TIER 2: Context & question generation — real Featherless via backend ─────

export async function generateProjectContext(
  projectId: string,
): Promise<ProjectContextGeneration> {
  try {
    const response = await request<ApiProjectContextGeneration>(
      `/projects/${projectId}/generate-context`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
    const mapped = mapProjectContextGenerationFromApi(response);

    // Persist generated context locally
    await updateProject(projectId, {
      extractedContext: mapped.extractedContext,
    });

    return mapped;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Context generation failed. Check that source material has been added.",
    );
  }
}

export async function generateProjectQuestions(
  projectId: string,
): Promise<ProjectQuestionsGeneration> {
  try {
    const response = await request<ApiProjectQuestionsGeneration>(
      `/projects/${projectId}/generate-questions`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
    const mapped = mapProjectQuestionsGenerationFromApi(response);

    // Persist generated questions locally
    await updateProject(projectId, {
      suggestedQuestions: mapped.suggestedQuestions,
    });

    return mapped;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Question generation failed. Check that source material has been added.",
    );
  }
}
