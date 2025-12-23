import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-xl";

  const variantStyles = {
    primary: "bg-primary-600 active:bg-primary-700",
    secondary: "bg-gray-100 active:bg-gray-200",
    outline: "border-2 border-primary-600 bg-transparent active:bg-primary-50",
    ghost: "bg-transparent active:bg-gray-100",
    danger: "bg-red-500 active:bg-red-600",
  };

  const textStyles = {
    primary: "text-white font-semibold",
    secondary: "text-gray-800 font-semibold",
    outline: "text-primary-600 font-semibold",
    ghost: "text-gray-700 font-medium",
    danger: "text-white font-semibold",
  };

  const sizeStyles = {
    sm: "px-3 py-2",
    md: "px-5 py-3",
    lg: "px-6 py-4",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const disabledStyles = disabled || loading ? "opacity-50" : "";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "white" : "#374151"}
          size="small"
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textStyles[variant]} ${textSizeStyles[size]}`}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}
