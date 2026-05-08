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
  status: ProjectStatus;
  lastVerdict: VerdictLabel;
  createdAt: string;
  updatedAt: string;
};
