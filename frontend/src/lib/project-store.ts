import { Project } from "./types";
import { mockProjects } from "./mock-data";

const STORAGE_KEY = "hotseat_local_projects";

export function getProjects(): Project[] {
  if (typeof window === "undefined") return mockProjects;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return mockProjects;
  
  try {
    const parsed = JSON.parse(stored) as Project[];
    // We want parsed projects to override mockProjects with the same ID
    const merged = [...mockProjects];
    for (const p of parsed) {
      const idx = merged.findIndex(m => m.id === p.id);
      if (idx >= 0) {
        merged[idx] = p;
      } else {
        merged.push(p);
      }
    }
    return merged;
  } catch {
    return mockProjects;
  }
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
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

export function updateProject(id: string, updates: Partial<Project>) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(STORAGE_KEY);
  let projects: Project[] = [];
  if (stored) {
    try {
      projects = JSON.parse(stored);
    } catch {}
  }

  const existingIndex = projects.findIndex((p) => p.id === id);
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...updates };
  } else {
    // If it's a mock project being updated, we copy it into local storage to persist the update
    const mockProject = mockProjects.find((p) => p.id === id);
    if (mockProject) {
      projects.push({ ...mockProject, ...updates });
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
