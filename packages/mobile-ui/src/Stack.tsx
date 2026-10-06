import { spacing } from "@curevanta/design-tokens";
import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

type Gap = keyof typeof spacing;

type StackProps = {
  children: ReactNode;
  gap?: Gap;
  style?: ViewStyle;
};

export function Stack({ children, gap = 4, style }: StackProps) {
  return (
    <View style={[{ flexDirection: "column", gap: spacing[gap] }, style]}>
      {children}
    </View>
  );
}

export function Row({ children, gap = 3, style }: StackProps) {
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", gap: spacing[gap] },
        style,
      ]}
    >
      {children}
    </View>
  );
}
