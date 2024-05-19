import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

function CouponLayout() {
  return (
    <SafeAreaProvider>
      {/* ... other code */}
      <Stack>
        {/* ... other stack screens */}
        <Stack.Screen
          name="index" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default CouponLayout;
