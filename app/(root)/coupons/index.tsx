import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "../../../components/icon";
import { useAuth } from "../../../context";
import { UserContextType, Vender } from "../../../types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFilteredDocs } from "../../../firebase/db";

/* Search Result Screen */
export default function Search() {
  const safeAreaInsets = useSafeAreaInsets();
  const [venders, setVenders] = useState([]);
  getFilteredDocs("vender")
    .then((venders) => {
      setVenders(venders);
    })
    .catch((error) => {
      console.error("Error fetching vender documents:", error);
    });

  const navigateToCouponInfo = useCallback((venderId) => {
    router.push({
      pathname: "/coupons/couponInfo/",
      params: { id: venderId },
    });
  }, []);

  const navigateToPostCoupons = useCallback(() => {
    router.push("coupons/postCoupons");
  }, []);

  const renderCoupon = useCallback(
    ({ item }) => (
      <View
        style={{
          padding: 10,
          marginVertical: 5,
          backgroundColor: "#f9f9f9",
          borderRadius: 5,
          width: "30%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onTouchEnd={() => navigateToCouponInfo(item.id)}
      >
        <Text>{item.venderName}</Text>
        <Image
          source={{ uri: item.logo }}
          style={{
            width: 100,
            height: 100,
            marginVertical: 5,
            alignItems: "center",
          }}
        />
        <Text style={{ fontSize: 13, fontWeight: "bold" }}>
          {item.venderName}
        </Text>
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "#38B39C",
            borderRadius: 5,
            padding: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {item.numUniqueCoupons}
          </Text>
        </View>
      </View>
    ),
    []
  );

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, marginTop: safeAreaInsets.top + 10 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 30 }}>Coupons</Text>
      </View>

      <ScrollView
        horizontal
        scrollEnabled={true}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 0,
          marginBottom: 5,
          marginTop: 5,
          flexGrow: 1,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 25,
            backgroundColor: "#E6E6E6",
            marginRight: 10,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 17 }}>Recent </Text>
          <MaterialIcons name="access-time" size={24} color="#38B39C" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 25,
            backgroundColor: "#E6E6E6",
            marginRight: 10,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            Price Descending{" "}
          </Text>
          <MaterialCommunityIcons
            name="order-numeric-descending"
            size={24}
            color="#38B39C"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 25,
            backgroundColor: "#E6E6E6",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            Price Ascending{" "}
          </Text>
          <MaterialCommunityIcons
            name="order-numeric-ascending"
            size={24}
            color="#38B39C"
          />
        </TouchableOpacity>
      </ScrollView>

      <View
        style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}
      >
        <FlatList
          data={venders}
          renderItem={renderCoupon}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
        />
      </View>

      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
        }}
      >
        <View style={{ position: "absolute", right: -30, bottom: -20 }}>
          <TouchableOpacity
            style={styles.plusIconStyle}
            onPress={navigateToPostCoupons}
          >
            <Icon color={"white"} height={20} width={20}>
              pluspost
            </Icon>
            {<Text style={styles.postTextStyle}>Post Coupon</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imageStyle: {
    flex: 1,
    height: 75,
    width: 358.5,
    alignSelf: "center",
    margin: 20,
  },
  icon: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
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
    fontSize: 18,
  },
});
