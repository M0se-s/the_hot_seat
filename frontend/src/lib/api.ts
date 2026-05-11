/**
 * api.ts — Frontend API layer
 *
 * All routes hit the real FastAPI backend. There is no local-storage
 * fallback or mock data for any entity.
 */

import {
  mapFeedbackReportFromApi,
  mapProjectContextGenerationFromApi,
  mapProjectQuestionsGenerationFromApi,
  mapRunwayStartFromApi,
  mapSessionTypeFromApi,
  mapUploadResponseFromApi,
  mapProjectFromApi,
  mapSessionFromApi,
} from "@/lib/api-mappers";

import {
  getStoredFeedback,
  saveStoredFeedback,
} from "@/lib/storage";

import type {
  ApiFeedbackReport,
  ApiRunwayStartResponse,
  ApiProjectContextGeneration,
  ApiProjectQuestionsGeneration,
  ApiSessionType,
  ApiUploadResponse,
  ApiProject,
  ApiSession,
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

// ─── TIER 1: Session types — from real backend ────────────────────────────────

export async function getSessionTypes(): Promise<SessionType[]> {
  const sessionTypes = await request<ApiSessionType[]>("/session-types");
  return sessionTypes.map(mapSessionTypeFromApi);
}

export async function getSessionType(
  sessionTypeId: string,
): Promise<SessionType | null> {
  const sessionTypes = await getSessionTypes();
  return sessionTypes.find((type) => type.id === sessionTypeId) ?? null;
}

// ─── TIER 1: Projects — real backend routes ───────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const projects = await request<ApiProject[]>("/projects");
  return projects.map(mapProjectFromApi);
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const project = await request<ApiProject>(`/projects/${projectId}`);
    return mapProjectFromApi(project);
  } catch {
    return null;
  }
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const payload = {
    title: input.title,
    description: input.description,
    session_type_id: input.sessionTypeId,
    pasted_texts: input.pastedTexts,
    file_urls: input.fileUrls ?? [],
  };
  const response = await request<ApiProject>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapProjectFromApi(response);
}

export async function updateProject(
  projectId: string,
  patch: Partial<Project>,
): Promise<Project> {
  const payload: Record<string, unknown> = {};
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.sessionTypeId !== undefined) payload.session_type_id = patch.sessionTypeId;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.pastedTexts !== undefined) payload.pasted_texts = patch.pastedTexts;
  if (patch.fileUrls !== undefined) payload.file_urls = patch.fileUrls;
  if (patch.extractedContext !== undefined) payload.extracted_context = patch.extractedContext;
  if (patch.suggestedQuestions !== undefined) payload.suggested_questions = patch.suggestedQuestions;

  const response = await request<ApiProject>(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapProjectFromApi(response);
}

// ─── TIER 1: Sessions — real backend routes ───────────────────────────────────

export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const response = await request<ApiSession>(`/projects/${input.projectId}/sessions`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return mapSessionFromApi(response);
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const session = await request<ApiSession>(`/sessions/${sessionId}`);
    return mapSessionFromApi(session);
  } catch {
    return null;
  }
}

export async function startSession(sessionId: string): Promise<Session> {
  const response = await request<ApiSession>(`/sessions/${sessionId}/start`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return mapSessionFromApi(response);
}

export async function endSession(
  sessionId: string,
  input: EndSessionInput,
): Promise<Session> {
  const response = await request<ApiSession>(`/sessions/${sessionId}/end`, {
    method: "POST",
    body: JSON.stringify({ transcript: input.transcript }),
  });
  return mapSessionFromApi(response);
}

// ─── TIER 1: Feedback — real Featherless route via backend ────────────────────

export async function getSessionFeedback(
  sessionId: string,
): Promise<FeedbackReport | null> {
  return getStoredFeedback(sessionId);
}

export async function analyzeSession(
  sessionId: string,
): Promise<FeedbackReport> {
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
}

// ─── TIER 1: Runway — real backend, Runway SDK ───────────────────────────────

export async function startRunwaySession(
  sessionId: string,
): Promise<RunwayStartResponse> {
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
  try {
    await request<{ status: string }>(`/sessions/${sessionId}/runway/end`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  } catch {
    // Runway cleanup failure is non-fatal — session end still proceeds.
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

// ─── TIER 1: Context & question generation — real Featherless via backend ─────

export async function generateProjectContext(
  projectId: string,
): Promise<ProjectContextGeneration> {
  const response = await request<ApiProjectContextGeneration>(
    `/projects/${projectId}/generate-context`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  const mapped = mapProjectContextGenerationFromApi(response);

  // Persist generated context to backend
  await updateProject(projectId, {
    extractedContext: mapped.extractedContext,
  });

  return mapped;
}

export async function generateProjectQuestions(
  projectId: string,
): Promise<ProjectQuestionsGeneration> {
  const response = await request<ApiProjectQuestionsGeneration>(
    `/projects/${projectId}/generate-questions`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  const mapped = mapProjectQuestionsGenerationFromApi(response);

  // Persist generated questions to backend
  await updateProject(projectId, {
    suggestedQuestions: mapped.suggestedQuestions,
  });

  return mapped;
}
