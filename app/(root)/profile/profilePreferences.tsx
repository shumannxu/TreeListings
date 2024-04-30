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
import { Slider } from "@react-native-community/slider";
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
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(8);
  const [bikeGender, setBikeGender] = useState("Male");
  const [bikeTypes, setBikeTypes] = useState<string[]>([]);

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

  const handleSliderChange = (value: number) => {
    const feet = Math.floor(value);
    const inches = Math.round((value - feet) * 12);
    setHeightFeet(feet);
    setHeightInches(inches);
  };

  const handleBikeGenderChange = (gender: string) => {
    setBikeGender(gender);
  };

  const toggleBikeType = (type: string) => {
    const updatedTypes = bikeTypes.includes(type)
      ? bikeTypes.filter((t) => t !== type)
      : [...bikeTypes, type];
    setBikeTypes(updatedTypes);
  };

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: width * 0.1,
        marginTop: safeAreaInsets.top,
      }}
    >
      <Text style={styles.textFirst}>My Preferences:</Text>
      <View style={styles.userPreferencesContainer}>
        {preferencesData.map((preference) => (
          <TouchableOpacity
            key={preference.id}
            style={[
              styles.preferenceButton,
              preferences.includes(preference.id) && styles.selectedPreference,
            ]}
            onPress={() => togglePreference(preference.id)}
          >
            <Text style={styles.preferenceText}>{preference.label}</Text>
          </TouchableOpacity>
        ))}
        <Text>Height: {heightFeet}' {heightInches}"</Text>
{/*         <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={3}
          maximumValue={7}
          step={0.1}
          value={(heightFeet - 3) + heightInches / 12}
          onValueChange={handleSliderChange}
        /> */}
        <Text style={styles.textFirst}>Bike Gender:</Text>
        <View style={styles.userPreferencesContainer}>
          <TouchableOpacity
            style={[
              styles.bikeGenderButton,
              bikeGender === "Male" && styles.selectedGenderButton,
            ]}
            onPress={() => handleBikeGenderChange("Male")}
          >
            <Text style={styles.preferenceText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bikeGenderButton,
              bikeGender === "Female" && styles.selectedGenderButton,
            ]}
            onPress={() => handleBikeGenderChange("Female")}
          >
            <Text style={styles.preferenceText}>Female</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textFirst}>Bike Types:</Text>
        <View style={styles.userPreferencesContainer}>
          {["Mountain", "Hybrid", "Road", "Electric", "Single Speed"].map(
            (type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.bikeTypeButton,
                  bikeTypes.includes(type) && styles.selectedTypeButton,
                ]}
                onPress={() => toggleBikeType(type)}
              >
                <Text style={styles.preferenceText}>{type}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
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
  bikeGenderButton: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 3,
    borderRadius: 50,
  },
  selectedGenderButton: {
    backgroundColor: "#2F9C95",
  },
  bikeTypeButton: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 3,
    borderRadius: 50,
  },
  selectedTypeButton: {
    backgroundColor: "#2F9C95",
  },
});
