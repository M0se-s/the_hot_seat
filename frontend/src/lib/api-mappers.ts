import type {
  ApiFeedbackReport,
  ApiJudge,
  ApiRunwayStartResponse,
  ApiProject,
  ApiProjectContextGeneration,
  ApiProjectQuestionsGeneration,
  ApiSession,
  ApiSessionType,
  ApiUploadResponse,
  FeedbackReport,
  Judge,
  Project,
  ProjectContextGeneration,
  ProjectQuestionsGeneration,
  RunwayStartResponse,
  Session,
  SessionType,
  UploadResponse,
} from "@/lib/types";

export function mapJudgeFromApi(judge: ApiJudge): Judge {
  return {
    id: judge.id,
    name: judge.name,
    roleName: judge.role_name,
    personality: judge.personality,
    description: judge.description ?? "",
    signaturePressure: judge.signature_pressure ?? "",
    avatarId: judge.avatar_id,
    isActive: judge.is_active,
  };
}

export function mapSessionTypeFromApi(
  sessionType: ApiSessionType,
): SessionType {
  return {
    id: sessionType.id,
    name: sessionType.name,
    description: sessionType.description ?? "",
    defaultDurationSeconds: sessionType.default_duration_seconds,
    judges: sessionType.judges.map(mapJudgeFromApi),
  };
}

export function mapProjectFromApi(project: ApiProject): Project {
  const allTexts = [
    ...(project.pasted_texts ?? []),
    ...(project.extracted_context ?? []),
  ].filter(Boolean);

  return {
    id: project.id,
    title: project.title,
    description: project.description ?? "",
    sessionTypeId: project.session_type_id,
    sourceText: allTexts.join("\n\n"),
    fileUrls: project.file_urls ?? [],
    pastedTexts: project.pasted_texts ?? [],
    extractedContext: project.extracted_context ?? [],
    suggestedQuestions: project.suggested_questions ?? [],
    evidenceCount:
      (project.file_urls?.length ?? 0) +
      (project.pasted_texts?.filter(Boolean).length ?? 0),
    status: project.status,
    lastVerdict: "Not tested yet",
    updatedAt: project.updated_at,
  };
}

export function mapSessionFromApi(session: ApiSession): Session {
  return {
    id: session.id,
    projectId: session.project_id,
    state: session.state,
    durationSeconds: session.duration_seconds,
    activeJudgeId: session.active_judge_id ?? "",
    transcript: session.transcript ?? [],
    startedAt: session.started_at ?? undefined,
    endedAt: session.ended_at ?? undefined,
  };
}

export function mapFeedbackReportFromApi(
  report: ApiFeedbackReport,
): FeedbackReport {
  return {
    finalVerdict: report.final_verdict,
    overallScore: report.overall_score,
    scoring: {
      judges:
        report.scoring?.judges?.map((judge) => ({
          judgeName: judge.judge_name,
          category: judge.category,
          score: judge.score,
          label: judge.label,
          notes: judge.notes,
        })) ?? [],
    },
    feedback: report.feedback ?? [],
    strengths: report.strengths ?? [],
    weaknesses: report.weaknesses ?? [],
    bestMoment: report.best_moment ?? "",
    weakestMoment: report.weakest_moment ?? "",
    suggestedStrongerAnswers: report.suggested_stronger_answers ?? [],
    transcript: report.transcript ?? [],
  };
}

export function mapRunwayStartFromApi(
  response: ApiRunwayStartResponse,
): RunwayStartResponse {
  return {
    sessionId: response.session_id,
    sessionKey: response.session_key ?? null,
    conversationId: response.conversation_id ?? null,
    state: response.state,
    raw: response.raw ?? null,
  };
}

export function mapUploadResponseFromApi(
  response: ApiUploadResponse,
): UploadResponse {
  return {
    fileUrl: response.file_url,
    filename: response.filename,
    contentType: response.content_type,
    extractedText: response.extracted_text,
  };
}

export function mapProjectContextGenerationFromApi(
  response: ApiProjectContextGeneration,
): ProjectContextGeneration {
  return {
    extractedContext: response.extracted_context ?? [],
    weakSpots: response.weak_spots ?? [],
    unsupportedRisks: response.unsupported_risks ?? [],
  };
}

export function mapProjectQuestionsGenerationFromApi(
  response: ApiProjectQuestionsGeneration,
): ProjectQuestionsGeneration {
  return {
    suggestedQuestions: response.suggested_questions ?? [],
    followUpAngles: response.follow_up_angles ?? [],
  };
}
