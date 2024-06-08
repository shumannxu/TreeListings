import {
  View,
  Text,
  Image,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  MaterialIcons,
  Feather,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { useAuth } from "../../../context";
import ListingItem from "../../components/listingItem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Listing, ListingId, UserContextType } from "../../../types";
import RecommendItem from "../../components/recommendItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from "../../../components/icon";
import { HeaderText, MainText } from "../../../components/text";

import TopNav from "../../../components/topNav";

export default function Home() {
  const { user, setUser, listings, setListings, setSelfListings } =
    useAuth() as UserContextType;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [trendingCounter, setTrendingCounter] = useState<number>(1);
  const [recCounter, setRecCounter] = useState<number>(1);
  const [histCounter, setHistCounter] = useState<number>(1);

  // const [bikeFilter, setBikeFilter] = useState<boolean>(false);

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

  const [showPlusIcon, setShowPlusIcon] = useState<boolean>(true);
  const handleScrollBegin = useCallback(() => {
    setShowPlusIcon(false);
  }, []);
  const handleScrollEnd = useCallback(() => {
    setShowPlusIcon(true);
  }, []);
  const goToPostListings = useCallback(
    () => router.push("/home/postListings"),
    []
  );
  // const toggleBikeFilter = useCallback(
  //   () => router.push("/home/bikeIndex"),
  //   [bikeFilter]
  // );

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
        .filter((listingId: ListingId) => listingId !== undefined);
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
    const slicedRecList = recList.slice(0, recCounter * 4);
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
        return <Button title="View More" onPress={incrementRec} color="#16524E"/>;
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
        {/* <View>
          <Image
            style={styles.imageStyle}
            source={require("../../../assets/Logo.png")}
          />
        </View> */}

        {/* <TouchableOpacity
          style={{ alignSelf: "flex-start" }}
          onPress={toggleBikeFilter}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              borderRadius: 999,
              backgroundColor: "gray",
            }}
          >
            <Text style={{ fontSize: 14 }}>Bikes</Text>
          </View>
        </TouchableOpacity> */}
        <HeaderText style={{ flexDirection: "row" }} color="black">
          Trending{" "}
          <Feather
            style={{ color: "#38B39C" }}
            name="trending-up"
            size={30}
            color="black"
          />
        </HeaderText>

        <FlatList
          data={listings ? Object.values(listings) : []}
          renderItem={renderTrend}
          initialNumToRender={5}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.listingId}
          scrollEnabled={true}
        />
        <HeaderText style={{ flexDirection: "row" }} color="black">
          For You{" "}
          <FontAwesome5
            style={{ marginLeft: 5, color: "#38B39C" }}
            name="hand-holding-heart"
            size={30}
            color="black"
          />
        </HeaderText>
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
        <MainText style={{ alignSelf: "center", fontSize: 20 }} color="black">
          No Browse History!
        </MainText>
      </View>
    );
  }, []);

  const recentlyBrowsedComponents = useMemo(
    () => (
      <>
        <HeaderText
          style={{ flexDirection: "row", marginTop: 10 }}
          color="black"
        >
          Recently Browsed{" "}
          <FontAwesome6
            style={{ marginLeft: 5, color: "#38B39C" }}
            name="clock-rotate-left"
            size={30}
            color="black"
          />
        </HeaderText>
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
    <SafeAreaView style={{ backgroundColor: "#FFF6EC" }}>
      <StatusBar backgroundColor="#FFF6EC" barStyle="dark-content" />
      <TopNav backgroundColor={"#FFF6EC"} iconColor={"#307E79"} />
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
          paddingBottom: insets.bottom + 70,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#B0DCC5"]}
            tintColor={"#B0DCC5"}
          />
        }
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
      />

      <TouchableOpacity style={styles.plusIconStyle} onPress={goToPostListings}>
        <Icon color={"white"} height={20} width={20}>
          pluspost
        </Icon>
        {showPlusIcon && <Text style={styles.postTextStyle}>Post</Text>}
      </TouchableOpacity>
    </SafeAreaView>
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
  plusIconStyle: {
    position: "absolute",
    right: 22,
    bottom: 25,
    padding: 10,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38B39C",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTextStyle: {
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
