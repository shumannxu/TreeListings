/* listingItem.tsx , but for the usage of search results */

import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { Listing, User, UserId } from "../../types";
import getTimeAgo from "./getTimeAgo";
import { getUserProfile } from "../../firebase/db";

interface ItemProps {
  item: Listing;
}

const SearchItem: React.FC<ItemProps> = ({ item }) => {
  const userId = item.sellerId;
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      setLoading(false);
    };
    fetchUserProfile();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imagePath }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.username}>
            {userProfile?.fullName ?? "Name 1"}
          </Text>
          <Text style={styles.rating}> {userProfile?.sellerRating ?? 5.0}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.time}>{getTimeAgo(item.datePosted)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomWidth: 1, // Add border bottom
    borderColor: "#DCDCDC", // Border color
    paddingBottom: 10, // Padding at the bottom to separate items
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  username: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
  },
  rating: {
    fontSize: 14,
    color: "#66BB6A",
    fontWeight: "bold",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  time: {
    color: "#888",
  },
});

export default SearchItem;
