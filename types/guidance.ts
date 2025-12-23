export interface ImageAnalysis {
  composition: {
    subjectPosition: string;
    horizon: string;
    perspective: string;
    distanceEstimate: string;
  };
  lighting: {
    direction: string;
    quality: string;
    shadows: string;
    recommendations: string[];
  };
  keyElements: string[];
  estimatedFocalLength: string;
}

export interface GuidanceState {
  position: {
    horizontal: "left" | "right" | "centered";
    horizontalAmount: "slight" | "moderate" | "significant";
    vertical: "up" | "down" | "centered";
    verticalAmount: "slight" | "moderate" | "significant";
    distance: "closer" | "further" | "good";
  };
  rotation: {
    tilt: "tilt-left" | "tilt-right" | "level";
    tiltDegrees: number;
  };
  lighting: {
    assessment: "good match" | "different";
    advice: string;
  };
  overallMatch: number;
  primaryInstruction: string;
  isReady: boolean;
}

export interface GuidanceSnapshot extends GuidanceState {
  timestamp: string;
}

export type Direction = "left" | "right" | "up" | "down" | "closer" | "further";
export type Severity = "slight" | "moderate" | "significant";
