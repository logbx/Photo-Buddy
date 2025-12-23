import OpenAI from "openai";
import { ENV } from "@/config/env";
import { ImageAnalysis, GuidanceState } from "@/types/guidance";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `Analyze this photograph for recreation purposes. Provide detailed analysis in the following JSON format:

{
  "composition": {
    "subjectPosition": "center" | "rule-of-thirds-left" | "rule-of-thirds-right" | "off-center-left" | "off-center-right",
    "horizon": "level" | "tilted-left-Xdeg" | "tilted-right-Xdeg",
    "perspective": "eye-level" | "low-angle" | "high-angle" | "bird's-eye" | "worm's-eye",
    "distanceEstimate": "close-up" | "medium" | "far" | "very-far"
  },
  "lighting": {
    "direction": "front" | "side-left" | "side-right" | "backlit" | "top" | "ambient",
    "quality": "soft" | "harsh" | "golden-hour" | "overcast" | "artificial",
    "shadows": "strong-left" | "strong-right" | "minimal" | "diffused",
    "recommendations": ["array of 1-3 tips for matching this lighting"]
  },
  "keyElements": ["array of 3-5 main visual elements someone should align when recreating this shot"],
  "estimatedFocalLength": "wide ~24mm" | "standard ~35-50mm" | "portrait ~85mm" | "telephoto ~100mm+"
}

Respond with ONLY the JSON, no additional text.`;

const COMPARISON_PROMPT = `Compare the CURRENT camera view (second image) to the REFERENCE image (first image).

The reference image has been analyzed as:
{REFERENCE_ANALYSIS}

Provide real-time guidance to help the photographer match the reference shot.

Respond with ONLY this JSON format:
{
  "position": {
    "horizontal": "left" | "right" | "centered",
    "horizontalAmount": "slight" | "moderate" | "significant",
    "vertical": "up" | "down" | "centered",
    "verticalAmount": "slight" | "moderate" | "significant",
    "distance": "closer" | "further" | "good"
  },
  "rotation": {
    "tilt": "tilt-left" | "tilt-right" | "level",
    "tiltDegrees": 0-15
  },
  "lighting": {
    "assessment": "good match" | "different",
    "advice": "brief tip if lighting differs"
  },
  "overallMatch": 0-100,
  "primaryInstruction": "Single most important adjustment in plain English"
}`;

export async function analyzeReferenceImage(
  imageBase64: string
): Promise<ImageAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: ANALYSIS_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse JSON from response (handle potential markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]) as ImageAnalysis;
  } catch (error) {
    console.error("Error analyzing reference image:", error);
    throw error;
  }
}

export async function compareToReference(
  currentBase64: string,
  referenceBase64: string,
  referenceAnalysis: ImageAnalysis,
  signal?: AbortSignal
): Promise<GuidanceState> {
  try {
    const prompt = COMPARISON_PROMPT.replace(
      "{REFERENCE_ANALYSIS}",
      JSON.stringify(referenceAnalysis, null, 2)
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use mini for faster, cheaper comparisons
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${referenceBase64}`,
                detail: "low",
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${currentBase64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      ...parsed,
      isReady: parsed.overallMatch >= 85,
    } as GuidanceState;
  } catch (error) {
    if (signal?.aborted) {
      throw new Error("Request aborted");
    }
    console.error("Error comparing images:", error);
    throw error;
  }
}
