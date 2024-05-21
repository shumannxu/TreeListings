import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../../context";
import { UserContextType, Vender } from "../../../types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* Search Result Screen */
export default function Search() {
  const { listings } = useAuth() as UserContextType;
  const safeAreaInsets = useSafeAreaInsets();
  const venders = [
    {
      venderId: "1",
      logo: "https://via.placeholder.com/150",
      venderName: "Poke House",
      coupons: ["Coup1", "Coup2"],
      categories: ["light", "quick"],
    },
    {
      venderId: "2",
      logo: "https://via.placeholder.com/150",
      venderName: "Palmetto SuperFoods",
      coupons: ["Coup1", "Coup2"],
      categories: ["dessert"],
    },
    {
      venderId: "3",
      logo: "https://via.placeholder.com/150",
      venderName: "BoiChik Bagels",
      coupons: ["Coup1", "Coup2"],
      categories: ["light", "quick"],
    },
    {
      venderId: "4",
      logo: "https://via.placeholder.com/150",
      venderName: "Penny Icecream",
      coupons: ["Coup1", "Coup2"],
      categories: ["dessert"],
    },
  ] as Vender[];

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
            {item.coupons.length}
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
        <TouchableOpacity
          onPress={navigateToPostCoupons}
          style={{
            height: 60,
            width: 60,
            backgroundColor: "#38B39C",
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="add-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
