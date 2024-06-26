import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  FlatList,
  ScrollView,
  StatusBar
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  getAllListings,
  getDocument,
  createOffer,
} from "../../../../firebase/db";
import { Listing, User, UserContextType } from "../../../../types";
import { getTimeAgo2 } from "../../../components/getTimeAgo";
import Icon from "../../../../components/icon";
import ListingItem from "../../../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from "expo-mail-composer";
import { useAuth } from "../../../../context";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { MainText } from "../../../../components/text"
import TopNav from "../../../../components/topNav";
import SubTopNav from "../../../../components/subTopNav";

export default function DetailItem() {
  const { user, setUser, listings, setListings, selfListings } =
    useAuth() as UserContextType;
  const { listingId } = useLocalSearchParams<{ listingId: string }>();

  const safeAreaInsets = useSafeAreaInsets();
  const [selfUserInfo, setSelfUserInfo] = useState<User | null>(null);

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [price, setPrice] = useState("");
  const { height, width } = useWindowDimensions();
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded); // Toggle the state on tap
  };

  useEffect(() => {
    if (listing) {
      setTimeAgo(getTimeAgo2(listing.datePosted));
    }
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      if (listingId && listings) {
        if (listings[listingId] == null) {
          setListing(
            selfListings.filter((listing) => listing.listingId == listingId)[0]
          );
        } else setListing(listings[listingId]);
      }
      const currentHistory = await AsyncStorage.getItem("history");
      const historyArray = currentHistory ? JSON.parse(currentHistory) : [];
      if (!historyArray.includes(listingId)) {
        historyArray.push(listingId);
        await AsyncStorage.setItem("history", JSON.stringify(historyArray));
      }
    };

    fetchListing();
  }, [listingId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (listing) {
        const userDocPath = `users/${listing.sellerId}`;
        const user = await getDocument(userDocPath);
        setSeller(user);
      }
    };

    fetchUser();
  }, [seller, listing]);

  const styles = StyleSheet.create({
    image: {
      width: width,
      height: width * 0.85,
      // borderRadius: 10,
      // marginVertical: 10,
    },
    button: {
      backgroundColor: "#38B39C",
      padding: 10,
      borderRadius: 10,
    },
    defaultTextSize: {
      fontSize: 20,
      fontWeight: "400",
      letterSpacing: 1,
    },
    textStyle: {
      fontSize: 18,
      fontWeight: "400",
      letterSpacing: 1,
      marginHorizontal: 10,
      marginVertical: 10,
    },
  });

  const showSuccessToast = () => {
    let toast = Toast.show("Offer succesfully made", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      },
    });
    setTimeout(function () {
      Toast.hide(toast);
    }, 1500);
  };

  const showErrorToast = () => {
    let toast = Toast.show("Error in posting offer", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      },
    });
    setTimeout(function () {
      Toast.hide(toast);
    }, 1500);
  };

  const onSubmitOffer = async () => {
    if (user && seller && listingId) {
      let success = await createOffer({
        listingId,
        buyerId: user?.id,
        sellerId: seller?.id,
        price: parseInt(price),
      });
      if (success) {
        showSuccessToast();
        setPrice("");
      } else {
        showErrorToast();
        setPrice("");
      }
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <ListingItem item={item} />,
    []
  );

  if (!listingId) {
    return (
      <SafeAreaView>
        <View>
          <MainText>No item ID provided</MainText>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView>
        <View>
          <MainText>Loading...</MainText>
        </View>
      </SafeAreaView>
    );
  }

  const onBuyNow = async () => {
    if (user && seller && listingId) {
      let success = await createOffer({
        listingId,
        buyerId: user?.id,
        sellerId: seller?.id,
        price: listing.price,
      });
      if (success) {
        showSuccessToast();
        setPrice("");
      } else {
        showErrorToast();
        setPrice("");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00BF63" }}>
      <StatusBar backgroundColor="#00BF63" barStyle="dark-content" />
      <TopNav backgroundColor="#00BF63" iconColor="white" />
      <View style={{ flex: 1, backgroundColor: '#FFF6EC' }}>
        <SubTopNav title="Listing" showSearchIcon={false} />
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        // paddingVertical: safeAreaInsets.top,
      }}
    >

      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: listing.imagePath }} style={styles.image} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: width,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Icon height={30} color="black">
              profile
            </Icon>
            <MainText style={styles.defaultTextSize}>{seller?.fullName} </MainText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MainText style={styles.defaultTextSize}>
              {seller?.sellerRating ? seller.sellerRating : 5}
            </MainText>
            <Icon height={20} color="black">
              star
            </Icon>
          </View>
        </View>
        <View
          style={{ width: width * 0.95, height: 1, backgroundColor: "grey" }}
        />
        <View style={{ width: width, paddingLeft: 10 }}>
          <MainText
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: width * 0.65,
              fontSize: 30,
              fontWeight: "bold",
              letterSpacing: 1,
              marginTop: 10,
              marginBottom: 7,
              color: "#4B6F6E",
              alignItems: "center"
            }}
          >
            {listing.title}
          </MainText>
          <MainText style={[styles.defaultTextSize, { color: "black" }]}>
            {"posted " + timeAgo}
          </MainText>
        </View>
        <View style={{ width: width }}>
          <MainText
            style={{
              fontSize: 18,
              fontWeight: "600",
              letterSpacing: 1,
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            {"Description:"}
          </MainText>
          <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.9}>
            <MainText
              style={styles.textStyle}
              numberOfLines={isExpanded ? undefined : 4} // Limit to 4 lines unless expanded
            >
              {listing.description}
            </MainText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "flex-end",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <MainText style={[styles.defaultTextSize, { marginHorizontal: 10 }]}>
            Asking Price: ${listing.price}
          </MainText>
          <TouchableOpacity style={styles.button} onPress={onBuyNow}>
            <MainText>Buy Now</MainText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "flex-end",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <MainText style={styles.defaultTextSize}>Best Offer: $</MainText>
          <TextInput
            style={{
              marginHorizontal: 10,
              borderWidth: 1,
              borderColor: "black",
              height: 30,
            }}
            placeholder=" Amount "
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: price === "" ? "grey" : "#38B39C" },
            ]}
            onPress={onSubmitOffer}
            disabled={price === ""}
          >
            <MainText>Submit Offer</MainText>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: "black",
          margin: 10,
        }}
      />
      <MainText
        style={{
          fontSize: 20,
          fontWeight: "500",
          letterSpacing: 1,
          marginVertical: 10,
        }}
        color={"#4B6F6E"}
      >
        Similar Items
      </MainText>
      <FlatList
        data={listings ? Object.values(listings) : []}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item.listingId}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
      />
    </ScrollView>
    </View>
    </SafeAreaView>
  );
}
