import React, { useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../firebase/auth";
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import { Listing } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Search Result Screen */
export default function Search() {
  const { user, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultList, setSearchResultList] = useState<Listing[]>([]);

  // Mock data for the list, replace with your actual data source
  const searchResultListData: Listing[] = [
    {
      listingId: "1",
      sellerId: user.id,
      title: "Nike Shoes",
      price: 26,
      datePosted: new Date(Date.now() - 3 * 60 * 60 * 1000),
      description: "A pair of lightly used Nike shoes.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    {
      listingId: "2",
      sellerId: user.id,
      title: "Adidas Sneakers",
      price: 41,
      datePosted: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
      description: "Brand new Adidas sneakers.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    {
      listingId: "3",
      sellerId: user.id,
      title: "Puma Running Shoes",
      price: 6,
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: "Puma running shoes in great condition.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    {
      listingId: "4",
      sellerId: user.id,
      title: "Aldo Chelsea",
      price: 100,
      datePosted: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: "Elegant Aldo Chelsea boots for formal occasions.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    {
      listingId: "5",
      sellerId: user.id,
      title: "Used Tap Dance Shoes",
      price: 16,
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "Used tap dance shoes, good for beginners.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    {
      listingId: "6",
      sellerId: user.id,
      title: "Converse All Stars",
      price: 16,
      datePosted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      description: "Classic Converse All Stars, lightly worn.",
      categories: ["APPAREL"],
      isListingActive: true,
    },
    // Add more shoe listings as needed
  ];

  // Set initial search results to the mock data
  useState(() => {
    setSearchResultList(searchResultListData);
  });

  const handleSearch = () => {
    // Perform search logic here, based on the searchQuery state
    // For simplicity, just filter the searchResultListData based on the title containing the searchQuery
    const filteredResults = searchResultListData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResultList(filteredResults);
  };

  const handleLogout = async () => {
    signOutUser().then(async () => {
      await AsyncStorage.removeItem("userInfo");
      setUser(null);
    });
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <SearchItem item={item} />
  );

  return (
    <SafeAreaView>
      <View>
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
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <Button onPress={handleLogout} title="Sign Out" />
        </View>
        <FlatList
          style={{ marginTop: 30 }}
          data={searchResultList}
          renderItem={renderItem}
          keyExtractor={(item) => item.listingId}
          style={{ marginBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
