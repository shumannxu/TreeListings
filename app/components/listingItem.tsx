import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Listing } from "../../types";
import {router} from "expo-router";

interface ItemProps {
  recommend: boolean;
  item: Listing
}

const ListingItem: React.FC<ItemProps> = ({ recommend, item }) => {

  const navigateToDetail = () => {
    router.push(`/detailitem?itemId=${item.listingId}`);
  };

  
  return (
    <View style={styles.container}>
      <TouchableOpacity
      onPress={navigateToDetail}
      >
          <Image source={{ uri: item.imagePath }} style={styles.image} />
      </TouchableOpacity>
      <Text>{item.title}</Text>
      <Text>{item.price}</Text>
      {recommend && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]}>
            <Text style={styles.buttonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]}>
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
  },
});

export default ListingItem;
