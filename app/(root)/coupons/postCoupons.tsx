import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryType, Listing, UserContextType } from "../../../types";
import { uploadListing, uploadCoupon } from "../../../firebase/db";
import { useAuth } from "../../../context";
import { router } from "expo-router";
import Icon from "../../../components/icon";

export default function PostCoupons() {
  const { user } = useAuth() as UserContextType;
  const [loading, setLoading] = useState<boolean>(false);
  const [couponName, setCouponName] = useState("");
  const [couponImage, setCouponImage] = useState<string[] | null>([]);
  const [numberOfCoupons, setNumberOfCoupons] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.getCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        const { status: newCameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (newCameraStatus !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }

      const { status: mediaLibraryStatus } =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      if (mediaLibraryStatus !== "granted") {
        const { status: newMediaLibraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newMediaLibraryStatus !== "granted") {
          alert("Sorry, we need media library permissions to make this work!");
        }
      }
    })();
  }, []);

  const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    handleImagePicked(pickerResult);
  };

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      if (!pickerResult.canceled) {
        let newImage = pickerResult.assets[0]?.uri;
        if (newImage) {
          setCouponImage(newImage);
        }
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    }
  };

  // function to upload coupon info to firestore (via uploadCoupon from db.ts)
  const uploadCouponToFirestore = useCallback(async () => {
    if (user) {
      if (!couponImage) {
        setError("Please include a logo or photo");
      } else if (!couponName) {
        setError("Please include a coupon name");
      } else if (!numberOfCoupons) {
        setError("Please include the number of available coupons");
      } else {
        setLoading(true);
        uploadCoupon({
          couponName,
          couponImage,
          numberOfCoupons: parseFloat(numberOfCoupons),
        }).then(() => {
          setLoading(false);
          setCouponName("");
          setCouponImage(null);
          setNumberOfCoupons(0);
          setError(null);
          router.replace("/home");
          let toast = Toast.show("Coupon Successfully Posted", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setTimeout(() => {
            Toast.hide(toast);
          }, 1500);
        });
      }
    }
  }, [user, couponName, couponImage, numberOfCoupons]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={takePhoto}
          >
            <Entypo name="camera" size={48} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            <Entypo name="folder-images" size={48} color="black" />
          </TouchableOpacity>
        </View>
        {couponImage && (
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: couponImage }} style={styles.imagePreview} />
          </View>
        )}
        <View>
          <Text style={styles.header}>Coupon Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Coupon Name"
            value={couponName}
            onChangeText={setCouponName}
          />
        </View>
        <View>
          <Text style={styles.header}>Maximum Number of Coupons</Text>
          <TextInput
            style={styles.input}
            placeholder="Maximum Number"
            keyboardType="numeric"
            value={numberOfCoupons}
            onChangeText={setNumberOfCoupons}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={uploadCouponToFirestore}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
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
    height: 150,
    width: 150,
    borderRadius: 5,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#e7e7e7",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  postButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
  },
});
