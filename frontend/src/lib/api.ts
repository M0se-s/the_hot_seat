import {
  mapProjectFromApi,
  mapSessionFromApi,
  mapSessionTypeFromApi,
} from "@/lib/api-mappers";

import { getStoredFeedback, saveStoredFeedback } from "@/lib/storage";

import type {
  ApiProject,
  ApiSession,
  ApiSessionType,
  CreateProjectInput,
  CreateSessionInput,
  EndSessionInput,
  FeedbackReport,
  Project,
  Session,
  SessionType,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

export async function getProjects(): Promise<Project[]> {
  const projects = await request<ApiProject[]>("/projects");
  return projects.map(mapProjectFromApi);
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const project = await request<ApiProject>(`/projects/${projectId}`);
    return mapProjectFromApi(project);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Project not found")) {
      return null;
    }

    throw error;
  }
}

export async function createProject(
  input: CreateProjectInput
): Promise<Project> {
  const project = await request<ApiProject>("/projects", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      session_type_id: input.sessionTypeId,
      file_urls: input.fileUrls ?? [],
      pasted_texts: input.pastedTexts,
    }),
  });

  return mapProjectFromApi(project);
}

export async function getSessionTypes(): Promise<SessionType[]> {
  const sessionTypes = await request<ApiSessionType[]>("/session-types");
  return sessionTypes.map(mapSessionTypeFromApi);
}

export async function getSessionType(
  sessionTypeId: string
): Promise<SessionType | null> {
  const sessionTypes = await getSessionTypes();
  return sessionTypes.find((type) => type.id === sessionTypeId) ?? null;
}

export async function createSession(
  input: CreateSessionInput
): Promise<Session> {
  const session = await request<ApiSession>(
    `/projects/${input.projectId}/sessions`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );

  return mapSessionFromApi(session);
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const session = await request<ApiSession>(`/sessions/${sessionId}`);
    return mapSessionFromApi(session);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Session not found")) {
      return null;
    }

    throw error;
  }
}

export async function startSession(sessionId: string): Promise<Session> {
  const session = await request<ApiSession>(`/sessions/${sessionId}/start`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  return mapSessionFromApi(session);
}

export async function endSession(
  sessionId: string,
  input: EndSessionInput
): Promise<Session> {
  const session = await request<ApiSession>(`/sessions/${sessionId}/end`, {
    method: "POST",
    body: JSON.stringify({
      transcript: input.transcript,
    }),
  });

  return mapSessionFromApi(session);
}

export async function getSessionFeedback(
  sessionId: string
): Promise<FeedbackReport | null> {
  return getStoredFeedback(sessionId);
}

export async function saveSessionFeedback(
  sessionId: string,
  feedback: FeedbackReport
): Promise<FeedbackReport> {
  saveStoredFeedback(sessionId, feedback);
  return feedback;
}
