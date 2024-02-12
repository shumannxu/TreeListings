import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserContextType } from "./types";
import { useRouter, useSegments } from "expo-router";

// Create the context with a default value
export const UserContext = createContext<UserContextType | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(UserContext);
}

// This hook will protect the route access based on user authentication.
export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/home");
    }
  }, [user, segments]);
}
