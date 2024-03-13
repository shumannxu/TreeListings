import {
  View,
  Text,
  Image,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Listing, ListingId, UserContextType } from "../../../types";
import RecommendItem from "../../components/recommendItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const { user, setUser, listings, setListings, setSelfListings } =
    useAuth() as UserContextType;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [trendingCounter, setTrendingCounter] = useState<number>(1);
  const [recCounter, setRecCounter] = useState<number>(1);
  const [histCounter, setHistCounter] = useState<number>(1);

  const [recList, setRecList] = useState<
    Array<Listing | { listingId: "VIEW_MORE" }>
  >([]);
  const [trendList, setTrendList] = useState<
    Array<Listing | { listingId: "VIEW_MORE" }>
  >([]);
  const [histList, setHistList] = useState<
    Array<Listing | { listingId: "VIEW_MORE" }>
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const retrieveLists = useCallback(async () => {
    if (listings && user) {
      setLoading(true);
      const rList = Object.values(listings).filter((listing: Listing) =>
        user.interests && user.interests.length !== 0
          ? user.interests.some((interest) =>
              listing.categories.includes(interest)
            )
          : true
      );
      setRecList(rList);
      const hList = await AsyncStorage.getItem("history");
      const parsedhListId = hList ? JSON.parse(hList) : [];
      const parsedHlist = parsedhListId
      .map((listingId: ListingId) => listings[listingId])
      .filter((listingId: ListingId) => listingId !== undefined);;
      setHistList(parsedHlist);
      setLoading(false);
    }
  }, [listings, user]);
  useEffect(() => {
    retrieveLists();
  }, [listings, user]);

  const incrementTrending = useCallback(
    () => setTrendingCounter(trendingCounter + 1),
    [trendingCounter]
  );
  const incrementRec = useCallback(
    () => setRecCounter(recCounter + 1),
    [recCounter]
  );
  const incrementHist = useCallback(
    () => setHistCounter(histCounter + 1),
    [histCounter]
  );
  const recommendedListData = useMemo(() => {
    const slicedRecList = recList.slice(0, recCounter * 5);
    return slicedRecList.length > 0
      ? slicedRecList.concat([{ listingId: "VIEW_MORE" }])
      : slicedRecList;
  }, [recCounter, recList]);

  const histListData = useMemo(() => {
    const slicedHistList = histList.slice(0, histCounter * 5);
    return slicedHistList.length > 0
      ? slicedHistList.concat([{ listingId: "VIEW_MORE" }])
      : slicedHistList;
  }, [histCounter, histList]);

  const trendListData = useMemo(() => {
    const slicedTrendList = trendList.slice(0, trendingCounter * 5);
    return slicedTrendList.length > 0
      ? slicedTrendList.concat([{ listingId: "VIEW_MORE" }])
      : slicedTrendList;
  }, [trendingCounter, trendList]);

  const onRefresh = useCallback(async () => {
    if (user) {
      setRefreshing(true);
      retrieveLists();
      // const listing = await getAllListings();
      // const filteredListings = {} as { [id: ListingId]: Listing };
      // const selfListing = {} as { [id: ListingId]: Listing };
      // Object.entries(listing).forEach(([id, listingItem]) => {
      //   if (listingItem.sellerId !== user.id) {
      //     filteredListings[id] = listingItem;
      //   } else {
      //     selfListing[id] = listingItem;
      //   }
      // });
      // setListings(filteredListings);
      // setSelfListings(Object.values(selfListing));
      setRefreshing(false);
    }
  }, [user, listings]);

  const renderRecommend = useCallback(
    ({
      item,
      index,
    }: {
      item: Listing | { listingId: "VIEW_MORE" };
      index: number;
    }) => {
      if (item.listingId === "VIEW_MORE") {
        if (index == recList.length) return null;
        return <Button title="View More" onPress={incrementRec} />;
      } else {
        return <RecommendItem item={item} />;
      }
    },
    [incrementRec, recList]
  );

  const renderHist = useCallback(
    ({
      item,
      index,
    }: {
      item: Listing | { listingId: "VIEW_MORE" };
      index: number;
    }) => {
      if (item.listingId === "VIEW_MORE") {
        if (index == histList.length) return null;
        return <Button title="View More" onPress={incrementHist} />;
      } else {
        return <ListingItem item={item} />;
      }
    },
    [incrementHist, histList]
  );
  // Render method for FlatList items
  const renderTrend = useCallback(
    ({
      item,
      index,
    }: {
      item: Listing | { listingId: "VIEW_MORE" };
      index: number;
    }) => {
      if (item.listingId === "VIEW_MORE") {
        if (index == trendList.length) return null;
        return <Button title="View More" onPress={incrementTrending} />;
      } else {
        return <ListingItem item={item} />;
      }
    },
    [incrementTrending]
  );

  const trendingItemsComponent = useMemo(
    () => (
      <View>
        <View>
          <Image
            style={styles.imageStyle}
            source={require("../../../assets/Logo.png")}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.textStyle}>Trending</Text>
          <Feather
            style={{ marginLeft: 5, color: "#38B39C" }}
            name="trending-up"
            size={24}
            color="black"
          />
        </View>
        <FlatList
          data={listings ? Object.values(listings) : []}
          renderItem={renderTrend}
          initialNumToRender={5}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.listingId}
          scrollEnabled={true}
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.textStyle}>Recommended For You</Text>
          <AntDesign
            style={{ marginLeft: 5, color: "#38B39C" }}
            name="heart"
            size={24}
            color="black"
          />
        </View>
      </View>
    ),
    [listings]
  );

  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Image
          style={styles.icon}
          source={require("../../../assets/sadtreeicon.png")}
        />
        <Text style={{ alignSelf: "center", fontSize: 20 }}>
          No Browse History!
        </Text>
      </View>
    );
  }, []);

  const recentlyBrowsedComponents = useMemo(
    () => (
      <>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={styles.textStyle}>Recently Browsed</Text>
          <MaterialIcons
            style={{ marginLeft: 5, color: "#38B39C" }}
            name="access-time"
            size={24}
            color="black"
          />
        </View>
        <View
          style={{
            alignItems: histListData.length === 0 ? "center" : undefined,
          }}
        >
          <FlatList
            data={histListData}
            renderItem={renderHist}
            initialNumToRender={5}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.listingId}
            scrollEnabled={true}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </>
    ),
    [histListData]
  );

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <FlatList
        ListHeaderComponent={trendingItemsComponent}
        data={recommendedListData}
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
            colors={["#B0DCC5"]}
            tintColor={"#B0DCC5"}
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
  imageStyle: {
    flex: 1,
    height: 75,
    width: 358.5,
    alignSelf: "center",
    margin: 20,
  },
  icon: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
});
