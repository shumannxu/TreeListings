import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Listing, UserContextType } from "../../../types";
import RecommendItem from "../../components/recommendItem";
import { getAllListings } from "../../../firebase/db";

export default function Home() {
  const { user, setUser, listings, setListings } = useAuth() as UserContextType;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (user) {
      setRefreshing(true);
      const newListings = await getAllListings(user.id);
      setListings(newListings);
      setRefreshing(false);
    }
  }, [user]);

  const renderRecommend = useCallback(
    ({ item }: { item: Listing }) => <RecommendItem item={item} />,
    []
  );

  // Render method for FlatList items
  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <ListingItem item={item} />,
    []
  );

  const trendingItemsComponent = useMemo(
    () => (
      <View>
        <Text style={{ alignSelf: "center", fontSize: 30 }}>TreeListing</Text>
        <Text style={styles.textStyle}>Trending</Text>
        <FlatList
          data={listings ? Object.values(listings) : []}
          renderItem={renderItem}
          initialNumToRender={5}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.listingId}
          scrollEnabled={true}
        />
        <Text style={styles.textStyle}>Recommended For You</Text>
      </View>
    ),
    [listings]
  );
  const recentlyBrowsedComponents = useMemo(
    () => (
      <>
        <Text style={styles.textStyle}>Recently Browsed</Text>
        <FlatList
          data={listings ? Object.values(listings) : []}
          renderItem={renderItem}
          initialNumToRender={5}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.listingId}
          scrollEnabled={true}
        />
      </>
    ),
    [listings]
  );

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <FlatList
        ListHeaderComponent={trendingItemsComponent}
        data={listings ? Object.values(listings) : []}
        renderItem={renderRecommend}
        initialNumToRender={5}
        keyExtractor={(item) => item.listingId}
        ListFooterComponent={recentlyBrowsedComponents}
        contentContainerStyle={{
          paddingLeft: insets.left + 20,
          paddingRight: insets.right + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#B0DCC5"]} // Customize the color of the loading indicator
            tintColor={"#B0DCC5"} // Customize the tint color of the iOS loading indicator
          />
        }
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
