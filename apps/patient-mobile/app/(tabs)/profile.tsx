import { colors } from "@curevanta/design-tokens";
import { Heading, Screen, Stack, Text } from "@curevanta/mobile-ui";

export default function ProfileTab() {
  return (
    <Screen>
      <Stack gap={3} style={{ marginTop: 12 }}>
        <Heading level={2}>Profile</Heading>
        <Text variant="bodyMedium" color={colors.textSecondary}>
          Session persistence uses SecureStore. OTP login wires to the mobile API
          next.
        </Text>
      </Stack>
    </Screen>
  );
}
