import { colors, motion, radius } from "@curevanta/design-tokens";
import type { ReactNode } from "react";
import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
  left?: ReactNode;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  accessibilityHint,
  left,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const animateTo = (value: number) => {
    Animated.timing(scale, {
      toValue: value,
      duration: motion.instant,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={() => animateTo(0.98)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [
          styles.base,
          variant === "primary" && styles.primary,
          variant === "secondary" && styles.secondary,
          variant === "ghost" && styles.ghost,
          (isDisabled || pressed) && { opacity: isDisabled ? 0.45 : 0.92 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? "#fff" : colors.primary} />
        ) : (
          <>
            {left}
            <Text
              variant="titleMedium"
              color={
                variant === "primary"
                  ? "#FFFFFF"
                  : variant === "ghost"
                    ? colors.primary
                    : colors.textPrimary
              }
            >
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
});
