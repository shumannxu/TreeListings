import React, { useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../firebase/auth";
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import getTimeAgo from "../components/getTimeAgo";

/* Search Result Screen */
export default function Search() {
  const { user, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultList, setSearchResultList] = useState([]);

  // Mock data for the list, replace with your actual data source
  const searchResultListData = [
    {
      id: "1",
      title: "Nike Shoes",
      price: 26, // Updated to number
      username: "Caleb C.",
      sellerRating: 4.8, // Updated to number
      timeSincePosted: getTimeAgo(new Date(Date.now() - 3 * 60 * 60 * 1000)), // 3 hrs * 60 min * 60 sec * 1000 milisec
    },
    {
      id: "2",
      title: "Adidas Sneakers",
      price: 41, // Updated to number
      username: "Juan B.",
      sellerRating: 4.8, // Updated to number
      timeSincePosted: getTimeAgo(new Date(Date.now() - 6.5 * 60 * 60 * 1000)), // 6hrs and 30 min ago
    },
    {
      id: "3",
      title: "Puma Running Shoes",
      price: 6, // Updated to number
      username: "Ara A.",
      sellerRating: 4.3, // Updated to number
      timeSincePosted: getTimeAgo(
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      ), // Updated to Date
    },
    {
      id: "4",
      title: "Aldo Chelsea",
      price: 100, // Updated to number
      username: "Young K.",
      sellerRating: 4.9, // Updated to number
      timeSincePosted: getTimeAgo(new Date(Date.now() - 6 * 60 * 60 * 1000)),
    },
    {
      id: "5",
      title: "Used Tap Dance Shoes",
      price: 16, // Updated to number
      username: "Shina H.",
      sellerRating: 4.1, // Updated to number
      timeSincePosted: getTimeAgo(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ),
    },
    {
      id: "6",
      title: "Converse All Stars",
      price: 16, // Updated to number
      username: "Houston Y.",
      sellerRating: 4.4, // Updated to number
      timeSincePosted: getTimeAgo(
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      ),
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

  const renderItem = ({ item }) => <SearchItem item={item} />;

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
          keyExtractor={(item) => item.id}
          style={{ marginBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
