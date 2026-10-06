import { colors, spacing } from "@curevanta/design-tokens";
import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import { Heading, Text } from "./Text";

type StateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: StateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <Heading level={3}>{title}</Heading>
      <Text variant="bodyMedium" color={colors.textSecondary} align="center">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing[2] }} />
      ) : null}
    </View>
  );
}

export function ErrorState({ title, description, actionLabel = "Try Again", onAction }: StateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Heading level={3}>{title}</Heading>
      <Text variant="bodyMedium" color={colors.textSecondary} align="center">
        {description}
      </Text>
      {onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing[2] }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[4],
  },
});
