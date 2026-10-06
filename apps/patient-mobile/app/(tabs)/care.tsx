import { colors, spacing } from "@curevanta/design-tokens";
import {
  Button,
  Card,
  ErrorState,
  Heading,
  Screen,
  Stack,
  StatusChip,
  Text,
} from "@curevanta/mobile-ui";
import { useCreateBooking } from "@/src/features/booking/useCreateBooking";
import { useState } from "react";

const SERVICE_MAP = {
  doctor: "DOCTOR_AT_HOME",
  nurse: "NURSE_AT_HOME",
  diagnostics: "DIAGNOSTICS",
  physio: "PHYSIOTHERAPY",
  followup: "FOLLOW_UP",
} as const;

export default function CareTab() {
  const createBooking = useCreateBooking();
  const [lastStatus, setLastStatus] = useState<string | null>(null);

  const requestDoctor = () => {
    createBooking.mutate(
      {
        serviceKind: SERVICE_MAP.doctor,
        addressLine: "12 Palm Grove, Indiranagar, Bengaluru",
        latitude: 12.9784,
        longitude: 77.6408,
        notes: "Patient mobile vertical slice request",
      },
      {
        onSuccess: (booking) => setLastStatus(booking.status),
      },
    );
  };

  return (
    <Screen>
      <Stack gap={4} style={{ marginTop: 12 }}>
        <Heading level={2}>Find care</Heading>
        <Text variant="bodyMedium" color={colors.textSecondary}>
          Creates a real booking against the Control Tower mobile API. Progress
          reflects backend status — not a fake spinner.
        </Text>

        <Card>
          <Stack gap={3}>
            <Text variant="titleLarge">Doctor at Home</Text>
            <Text variant="bodySmall" color={colors.textSecondary}>
              Verified physician · home visit
            </Text>
            <Button
              label={createBooking.isPending ? "Requesting…" : "Request doctor"}
              loading={createBooking.isPending}
              onPress={requestDoctor}
            />
          </Stack>
        </Card>

        {createBooking.isError ? (
          <ErrorState
            title="We couldn't connect."
            description="Your booking has not been duplicated. Check API URL and try again."
            onAction={requestDoctor}
          />
        ) : null}

        {lastStatus ? (
          <Card style={{ gap: spacing[2] }}>
            <Text variant="titleMedium">Latest request</Text>
            <StatusChip label={lastStatus.replaceAll("_", " ")} tone="info" />
            <Text variant="bodySmall" color={colors.textSecondary}>
              When a doctor accepts, status moves to PROVIDER_ACCEPTED / ON_THE_WAY.
            </Text>
          </Card>
        ) : null}
      </Stack>
    </Screen>
  );
}
