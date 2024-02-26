import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { UserContext, useProtectedRoute } from "../context";
import { Listing, ListingId, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllListings } from "../firebase/db";
import { RootSiblingParent } from "react-native-root-siblings";

export default function AppLayout() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<{ [id: ListingId]: Listing } | null>(
    null
  );

  useProtectedRoute(user);

  const initAuthenticatedUser = async () => {
    setLoading(true);
    const authenticatedUser = await AsyncStorage.getItem("userInfo");
    setUser(() => (authenticatedUser ? JSON.parse(authenticatedUser) : null));
    const listing = await getAllListings();
    setListings(listing);
    setLoading(false);
  };

  useEffect(() => {
    initAuthenticatedUser();
  }, []); // Added dependency array to ensure it runs only once

  return (
    <RootSiblingParent>
      <UserContext.Provider value={{ user, setUser, setListings, listings }}>
        <Slot screenOptions={{ headerShown: false }} />
      </UserContext.Provider>
    </RootSiblingParent>
  );
}
