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
import { CategoryType, Listing, UserContextType } from "../../types";
import { uploadListing } from "../../firebase/db";
import { useAuth } from "../../context";
import {
  CATEGORIES,
  BIKE_CATEGORIES,
  BIKE_BRANDS,
  BIKE_GENDER,
} from "../../constants";
import { router } from "expo-router";

export default function PostListings() {
  const { user } = useAuth() as UserContextType;
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState(CATEGORIES);
  const [open, setOpen] = useState(false);
  const [openMainDropdown, setOpenMainDropdown] = useState(false);
  const [openBikeCategory, setOpenBikeCategory] = useState(false);
  const [openBikeBrand, setOpenBikeBrand] = useState(false);
  const [openBikeGender, setOpenBikeGender] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bikeCategoryValue, setBikeCategoryValue] = useState([]);
  const [bikeBrandValue, setBikeBrandValue] = useState([]);
  const [bikeGenderValue, setBikeGenderValue] = useState([]);

  const [bikeCategoryItems, setBikeCategoryItems] = useState(BIKE_CATEGORIES);
  const [bikeBrandItems, setBikeBrandItems] = useState(BIKE_BRANDS);
  const [bikeGenderItems, setBikeGenderItems] = useState(BIKE_GENDER);

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

  const handleImagePicked = async (pickerResult: ImagePickerResult) => {
    try {
      if (!pickerResult.canceled) {
        // const uploadUrl = await uploadImageAsync(pickerResult.assets[0]?.uri);
        setImage(pickerResult.assets[0]?.uri);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
    }
  };

  const handleDropdownToggle = (dropdown) => {
    setOpenMainDropdown(
      dropdown === "main" ? (prevState) => !prevState : false
    );
    setOpenBikeCategory(
      dropdown === "bikeCategory" ? (prevState) => !prevState : false
    );
    setOpenBikeBrand(
      dropdown === "bikeBrand" ? (prevState) => !prevState : false
    );
    setOpenBikeGender(
      dropdown === "bikeGender" ? (prevState) => !prevState : false
    );
  };

  const uploadListingToFirestore = useCallback(async () => {
    if (user) {
      if (!image) {
        setError("Please include an image or photo");
      } else if (!title) {
        setError("Please include a title");
      } else if (!price) {
        setError("Please include a price");
      } else if (categories.length == 0) {
        setError("Please include at least 1 category");
      } else {
        setLoading(true);
        uploadListing({
          title,
          description,
          price: parseFloat(price),
          categories,
          image,
          sellerId: user.id,
          datePosted: new Date(),
          isListingActive: true,
        }).then(() => {
          setLoading(false);
          setTitle("");
          setCategories([]);
          setPrice("");
          setDescription("");
          setImage(null);
          setError(null);
          router.replace("/home");
          let toast = Toast.show("Listing Successfully Posted", {
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
        });
      }
    }
  }, [user, title, price, description, categories, image]);

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
          {image ? (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImage}
            >
              <Image source={{ uri: image }} style={styles.imagePreview} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={takePhoto}
            >
              <Entypo name="camera" size={48} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            <Entypo name="folder-images" size={48} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.header}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand, model, color, size, etc."
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View>
          <Text style={styles.header}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <KeyboardAvoidingView>
          <Text style={styles.header}>Description</Text>
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="i.e slightly used, "
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </KeyboardAvoidingView>
        <View style={{ zIndex: openMainDropdown ? 2 : 1 }}>
          <DropDownPicker
            style={styles.dropdown}
            listMode="SCROLLVIEW"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
            multiple={true}
            min={1}
            max={8}
            // searchable={true}
            open={openMainDropdown}
            value={categories}
            items={items}
            setOpen={() => handleDropdownToggle("main")}
            setValue={setCategories}
            setItems={setItems}
            placeholder={"Category"}
          />
        </View>
        {categories.includes("BIKE") && (
          <View style={{ zIndex: openBikeCategory ? 2 : 1 }}>
            <DropDownPicker
              style={[styles.dropdown, styles.additionalDropdown]}
              listMode="SCROLLVIEW"
              mode="BADGE"
              badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
              multiple={true}
              min={1}
              max={8}
              open={openBikeCategory}
              value={bikeCategoryValue}
              items={bikeCategoryItems}
              setOpen={() => handleDropdownToggle("bikeCategory")}
              setValue={setBikeCategoryValue}
              setItems={setBikeCategoryItems}
              placeholder={"Bike Category"}
            />
          </View>
        )}
        {categories.includes("BIKE") && (
          <View style={{ zIndex: openBikeBrand ? 2 : 1 }}>
            <DropDownPicker
              style={[styles.dropdown, styles.additionalDropdown]}
              listMode="SCROLLVIEW"
              mode="BADGE"
              badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
              multiple={true}
              min={1}
              max={8}
              open={openBikeBrand}
              value={bikeBrandValue}
              items={bikeBrandItems}
              setOpen={() => handleDropdownToggle("bikeBrand")}
              setValue={setBikeBrandValue}
              setItems={setBikeBrandItems}
              placeholder={"Bike Brand"}
            />
          </View>
        )}
        {categories.includes("BIKE") && (
          <View style={{ zIndex: openBikeGender ? 2 : 1 }}>
            <DropDownPicker
              style={[styles.dropdown, styles.additionalDropdown]}
              listMode="SCROLLVIEW"
              mode="BADGE"
              badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
              multiple={true}
              min={1}
              max={8}
              open={openBikeGender}
              value={bikeGenderValue}
              items={bikeGenderItems}
              setOpen={() => handleDropdownToggle("bikeGender")}
              setValue={setBikeGenderValue}
              setItems={setBikeGenderItems}
              placeholder={"Bike Gender"}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={uploadListingToFirestore}
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
  imageUploadText: {
    color: "#000",
    fontSize: 18,
  },
  input: {
    height: 50,
    borderColor: "#e7e7e7",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    borderColor: "#e7e7e7",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  additionalDropdown: {
    marginTop: 10, // Add some space between dropdowns
  },
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  description: {
    height: 100,
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
  imagePreview: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  loadingContainer: {
    top: 0, // Align to the top of the parent container
    left: 0, // Align to the left of the parent container
    right: 0, // Stretch to the right of the parent container
    bottom: 0,
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
  },
  error: {
    marginTop: 10,
    alignSelf: "flex-end",
    color: "red",
  },
});
