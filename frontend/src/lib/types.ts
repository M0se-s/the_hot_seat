export type Judge = {
  id: string;
  name: string;
  roleName: string;
  personality: string;
  description: string;
  signaturePressure: string;
  isActive?: boolean;
};

export type SessionType = {
  id: string;
  name: string;
  description: string;
  defaultDurationSeconds: number;
  judges: Judge[];
};

export type VerdictLabel =
  | "Not tested yet"
  | "Not ready"
  | "Promising but weak"
  | "Strong with gaps"
  | "Demo-ready";

export type ProjectStatus = "draft" | "ready" | "archived";

export type Project = {
  id: string;
  title: string;
  description: string;
  sessionTypeId: string;
  evidenceCount: number;
  sourceText?: string;
  pastedTexts: string[];
  fileUrls: string[];
  extractedContext: string[];
  suggestedQuestions: string[];
  status: ProjectStatus;
  lastVerdict: VerdictLabel;
  createdAt?: string;
  updatedAt?: string;
};

export type SessionState = "created" | "running" | "ended";

export type Session = {
  id: string;
  projectId: string;
  state: SessionState;
  durationSeconds: number;
  activeJudgeId: string;
  transcript: string[];
  startedAt?: string;
  endedAt?: string;
};

// ─── API Contracts ───────────────────────────────────────────────────────────

export type CreateProjectInput = {
  title: string;
  description: string;
  sessionTypeId: string;
  pastedTexts: string[];
  fileUrls?: string[];
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
};

export type CreateSessionInput = {
  projectId: string;
};

export type EndSessionInput = {
  transcript: string[];
};

export type JudgeScore = {
  judgeName: string;
  category: string;
  score: number;
  label: string;
  notes: string;
};

export type FeedbackReport = {
  finalVerdict: string;
  overallScore: number;
  scoring: {
    judges: JudgeScore[];
  };
  feedback: string[];
  strengths: string[];
  weaknesses: string[];
  bestMoment: string;
  weakestMoment: string;
  suggestedStrongerAnswers: string[];
  transcript: string[];
};
