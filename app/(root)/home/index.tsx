import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../../firebase/auth";
import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem"; // Assuming the component exists at this path

export default function Home() {
  const { user, setUser } = useAuth();

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
  const renderItem = ({ item }) => <ListingItem item={item} />;

  return (
    <SafeAreaView>
      <View>
        <Text>Feed screen</Text>
        <Button onPress={handleLogout} title="Sign Out" />
        <Text>We think you’ll like</Text>
        <FlatList
          data={recommendedList}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.id}
        />
        <Text>Recently Browsed</Text>
        <FlatList
          data={recentlyBrowsedList}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.id}
        />
        <Text>Trending</Text>
        <FlatList
          data={trendingList}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
