import type { FeedbackReport } from "./types";

const FEEDBACK_KEY = "hot-seat.feedback";

function isBrowser() {
  return typeof window !== "undefined";
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

export function saveStoredFeedback(
  sessionId: string,
  feedback: FeedbackReport,
) {
  if (!isBrowser()) return;
  window.localStorage.setItem(
    `${FEEDBACK_KEY}.${sessionId}`,
    JSON.stringify(feedback),
  );
}
