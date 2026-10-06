import { colors } from "@curevanta/design-tokens";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  edges?: ("top" | "right" | "bottom" | "left")[];
};

export function Screen({
  children,
  scroll = true,
  style,
  edges = ["top", "left", "right"],
}: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});
