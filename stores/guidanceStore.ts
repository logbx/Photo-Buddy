import { create } from "zustand";
import { GuidanceState } from "@/types/guidance";

interface GuidanceStoreState {
  // Current guidance from AI
  guidance: GuidanceState | null;

  // Analysis state
  isAnalyzing: boolean;
  lastAnalyzedAt: number | null;
  analysisError: string | null;

  // Pause control
  isPaused: boolean;

  // Actions
  setGuidance: (guidance: GuidanceState) => void;
  clearGuidance: () => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  togglePause: () => void;
  setPaused: (isPaused: boolean) => void;
  reset: () => void;
}

const initialGuidance: GuidanceState = {
  position: {
    horizontal: "centered",
    horizontalAmount: "slight",
    vertical: "centered",
    verticalAmount: "slight",
    distance: "good",
  },
  rotation: {
    tilt: "level",
    tiltDegrees: 0,
  },
  lighting: {
    assessment: "good match",
    advice: "",
  },
  overallMatch: 0,
  primaryInstruction: "Position your camera to match the reference",
  isReady: false,
};

export const useGuidanceStore = create<GuidanceStoreState>((set) => ({
  // Initial state
  guidance: null,
  isAnalyzing: false,
  lastAnalyzedAt: null,
  analysisError: null,
  isPaused: false,

  // Actions
  setGuidance: (guidance) =>
    set({
      guidance,
      lastAnalyzedAt: Date.now(),
      analysisError: null,
      isAnalyzing: false,
    }),

  clearGuidance: () => set({ guidance: null }),

  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  setAnalysisError: (error) =>
    set({
      analysisError: error,
      isAnalyzing: false,
    }),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  setPaused: (isPaused) => set({ isPaused }),

  reset: () =>
    set({
      guidance: null,
      isAnalyzing: false,
      lastAnalyzedAt: null,
      analysisError: null,
      isPaused: false,
    }),
}));
