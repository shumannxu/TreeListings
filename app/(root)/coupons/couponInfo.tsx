import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context";
import { useLocalSearchParams } from "expo-router";
import { fetchCoupons } from "../../../firebase/db";
export default function CouponInfo() {
  const { user } = useAuth();
  const route = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // Assuming 'venderId' is passed as a parameter to this route
  const venderId = route.id;
  useEffect(() => {
    if (!venderId) {
      console.error("No vender ID provided");
      return;
    }

    setLoading(true);
    fetchCoupons(venderId)
      .then((coupons) => {
        setCoupons(coupons[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch coupons:", error);
        setLoading(false);
      });
  }, [venderId]);

  const CouponGrid = () => (
    <ScrollView contentContainerStyle={styles.grid}>
      {coupons.map((coupon, index) => (
        <TouchableOpacity key={index} style={styles.couponCard}>
          <Image
            source={{ uri: coupon.couponImage }}
            style={styles.couponImage}
            onError={(e) =>
              console.log(`Error loading image: ${e.nativeEvent.error}`)
            }
          />
          <Text style={styles.couponText}>{coupon.couponName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {coupons.length > 0 ? <CouponGrid /> : <Text>No coupons available.</Text>}
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
    width: "45%",
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
