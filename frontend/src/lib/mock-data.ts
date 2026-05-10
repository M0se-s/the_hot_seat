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
      "The Hot Seat is a factual crisis rehearsal room for conversations you cannot afford to fumble.\n\nThe system lets users create a case file, add pasted source material or upload PDF/TXT documents, generate source-grounded context and pressure questions, enter a live Hot Seat session with a Runway Character judge, and receive a credibility report after the session.\n\nThe MVP uses one active Runway Character at a time. The full judge panel is visible in the interface, but the first judge in the selected session type becomes the live active judge. For the Demo Panel, Rowan Pierce is the active judge.\n\nThe system tracks the quality of answers through the transcript and source materials. It looks for evasions, unsupported claims, vague ownership, weak timelines, contradictions, and trust recovery moments.\n\nThe post-session credibility report is generated from the transcript and project materials. It includes a final verdict, trust score, judge scoring, strengths, weaknesses, weakest moment, best moment, and suggested stronger answers.\n\nThe MVP intentionally avoids fake evidence, fake companies, fake metrics, fictional incidents, and generated claims that are not grounded in the materials."
    ],
    fileUrls: [],
    extractedContext: [
      "The Hot Seat is a factual crisis rehearsal room — not generic roleplay or AI coaching.",
      "Users create a case file, upload or paste source material, then enter a live session with a Runway Character judge.",
      "The active judge for the Demo Panel is Rowan Pierce — Demo Judge.",
      "The system tracks evasions, unsupported claims, vague ownership, weak timelines, and trust recovery moments.",
      "The credibility report includes: final verdict, trust score, judge scoring, strengths, weaknesses, and stronger answer suggestions.",
      "The MVP intentionally avoids fake evidence, fake metrics, and generated claims not grounded in the materials.",
      "Source materials ground the entire session — answers not supported by the materials will be flagged."
    ],
    suggestedQuestions: [
      "What is the moment people will remember from this demo?",
      "What makes this Runway-native instead of generic roleplay?",
      "What claim in your pitch is actually supported by the current materials?",
      "Who is this painfully for — and how do you know it is not just founders?",
      "What is not live yet in the demo, and why did you cut it?",
      "If Runway fails mid-demo, what does the user experience?",
      "What is the most at-risk claim you are making today?"
    ],
    status: "ready",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T12:00:00Z",
    updatedAt: "2026-05-10T12:00:00Z",
  },
  {
    id: "project-crisis-response",
    title: "Crisis Response Case",
    description:
      "Rehearse a high-stakes response using only pasted source materials and documented claims.",
    sessionTypeId: "session-crisis-panel",
    evidenceCount: 0,
    pastedTexts: [],
    fileUrls: [],
    extractedContext: [],
    suggestedQuestions: [
      "What is the single most damaging fact in the source material?",
      "Who is accountable for the failure, and have you named them?"
    ],
    status: "draft",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T10:30:00Z",
    updatedAt: "2026-05-08T10:30:00Z",
  },
  {
    id: "project-pitch-pressure",
    title: "Pitch Pressure Test",
    description:
      "Stress-test positioning, target user clarity, and unsupported business claims before a live pitch.",
    sessionTypeId: "session-pitch-panel",
    evidenceCount: 0,
    pastedTexts: [],
    fileUrls: [],
    extractedContext: [],
    suggestedQuestions: [
      "Who is this painfully for, and how do you know?",
      "Why would someone pay for this instead of building it themselves?"
    ],
    status: "draft",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T09:00:00Z",
    updatedAt: "2026-05-08T09:00:00Z",
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
    "What is the moment people will remember?",
    "What makes this Runway-native instead of generic roleplay?",
    "What claim is actually supported by the materials?",
    "If the demo crashed halfway through, what would the audience still take away?",
    "What is the one thing you are afraid they will ask?",
  ],
};

// ─── Feedback Report ──────────────────────────────────────────────────────────

export const mockFeedbackReport: FeedbackReport = {
  finalVerdict: "Strong with gaps",
  overallScore: 78,
  scoring: {
    judges: [
      {
        judgeName: "Rowan Pierce",
        category: "Demo Judge",
        score: 85,
        label: "Medium Support",
        notes: "Strong opening, but the wow moment was delayed by unnecessary background context.",
      },
      {
        judgeName: "Nova Reed",
        category: "Product Judge",
        score: 70,
        label: "Low Support",
        notes: "Failed to clearly define the immediate target user. 'Anyone' is not a market.",
      },
      {
        judgeName: "Victor Quell",
        category: "Finance Judge",
        score: 80,
        label: "Low Support",
        notes: "Good recovery on the integration limits, but revenue assumptions are completely unsupported by the provided evidence.",
      }
    ]
  },
  feedback: [
    "You pivoted to the roadmap when asked for current metrics.",
    "Claiming 10x ROI without specific case study data deteriorates credibility immediately."
  ],
  strengths: [
    "Admitting the integration limitation upfront and focusing on the core value prop."
  ],
  weaknesses: [
    "The answer broadened the target user without evidence from the provided materials."
  ],
  bestMoment: "Admitting the integration limitation upfront and focusing on the core value prop.",
  weakestMoment: "Pivot to roadmap when asked for current metrics.",
  suggestedStrongerAnswers: [
    "Our first user is a hackathon team or founder preparing for a high-stakes demo, because that is the scenario supported by the current materials."
  ],
  transcript: [
    "Judge: Who is this painfully for?",
    "User: This is for anyone who wants to pitch better. Sales teams, founders, students...",
    "Judge: The source material only mentions founders preparing for a demo. Why broaden the scope?",
    "User: Well, the roadmap will support everyone eventually.",
    "Judge: We're not buying the roadmap. We're buying the product today. Who pays, how much, and why now?"
  ]
};
