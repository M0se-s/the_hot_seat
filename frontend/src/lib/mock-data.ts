import type { Judge, SessionType, Project } from "./types";

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
      "Pressure-test The Hot Seat\u2019s Runway hackathon demo flow using the team\u2019s own project materials and implementation plan.",
    sessionTypeId: "session-demo-panel",
    evidenceCount: 1,
    status: "draft",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T12:00:00Z",
    updatedAt: "2026-05-08T12:00:00Z",
  },
  {
    id: "project-crisis-response",
    title: "Crisis Response Case",
    description:
      "Rehearse a high-stakes response using only pasted source materials and documented claims.",
    sessionTypeId: "session-crisis-panel",
    evidenceCount: 0,
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
    status: "draft",
    lastVerdict: "Not tested yet",
    createdAt: "2026-05-08T09:00:00Z",
    updatedAt: "2026-05-08T09:00:00Z",
  },
];
