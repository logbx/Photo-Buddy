import { ImageAnalysis, GuidanceSnapshot } from "./guidance";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  referenceImage: {
    uri: string;
    analysis: ImageAnalysis | null;
  };
  attempts: Attempt[];
}

export interface Attempt {
  id: string;
  imageUri: string;
  capturedAt: string;
  guidance: GuidanceSnapshot | null;
  matchScore: number;
}

export interface ProjectCreateInput {
  name: string;
  referenceImageUri: string;
}
