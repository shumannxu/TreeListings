import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem";
import { getAllListings } from "../../../firebase/db";
import { useEffect, useState } from "react";
import { Listing, UserContextType } from "../../../types";
import RecommendItem from "../../components/recommendItem";

export default function Home() {
  const { user, setUser, listings } = useAuth() as UserContextType;
  const insets = useSafeAreaInsets();

  const renderRecommend = ({ item }: { item: Listing }) => (
    <RecommendItem item={item} />
  );

  // Render method for FlatList items
  const renderItem = ({ item }: { item: Listing }) => (
    <ListingItem item={item} />
  );

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <FlatList
        ListHeaderComponent={
          <>
            <View>
              <Text style={{ alignSelf: "center", fontSize: 30 }}>
                TreeListing
              </Text>
              <Text style={styles.textStyle}>Trending</Text>
              <FlatList
                data={listings ? Object.values(listings) : []}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.listingId}
                scrollEnabled={true}
              />
              <Text style={styles.textStyle}>Recommended For You</Text>
            </View>
          </>
        }
        data={listings ? Object.values(listings) : []}
        renderItem={renderRecommend}
        keyExtractor={(item) => item.listingId}
        ListFooterComponent={
          <>
            <Text style={styles.textStyle}>Recently Browsed</Text>
            <FlatList
              data={listings ? Object.values(listings) : []}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.listingId}
              scrollEnabled={true}
            />
          </>
        }
        contentContainerStyle={{
          paddingLeft: insets.left + 20,
          paddingRight: insets.right + 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
