export type Judge = {
  id: string;
  name: string;
  roleName: string;
  personality: string;
  description: string;
  signaturePressure: string;
  avatarId?: string | null;
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
    judges: {
      judgeName: string;
      category: string;
      score: number;
      label: string;
      notes: string;
    }[];
  };
  feedback: string[];
  strengths: string[];
  weaknesses: string[];
  bestMoment: string;
  weakestMoment: string;
  suggestedStrongerAnswers: string[];
  transcript: string[];
};

// Backend API response contracts mirror the Python API's snake_case fields.

export type ApiJudge = {
  id: string;
  name: string;
  role_name: string;
  personality: string;
  description: string | null;
  signature_pressure: string | null;
  avatar_id: string | null;
  voice_preset: string | null;
  base_prompt: string | null;
  is_active: boolean;
};

export type RunwayStartResponse = {
  sessionId: string;
  sessionKey?: string | null;
  conversationId?: string | null;
  state: string;
  raw?: Record<string, unknown> | null;
};

export type ApiRunwayStartResponse = {
  session_id: string;
  session_key?: string | null;
  conversation_id?: string | null;
  state: string;
  raw?: Record<string, unknown> | null;
};

export type ApiSessionType = {
  id: string;
  name: string;
  description: string | null;
  default_duration_seconds: number;
  rubric: Record<string, unknown> | null;
  is_active: boolean;
  judges: ApiJudge[];
};

export type ApiProject = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  session_type_id: string;
  file_urls: string[];
  pasted_texts: string[];
  extracted_context: string[];
  suggested_questions: string[];
  status: "draft" | "ready" | "archived";
  created_at: string;
  updated_at: string;
};

export type ApiSession = {
  id: string;
  project_id: string;
  user_id: string;
  session_type_id: string;
  active_judge_id: string | null;
  state: SessionState;
  duration_seconds: number;
  runway_session_id: string | null;
  runway_conversation_id: string | null;
  transcript: string[];
  feedback: string[];
  scoring: Record<string, unknown> | null;
  overall_score: number | null;
  final_verdict: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiFeedbackReport = {
  final_verdict: string;
  overall_score: number;
  scoring: {
    judges: {
      judge_name: string;
      category: string;
      score: number;
      label: string;
      notes: string;
    }[];
  };
  feedback: string[];
  strengths: string[];
  weaknesses: string[];
  best_moment: string;
  weakest_moment: string;
  suggested_stronger_answers: string[];
  transcript: string[];
};

export type ApiUploadResponse = {
  file_url: string;
  filename: string;
  content_type: string;
  extracted_text: string;
};

export type UploadResponse = {
  fileUrl: string;
  filename: string;
  contentType: string;
  extractedText: string;
};
