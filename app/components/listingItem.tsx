import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Listing } from "../../types";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons if you haven't already
import { router } from "expo-router";
interface ItemProps {
  item: Listing;
}

const ListingItem: React.FC<ItemProps> = ({ item }) => {
  const navigateToDetail = () => {
    router.push({
      pathname: "/detailitem/[listingId]",
      params: { listingId: item.listingId },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToDetail}>
      <View style={styles.imageContainer}>
        <Image source={{
           uri: item.imagePath || (item.imagesPath && item.imagesPath.length > 0 ? item.imagesPath[0] : 'https://firebasestorage.googleapis.com/v0/b/treelistings.appspot.com/o/Screenshot%202024-05-06%20at%204.02.47%E2%80%AFPM.png?alt=media&token=6a0b9378-cce8-4b60-886a-9ba4ea391ea6')
          }} style={styles.image} />
        <TouchableOpacity style={styles.touchableHeart}>
          <View style={styles.heartContainer}>
            <Ionicons name="heart-outline" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>{`$${item.price}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140, 
    margin: 10,
    borderRadius: 10,
    overflow: "hidden", 
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10, // Rounded corners for the image
  },
  heartContainer: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#CFB284",
  },
  buttonText: {
    color: "#fff",
  },
  touchableHeart: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "transparent",
  },
});

export default React.memo(ListingItem);
