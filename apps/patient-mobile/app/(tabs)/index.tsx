import { PatientHomeScreen } from "@/src/features/home/PatientHomeScreen";
import { router } from "expo-router";

export default function HomeTab() {
  return (
    <PatientHomeScreen
      patientName="Aanya"
      addressLabel="12 Palm Grove, Indiranagar"
      onFindCare={() => router.push("/(tabs)/care")}
      onChangeLocation={() => {}}
      onOpenNotifications={() => {}}
      onTrackBooking={() => router.push("/(tabs)/bookings")}
      onSelectService={() => router.push("/(tabs)/care")}
    />
  );
}
