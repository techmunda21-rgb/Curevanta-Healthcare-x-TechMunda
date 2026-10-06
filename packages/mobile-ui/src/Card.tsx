import { colors, elevation, radius, spacing } from "@curevanta/design-tokens";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function Card({ children, onPress, style, accessibilityLabel }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.96 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    ...elevation.low,
  },
});
