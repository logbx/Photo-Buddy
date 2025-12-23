import { View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  size = "large",
  color = "#2563eb",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerStyles = fullScreen
    ? "flex-1 items-center justify-center bg-white"
    : "items-center justify-center py-8";

  return (
    <View className={containerStyles}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-gray-500 mt-3 text-center">{message}</Text>
      )}
    </View>
  );
}
