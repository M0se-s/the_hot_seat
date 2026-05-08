import { Project } from "./types";
import { mockProjects } from "./mock-data";

const STORAGE_KEY = "hotseat_local_projects";

export function getProjects(): Project[] {
  if (typeof window === "undefined") return mockProjects;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return mockProjects;
  
  try {
    const parsed = JSON.parse(stored) as Project[];
    return [...mockProjects, ...parsed];
  } catch {
    return mockProjects;
  }
}

export function saveProject(project: Project) {
  if (typeof window === "undefined") return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  let projects: Project[] = [];
  if (stored) {
    try {
      projects = JSON.parse(stored);
    } catch {}
  }
  projects.push(project);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
