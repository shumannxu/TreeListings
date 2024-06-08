import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "../../../components/icon";
import { HeaderText, MainText } from "../../../components/text";
import { useAuth } from "../../../context";
import { UserContextType, Vender } from "../../../types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getVenders } from "../../../firebase/db";
import TopNav from "../../../components/topNav";
import SubTopNav from "../../../components/subTopNav";

export default function Coupon() {
  const { listings } = useAuth() as UserContextType;
  const safeAreaInsets = useSafeAreaInsets();
  const [venders, setVenders] = useState<Vender[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const extractVenderData = async () => {
    const venders = await getVenders();
    if (venders) setVenders(venders);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await extractVenderData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    extractVenderData();
  }, []);

  const navigateToVender = useCallback((item) => {
    router.push({
      pathname: "/coupons/[venderId]",
      params: { venderId: item.venderId },
    });
  }, []);

  const navigateToPostCoupons = useCallback(() => {
    router.push("coupons/postCoupons");
  }, []);

  const renderCoupon = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.couponContainer}
        onPress={() => navigateToVender(item)}
      >
        <Image source={{ uri: item.logo }} style={styles.couponImage} />
        <MainText style={styles.couponText} color="black">
          {item.venderName}
        </MainText>
        <View style={styles.couponBadge}>
          <MainText style={styles.couponBadgeText} color={"white"}>
            {(item.coupons ?? []).length}
          </MainText>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00BF63" }}>
      <StatusBar backgroundColor="#00BF63" barStyle="dark-content" />
      <TopNav backgroundColor="#00BF63" iconColor="white" />
      <View style={{ flex: 1, backgroundColor: "#FFF6EC" }}>
        <SubTopNav title="Coupons" showSearchIcon={true} />
        <View style={styles.contentContainer}>
          {/* <ScrollView
            horizontal
            scrollEnabled={true}
            contentContainerStyle={styles.scrollViewContent}
            showsHorizontalScrollIndicator={false}
          >
            <FilterButton text="Recent" icon={<MaterialIcons name="access-time" size={24} color="#38B39C" />} useMainText />
            <FilterButton text="Price Descending" icon={<MaterialCommunityIcons name="order-numeric-descending" size={24} color="#38B39C" />} useMainText />
            <FilterButton text="Price Ascending" icon={<MaterialCommunityIcons name="order-numeric-ascending" size={24} color="#38B39C" />} useMainText />
            <FilterButton text="Distance" icon={<MaterialCommunityIcons name="order-numeric-ascending" size={24} color="#38B39C" />} useMainText />
          </ScrollView> */}
          <FlatList
            style={{ paddingTop: 10 }}
            data={venders}
            renderItem={renderCoupon}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.flatListColumn}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#B0DCC5"]}
                tintColor="#B0DCC5"
              />
            }
          />
        </View>
      </View>
      {/* <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.plusIconStyle} onPress={navigateToPostCoupons}>
          <Icon color="white" height={20} width={20}>pluspost</Icon>
          <MainText style={styles.postTextStyle} color={"white"}>Post Coupon</MainText>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const FilterButton = ({ text, icon, useMainText = false }) => (
  <TouchableOpacity style={styles.filterButton}>
    {useMainText ? (
      <MainText style={styles.filterButtonText} color="black">
        {text}{" "}
      </MainText>
    ) : (
      <Text style={styles.filterButtonText}>{text} </Text>
    )}
    {icon}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00BF63",
  },
  headerText: {
    marginHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF6EC",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#DEF4D9",
    marginRight: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  filterButtonText: {
    textAlign: "center",
    fontSize: 17,
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContent: {
    justifyContent: "space-between",
  },
  flatListColumn: {
    justifyContent: "space-between",
    padding: 10,
  },
  floatingButtonContainer: {
    position: "absolute",
    right: 5,
    bottom: 20,
  },
  plusIconStyle: {
    position: "absolute",
    right: 22,
    bottom: 25,
    padding: 10,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38B39C",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTextStyle: {
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  couponContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  couponImage: {
    width: 100,
    height: 100,
    marginVertical: 5,
    alignItems: "center",
  },
  couponText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  couponBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    height: 30,
    width: 30,
    backgroundColor: "#38B39C",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  couponBadgeText: {
    color: "#fff",
    fontSize: 15,
  },
});
