import React, {useCallback, useEffect, useState} from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    RefreshControl,
  } from "react-native";

import {getAllOffersForUser} from "../../firebase/db";
import {Listing, ListingId, Offer, UserContextType} from "../../types";
import { useAuth } from "../../context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OfferItem from "../components/offerItem";


export default function offers() {
    const { user, setUser, listings, setListings } = useAuth() as UserContextType;
    const [offers, setOffers] = useState<{ [id: ListingId]: Offer } | null>();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchOffers = async () => {
            if (!user) {
                return;
            }
            const offers = await getAllOffersForUser(user.id);
            setOffers(offers);
        };
        fetchOffers();
    }, []);

    const onRefresh = useCallback(async () => {
        if (user) {
          setRefreshing(true);
          const newOffers = await getAllOffersForUser(user.id);
          setOffers(newOffers);
          setRefreshing(false);
        }
      }, [user]);

    const renderItem= useCallback(
        ({ item }: { item: Offer }) => <OfferItem item={item} />,
        []
    );

    return (
    <View style={{ flex: 1, marginTop: insets.top }}>
        <FlatList
        ListHeaderComponent={
            <Text style={styles.textStyle}>Offers</Text>
            }
          data={offers ? Object.values(offers) : []}
          renderItem={renderItem}
          initialNumToRender={5}
          keyExtractor={(item) => item.offerId}
          contentContainerStyle={{
            paddingLeft: insets.left + 20,
            paddingRight: insets.right + 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#B0DCC5"]} 
              tintColor={"#B0DCC5"} 
            />
          }
          ListEmptyComponent={
            <Text style={{ alignSelf: "center", fontSize: 30, marginTop: 20 }}>No Offers yet </Text>
          }
        />
      </View>
    )
}

const styles = StyleSheet.create({
    textStyle: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });