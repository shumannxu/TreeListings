// import { Stack } from "expo-router";

// export default function AppLayout() {

//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: "#f4511e",
//         },
//         headerTintColor: "#fff",
//         headerTitleStyle: {
//           fontWeight: "bold",
//         },
//       }}
//     >
//       <Stack.Screen name="login" options={{ headerShown: false }} />
//     </Stack>
//   );
// }

import { Link, Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { UserContext, useProtectedRoute } from "../context";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppLayout() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useProtectedRoute(user);
  const initAuthenticatedUser = async () => {
    setLoading(true);
    const authenticatedUser = await AsyncStorage.getItem("userInfo");
    setUser(() => (authenticatedUser ? JSON.parse(authenticatedUser) : null));
    setLoading(false);
  };

  useEffect(() => {
    initAuthenticatedUser();
  }, []); // Added dependency array to ensure it runs only once

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Stack screenOptions={{ headerShown: false }} />
    </UserContext.Provider>
  );
}
