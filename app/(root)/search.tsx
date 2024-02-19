import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../firebase/auth";
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import { Listing } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllListings } from "../../firebase/db";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* Search Result Screen */
export default function Search() {
  const { user, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [listings, setlistings] = useState<Listing[]>([]);
  const [filteredResults, setFilteredResults] = useState<Listing[]>([]);

  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchAllListings = async () => {
      const listings = await getAllListings();
      setlistings(listings);
    };
    fetchAllListings();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const results = listings.filter((listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredResults(results);
      } else {
        setFilteredResults(listings);
      }
    }, 500); // 500 ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, listings]);

  const renderItem = ({ item }: { item: Listing }) => (
    <SearchItem item={item} />
  );

  return (
    <View style={{ paddingTop: safeAreaInsets.top }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingHorizontal: 10,
          }}
          placeholder="Search..."
          value={searchQuery} // input value
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <FlatList
        style={{ marginTop: 30, marginBottom: 100, height: "100%" }}
        data={filteredResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.listingId}
      />
    </View>
  );
}
