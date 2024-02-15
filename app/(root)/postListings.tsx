import React, { useEffect, useState } from "react";
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
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import { uploadImageAsync } from "../../firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryType, Listing } from "../../types";
import { uploadListing } from "../../firebase/db";
import { useAuth } from "../../context";
import { CATEGORIES } from "../../constants";
import { router } from "expo-router";

export default function PostListings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState(CATEGORIES);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  const uploadListingToFirestore = async () => {
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
      router.replace("/home");
    });
  };

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
          {image && (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImage}
            >
              <Image source={{ uri: image }} style={styles.imagePreview} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            <Text style={styles.imageUploadText}>Add Images</Text>
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
        <DropDownPicker
          style={styles.dropdown}
          listMode="SCROLLVIEW"
          mode="BADGE"
          badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
          multiple={true}
          min={1}
          max={4}
          // searchable={true}
          open={open}
          value={categories}
          items={items}
          setOpen={setOpen}
          setValue={setCategories}
          setItems={setItems}
          placeholder={"Category"}
        />
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
});
