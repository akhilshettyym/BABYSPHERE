import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1A1A25",
          borderTopWidth: 1,
          borderTopColor: "#2A2A35",
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#FF9500",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomePage"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="GraphPage"
        options={{
          title: "Graph",
          tabBarIcon: ({ color, size }) => <Ionicons name="desktop-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="live-feed"
        options={{
          title: "Live Feed",
          tabBarIcon: ({ color, size }) => <Ionicons name="videocam" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="WellnessTracker"
        options={{
          title: "Wellness",
          tabBarIcon: ({ color, size }) => <Ionicons name="fitness" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}