import { colors, radius } from "@curevanta/design-tokens";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "error" | "info" | "primary";
};

const tones = {
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
  success: { bg: "#E7F6EF", fg: colors.success },
  warning: { bg: "#FBF3E0", fg: colors.warning },
  error: { bg: "#FCEAEA", fg: colors.error },
  info: { bg: "#E7F3F9", fg: colors.info },
  primary: { bg: colors.primarySoft, fg: colors.primaryPressed },
} as const;

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text variant="labelMedium" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

export function StatusChip({ label, tone = "primary" }: BadgeProps) {
  return <Badge label={label} tone={tone} />;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
