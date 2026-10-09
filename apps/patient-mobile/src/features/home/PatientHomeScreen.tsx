import { colors, spacing } from "@curevanta/design-tokens";
import {
  Button,
  Heading,
  Row,
  Screen,
  Stack,
  Text,
} from "@curevanta/mobile-ui";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

/** Showcase-aligned service grid (Curevanta Healthcare App Showcase) */
const SERVICES = [
  { id: "doctor", title: "Doctor at Home" },
  { id: "nurse", title: "Nurse at Home" },
  { id: "diagnostics", title: "Diagnostics at Home" },
  { id: "physio", title: "Physiotherapy" },
  { id: "elder", title: "Elder Care" },
  { id: "followup", title: "Follow-up Care" },
] as const;

type PatientHomeScreenProps = {
  patientName?: string;
  addressLabel?: string;
  onFindCare?: () => void;
  onChangeLocation?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onSelectService?: (id: string) => void;
};

export function PatientHomeScreen({
  patientName = "Priya",
  addressLabel = "Indiranagar, Bengaluru",
  onFindCare,
  onChangeLocation,
  onOpenNotifications,
  onOpenProfile,
  onSelectService,
}: PatientHomeScreenProps) {
  return (
    <Screen>
      <Stack gap={5}>
        <Row style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change location"
            onPress={onChangeLocation}
            style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Text variant="titleMedium" color={colors.primary}>
              ⌖
            </Text>
            <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
              {addressLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={onOpenNotifications}
            style={styles.iconBtn}
          >
            <Text variant="titleMedium">🔔</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onOpenProfile}
            style={styles.avatar}
          >
            <Text variant="titleMedium" color={colors.primaryPressed}>
              {patientName.slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
        </Row>

        <Stack gap={1}>
          <Heading level={2}>Good Morning, {patientName} 👋</Heading>
          <Text variant="bodyMedium" color={colors.textSecondary}>
            How can we help you today?
          </Text>
        </Stack>

        <View style={styles.search}>
          <Text variant="bodyMedium" color={colors.textMuted}>
            🔍
          </Text>
          <TextInput
            placeholder="Search for services, doctors..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            accessibilityLabel="Search for services, doctors"
          />
        </View>

        <View style={styles.hero}>
          <Text variant="heading2" color="#FFFFFF">
            Care when you need it, at home
          </Text>
          <Text
            variant="bodySmall"
            color="rgba(255,255,255,0.88)"
            style={{ marginTop: spacing[2] }}
          >
            Verified doctors · Live tracking
          </Text>
          <Button
            label="Find Care"
            variant="secondary"
            onPress={onFindCare}
            style={styles.heroCta}
          />
        </View>

        <Row style={{ justifyContent: "space-between" }}>
          <Heading level={3}>Our Services</Heading>
          <Pressable onPress={onFindCare} accessibilityRole="button">
            <Text variant="labelLarge" color={colors.primary}>
              See All
            </Text>
          </Pressable>
        </Row>

        <View style={styles.serviceGrid}>
          {SERVICES.map((service) => (
            <Pressable
              key={service.id}
              accessibilityRole="button"
              accessibilityLabel={service.title}
              onPress={() => onSelectService?.(service.id)}
              style={({ pressed }) => [
                styles.serviceCard,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.serviceIcon}>
                <Text variant="titleLarge" color={colors.primary}>
                  +
                </Text>
              </View>
              <Text variant="labelMedium" align="center">
                {service.title}
              </Text>
            </Pressable>
          ))}
        </View>
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
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  hero: {
    borderRadius: 20,
    padding: spacing[5],
    backgroundColor: colors.primary,
  },
  heroCta: {
    marginTop: spacing[4],
    alignSelf: "flex-start",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: "30%",
    flexGrow: 1,
    minWidth: 96,
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
});
