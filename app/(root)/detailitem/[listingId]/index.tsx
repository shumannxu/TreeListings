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
  const [mainImage, setMainImage] = useState<string>("");

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

  useEffect(() => {
    const setImage = async () => {
      if (listing)
        setMainImage(
          listing.imagePath ||
            (listing.imagesPath && listing.imagesPath.length > 0
              ? listing.imagesPath[0]
              : "https://firebasestorage.googleapis.com/v0/b/treelistings.appspot.com/o/Screenshot%202024-05-06%20at%204.02.47%E2%80%AFPM.png?alt=media&token=6a0b9378-cce8-4b60-886a-9ba4ea391ea6")
        );
    };
    setImage();
  }, [listing]);

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
    imageUploadButton: {
      backgroundColor: "#e7e7e7",
      alignItems: "center",
      justifyContent: "center",
      height: 150,
      width: 150,
      borderRadius: 5,
      marginVertical: 10,
    },
    imagePreview: {
      height: "100%",
      width: "100%",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "gray",
      borderWidth: 1,
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
    [listing]
  );

  if (!listingId) {
    return (
      <SafeAreaView>
        <View>
          <Text>No item ID provided</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading...</Text>
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
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: safeAreaInsets.top + 10,
          left: 10,
          zIndex: 10, // Ensure it's above other elements
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back-outline" size={40} color="#38B39C" />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: safeAreaInsets.top + 50, // Add padding to avoid overlap with the back button
          paddingBottom: 100
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={{
              uri: mainImage,
            }}
            style={styles.image}
          />
          {listing.imagePath && (
            <ScrollView
              horizontal={true} // Enable horizontal scrolling
              showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scrollbar
              contentContainerStyle={{
                // height: 5,
                alignContent: "center",
                justifyContent: "center",
              }} // Apply layout properties here
            >
              {listing.imagesPath
                ?.filter((img) => img)
                .map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      backgroundColor: "#e7e7e7",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 175,
                      width: 175,
                      borderRadius: 5,
                      marginVertical: 10,
                      marginHorizontal: 5,
                    }}
                    onPress={() => setMainImage(img)}
                  >
                    <Image
                      source={{ uri: img }}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: "gray",
                        borderWidth: 1,
                      }}
                    />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: width,
              paddingVertical: 5,
              paddingHorizontal: 10,
              marginTop: -20,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon height={30} color="black">
                profile
              </Icon>
              <Text style={styles.defaultTextSize}>{seller?.fullName} </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.defaultTextSize}>
                {seller?.sellerRating ? seller.sellerRating : 5}
              </Text>
              <Icon height={20} color="black">
                star
              </Icon>
            </View>
          </View>
          <View
            style={{ width: width * 0.95, height: 1, backgroundColor: "grey" }}
          />
          <View style={{ width: width, paddingLeft: 10 }}>
            <Text
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
              }}
            >
              {listing.title}
            </Text>
            <Text style={[styles.defaultTextSize, { color: "black" }]}>
              {"posted " + timeAgo}
            </Text>
          </View>
          <View style={{ width: width }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                letterSpacing: 1,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              {"Description:"}
            </Text>
            <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.9}>
              <Text
                style={styles.textStyle}
                numberOfLines={isExpanded ? undefined : 4} // Limit to 4 lines unless expanded
              >
                {listing.description}
              </Text>
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
            <Text style={[styles.defaultTextSize, { marginHorizontal: 10 }]}>
              Asking Price: ${listing.price}
            </Text>
            <TouchableOpacity style={styles.button} onPress={onBuyNow}>
              <Text>Buy Now</Text>
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
            <Text style={styles.defaultTextSize}>Best Offer: $</Text>
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
              <Text>Submit Offer</Text>
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            letterSpacing: 1,
            marginVertical: 10,
            color: "#4B6F6E",
          }}
        >
          Similar Items
        </Text>

        <FlatList
          data={
            listings
              ? Object.values(listings).filter(
                  (item) => item.listingId !== listingId
                )
              : []
          }
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.listingId}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={5}
        />
      </ScrollView>
    </View>
  );
}
