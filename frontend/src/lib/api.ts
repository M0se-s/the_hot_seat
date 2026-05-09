import {
  getStoredProjects,
  saveStoredProjects,
  getStoredSessions,
  saveStoredSessions,
  getStoredFeedback,
  saveStoredFeedback,
} from "./storage";

import { mockSessionTypes, mockPressureQuestions, mockFeedbackReport } from "./mock-data";

import type {
  CreateProjectInput,
  CreateSessionInput,
  EndSessionInput,
  FeedbackReport,
  Project,
  Session,
  SessionType,
} from "./types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export async function getProjects(): Promise<Project[]> {
  return getStoredProjects();
}

export async function getProject(projectId: string): Promise<Project | null> {
  const projects = getStoredProjects();
  return projects.find((project) => project.id === projectId) ?? null;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
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
    evidenceCount: input.pastedTexts.filter(Boolean).length + (input.fileUrls?.length ?? 0),
    status: "draft",
    lastVerdict: "Not tested yet",
    updatedAt: new Date().toISOString(),
  };

  saveStoredProjects([project, ...projects]);
  return project;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = getStoredProjects();
  const index = projects.findIndex(p => p.id === projectId);
  
  if (index === -1) return null;
  
  const updated = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
  projects[index] = updated;
  
  saveStoredProjects(projects);
  return updated;
}

export async function getSessionTypes(): Promise<SessionType[]> {
  return mockSessionTypes;
}

export async function getSessionType(sessionTypeId: string): Promise<SessionType | null> {
  return mockSessionTypes.find((type) => type.id === sessionTypeId) ?? null;
}

export async function createSession(input: CreateSessionInput): Promise<Session> {
  const project = await getProject(input.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const sessionType = await getSessionType(project.sessionTypeId);

  if (!sessionType) {
    throw new Error("Session type not found");
  }

  const activeJudge = sessionType.judges[0];

  const session: Session = {
    id: makeId("session"),
    projectId: project.id,
    state: "created",
    durationSeconds: 300,
    activeJudgeId: activeJudge.id,
    transcript: [],
  };

  const sessions = getStoredSessions();
  saveStoredSessions([session, ...sessions]);

  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = getStoredSessions();
  return sessions.find((session) => session.id === sessionId) ?? null;
}

export async function startSession(sessionId: string): Promise<Session> {
  const sessions = getStoredSessions();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const updatedSession: Session = {
    ...session,
    state: "running",
    startedAt: new Date().toISOString(),
  };

  saveStoredSessions(
    sessions.map((item) => (item.id === sessionId ? updatedSession : item))
  );

  return updatedSession;
}

export async function endSession(
  sessionId: string,
  input: EndSessionInput
): Promise<Session> {
  const sessions = getStoredSessions();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const updatedSession: Session = {
    ...session,
    state: "ended",
    transcript: input.transcript,
    endedAt: new Date().toISOString(),
  };

  saveStoredSessions(
    sessions.map((item) => (item.id === sessionId ? updatedSession : item))
  );

  // For MVP, mock generating feedback and updating project
  await saveSessionFeedback(sessionId, mockFeedbackReport);
  await updateProject(session.projectId, {
    status: "ready",
    lastVerdict: mockFeedbackReport.finalVerdict as any,
  });

  return updatedSession;
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
