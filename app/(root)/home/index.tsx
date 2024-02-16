import { View, Text, Button, FlatList, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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



  // Render method for FlatList items
  const renderItem = ({ item }:{item:Listing}) => <ListingItem recommend ={false} item={item} />;

  return (
    <SafeAreaView>
      <View>
        <Text style={{alignSelf: "center", fontSize: 30}}>TreeListing</Text>
        <Text style={styles.textStyle}>We think you&apos;ll like ❤️</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
        <Text style={styles.textStyle}>Recently Browsed 🕒</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
        <Text style={styles.textStyle}>Trending 📈</Text>
        <FlatList
          data={listings}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
  }

});
