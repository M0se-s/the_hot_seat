import { mockProjects } from "./mock-data";
import type { Project, Session, FeedbackReport } from "./types";

const PROJECTS_KEY = "hot-seat.projects";
const SESSIONS_KEY = "hot-seat.sessions";
const FEEDBACK_KEY = "hot-seat.feedback";

// Bump this version when mock seed data changes significantly.
// It triggers a refresh of mock projects in localStorage.
const SEED_VERSION = "2026-05-10-v2";
const SEED_VERSION_KEY = "hot-seat.seed-version";

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Checks if the stored seed version matches the current one.
 * If not, clears projects so fresh mock data is seeded.
 */
function ensureSeedFresh() {
  const stored = window.localStorage.getItem(SEED_VERSION_KEY);
  if (stored !== SEED_VERSION) {
    window.localStorage.removeItem(PROJECTS_KEY);
    window.localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

export function getStoredProjects(): Project[] {
  if (!isBrowser()) return mockProjects;

  ensureSeedFresh();

  const raw = window.localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
    return mockProjects;
  }

  try {
    const stored = JSON.parse(raw) as Project[];
    // Ensure mock projects that have been updated are merged in
    const mergedMap = new Map(stored.map((p) => [p.id, p]));
    for (const mock of mockProjects) {
      if (!mergedMap.has(mock.id)) {
        mergedMap.set(mock.id, mock);
      } else {
        // Always keep fresh mock fields for demo project
        const existing = mergedMap.get(mock.id)!;
        mergedMap.set(mock.id, {
          ...mock,
          // Preserve user changes: title, description, status, lastVerdict, transcript
          title: existing.title,
          description: existing.description,
          status: existing.status,
          lastVerdict: existing.lastVerdict,
          // Use mock's richer content if existing is empty
          pastedTexts: existing.pastedTexts?.length > 0 ? existing.pastedTexts : mock.pastedTexts,
          extractedContext: existing.extractedContext?.length > 0 ? existing.extractedContext : mock.extractedContext,
          suggestedQuestions: existing.suggestedQuestions?.length > 0 ? existing.suggestedQuestions : mock.suggestedQuestions,
        });
      }
    }
    const merged = Array.from(mergedMap.values());
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(merged));
    return merged;
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
