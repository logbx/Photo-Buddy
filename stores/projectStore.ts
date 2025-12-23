import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project, Attempt } from "@/types/project";
import { ImageAnalysis } from "@/types/guidance";

interface ProjectState {
  // Current session state
  currentReferenceUri: string | null;
  currentProjectId: string | null;
  currentAnalysis: ImageAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;

  // Persisted projects
  projects: Project[];

  // Actions
  setCurrentReferenceUri: (uri: string | null) => void;
  setCurrentAnalysis: (analysis: ImageAnalysis | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;

  createProject: (name: string, referenceUri: string, analysis: ImageAnalysis) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;

  addAttempt: (projectId: string, attempt: Attempt) => void;
  deleteAttempt: (projectId: string, attemptId: string) => void;

  // Computed
  recentProjects: Project[];
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentReferenceUri: null,
      currentProjectId: null,
      currentAnalysis: null,
      isAnalyzing: false,
      analysisError: null,
      projects: [],

      // Actions
      setCurrentReferenceUri: (uri) =>
        set({ currentReferenceUri: uri, currentAnalysis: null, analysisError: null }),

      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      setAnalysisError: (error) => set({ analysisError: error }),

      createProject: (name, referenceUri, analysis) => {
        const newProject: Project = {
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          referenceImage: {
            uri: referenceUri,
            analysis,
          },
          attempts: [],
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
          currentProjectId: newProject.id,
        }));

        return newProject;
      },

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        })),

      getProject: (id) => get().projects.find((p) => p.id === id),

      addAttempt: (projectId, attempt) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  attempts: [...p.attempts, attempt],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      deleteAttempt: (projectId, attemptId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  attempts: p.attempts.filter((a) => a.id !== attemptId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      // Computed - returns projects sorted by updatedAt
      get recentProjects() {
        return get().projects.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },
    }),
    {
      name: "photo-buddy-projects",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
