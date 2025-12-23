import { Pressable, View } from "react-native";
import { useGuidanceStore } from "@/stores/guidanceStore";

interface CaptureButtonProps {
  onCapture: () => void;
  disabled?: boolean;
}

export function CaptureButton({ onCapture, disabled = false }: CaptureButtonProps) {
  const { guidance } = useGuidanceStore();
  const isReady = guidance?.isReady ?? false;

  return (
    <Pressable
      onPress={onCapture}
      disabled={disabled}
      className={`items-center justify-center ${disabled ? "opacity-50" : ""}`}
    >
      {/* Outer ring */}
      <View
        className={`w-20 h-20 rounded-full border-4 items-center justify-center ${
          isReady ? "border-green-400" : "border-white"
        }`}
      >
        {/* Inner button */}
        <View
          className={`w-16 h-16 rounded-full ${
            isReady ? "bg-green-400" : "bg-white"
          } active:scale-95`}
        />
      </View>
    </Pressable>
  );
}
