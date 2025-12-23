import { View, Pressable } from "react-native";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export function Card({
  children,
  onPress,
  variant = "default",
  padding = "md",
  className = "",
}: CardProps) {
  const baseStyles = "rounded-2xl overflow-hidden";

  const variantStyles = {
    default: "bg-white",
    outlined: "bg-white border border-gray-200",
    elevated: "bg-white shadow-md",
  };

  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${combinedStyles} active:opacity-90`}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={combinedStyles}>{children}</View>;
}
