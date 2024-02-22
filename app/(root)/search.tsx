import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import { Listing, UserContextType } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* Search Result Screen */
export default function Search() {
  const { user, setUser, listings } = useAuth() as UserContextType;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Listing[] | null>(
    listings ? Object.values(listings) : null
  );

  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery && listings) {
        const results = Object.values(listings).filter((listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredResults(results);
      } else {
        setFilteredResults(listings ? Object.values(listings) : null);
      }
    }, 500); // 500 ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, listings]);

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <SearchItem item={item} />,
    []
  );

  return (
    <View style={{ flex: 1, marginTop: safeAreaInsets.top }}>
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
        data={filteredResults ? filteredResults : []}
        initialNumToRender={7}
        renderItem={renderItem}
        keyExtractor={(item) => item.listingId}
      />
    </View>
  );
}
