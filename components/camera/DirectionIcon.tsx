import { View, Text } from "react-native";
import { ReactNode } from "react";
import { Severity } from "@/types/guidance";

interface DirectionIconProps {
  icon: ReactNode;
  severity: Severity;
  label: string;
}

export function DirectionIcon({ icon, severity, label }: DirectionIconProps) {
  const severityColors = {
    slight: "bg-yellow-500/80",
    moderate: "bg-orange-500/80",
    significant: "bg-red-500/80",
  };

  const pulseAnimation = severity === "significant" ? "animate-pulse" : "";

  return (
    <View className={`items-center ${pulseAnimation}`}>
      <View
        className={`w-14 h-14 rounded-full items-center justify-center ${severityColors[severity]}`}
      >
        {icon}
      </View>
      <Text className="text-white text-xs mt-1 font-medium bg-black/40 px-2 py-0.5 rounded">
        {label}
      </Text>
    </View>
  );
}
