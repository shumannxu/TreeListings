import { useState } from "react";
import { View, Text } from "react-native";

export default function PostListings() {
  const [listings, setListings] = useState([]);
  return (
    <View>
      <Text>Post listings screen</Text>
    </View>
  );
}
