import React, { useCallback, useEffect, useState } from "react";
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

import {
  createOfferListener,
  getAllIncomingOffersUser,
  getAllOutgoingOffersUser,
} from "../../firebase/db";
import { Listing, ListingId, Offer, UserContextType } from "../../types";
import { useAuth } from "../../context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OfferItem from "../components/offerItem";

export default function Offers() {
  const {
    user,
    outgoingOffers,
    setOutgoingOffers,
    incomingOffers,
    setIncomingOffers,
  } = useAuth() as UserContextType;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (user) {
      setRefreshing(true);
      const outgoing = await getAllOutgoingOffersUser(user.id);
      const incoming = await getAllIncomingOffersUser(user.id);
      setOutgoingOffers(Object.values(outgoing));
      setIncomingOffers(Object.values(incoming));
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const unsubscribe = createOfferListener({
        setOutgoingOffers,
        setIncomingOffers,
        userId: user.id,
      });
      return () => unsubscribe();
    }
  }, [user]);

  const renderIncoming = useCallback(
    ({ item }: { item: Offer }) => <OfferItem item={item} type={"incoming"} />,
    []
  );

  const renderOutgoing = useCallback(
    ({ item }: { item: Offer }) => <OfferItem item={item} type={"outgoing"} />,
    []
  );
  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <FlatList
        ListHeaderComponent={
          <Text style={styles.textStyle}>Incoming Offers</Text>
        }
        data={incomingOffers}
        renderItem={renderIncoming}
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
          <Text style={{ alignSelf: "center", fontSize: 30, marginTop: 20 }}>
            No Incoming Offers yet{" "}
          </Text>
        }
      />
      <FlatList
        ListHeaderComponent={
          <Text style={styles.textStyle}>Outgoing Offers</Text>
        }
        data={outgoingOffers}
        renderItem={renderOutgoing}
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
          <Text style={{ alignSelf: "center", fontSize: 30, marginTop: 20 }}>
            No Outgoing Offers yet{" "}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
