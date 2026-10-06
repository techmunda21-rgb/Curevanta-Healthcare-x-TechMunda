import { colors } from "@curevanta/design-tokens";
import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";

function TabLabel({ label, color }: { label: string; color: ColorValue }) {
  return (
    <Text style={{ fontSize: 11, fontWeight: "600", color }}>{label}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ color }) => <TabLabel label="Home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarLabel: ({ color }) => <TabLabel label="Bookings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: "Care",
          tabBarLabel: ({ color }) => <TabLabel label="Care" color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarLabel: ({ color }) => <TabLabel label="Support" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: ({ color }) => <TabLabel label="Profile" color={color} />,
        }}
      />
    </Tabs>
  );
}
