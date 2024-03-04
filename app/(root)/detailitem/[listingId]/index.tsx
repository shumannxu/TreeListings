import React, { useEffect, useState } from "react";
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
import { getAllListings, getDocument } from "../../../../firebase/db";
import { Listing, User, UserContextType } from "../../../../types";
import getTimeAgo from "../../../components/getTimeAgo";
import Icon from "../../../../components/icon";
import ListingItem from "../../../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from "expo-mail-composer";
import { useAuth } from "../../../../context";

export default function DetailItem() {
  const { user, setUser, listings, setListings } = useAuth() as UserContextType;
  const { listingId } = useLocalSearchParams<{ listingId: string }>();

  const safeAreaInsets = useSafeAreaInsets();
  const [selfUserInfo, setSelfUserInfo] = useState<User | null>(null);

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [price, setPrice] = useState("");
  const { height, width } = useWindowDimensions();
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (listingId && listings) {
        setListing(listings[listingId]);
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
      width: width * 0.85,
      height: width * 0.85,
      borderRadius: 10,
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
  });

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

  const onBuyNow = () => {
    console.log("Buy Now");
  };

  const onSubmitOffer = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if (!isAvailable) {
      console.log("Mail services are not available");
      return;
    }
    if (!seller) {
      console.log("User not loaded yet");
      return;
    }

    await MailComposer.composeAsync({
      recipients: [seller.email],
      subject: "Offer for Your Listing",
      body: `Hello ${seller.fullName},\n\nI would like to submit an offer of $${price} for the item listed.\n\nBest regards,\n ${selfUserInfo?.firstName}`,
      isHtml: false, // Set to true if you want to use HTML content in the body
    });

    console.log("Offer submitted via email");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: safeAreaInsets.top,
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: safeAreaInsets.top + 10, // Adjust for safe area
          left: 10,
          zIndex: 10, // Ensure it's above other elements
        }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 18 }}>Go Back</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", letterSpacing: 1 }}>
          {listing.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon height={30} color="black">
            profile
          </Icon>
          <Text style={styles.defaultTextSize}>{seller?.fullName} </Text>
          {seller?.sellerRating && (
            <>
              <Text style={styles.defaultTextSize}>{seller?.sellerRating}</Text>
              <Icon height={20} color="black">
                star
              </Icon>
            </>
          )}
          <Text style={styles.defaultTextSize}>{timeAgo}</Text>
        </View>

        <Image source={{ uri: listing.imagePath }} style={styles.image} />
        <Text style={styles.defaultTextSize}>{listing.description}</Text>
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
          <Text style={styles.defaultTextSize}>Best Offer$</Text>
          <TextInput
            style={{ marginHorizontal: 10 }}
            placeholder="Amount"
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
      <View style={{ width: "100%", height: 1, backgroundColor: "black" }} />
      <Text style={styles.defaultTextSize}>Similar Items</Text>
      <FlatList
        data={listings ? Object.values(listings) : []}
        renderItem={({ item }: { item: Listing }) => (
          <ListingItem item={item} />
        )}
        horizontal
        keyExtractor={(item) => item.listingId}
      />
    </ScrollView>
  );
}
