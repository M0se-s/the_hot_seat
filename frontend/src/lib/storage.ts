import { mockProjects } from "./mock-data";
import type { Project, Session, FeedbackReport } from "./types";

const PROJECTS_KEY = "hot-seat.projects";
const SESSIONS_KEY = "hot-seat.sessions";
const FEEDBACK_KEY = "hot-seat.feedback";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredProjects(): Project[] {
  if (!isBrowser()) return mockProjects;

  const raw = window.localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
    return mockProjects;
  }

  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return mockProjects;
  }
}

export function saveStoredProjects(projects: Project[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getStoredSessions(): Session[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

export function saveStoredSessions(sessions: Session[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getStoredFeedback(sessionId: string): FeedbackReport | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(`${FEEDBACK_KEY}.${sessionId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FeedbackReport;
  } catch {
    return null;
  }
}

export function saveStoredFeedback(sessionId: string, feedback: FeedbackReport) {
  if (!isBrowser()) return;
  window.localStorage.setItem(`${FEEDBACK_KEY}.${sessionId}`, JSON.stringify(feedback));
}
