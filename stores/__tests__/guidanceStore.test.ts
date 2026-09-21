import { useGuidanceStore } from '../guidanceStore';
import { GuidanceState } from '@/types/guidance';

describe('Guidance Store', () => {
  beforeEach(() => {
    useGuidanceStore.setState({
      guidance: null,
      isAnalyzing: false,
      lastAnalyzedAt: null,
      analysisError: null,
      isPaused: false,
    });
  });

  describe('setGuidance', () => {
    it('should set guidance and clear error state', () => {
      const mockGuidance: GuidanceState = {
        position: {
          horizontal: 'left',
          horizontalAmount: 'moderate',
          vertical: 'up',
          verticalAmount: 'slight',
          distance: 'closer',
        },
        rotation: {
          tilt: 'level',
          tiltDegrees: 0,
        },
        lighting: {
          assessment: 'good match',
          advice: '',
        },
        overallMatch: 75,
        primaryInstruction: 'Move left',
        isReady: false,
      };

      const { setGuidance } = useGuidanceStore.getState();
      setGuidance(mockGuidance);

      const state = useGuidanceStore.getState();
      expect(state.guidance).toEqual(mockGuidance);
      expect(state.analysisError).toBeNull();
      expect(state.isAnalyzing).toBe(false);
    });

    it('should set lastAnalyzedAt timestamp', () => {
      const mockGuidance: GuidanceState = {
        position: {
          horizontal: 'centered',
          horizontalAmount: 'slight',
          vertical: 'centered',
          verticalAmount: 'slight',
          distance: 'good',
        },
        rotation: {
          tilt: 'level',
          tiltDegrees: 0,
        },
        lighting: {
          assessment: 'good match',
          advice: '',
        },
        overallMatch: 90,
        primaryInstruction: 'Perfect!',
        isReady: true,
      };

      const beforeTime = Date.now();
      const { setGuidance } = useGuidanceStore.getState();
      setGuidance(mockGuidance);
      const afterTime = Date.now();

      const state = useGuidanceStore.getState();
      expect(state.lastAnalyzedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(state.lastAnalyzedAt).toBeLessThanOrEqual(afterTime);
    });

    it('should clear isAnalyzing flag', () => {
      useGuidanceStore.setState({ isAnalyzing: true });

      const mockGuidance: GuidanceState = {
        position: {
          horizontal: 'centered',
          horizontalAmount: 'slight',
          vertical: 'centered',
          verticalAmount: 'slight',
          distance: 'good',
        },
        rotation: {
          tilt: 'level',
          tiltDegrees: 0,
        },
        lighting: {
          assessment: 'good match',
          advice: '',
        },
        overallMatch: 85,
        primaryInstruction: 'Ready to capture!',
        isReady: true,
      };

      const { setGuidance } = useGuidanceStore.getState();
      setGuidance(mockGuidance);

      expect(useGuidanceStore.getState().isAnalyzing).toBe(false);
    });
  });

  describe('setAnalysisError', () => {
    it('should set error message and clear isAnalyzing', () => {
      useGuidanceStore.setState({ isAnalyzing: true });

      const { setAnalysisError } = useGuidanceStore.getState();
      setAnalysisError('API connection failed');

      const state = useGuidanceStore.getState();
      expect(state.analysisError).toBe('API connection failed');
      expect(state.isAnalyzing).toBe(false);
    });

    it('should clear error when null is passed', () => {
      useGuidanceStore.setState({ analysisError: 'Previous error' });

      const { setAnalysisError } = useGuidanceStore.getState();
      setAnalysisError(null);

      expect(useGuidanceStore.getState().analysisError).toBeNull();
    });
  });

  describe('togglePause', () => {
    it('should toggle pause state from false to true', () => {
      const { togglePause } = useGuidanceStore.getState();
      
      expect(useGuidanceStore.getState().isPaused).toBe(false);
      
      togglePause();
      
      expect(useGuidanceStore.getState().isPaused).toBe(true);
    });

    it('should toggle pause state from true to false', () => {
      useGuidanceStore.setState({ isPaused: true });
      
      const { togglePause } = useGuidanceStore.getState();
      togglePause();
      
      expect(useGuidanceStore.getState().isPaused).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('should set paused to true', () => {
      const { setPaused } = useGuidanceStore.getState();
      setPaused(true);
      
      expect(useGuidanceStore.getState().isPaused).toBe(true);
    });

    it('should set paused to false', () => {
      useGuidanceStore.setState({ isPaused: true });
      
      const { setPaused } = useGuidanceStore.getState();
      setPaused(false);
      
      expect(useGuidanceStore.getState().isPaused).toBe(false);
    });
  });

  describe('clearGuidance', () => {
    it('should clear guidance state', () => {
      const mockGuidance: GuidanceState = {
        position: {
          horizontal: 'centered',
          horizontalAmount: 'slight',
          vertical: 'centered',
          verticalAmount: 'slight',
          distance: 'good',
        },
        rotation: {
          tilt: 'level',
          tiltDegrees: 0,
        },
        lighting: {
          assessment: 'good match',
          advice: '',
        },
        overallMatch: 90,
        primaryInstruction: 'Perfect!',
        isReady: true,
      };

      useGuidanceStore.setState({ guidance: mockGuidance });
      
      const { clearGuidance } = useGuidanceStore.getState();
      clearGuidance();
      
      expect(useGuidanceStore.getState().guidance).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const mockGuidance: GuidanceState = {
        position: {
          horizontal: 'left',
          horizontalAmount: 'moderate',
          vertical: 'up',
          verticalAmount: 'slight',
          distance: 'closer',
        },
        rotation: {
          tilt: 'tilt-left',
          tiltDegrees: 5,
        },
        lighting: {
          assessment: 'different',
          advice: 'Adjust lighting',
        },
        overallMatch: 60,
        primaryInstruction: 'Move left and adjust lighting',
        isReady: false,
      };

      useGuidanceStore.setState({
        guidance: mockGuidance,
        isAnalyzing: true,
        lastAnalyzedAt: Date.now(),
        analysisError: 'Some error',
        isPaused: true,
      });

      const { reset } = useGuidanceStore.getState();
      reset();

      const state = useGuidanceStore.getState();
      expect(state.guidance).toBeNull();
      expect(state.isAnalyzing).toBe(false);
      expect(state.lastAnalyzedAt).toBeNull();
      expect(state.analysisError).toBeNull();
      expect(state.isPaused).toBe(false);
    });
  });
});
