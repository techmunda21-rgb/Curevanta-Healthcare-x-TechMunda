import { PatientHomeScreen } from "@/src/features/home/PatientHomeScreen";
import { router } from "expo-router";

export default function HomeTab() {
  return (
    <PatientHomeScreen
      patientName="Priya"
      addressLabel="Indiranagar, Bengaluru"
      onFindCare={() => router.push("/(tabs)/care")}
      onChangeLocation={() => {}}
      onOpenNotifications={() => {}}
      onOpenProfile={() => router.push("/(tabs)/profile")}
      onSelectService={() => router.push("/(tabs)/care")}
    />
  );
}
