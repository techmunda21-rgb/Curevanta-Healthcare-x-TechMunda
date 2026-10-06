import { colors, spacing } from "@curevanta/design-tokens";
import {
  Badge,
  Button,
  Card,
  Heading,
  Row,
  Screen,
  Stack,
  StatusChip,
  Text,
} from "@curevanta/mobile-ui";
import { Pressable, StyleSheet, View } from "react-native";

const SERVICES = [
  { id: "doctor", title: "Doctor at Home", subtitle: "Verified physicians" },
  { id: "nurse", title: "Nurse at Home", subtitle: "Skilled nursing care" },
  { id: "diagnostics", title: "Diagnostics", subtitle: "Lab collection" },
  { id: "physio", title: "Physiotherapy", subtitle: "Recovery support" },
  { id: "followup", title: "Follow-up", subtitle: "Continuity of care" },
] as const;

type PatientHomeScreenProps = {
  patientName?: string;
  addressLabel?: string;
  onFindCare?: () => void;
  onChangeLocation?: () => void;
  onOpenNotifications?: () => void;
  onTrackBooking?: () => void;
  onSelectService?: (id: string) => void;
};

export function PatientHomeScreen({
  patientName = "there",
  addressLabel = "Set your care address",
  onFindCare,
  onChangeLocation,
  onOpenNotifications,
  onTrackBooking,
  onSelectService,
}: PatientHomeScreenProps) {
  return (
    <Screen>
      <Stack gap={6}>
        <Row style={styles.header}>
          <Stack gap={1} style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textMuted}>
              Good day
            </Text>
            <Heading level={2}>Hello, {patientName}</Heading>
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={onOpenNotifications}
            style={styles.iconBtn}
          >
            <Text variant="titleMedium" color={colors.primary}>
              ●
            </Text>
          </Pressable>
          <View style={styles.avatar} accessibilityLabel="Profile">
            <Text variant="titleMedium" color={colors.primaryPressed}>
              {patientName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        </Row>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change location"
          onPress={onChangeLocation}
          style={styles.location}
        >
          <Stack gap={1} style={{ flex: 1 }}>
            <Text variant="labelMedium" color={colors.textMuted}>
              CARE ADDRESS
            </Text>
            <Text variant="titleMedium" numberOfLines={1}>
              {addressLabel}
            </Text>
          </Stack>
          <Text variant="labelLarge" color={colors.primary}>
            Change
          </Text>
        </Pressable>

        <View style={styles.hero}>
          <Heading level={1} color="#FFFFFF">
            Care, when and where you need it.
          </Heading>
          <Text variant="bodyMedium" color="rgba(255,255,255,0.88)" style={{ marginTop: spacing[2] }}>
            Book verified home care with clear status every step of the way.
          </Text>
          <Button
            label="Find Care"
            variant="secondary"
            onPress={onFindCare}
            style={styles.heroCta}
            accessibilityHint="Starts finding care near you"
          />
        </View>

        <Stack gap={3}>
          <Heading level={3}>Services</Heading>
          <View style={styles.serviceGrid}>
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                onPress={() => onSelectService?.(service.id)}
                accessibilityLabel={service.title}
                style={styles.serviceCard}
              >
                <Text variant="titleMedium">{service.title}</Text>
                <Text variant="bodySmall" color={colors.textSecondary}>
                  {service.subtitle}
                </Text>
              </Card>
            ))}
          </View>
        </Stack>

        <Stack gap={3}>
          <Heading level={3}>Active booking</Heading>
          <Card
            onPress={onTrackBooking}
            accessibilityLabel="Track active booking"
            style={styles.activeCard}
          >
            <Row style={{ justifyContent: "space-between" }}>
              <Text variant="titleLarge">Dr. Meera Shah</Text>
              <StatusChip label="On the way" tone="info" />
            </Row>
            <Text variant="bodyMedium" color={colors.textSecondary}>
              General physician · ETA 12 min
            </Text>
            <Row style={{ marginTop: spacing[2], justifyContent: "space-between" }}>
              <Badge label="Verified" tone="success" />
              <Text variant="labelLarge" color={colors.primary}>
                Track
              </Text>
            </Row>
          </Card>
        </Stack>

        <Stack gap={3}>
          <Heading level={3}>Recommended care</Heading>
          <Card>
            <Text variant="titleMedium">Nurse follow-up visit</Text>
            <Text variant="bodySmall" color={colors.textSecondary}>
              Continue recovery with a scheduled home nurse visit.
            </Text>
          </Card>
        </Stack>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: spacing[4],
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    borderRadius: 24,
    padding: spacing[6],
    backgroundColor: colors.primary,
    overflow: "hidden",
  },
  heroCta: {
    marginTop: spacing[5],
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: "47%",
    flexGrow: 1,
    minWidth: 140,
  },
  activeCard: {
    gap: 8,
  },
});
