import { View, Text } from "react-native";
import { Sun } from "lucide-react-native";

interface LightingAdviceProps {
  advice: string;
}

export function LightingAdvice({ advice }: LightingAdviceProps) {
  if (!advice) return null;

  return (
    <View className="bg-amber-500/80 rounded-xl px-4 py-3 flex-row items-start">
      <Sun size={20} color="white" />
      <View className="flex-1 ml-3">
        <Text className="text-white font-medium text-sm">Lighting tip</Text>
        <Text className="text-white/90 text-sm mt-0.5">{advice}</Text>
      </View>
    </View>
  );
}
