import { View, Text, Image} from "react-native";
import { Listing } from "../types";

export default function ListingItem({ item }: { item: Listing }) {
    // Convert datePosted to a Date object if it's not already one
    const datePosted = item.datePosted instanceof Date ? item.datePosted : new Date(item.datePosted);
  
    return (
        <View>
        <Image source={{ uri: item.imagePath }} style={{ width: 50, height: 50 }} />
        <Text>{item.title}</Text>
        <Text>{item.price}</Text>
        <Text>{datePosted.toISOString()}</Text>
        </View>
    );
}