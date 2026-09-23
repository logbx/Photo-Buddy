import OpenAI from 'openai';
import { analyzeReferenceImage, compareToReference } from '../openai';
import { ImageAnalysis } from '@/types/guidance';

jest.mock('openai');

const mockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

describe('OpenAI Service', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCreate = jest.fn();
    mockOpenAI.prototype.chat = {
      completions: {
        create: mockCreate,
      },
    } as any;
  });

  describe('analyzeReferenceImage', () => {
    const mockImageBase64 = 'base64-encoded-image-data';
    
    const mockAnalysisResponse = {
      composition: {
        subjectPosition: 'center',
        horizon: 'level',
        perspective: 'eye-level',
        distanceEstimate: 'medium',
      },
      lighting: {
        direction: 'front',
        quality: 'soft',
        shadows: 'minimal',
        recommendations: ['Use soft natural light'],
      },
      keyElements: ['Subject', 'Background', 'Foreground'],
      estimatedFocalLength: 'standard ~35-50mm',
    };

    it('should analyze a reference image and return parsed JSON', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAnalysisResponse),
            },
          },
        ],
      });

      const result = await analyzeReferenceImage(mockImageBase64);

      expect(result).toEqual(mockAnalysisResponse);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({ type: 'text' }),
                expect.objectContaining({
                  type: 'image_url',
                  image_url: expect.objectContaining({
                    url: `data:image/jpeg;base64,${mockImageBase64}`,
                    detail: 'high',
                  }),
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it('should strip markdown code fences from response', async () => {
      const responseWithCodeFence = `\`\`\`json
${JSON.stringify(mockAnalysisResponse)}
\`\`\``;

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: responseWithCodeFence,
            },
          },
        ],
      });

      const result = await analyzeReferenceImage(mockImageBase64);

      expect(result).toEqual(mockAnalysisResponse);
    });

    it('should throw error when response content is empty', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      });

      await expect(analyzeReferenceImage(mockImageBase64)).rejects.toThrow(
        'No response from OpenAI'
      );
    });

    it('should throw error when no JSON object is found in response', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is plain text without JSON',
            },
          },
        ],
      });

      await expect(analyzeReferenceImage(mockImageBase64)).rejects.toThrow(
        'Could not parse JSON from response'
      );
    });

    it('should handle API errors', async () => {
      const apiError = new Error('OpenAI API error');
      mockCreate.mockRejectedValue(apiError);

      await expect(analyzeReferenceImage(mockImageBase64)).rejects.toThrow(
        'OpenAI API error'
      );
    });
  });

  describe('compareToReference', () => {
    const mockCurrentBase64 = 'current-base64';
    const mockReferenceBase64 = 'reference-base64';
    const mockReferenceAnalysis: ImageAnalysis = {
      composition: {
        subjectPosition: 'center',
        horizon: 'level',
        perspective: 'eye-level',
        distanceEstimate: 'medium',
      },
      lighting: {
        direction: 'front',
        quality: 'soft',
        shadows: 'minimal',
        recommendations: [],
      },
      keyElements: [],
      estimatedFocalLength: 'standard ~35-50mm',
    };

    const mockGuidanceResponse = {
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
      primaryInstruction: 'Looking good!',
    };

    it('should compare images and return guidance with isReady: true when match >= 85', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockGuidanceResponse),
            },
          },
        ],
      });

      const result = await compareToReference(
        mockCurrentBase64,
        mockReferenceBase64,
        mockReferenceAnalysis
      );

      expect(result).toEqual({
        ...mockGuidanceResponse,
        isReady: true,
      });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({ type: 'text' }),
                expect.objectContaining({
                  type: 'image_url',
                  image_url: expect.objectContaining({
                    url: `data:image/jpeg;base64,${mockReferenceBase64}`,
                    detail: 'low',
                  }),
                }),
                expect.objectContaining({
                  type: 'image_url',
                  image_url: expect.objectContaining({
                    url: `data:image/jpeg;base64,${mockCurrentBase64}`,
                    detail: 'low',
                  }),
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it('should set isReady: false when match < 85', async () => {
      const lowMatchResponse = {
        ...mockGuidanceResponse,
        overallMatch: 75,
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(lowMatchResponse),
            },
          },
        ],
      });

      const result = await compareToReference(
        mockCurrentBase64,
        mockReferenceBase64,
        mockReferenceAnalysis
      );

      expect(result.isReady).toBe(false);
      expect(result.overallMatch).toBe(75);
    });

    it('should throw error when response content is empty', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      });

      await expect(
        compareToReference(
          mockCurrentBase64,
          mockReferenceBase64,
          mockReferenceAnalysis
        )
      ).rejects.toThrow('No response from OpenAI');
    });

    it('should throw error when AbortSignal is aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      mockCreate.mockRejectedValue(new Error('Request cancelled'));

      await expect(
        compareToReference(
          mockCurrentBase64,
          mockReferenceBase64,
          mockReferenceAnalysis,
          controller.signal
        )
      ).rejects.toThrow('Request aborted');
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('Network error');
      mockCreate.mockRejectedValue(apiError);

      await expect(
        compareToReference(
          mockCurrentBase64,
          mockReferenceBase64,
          mockReferenceAnalysis
        )
      ).rejects.toThrow('Network error');
    });
  });
});
