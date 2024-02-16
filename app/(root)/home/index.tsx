import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../../firebase/auth";
import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem"; 
import { getAllListings } from "../../../firebase/db";
import { useEffect, useState} from "react";
import { Listing } from "../../../types";

export default function Home() {
  const { user, setUser } = useAuth();
  const [listings, setListings] = useState<Listing[] | [] >([]);

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchAllListings = async () => {
      const listings = await getAllListings();
      setListings(listings);
    }
    fetchAllListings();
  }, []);

  // Mock data for the lists, replace with your actual data source
  const recommendedList = [
    { id: "1", title: "Listing 1" },
    // ... more items
  ];
  const recentlyBrowsedList = [
    { id: "2", title: "Listing 2" },
    // ... more items
  ];
  const trendingList = [
    { id: "3", title: "Listing 3" },
    // ... more items
  ];

  const handleLogout = async () => {
    signOutUser().then(async () => {
      await AsyncStorage.removeItem("userInfo");
      setUser(null);
    });
  };

  // Render method for FlatList items
  const renderItem = ({ item }:{item:Listing}) => <ListingItem item={item} />;

  return (
    <SafeAreaView>
      <View>
        <Text style={{alignSelf: "center", fontSize: 30}}>TreeListing</Text>
        <Text>We think you&apos;ll like ❤️</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
        <Text>Recently Browsed 🕒</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
        <Text>Trending 📈</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
      </View>
      <Button onPress={handleLogout} title="Sign Out" />
    </SafeAreaView>
  );
}
