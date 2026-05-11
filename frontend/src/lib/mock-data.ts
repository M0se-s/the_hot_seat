import type { FeedbackReport, Judge, Project, SessionType } from "./types";

// ─── Judges ────────────────────────────────────────────────────────────────────

export const mockJudges: Judge[] = [
  {
    id: "judge-mara-vale",
    name: "Mara Vale",
    roleName: "Journalist",
    personality: "sharp, composed, skeptical, press-room energy",
    description:
      "Tracks public trust, direct answers, evasions, and harm acknowledgment.",
    signaturePressure: "Answer the question directly.",
    isActive: true,
  },
  {
    id: "judge-priya-stone",
    name: "Priya Stone",
    roleName: "Operator",
    personality: "practical, impatient, execution-first",
    description:
      "Tracks ownership, deadlines, next steps, remediation, and execution.",
    signaturePressure: "Who owns the fix, and by when?",
    isActive: true,
  },
  {
    id: "judge-elias-cross",
    name: "Elias Cross",
    roleName: "Evidence Judge",
    personality: "cold, precise, legalistic, evidence-obsessed",
    description:
      "Tracks unsupported claims, contradictions, source mismatch, and timeline gaps.",
    signaturePressure: "The record does not support that.",
    isActive: true,
  },
  {
    id: "judge-nova-reed",
    name: "Nova Reed",
    roleName: "Product Judge",
    personality: "curious but brutal, allergic to vague product claims",
    description:
      "Tracks user pain, workflow clarity, product value, and differentiation.",
    signaturePressure: "Who is this painfully for?",
    isActive: true,
  },
  {
    id: "judge-victor-quell",
    name: "Victor Quell",
    roleName: "Finance Judge",
    personality: "blunt, numbers-first, skeptical of hype",
    description:
      "Tracks pricing, buyer logic, revenue assumptions, and defensibility.",
    signaturePressure: "Who pays, how much, and why now?",
    isActive: true,
  },
  {
    id: "judge-rowan-pierce",
    name: "Rowan Pierce",
    roleName: "Demo Judge",
    personality: "theatrical but practical, obsessed with memorability",
    description:
      "Tracks story, wow moment, technical depth, demo clarity, and hackathon fit.",
    signaturePressure: "What is the moment people will remember?",
    isActive: true,
  },
];

// ─── Session Types ─────────────────────────────────────────────────────────────

export const mockSessionTypes: SessionType[] = [
  {
    id: "session-crisis-panel",
    name: "Crisis Panel",
    description:
      "Three-judge panel focused on public trust, operational accountability, and evidentiary rigor.",
    defaultDurationSeconds: 300,
    judges: [mockJudges[0], mockJudges[1], mockJudges[2]],
  },
  {
    id: "session-pitch-panel",
    name: "Pitch Panel",
    description:
      "Three-judge panel stress-testing product claims, buyer logic, and evidence quality.",
    defaultDurationSeconds: 300,
    judges: [mockJudges[3], mockJudges[4], mockJudges[2]],
  },
  {
    id: "session-demo-panel",
    name: "Demo Panel",
    description:
      "Three-judge panel evaluating demo clarity, product value, and commercial viability.",
    defaultDurationSeconds: 300,
    judges: [mockJudges[5], mockJudges[3], mockJudges[4]],
  },
];

// ─── Projects ──────────────────────────────────────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: "project-hackathon-demo",
    title: "Hackathon Demo Project",
    description:
      "Pressure-test The Hot Seat's Runway hackathon demo flow using the team's own project materials and implementation plan.",
    sessionTypeId: "session-demo-panel",
    evidenceCount: 1,
    pastedTexts: [
      "The Hot Seat is a factual crisis rehearsal room for conversations you cannot afford to fumble.\n\nThe system lets users create a case file, add pasted source material or upload PDF/TXT documents, generate source-grounded context and pressure questions, enter a live Hot Seat session with a Runway Character judge, and receive a credibility report after the session.\n\nThe MVP uses one active Runway Character at a time. The full judge panel is visible in the interface, but the first judge in the selected session type becomes the live active judge. For the Demo Panel, Rowan Pierce is the active judge.\n\nThe system tracks the quality of answers through the transcript and source materials. It looks for evasions, unsupported claims, vague ownership, weak timelines, contradictions, and trust recovery moments.\n\nThe post-session credibility report is generated from the transcript and project materials. It includes a final verdict, trust score, judge scoring, strengths, weaknesses, weakest moment, best moment, and suggested stronger answers.\n\nThe MVP keeps claims grounded in the materials and avoids unsupported additions.",
    ],
    fileUrls: [],
    extractedContext: [
      "The Hot Seat is a factual crisis rehearsal room — not generic roleplay or AI pep talk.",
      "Users create a case file, upload or paste source material, then enter a live session with a Runway Character judge.",
      "The active judge for the Demo Panel is Rowan Pierce — Demo Judge.",
      "The system tracks evasions, unsupported claims, vague ownership, weak timelines, and trust recovery moments.",
      "The credibility report includes: final verdict, trust score, judge scoring, strengths, weaknesses, and stronger answer suggestions.",
      "The MVP keeps claims grounded in the materials and avoids unsupported additions.",
      "Source materials ground the entire session — answers not supported by the materials will be flagged.",
    ],
    suggestedQuestions: [
      "What is the moment people will remember from this demo?",
      "What evidence do you have that the system can do that today?",
      "What is actually live in the demo right now?",
      "What is not included yet, and why?",
      "Who is this painfully for?",
      "What claim is most at risk today?",
      "If Runway fails mid-demo, what does the user do?",
    ],
    status: "ready",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T12:00:00Z",
    updatedAt: "2026-05-10T12:00:00Z",
  },
];

// ─── Pressure Questions ────────────────────────────────────────────────────────

export const mockPressureQuestions: Record<string, string[]> = {
  "session-crisis-panel": [
    "What is the single most damaging fact in the source material?",
    "If a journalist quoted your own words back to you, which line would hurt the most?",
    "Who is accountable for the failure, and have you named them?",
    "What are you not saying — and why will it come out anyway?",
    "If this were leaked tomorrow, what would the headline be?",
  ],
  "session-pitch-panel": [
    "Who is this painfully for, and how do you know?",
    "What claim in your pitch is not supported by evidence?",
    "Why would someone pay for this instead of building it themselves?",
    "What is your weakest assumption about the buyer?",
    "If a competitor copied your pitch word-for-word, what would they still be missing?",
  ],
  "session-demo-panel": [
    "What is the moment people will remember from this demo?",
    "What evidence do you have that the system can do that today?",
    "What is actually live in the demo right now?",
    "What is not included yet, and why?",
    "Who is this painfully for?",
    "What claim is most at risk today?",
    "If Runway fails mid-demo, what does the user do?",
  ],
};

// ─── Feedback Report ──────────────────────────────────────────────────────────

export const mockFeedbackReport: FeedbackReport = {
  finalVerdict: "Strong with gaps",
  overallScore: 82,
  scoring: {
    judges: [
      {
        judgeName: "Rowan Pierce",
        category: "Demo Judge",
        score: 88,
        label: "Medium Support",
        notes:
          "Clear demo path, but the memorable moment should land faster and harder.",
      },
      {
        judgeName: "Nova Reed",
        category: "Product Judge",
        score: 76,
        label: "Medium Support",
        notes:
          "Target user was named, but the proof for trust-loss detection is still thin.",
      },
      {
        judgeName: "Victor Quell",
        category: "Finance Judge",
        score: 82,
        label: "Medium Support",
        notes:
          "Good scope discipline, but the value proof needs tighter evidence from the materials.",
      },
    ],
  },
  feedback: [
    "You clearly separated what is live today from what was cut for stability.",
    "The trust-loss detection claim still lacks measurable evidence beyond transcript analysis.",
  ],
  strengths: [
    "Clear separation between live demo features and future scope.",
    "Built-in fallback for Runway failure is credible and user-first.",
  ],
  weaknesses: [
    "Trust-loss detection is not yet backed by measurable proof beyond transcript analysis.",
  ],
  bestMoment:
    "Naming what is live today and what was intentionally cut for stability.",
  weakestMoment:
    "Claiming trust-loss detection without measurable proof beyond transcript analysis.",
  suggestedStrongerAnswers: [
    "In the MVP, trust-loss detection is based on transcript analysis against source materials; a behavioral scoring model is future work.",
  ],
  transcript: [
    "Judge: What is the moment people will remember from this demo?",
    "User: The moment is when the Runway Character catches an unsupported claim during the Hot Seat and forces the user to answer directly.",
    "Judge: What evidence do you have that the system can do that today?",
    "User: The current MVP grounds the session in pasted or uploaded source materials, generates pressure questions from those materials, captures the transcript, and uses Featherless to produce a credibility report that flags unsupported claims and evasions.",
    "Judge: That describes the architecture. What is actually live in the demo?",
    "User: The live demo includes project creation, source upload, generated context, generated pressure questions, a Runway Character session, manual transcript fallback, and a post-session credibility report.",
    "Judge: What is not included yet?",
    "User: The MVP does not include recap video, OCR, DOCX upload, multiple simultaneous Runway Characters, real authentication, or a full event timeline. Those were intentionally cut to keep the demo stable.",
    "Judge: Who is this painfully for?",
    "User: The first user is a founder, hackathon team, executive, or spokesperson preparing for a high-stakes pitch, crisis response, demo, or public explanation where vague or unsupported answers can damage credibility.",
    "Judge: What claim are you making that is most at risk?",
    "User: The risky claim is that the system can detect trust loss and recovery. In the MVP, that is based on transcript analysis and source-grounded feedback, not a live behavioral scoring model.",
  ],
};
