import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { UserContext, useProtectedRoute } from "../context";
import { Listing, ListingId, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createPostListingListener,
  getAllListings,
  getSelfListings,
} from "../firebase/db";
import { RootSiblingParent } from "react-native-root-siblings";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function AppLayout() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<{ [id: ListingId]: Listing } | null>(
    null
  );
  const [selfListings, setSelfListings] = useState<Listing[]>([]);

  const [offers, setOffers] = useState<{ [id: ListingId]: Listing } | null>(
    null
  );

  useProtectedRoute(user);

  useEffect(() => {
    if (user) {
      const unsubscribe = createPostListingListener({
        setListings,
        userId: user.id,
      });
      return () => unsubscribe();
    }
  }, [user]);

  const initAuthenticatedUser = async () => {
    setLoading(true);
    const authenticatedUserString = await AsyncStorage.getItem("userInfo");
    const authenticatedUser = authenticatedUserString
      ? JSON.parse(authenticatedUserString)
      : null;
    setUser(authenticatedUser);
    if (authenticatedUser) {
      const listing = await getAllListings(authenticatedUser.id);
      const selfListing = await getSelfListings(authenticatedUser.id);
      setListings(listing);
      setSelfListings(Object.values(selfListing));
    }
    setLoading(false);
  };
  useEffect(() => {
    initAuthenticatedUser();
  }, []); // Added dependency array to ensure it runs only once

  return (
    <RootSiblingParent>
      <UserContext.Provider
        value={{
          user,
          setUser,
          setListings,
          listings,
          selfListings,
          setSelfListings,
        }}
      >
        <Slot screenOptions={{ headerShown: false }} />
      </UserContext.Provider>
    </RootSiblingParent>
  );
}
