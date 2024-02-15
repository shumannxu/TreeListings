import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeLayout() {
  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home/index"
          options={{
            href: "/home",
            tabBarLabel: "Home",
          }}
        />
        <Tabs.Screen
          name="postListings"
          options={{
            href: "/postListings",
            tabBarLabel: "Post",
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
