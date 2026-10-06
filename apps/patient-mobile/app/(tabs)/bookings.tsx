import { EmptyState, Screen } from "@curevanta/mobile-ui";
import { router } from "expo-router";

export default function BookingsTab() {
  return (
    <Screen scroll={false}>
      <EmptyState
        title="No bookings yet"
        description="Your upcoming care appointments will appear here."
        actionLabel="Find Care"
        onAction={() => router.push("/(tabs)/care")}
      />
    </Screen>
  );
}
