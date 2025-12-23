import { useRef, useEffect, useCallback } from "react";
import { CameraView } from "expo-camera";
import { useGuidanceStore } from "@/stores/guidanceStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { compareToReference } from "@/services/openai";
import { readImageAsBase64 } from "@/services/storage";
import { ImageAnalysis } from "@/types/guidance";

export function useRealtimeAnalysis(
  cameraRef: React.RefObject<CameraView | null>,
  referenceUri: string | null,
  referenceAnalysis: ImageAnalysis | null,
  isActive: boolean
) {
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const referenceBase64Ref = useRef<string | null>(null);

  const { setGuidance, setIsAnalyzing, setAnalysisError, isPaused } =
    useGuidanceStore();
  const { analysisInterval } = useSettingsStore();

  // Load reference image as base64 once
  useEffect(() => {
    if (referenceUri) {
      readImageAsBase64(referenceUri)
        .then((base64) => {
          referenceBase64Ref.current = base64;
        })
        .catch((error) => {
          console.error("Failed to load reference image:", error);
          setAnalysisError("Failed to load reference image");
        });
    }
  }, [referenceUri, setAnalysisError]);

  const captureAndAnalyze = useCallback(async () => {
    // Skip if not ready
    if (
      !cameraRef.current ||
      !referenceAnalysis ||
      !referenceBase64Ref.current ||
      isPaused
    ) {
      return;
    }

    // Skip if already processing (prevents overlapping requests)
    if (isProcessingRef.current) {
      console.log("Skipping - previous request still processing");
      return;
    }

    try {
      isProcessingRef.current = true;
      setIsAnalyzing(true);

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Capture snapshot (low quality for speed)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3, // Low quality = smaller file = faster upload
        base64: true,
        skipProcessing: true, // Faster capture
        imageType: "jpg",
      });

      if (!photo?.base64) {
        throw new Error("Failed to capture photo");
      }

      // Send to OpenAI for comparison
      const guidance = await compareToReference(
        photo.base64,
        referenceBase64Ref.current,
        referenceAnalysis,
        abortControllerRef.current.signal
      );

      // Update guidance state
      setGuidance(guidance);
    } catch (error: any) {
      if (error.message !== "Request aborted") {
        console.error("Analysis error:", error);
        setAnalysisError(error.message || "Analysis failed");
      }
    } finally {
      isProcessingRef.current = false;
      setIsAnalyzing(false);
    }
  }, [
    cameraRef,
    referenceAnalysis,
    isPaused,
    setGuidance,
    setIsAnalyzing,
    setAnalysisError,
  ]);

  // Run analysis at interval
  useEffect(() => {
    if (!isActive || !referenceAnalysis || isPaused) {
      return;
    }

    // Initial delay before first analysis
    const initialTimeout = setTimeout(captureAndAnalyze, 1000);

    // Then run at interval
    const intervalId = setInterval(captureAndAnalyze, analysisInterval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      abortControllerRef.current?.abort();
    };
  }, [isActive, referenceAnalysis, isPaused, analysisInterval, captureAndAnalyze]);

  return {
    triggerAnalysis: captureAndAnalyze,
  };
}
