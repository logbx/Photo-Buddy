import { useState, useCallback } from "react";
import { analyzeReferenceImage } from "@/services/openai";
import { readImageAsBase64 } from "@/services/storage";
import { ImageAnalysis } from "@/types/guidance";

interface UseImageAnalysisReturn {
  analyze: (imageUri: string) => Promise<ImageAnalysis | null>;
  isAnalyzing: boolean;
  error: string | null;
  analysis: ImageAnalysis | null;
}

export function useImageAnalysis(): UseImageAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);

  const analyze = useCallback(async (imageUri: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64 = await readImageAsBase64(imageUri);
      const result = await analyzeReferenceImage(base64);
      setAnalysis(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to analyze image";
      setError(errorMessage);
      console.error("Image analysis error:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyze,
    isAnalyzing,
    error,
    analysis,
  };
}
