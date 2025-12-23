import { ImageAnalysis, GuidanceState } from "./guidance";

export interface AnalysisResponse {
  success: boolean;
  data?: ImageAnalysis;
  error?: string;
}

export interface ComparisonResponse {
  success: boolean;
  data?: GuidanceState;
  error?: string;
}

export interface OpenAIError {
  message: string;
  type: string;
  code: string;
}
