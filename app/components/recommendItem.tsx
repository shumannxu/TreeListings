import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Listing } from "../../types";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface ItemProps {
  item: Listing;
}

const RecommendItem: React.FC<ItemProps> = ({ item }) => {
  const [liked, setLiked] = useState<boolean>(false);
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
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.description}>
          {item.description}
        </Text>
        <Text style={styles.price}>{`$${item.price}`}</Text>
      </View>
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => setLiked(!liked)}
      >
        <MaterialCommunityIcons
          name={liked ? "tree" : "tree-outline"}
          size={28}
          color="#3ac981"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFBF4",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    elevation: 1, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 1 }, // for iOS shadow
    shadowOpacity: 0.22, // for iOS shadow
    shadowRadius: 2.22, // for iOS shadow
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden", // this ensures the image does not bleed outside the border radius
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  heartButton: {
    padding: 20,
  },
  buttonText: {
    color: "#fff",
  },
});

export default RecommendItem;
