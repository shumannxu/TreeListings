import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  ViewProps,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { signOutUser } from "../../../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context";
import { Listing, Offer, User, UserContextType } from "../../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../../components/icon";
import { getSelfListings, setDocument } from "../../../firebase/db";
import {
  FlatList,
  HeaderMeasurements,
  MaterialTabBar,
  TabBarProps,
  Tabs,
  useHeaderMeasurements,
} from "react-native-collapsible-tab-view";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchItem from "../../components/searchItem";

export default function Profile() {
  const { user, setUser, selfListings, listings, outgoingOffers } =
    useAuth() as UserContextType;
  const safeAreaInsets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [activeListingsSelected, setActiveListingsSelected] = useState(true); // For buyer and seller active/past toggle
  const [sellerActiveListingsSelected, setSellerActiveListingsSelected] =
    useState(true); // For seller active/past toggle

  const toggleActiveListings = () => {
    setActiveListingsSelected(true);
  };

  const togglePastListings = () => {
    setActiveListingsSelected(false);
  };

  const toggleSellerActiveListings = () => {
    setSellerActiveListingsSelected(true);
  };

  const toggleSellerPastListings = () => {
    setSellerActiveListingsSelected(false);
  };

  const navigateToEditProfile = useCallback(() => {
    router.push("/profile/editProfile");
  }, []);

  const navigateToProfileListings = useCallback(() => {
    router.push("/profile/profileListings");
  }, []);

  const navigateToProfilePurchases = useCallback(() => {
    router.push("/profile/profileListings");
  }, []);

  const navigateToProfilePreferences = useCallback(() => {
    router.push("/profile/profilePreferences");
  }, []);

  const navigateToOffers = useCallback(() => {
    router.push("/profile/profileOffers");
  }, []);

  const sellerFilteredResults = useMemo(() => {
    if (user) {
      const filter = Object.values(selfListings).filter(
        (listing: Listing) =>
          listing && listing.isListingActive === sellerActiveListingsSelected
      );
      return filter;
    }
  }, [sellerActiveListingsSelected, user]);

  const buyerFilteredResults = useMemo(() => {
    if (user && listings) {
      return outgoingOffers
        .filter((offer: Offer) => {
          // Check if the listing for the offer exists and isListingActive matches the selected state
          const listing = listings[offer.listingId];
          if (listing) {
            if (listing.isListingActive === undefined) {
              console.log("undefined listing found: ", listing);
              return false;
            }
            return listing.isListingActive === activeListingsSelected;
          }
          return false; // Exclude offers where the listing doesn't exist
        })
        .map((offer: Offer) => listings[offer.listingId]);
    }
    return [];
  }, [activeListingsSelected, listings, outgoingOffers, user]);

  const renderHeader = useCallback(
    (props: TabBarProps) => {
      return (
        <Animated.View
          style={{
            flexDirection: "column",
          }}
        >
          <View style={{ height: 100, backgroundColor: "black" }} />
          <View style={{ height: 100, backgroundColor: "white" }} />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: "25%",
              padding: 10,
              left: "75%",
              zIndex: 2,
            }}
            onPress={navigateToEditProfile}
          >
            <MaterialCommunityIcons
              name="pencil-circle"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              left: 0,
              right: 0,
              top: "50%",
              opacity: 1,
              transform: [{ translateY: -35 }], // Adjust based on the height of the icon for vertical centering
            }}
          >
            <View
              style={{
                padding: 3,
                backgroundColor: "white",
                borderRadius: 999,
              }}
            >
              <Icon color={"#664147"} height={100}>
                profile
              </Icon>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{user?.fullName}</Text>
              <Text>{user?.sellerRating}</Text>
            </View>
          </View>
        </Animated.View>
      );
    },
    [user]
  );

  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.icon}
          source={require("../../../assets/sadtreeicon.png")}
        />
        <Text style={{ alignSelf: "center", fontSize: 20 }}>
          No History Yet
        </Text>
      </View>
    );
  }, []);

  return (
    <ScrollView style={[styles.container]}>
      <View style={{ height: safeAreaInsets.top }} />
      <View style={[styles.profileContainer]}>
        <View style={[styles.align, styles.horizontal]}>
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={styles.itemLinkText}>{user?.fullName}</Text>
        </View>
        <View style={[styles.align, styles.horizontal]}>
          <TouchableOpacity
            style={styles.viewProfile}
            onPress={navigateToEditProfile}
          >
            <Text>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={[styles.headerText, styles.itemSpacing]}>
          Recently Visited
        </Text>
      </View>
      <View style={[styles.itemLinkContainer]}>
        <Text style={[styles.headerText, styles.itemSpacing]}>
          Buying & Selling
        </Text>
        <TouchableOpacity
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToProfileListings}
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToOffers}
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToProfilePreferences}
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Preferences</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.itemLinkContainer]}>
        <Text style={[styles.headerText, styles.itemSpacing]}>Business</Text>
        <TouchableOpacity
          style={[styles.align, styles.horizontal, styles.itemSpacing]}
        >
          <Icon color={"#664147"} height={30}>
            profile
          </Icon>
          <Text style={[styles.itemLinkText]}>Manage Business Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  align: {
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "left",
  },
  itemLinkText: {
    fontSize: 18,
    textAlign: "left",
    marginLeft: 10,
  },
  viewProfile: {
    borderRadius: 6,
    padding: 10,
    backgroundColor: "gray",
  },
  itemSpacing: {
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  itemLinkContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#2F9C95",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  activeButton: {
    backgroundColor: "#38B39C",
  },
  userInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  textFirst: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "800",
  },
  textSecond: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#e7e7e7",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  userPreferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  preferenceButton: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 3,
    borderRadius: 50,
  },
  selectedPreference: {
    backgroundColor: "#2F9C95",
  },
  preferenceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2F9C95",
    textAlign: "center",
    marginVertical: 10,
  },
  expandButton: {
    backgroundColor: "#2F9C95",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  listingsToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  listingsToggleButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 2,
    marginHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  inactiveText: {
    color: "#888",
  },
  icon: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
});
