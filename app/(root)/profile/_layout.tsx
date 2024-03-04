import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

function UniqueURLLayout() {
  return (
    <SafeAreaProvider>
      {/* ... other code */}
      <Stack>
        {/* ... other stack screens */}
        <Stack.Screen
          name="index" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="editProfile" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default UniqueURLLayout;
