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
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { signOutUser } from "../../../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context";
import { User, UserContextType } from "../../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../../components/icon";
import { setDocument } from "../../../firebase/db";
import {
  HeaderMeasurements,
  Tabs,
  useHeaderMeasurements,
} from "react-native-collapsible-tab-view";
import { CATEGORIES } from "../../../constants";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const preferencesData = CATEGORIES.map((category) => ({
  id: category.value,
  label: category.label,
}));

export default function Profile() {
  const { user, setUser } = useAuth() as UserContextType;
  const safeAreaInsets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [change, setChange] = useState(false);
  const [preferences, setPreferences] = useState(user?.interests || []);
  const [activeListingsSelected, setActiveListingsSelected] = useState(true); // For buyer and seller active/past toggle
  const [sellerActiveListingsSelected, setSellerActiveListingsSelected] =
    useState(true); // For seller active/past toggle
  const scrollY = useSharedValue<Number>(0);
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
  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const handleLogout = async () => {
    signOutUser().then(async () => {
      await AsyncStorage.removeItem("userInfo");
      setUser(null);
    });
  };

  const saveChanges = () => {
    if (userInfo) {
      const newUserinfo = { ...userInfo, interests: preferences };
      setDocument(`users/${userInfo?.id}`, newUserinfo, true);
      setChange(false);
      setUser(newUserinfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(newUserinfo));
    } // need to implement storing user preferences into firebase
  };
  const navigateToEditProfile = useCallback(() => {
    router.push("/profile/editProfile");
  }, []);

  const togglePreference = (preferenceId: string) => {
    const updatedPreferences = preferences.includes(preferenceId)
      ? preferences.filter((id) => id !== preferenceId)
      : [...preferences, preferenceId];
    setPreferences(updatedPreferences);
    if (userInfo) {
      const newUserinfo = { ...userInfo, interests: updatedPreferences };
      setDocument(`users/${userInfo?.id}`, newUserinfo, true);
      setChange(false);
      setUser(newUserinfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(newUserinfo));
    } // need
    // Update user's preferences in Firebase
    // updateUserPreferences(updatedPreferences); not implemented yet
  };

  /* const updateUserPreferences = (updatedPreferences) => {
      // Update user's preferences in Firebase
    }; */
  const [headerHeight, setHeaderHeight] = useState(0);
  const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => setHeaderHeight(event.nativeEvent.layout.height),
    []
  );
  return (
    <Tabs.Container
      minHeaderHeight={40}
      lazy
      // revealHeaderOnScroll={true}
      renderHeader={() => (
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
      )}
    >
      {/* / */}
      <Tabs.Tab name="Buyer" label="Buying History">
        <Tabs.ScrollView>
          <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
            {/* Buyer Information content */}
            <View style={styles.listingsToggleContainer}>
              <TouchableOpacity onPress={toggleActiveListings}>
                <View
                  style={[
                    styles.listingsToggleButton,
                    activeListingsSelected && styles.activeButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Active</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePastListings}>
                <View
                  style={[
                    styles.listingsToggleButton,
                    !activeListingsSelected && styles.activeButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Past</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="Seller" label="Selling History">
        <Tabs.ScrollView>
          <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
            {/* Seller Information content */}
            <View style={styles.listingsToggleContainer}>
              <TouchableOpacity onPress={toggleSellerActiveListings}>
                <View
                  style={[
                    styles.listingsToggleButton,
                    sellerActiveListingsSelected && styles.activeButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Active</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSellerPastListings}>
                <View
                  style={[
                    styles.listingsToggleButton,
                    !sellerActiveListingsSelected && styles.activeButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Past</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
    backgroundColor: "#007bff",
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
});