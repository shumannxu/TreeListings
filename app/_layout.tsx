import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { UserContext, useProtectedRoute } from "../context";
import { Listing, ListingId, Offer, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createPostListingListener,
  getAllIncomingOffersUser,
  getAllListings,
  getAllOutgoingOffersUser,
  getSelfListings,
} from "../firebase/db";
import { RootSiblingParent } from "react-native-root-siblings";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Toast from "react-native-toast-message";

export default function AppLayout() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<{ [id: ListingId]: Listing } | null>(
    null
  );
  const [selfListings, setSelfListings] = useState<Listing[]>([]);

  const [outgoingOffers, setOutgoingOffers] = useState<Offer[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<Offer[]>([]);

  useProtectedRoute(user);

  useEffect(() => {
    if (user) {
      const unsubscribe = createPostListingListener({
        setListings,
        setSelfListings,
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
      const listing = await getAllListings();
      const filteredListings = {} as { [id: ListingId]: Listing };
      const selfListing = {} as { [id: ListingId]: Listing };
      Object.entries(listing).forEach(([id, listingItem]) => {
        if (listingItem.sellerId !== authenticatedUser.id) {
          filteredListings[id] = listingItem;
        } else {
          selfListing[id] = listingItem;
        }
      });
      setListings(filteredListings);
      setSelfListings(Object.values(selfListing));
      const incoming = await getAllIncomingOffersUser(authenticatedUser.id);
      const outgoing = await getAllOutgoingOffersUser(authenticatedUser.id);
      setIncomingOffers(Object.values(incoming));
      setOutgoingOffers(Object.values(outgoing));
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
          outgoingOffers,
          setOutgoingOffers,
          incomingOffers,
          setIncomingOffers,
        }}
      >
        <Slot screenOptions={{ headerShown: false }} />
      </UserContext.Provider>
      <Toast />
    </RootSiblingParent>
  );
}
