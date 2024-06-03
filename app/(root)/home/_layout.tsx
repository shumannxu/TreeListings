import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

function FeedLayout() {
  return (
    <SafeAreaProvider>
      {/* ... other code */}
      <Stack>
        {/* ... other stack screens */}
        <Stack.Screen
          name="index" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        />
        {/* <Stack.Screen
          name="bikeIndex" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        /> */}
        <Stack.Screen
          name="postListings" // Note the change here
          options={{ headerShown: false, gestureEnabled: true }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default FeedLayout;
