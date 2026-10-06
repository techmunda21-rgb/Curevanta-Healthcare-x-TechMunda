import { colors } from "@curevanta/design-tokens";
import { Heading, Screen, Stack, Text } from "@curevanta/mobile-ui";

export default function SupportTab() {
  return (
    <Screen>
      <Stack gap={3} style={{ marginTop: 12 }}>
        <Heading level={2}>Support</Heading>
        <Text variant="bodyMedium" color={colors.textSecondary}>
          Help and escalation will connect to Control Tower support workflows.
        </Text>
      </Stack>
    </Screen>
  );
}
