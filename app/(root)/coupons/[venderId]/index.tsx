import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../context";
import { useLocalSearchParams } from "expo-router";
import { fetchCoupons } from "../../../../firebase/db";
import { Coupon, CouponId, UserContextType, VenderId } from "../../../../types";
import { router } from "expo-router";
import CustomAlert from "../../../components/alert";

export default function VenderItem() {
  const { user, setCoupons, coupons } = useAuth() as UserContextType;
  const { venderId } = useLocalSearchParams<{ venderId: VenderId }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [currCoupons, setCurrCoupons] = useState<Coupon[]>([]);
  const [currCouponNav, setCurrCouponNav] = useState<CouponId | null>(null);
  const navigateToCoupon = useCallback(
    (couponId: CouponId) => {
      router.push({
        pathname: "/coupons/[venderId]/[couponId]",
        params: { venderId: venderId, couponId: couponId },
      });
    },
    [venderId]
  );
  // Assuming 'venderId' is passed as a parameter to this route
  useEffect(() => {
    if (!venderId) {
      console.error("No vender ID provided");
      return;
    }

    setLoading(true);
    fetchCoupons(venderId, setCoupons)
      .then((retrievedCoupons) => {
        setCurrCoupons(retrievedCoupons);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch coupons:", error);
        setLoading(false);
      });
  }, [venderId]);

  const onConfirm = useCallback(() => {
    if (currCouponNav) {
      navigateToCoupon(currCouponNav);
      setAlert(false);
    }
  }, [currCouponNav]);

  const renderCoupon = useCallback(
    ({ item }) => (
      <TouchableOpacity
        key={item.couponId}
        style={styles.couponCard}
        onPress={() => {
          setAlert(true);
          setCurrCouponNav(item.couponId);
        }}
      >
        <Image
          source={{ uri: item.couponImage }}
          style={styles.couponImage}
          resizeMode="contain" // Ensures the image is scaled to fit within the view without being cropped
          onError={(e) =>
            console.log(`Error loading image: ${e.nativeEvent.error}`)
          }
        />
        <Text style={styles.couponText}>{item.couponName}</Text>
      </TouchableOpacity>
    ),
    []
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={currCoupons}
        renderItem={renderCoupon}
        numColumns={2} // Ensures that the number of columns is set to 2
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "space-between",
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        ListEmptyComponent={<Text>No coupons available.</Text>}
      />
      <CustomAlert
        modalVisible={alert}
        setModalVisible={setAlert}
        textPrompt={
          "Please make sure you are within distance from the store. You will only have 10 minutes once you confirm"
        }
        onConfirm={onConfirm}
        onCancel={() => setAlert(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  couponCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: 175,
    alignItems: "center",
  },
  couponImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  couponText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
