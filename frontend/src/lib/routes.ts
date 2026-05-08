export const routes = {
  home: "/",
  dashboard: "/dashboard",
  newProject: "/projects/new",
  project: (projectId: string) => `/projects/${projectId}`,
  liveSession: (sessionId: string) => `/sessions/${sessionId}/live`,
  feedback: (sessionId: string) => `/sessions/${sessionId}/feedback`,
} as const;
