import { View, Text } from "react-native";
import { useGuidanceStore } from "@/stores/guidanceStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { DirectionIcon } from "./DirectionIcon";
import { LightingAdvice } from "./LightingAdvice";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
} from "lucide-react-native";

export function GuidanceOverlay() {
  const { guidance, isAnalyzing } = useGuidanceStore();
  const { showLightingAdvice, showMatchScore } = useSettingsStore();

  if (!guidance) {
    return (
      <View className="absolute inset-0 items-center justify-center">
        <View className="bg-black/60 px-6 py-4 rounded-2xl">
          <Text className="text-white text-center text-lg">
            Analyzing reference image...
          </Text>
        </View>
      </View>
    );
  }

  const { position, rotation, lighting, overallMatch, primaryInstruction, isReady } =
    guidance;

  // Determine severity colors
  const getColor = (match: number) => {
    if (match >= 85) return "#22c55e"; // green
    if (match >= 60) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const matchColor = getColor(overallMatch);

  return (
    <View className="absolute inset-0 pointer-events-none">
      {/* Status bar at top */}
      <View className="absolute top-12 left-4 right-4">
        <View className="bg-black/60 rounded-xl px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isAnalyzing && (
              <View className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
            )}
            <Text className="text-white/80 text-sm">
              {isAnalyzing ? "Analyzing..." : "Ready"}
            </Text>
          </View>

          {showMatchScore && (
            <View className="flex-row items-center">
              <Text className="text-white/80 text-sm mr-2">Match:</Text>
              <View
                className="h-2 w-20 bg-white/20 rounded-full overflow-hidden"
              >
                <View
                  style={{ width: `${overallMatch}%`, backgroundColor: matchColor }}
                  className="h-full rounded-full"
                />
              </View>
              <Text className="text-white font-bold ml-2">{overallMatch}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Direction indicators */}
      {position.horizontal !== "centered" && (
        <View className="absolute left-4 top-1/2 -translate-y-1/2">
          {position.horizontal === "left" && (
            <DirectionIcon
              icon={<ArrowLeft size={32} color="white" />}
              severity={position.horizontalAmount}
              label="Move left"
            />
          )}
        </View>
      )}

      {position.horizontal !== "centered" && (
        <View className="absolute right-4 top-1/2 -translate-y-1/2">
          {position.horizontal === "right" && (
            <DirectionIcon
              icon={<ArrowRight size={32} color="white" />}
              severity={position.horizontalAmount}
              label="Move right"
            />
          )}
        </View>
      )}

      {position.vertical !== "centered" && (
        <View className="absolute top-28 left-1/2 -translate-x-1/2">
          {position.vertical === "up" && (
            <DirectionIcon
              icon={<ArrowUp size={32} color="white" />}
              severity={position.verticalAmount}
              label="Move up"
            />
          )}
        </View>
      )}

      {position.vertical !== "centered" && (
        <View className="absolute bottom-52 left-1/2 -translate-x-1/2">
          {position.vertical === "down" && (
            <DirectionIcon
              icon={<ArrowDown size={32} color="white" />}
              severity={position.verticalAmount}
              label="Move down"
            />
          )}
        </View>
      )}

      {/* Distance indicator */}
      {position.distance !== "good" && (
        <View className="absolute bottom-60 right-4">
          <DirectionIcon
            icon={
              position.distance === "closer" ? (
                <ZoomIn size={28} color="white" />
              ) : (
                <ZoomOut size={28} color="white" />
              )
            }
            severity="moderate"
            label={position.distance === "closer" ? "Get closer" : "Step back"}
          />
        </View>
      )}

      {/* Rotation indicator */}
      {rotation.tilt !== "level" && (
        <View className="absolute bottom-60 left-4">
          <DirectionIcon
            icon={
              rotation.tilt === "tilt-left" ? (
                <RotateCcw size={28} color="white" />
              ) : (
                <RotateCw size={28} color="white" />
              )
            }
            severity={rotation.tiltDegrees > 5 ? "significant" : "slight"}
            label={`Tilt ${rotation.tilt === "tilt-left" ? "left" : "right"}`}
          />
        </View>
      )}

      {/* Primary instruction */}
      <View className="absolute bottom-44 left-4 right-4">
        <View
          className={`px-4 py-3 rounded-xl ${
            isReady ? "bg-green-500/80" : "bg-black/60"
          }`}
        >
          <Text className="text-white text-center font-medium text-base">
            {isReady ? "Looking good! Ready to capture." : primaryInstruction}
          </Text>
        </View>
      </View>

      {/* Lighting advice */}
      {showLightingAdvice && lighting.assessment === "different" && (
        <View className="absolute bottom-24 left-4 right-4">
          <LightingAdvice advice={lighting.advice} />
        </View>
      )}
    </View>
  );
}
