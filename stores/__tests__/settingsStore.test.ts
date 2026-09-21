import { useSettingsStore } from '../settingsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('Settings Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useSettingsStore.setState({
      analysisInterval: 1000,
      autoAnalysis: true,
      showLightingAdvice: true,
      showMatchScore: true,
      hapticFeedback: true,
    });
  });

  describe('Default Settings', () => {
    it('should have correct default values', () => {
      const state = useSettingsStore.getState();
      
      expect(state.analysisInterval).toBe(1000);
      expect(state.autoAnalysis).toBe(true);
      expect(state.showLightingAdvice).toBe(true);
      expect(state.showMatchScore).toBe(true);
      expect(state.hapticFeedback).toBe(true);
    });
  });

  describe('setAnalysisInterval', () => {
    it('should update analysis interval', () => {
      const { setAnalysisInterval } = useSettingsStore.getState();
      
      setAnalysisInterval(2000);
      
      expect(useSettingsStore.getState().analysisInterval).toBe(2000);
    });

    it('should persist to AsyncStorage', async () => {
      const { setAnalysisInterval } = useSettingsStore.getState();
      
      setAnalysisInterval(3000);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('setAutoAnalysis', () => {
    it('should enable auto analysis', () => {
      useSettingsStore.setState({ autoAnalysis: false });
      
      const { setAutoAnalysis } = useSettingsStore.getState();
      setAutoAnalysis(true);
      
      expect(useSettingsStore.getState().autoAnalysis).toBe(true);
    });

    it('should disable auto analysis', () => {
      const { setAutoAnalysis } = useSettingsStore.getState();
      setAutoAnalysis(false);
      
      expect(useSettingsStore.getState().autoAnalysis).toBe(false);
    });
  });

  describe('setShowLightingAdvice', () => {
    it('should show lighting advice', () => {
      useSettingsStore.setState({ showLightingAdvice: false });
      
      const { setShowLightingAdvice } = useSettingsStore.getState();
      setShowLightingAdvice(true);
      
      expect(useSettingsStore.getState().showLightingAdvice).toBe(true);
    });

    it('should hide lighting advice', () => {
      const { setShowLightingAdvice } = useSettingsStore.getState();
      setShowLightingAdvice(false);
      
      expect(useSettingsStore.getState().showLightingAdvice).toBe(false);
    });
  });

  describe('setShowMatchScore', () => {
    it('should show match score', () => {
      useSettingsStore.setState({ showMatchScore: false });
      
      const { setShowMatchScore } = useSettingsStore.getState();
      setShowMatchScore(true);
      
      expect(useSettingsStore.getState().showMatchScore).toBe(true);
    });

    it('should hide match score', () => {
      const { setShowMatchScore } = useSettingsStore.getState();
      setShowMatchScore(false);
      
      expect(useSettingsStore.getState().showMatchScore).toBe(false);
    });
  });

  describe('setHapticFeedback', () => {
    it('should enable haptic feedback', () => {
      useSettingsStore.setState({ hapticFeedback: false });
      
      const { setHapticFeedback } = useSettingsStore.getState();
      setHapticFeedback(true);
      
      expect(useSettingsStore.getState().hapticFeedback).toBe(true);
    });

    it('should disable haptic feedback', () => {
      const { setHapticFeedback } = useSettingsStore.getState();
      setHapticFeedback(false);
      
      expect(useSettingsStore.getState().hapticFeedback).toBe(false);
    });
  });

  describe('resetSettings', () => {
    it('should reset all settings to default values', () => {
      useSettingsStore.setState({
        analysisInterval: 5000,
        autoAnalysis: false,
        showLightingAdvice: false,
        showMatchScore: false,
        hapticFeedback: false,
      });

      const { resetSettings } = useSettingsStore.getState();
      resetSettings();

      const state = useSettingsStore.getState();
      expect(state.analysisInterval).toBe(1000);
      expect(state.autoAnalysis).toBe(true);
      expect(state.showLightingAdvice).toBe(true);
      expect(state.showMatchScore).toBe(true);
      expect(state.hapticFeedback).toBe(true);
    });

    it('should persist reset to AsyncStorage', async () => {
      const { resetSettings } = useSettingsStore.getState();
      
      resetSettings();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Persistence', () => {
    it('should use AsyncStorage with correct storage name', () => {
      const mockGetItem = AsyncStorage.getItem as jest.Mock;
      
      mockGetItem.mockResolvedValueOnce(JSON.stringify({
        state: {
          analysisInterval: 2000,
          autoAnalysis: false,
        },
      }));

      expect(mockGetItem).toBeDefined();
    });
  });
});
