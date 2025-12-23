import { Pressable, View } from "react-native";
import { ReactNode } from "react";

interface IconButtonProps {
  onPress: () => void;
  icon: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function IconButton({
  onPress,
  icon,
  variant = "secondary",
  size = "md",
  disabled = false,
}: IconButtonProps) {
  const variantStyles = {
    primary: "bg-primary-600 active:bg-primary-700",
    secondary: "bg-gray-100 active:bg-gray-200",
    ghost: "bg-transparent active:bg-gray-100",
    danger: "bg-red-500 active:bg-red-600",
  };

  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const disabledStyles = disabled ? "opacity-50" : "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-full items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      {icon}
    </Pressable>
  );
}
