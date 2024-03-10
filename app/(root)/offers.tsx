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
  Image,
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
      <Text style={styles.headingStyle}>Offer Status</Text>
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
          <View style={{ alignItems: "center" }} >
          <Image style={styles.icon} source={require("./profile/sadtreeicon.png")} />
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            No Incoming Offers yet{" "}
          </Text>
          </View>
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
          <View style={{ alignItems: "center" }} >
          <Image style={styles.icon} source={require("./profile/sadtreeicon.png")} />
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            No Outgoing Offers yet{" "}
          </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headingStyle: {
    fontSize: 35,
    fontWeight: "bold",
    margin: 20,
    color: "#2F9C95"
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#38B39C",
    margin: 10
  },
  icon: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
});
