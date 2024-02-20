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
import { User } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/icon";
import { setDocument } from "../../firebase/db";
import { collection, doc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

const preferencesData = [
  { id: "ELECT", label: "Electronics" },
  { id: "PROP_RENT", label: "Property Rentals" },
  { id: "APRL", label: "Apparel" },
  { id: "ENT", label: "Entertainment" },
  { id: "FAM", label: "Family" },
  { id: "FREE", label: "Free Stuff" },
  { id: "GARD_OUT", label: "Garden & Outdoor" },
  { id: "HOB", label: "Hobbies" },
  { id: "HOME", label: "Home Goods" },
  { id: "MI", label: "Musical Instruments" },
  { id: "OFF_SUP", label: "Office Supplies" },
  { id: "PET_SUP", label: "Pet Supplies" },
  { id: "SPORT", label: "Sporting Goods" },
  { id: "TOYS", label: "Toys & Games" },
  { id: "SERV", label: "Services" },
];

export default function Profile() {
  const { user, setUser } = useAuth();
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

  const toggleUserInformation = () => {
    setIsUserInformationExpanded(!isUserInformationExpanded);
  };

  const toggleBuyerInformation = () => {
    setIsBuyerInformationExpanded(!isBuyerInformationExpanded);
  };

  const toggleSellerInformation = () => {
    setIsSellerInformationExpanded(!isSellerInformationExpanded);
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
      <TouchableOpacity onPress={toggleUserInformation}>
        <View style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {isUserInformationExpanded
              ? "Collapse User Information"
              : "Expand User Information"}
          </Text>
        </View>
      </TouchableOpacity>
      {isUserInformationExpanded && (
        <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
          {change && (
            <TouchableOpacity
              onPress={saveChanges}
              style={{
                backgroundColor: "#2F9C95",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.textFirst, { color: "white" }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          )}

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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
          <Text style={styles.textFirst}>User Preferences:</Text>
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
      <TouchableOpacity onPress={toggleBuyerInformation}>
        <View style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {isBuyerInformationExpanded
              ? "Collapse Buyer Information"
              : "Expand Buyer Information"}
          </Text>
        </View>
      </TouchableOpacity>

      {isBuyerInformationExpanded && (
        <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
          {/* Buyer Information content */}
        </View>
      )}
      <TouchableOpacity onPress={toggleSellerInformation}>
        <View style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {isSellerInformationExpanded
              ? "Collapse Seller Information"
              : "Expand Seller Information"}
          </Text>
        </View>
      </TouchableOpacity>

      {isSellerInformationExpanded && (
        <View style={{ width: "100%", paddingHorizontal: width * 0.1 }}>
          {/* Seller Information content */}
        </View>
      )}
      <Button onPress={handleLogout} title="Sign Out" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
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
    margin: 2,
    borderRadius: 10,
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
  expandButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
