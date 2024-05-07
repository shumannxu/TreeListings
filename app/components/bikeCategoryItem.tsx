import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { BikeCategoryType, Listing } from "../../types";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons if you haven't already
import { router } from "expo-router";
interface ItemProps {
  item: { label: string; value: BikeCategoryType };
}

const BikeCategoryItem: React.FC<ItemProps> = ({ item }) => {
  const navigateToDetail = () => {
    // router.push({
    //   pathname: "/detailitem/[listingId]",
    //   params: { listingId: item.listingId },
    // });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToDetail}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{
            uri:
              item.value === BikeCategoryType.ROAD
                ? "https://example.com/road_bike.jpg"
                : item.value === BikeCategoryType.SPORT
                ? "https://example.com/sport_bike.jpg"
                : item.value === BikeCategoryType.COMMUTER_URBAN
                ? "https://example.com/commuter_urban_bike.jpg"
                : item.value === BikeCategoryType.COMFORT
                ? "https://example.com/comfort_bike.jpg"
                : item.value === BikeCategoryType.FITNESS
                ? "https://example.com/fitness_bike.jpg"
                : item.value === BikeCategoryType.HYBRID
                ? "https://example.com/hybrid_bike.jpg"
                : item.value === BikeCategoryType.ELECTRIC
                ? "https://example.com/electric_bike.jpg"
                : "https://example.com/default_bike.jpg", // default image if none match
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.label}</Text>
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
    aspectRatio: 2 / 3,
    borderRadius: 10, // Rounded corners for the image
  },
  heartContainer: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  textContainer: {
    alignSelf: "center",
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

export default React.memo(BikeCategoryItem);
