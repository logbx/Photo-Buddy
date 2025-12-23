import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
  // Analysis settings
  analysisInterval: number; // milliseconds between analyses
  autoAnalysis: boolean; // auto-analyze or manual trigger

  // UI settings
  showLightingAdvice: boolean;
  showMatchScore: boolean;
  hapticFeedback: boolean;

  // Actions
  setAnalysisInterval: (interval: number) => void;
  setAutoAnalysis: (auto: boolean) => void;
  setShowLightingAdvice: (show: boolean) => void;
  setShowMatchScore: (show: boolean) => void;
  setHapticFeedback: (enabled: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  analysisInterval: 1000, // 1 second
  autoAnalysis: true,
  showLightingAdvice: true,
  showMatchScore: true,
  hapticFeedback: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setAnalysisInterval: (interval) => set({ analysisInterval: interval }),
      setAutoAnalysis: (auto) => set({ autoAnalysis: auto }),
      setShowLightingAdvice: (show) => set({ showLightingAdvice: show }),
      setShowMatchScore: (show) => set({ showMatchScore: show }),
      setHapticFeedback: (enabled) => set({ hapticFeedback: enabled }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "photo-buddy-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
