import { validateEnv, ENV } from '../env';

describe('Environment Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnv', () => {
    it('should return true when valid API key is set', () => {
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = 'sk-proj-test123456789';
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        expect(validateEnv()).toBe(true);
      });
    });

    it('should return false when API key is empty string', () => {
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = '';
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        expect(validateEnv()).toBe(false);
      });
    });

    it('should return false when API key is placeholder value', () => {
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = 'your-openai-api-key-here';
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        expect(validateEnv()).toBe(false);
      });
    });

    it('should return false when API key is undefined', () => {
      delete process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        expect(validateEnv()).toBe(false);
      });
    });

    it('should log warning when validation fails', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = '';
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        validateEnv();
        
        expect(consoleSpy).toHaveBeenCalledWith(
          'OpenAI API key not configured. Add your key to .env file.'
        );
      });
      
      consoleSpy.mockRestore();
    });

    it('should not log warning when validation succeeds', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = 'sk-valid-key';
      
      jest.isolateModules(() => {
        const { validateEnv } = require('../env');
        validateEnv();
        
        expect(consoleSpy).not.toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('ENV object', () => {
    it('should expose OPENAI_API_KEY from environment', () => {
      process.env.EXPO_PUBLIC_OPENAI_API_KEY = 'test-key-123';
      
      jest.isolateModules(() => {
        const { ENV } = require('../env');
        expect(ENV.OPENAI_API_KEY).toBe('test-key-123');
      });
    });

    it('should default to empty string when key is not set', () => {
      delete process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      jest.isolateModules(() => {
        const { ENV } = require('../env');
        expect(ENV.OPENAI_API_KEY).toBe('');
      });
    });
  });
});
