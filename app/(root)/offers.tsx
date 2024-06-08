import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  SectionList,
  StyleSheet,
  RefreshControl,
  Image,
  SafeAreaView,
  StatusBar
} from "react-native";
import { createOfferListener, getAllIncomingOffersUser, getAllOutgoingOffersUser } from "../../firebase/db";
import { Offer, UserContextType } from "../../types";
import { useAuth } from "../../context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OfferItem from "../components/offerItem";
import { useGlobalSearchParams, router } from "expo-router";
import { MainText } from "../../components/text";
import TopNav from "../../components/topNav";
import SubTopNav from "../../components/subTopNav";

export default function Offers() {
  const { user, outgoingOffers, setOutgoingOffers, incomingOffers, setIncomingOffers } = useAuth() as UserContextType;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const sectionListRef = useRef<SectionList>(null);
  const { section } = useGlobalSearchParams();

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

  const navigateToPreference = useCallback(() => {
    router.push("/preferenceSurvey");
  }, []);

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

  useEffect(() => {
    if (section) {
      const sectionIndex = section === "incoming" ? 0 : 1;
      sectionListRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
      });
    }
  }, [section]);

  const getItemLayout = (data, index) => ({
    length: 100, // approximate height of each item
    offset: 120 * index,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: info.index,
        itemIndex: 0,
        animated: true,
      });
    });
  };

  const renderIncoming = useCallback(
    ({ item }: { item: Offer }) => <OfferItem item={item} type={"incoming"} />,
    []
  );

  const renderOutgoing = useCallback(
    ({ item }: { item: Offer }) => <OfferItem item={item} type={"outgoing"} />,
    []
  );

  const ListEmptyComponent = useCallback(
    ({ section }: { section: { emptyMessage: string; data: any[] } }) => {
      if (section.data.length === 0) {
        return (
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.icon}
              source={require("../../assets/sadtreeicon.png")}
            />
            <Text style={{ alignSelf: "center", fontSize: 20 }}>
              {section.emptyMessage}
            </Text>
          </View>
        );
      }
      return null;
    },
    [outgoingOffers, incomingOffers]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00BF63" }}>
      <StatusBar backgroundColor="#00BF63" barStyle="dark-content" />
      <TopNav backgroundColor="#00BF63" iconColor="white" />
      {/* <Button onPress={navigateToPreference} title="Navigate" /> */}
      <View style={{ flex: 1, backgroundColor: '#FFF6EC' }}>
      <SubTopNav title="Offer Status" showSearchIcon={false} />
      <SectionList
        ref={sectionListRef}
        sections={[
          {
            title: "Incoming Offers",
            data: incomingOffers,
            renderItem: renderIncoming,
            emptyMessage: "No Incoming Offers yet",
          },
          {
            title: "Outgoing Offers",
            data: outgoingOffers,
            renderItem: renderOutgoing,
            emptyMessage: "No Outgoing Offers yet",
          },
        ]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item) => item.offerId}
        initialNumToRender={10}
        renderSectionHeader={({ section }) => (
          <MainText style={ styles.textStyle } color={"#38B39C"}>{section.title}</MainText>
        )}
        renderSectionFooter={ListEmptyComponent}
        renderItem={({ item, section }) => section.renderItem({ item })}
        contentContainerStyle={{
          paddingLeft: insets.left + 20,
          paddingRight: insets.right + 20,
        }}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#B0DCC5"]}
            tintColor={"#B0DCC5"}
          />
        }
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headingStyle: {
    fontSize: 35,
    fontWeight: "bold",
    margin: 20,
    color: "#2F9C95",
  },
  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20
  },
  icon: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
  },
});
