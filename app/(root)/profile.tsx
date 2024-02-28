import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signOutUser } from "../../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context";
import { User, UserContextType } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/icon";
import { setDocument } from "../../firebase/db";
import { Tabs } from "react-native-collapsible-tab-view";
import { CATEGORIES } from "../../constants";

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
  const [preferences, setPreferences] = useState(user?.preferences || []);
  const [isUserInformationExpanded, setIsUserInformationExpanded] =
    useState(true);
  const [isSellerInformationExpanded, setIsSellerInformationExpanded] =
    useState(false);
  const [isBuyerInformationExpanded, setIsBuyerInformationExpanded] =
    useState(false);
  const [activeListingsSelected, setActiveListingsSelected] = useState(true); // For buyer and seller active/past toggle
  const [sellerActiveListingsSelected, setSellerActiveListingsSelected] =
    useState(true); // For seller active/past toggle
  const [selectedTab, setSelectedTab] = useState<"user" | "buyer" | "seller">(
    "user"
  );

  const toggleUserInformation = () => {
    if (isUserInformationExpanded) {
      return;
    }
    setIsUserInformationExpanded(true);
    setIsBuyerInformationExpanded(false);
    setIsSellerInformationExpanded(false);
    setSelectedTab("user");
  };

  const toggleBuyerInformation = () => {
    if (isBuyerInformationExpanded) {
      return;
    }
    setIsBuyerInformationExpanded(true);
    setIsUserInformationExpanded(false);
    setIsSellerInformationExpanded(false);
    setSelectedTab("buyer");
  };

  const toggleSellerInformation = () => {
    if (isSellerInformationExpanded) {
      return;
    }
    setIsSellerInformationExpanded(true);
    setIsUserInformationExpanded(false);
    setIsBuyerInformationExpanded(false);
    setSelectedTab("seller");
  };
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
      setDocument(`users/${userInfo?.id}`, userInfo, true);
      setChange(false);
      setUser(userInfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    } // need to implement storing user preferences into firebase
  };

  const togglePreference = (preferenceId) => {
    const updatedPreferences = preferences.includes(preferenceId)
      ? preferences.filter((id) => id !== preferenceId)
      : [...preferences, preferenceId];
    setPreferences(updatedPreferences);
    // Update user's preferences in Firebase
    // updateUserPreferences(updatedPreferences); not implemented yet
  };

  /* const updateUserPreferences = (updatedPreferences) => {
    // Update user's preferences in Firebase
  }; */

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top,
        ...styles.container,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon color={"#664147"} height={30} style={{ marginHorizontal: 10 }}>
          profile
        </Icon>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            letterSpacing: 1,
            color: "#664147",
            maxWidth: width * 0.95,
          }}
        >
          {userInfo?.fullName}&apos;s Dashboard
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleUserInformation}>
          <View
            style={[
              styles.button,
              selectedTab == "user" &&
                isUserInformationExpanded &&
                styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>User Info</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleBuyerInformation}>
          <View
            style={[
              styles.button,
              selectedTab == "buyer" &&
                isBuyerInformationExpanded &&
                styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>Buyer Info</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSellerInformation}>
          <View
            style={[
              styles.button,
              selectedTab == "seller" &&
                isSellerInformationExpanded &&
                styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>Seller Info</Text>
          </View>
        </TouchableOpacity>
      </View>

      {selectedTab === "user" && isUserInformationExpanded && (
        <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
          {/* User Information content */}
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>First name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Input your first name"
              value={userInfo?.firstName}
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, firstName: text });
                setChange(true);
              }}
            />
            <TouchableOpacity onPress={saveChanges}>
              <Icon color={"black"} height={20}>
                edit
              </Icon>
            </TouchableOpacity>
          </View>

          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Last name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Input your last name"
              value={userInfo?.lastName}
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, lastName: text });
                setChange(true);
              }}
            />
            <TouchableOpacity onPress={saveChanges}>
              <Icon color={"black"} height={20}>
                edit
              </Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Input your username"
              value={userInfo?.username}
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, username: text });
                setChange(true);
              }}
            />
            <TouchableOpacity onPress={saveChanges}>
              <Icon color={"black"} height={20}>
                edit
              </Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Phone:</Text>
            <TextInput
              style={styles.input}
              placeholder="Input your phone number"
              value={userInfo?.phone}
              inputMode="numeric"
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, phone: text });
                setChange(true);
              }}
            />
            <TouchableOpacity onPress={saveChanges}>
              <Icon color={"black"} height={20}>
                edit
              </Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Input your email"
              value={userInfo?.email}
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, email: text });
                setChange(true);
              }}
            />
            <TouchableOpacity onPress={saveChanges}>
              <Icon color={"black"} height={20}>
                edit
              </Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Buyer Rating:</Text>
            <Text style={styles.textSecond}> {userInfo?.buyerRating}</Text>
          </View>
          <View style={styles.userInformationContainer}>
            <Text style={styles.textFirst}>Seller Rating:</Text>
            <Text style={styles.textSecond}> {userInfo?.sellerRating}</Text>
          </View>
          {/* User Preferences */}
          <Text style={styles.textFirst}>My Preferences:</Text>
          <View style={styles.userPreferencesContainer}>
            {preferencesData.map((preference) => (
              <TouchableOpacity
                key={preference.id}
                style={[
                  styles.preferenceButton,
                  preferences.includes(preference.id) &&
                    styles.selectedPreference,
                ]}
                onPress={() => togglePreference(preference.id)}
              >
                <Text style={styles.preferenceText}>{preference.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Add buttons for other preferences */}
          </View>
        </View>
      )}

      {selectedTab === "buyer" && isBuyerInformationExpanded && (
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
      )}

      {selectedTab === "seller" && isSellerInformationExpanded && (
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
      )}

      <Button onPress={handleLogout} title="Sign Out" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
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
