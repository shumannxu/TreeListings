import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  getAllListings,
  getDocument,
  createOffer,
} from "../../../../../firebase/db";
import { Coupon, Listing, User, UserContextType } from "../../../../../types";
import { getTimeAgo2 } from "../../../../components/getTimeAgo";
import Icon from "../../../../../components/icon";
import ListingItem from "../../../../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from "expo-mail-composer";
import { useAuth } from "../../../../../context";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

export default function CouponItem() {
  const { user, coupons, setCoupons } = useAuth() as UserContextType;
  const { couponId } = useLocalSearchParams<{ couponId: string }>();
  const { width, height } = useWindowDimensions();
  const [timeLeft, setTimeLeft] = useState(10 * 60); 

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft <= 1) {
          clearInterval(interval);
          console.log("Timer completed");
          return 0;
        }
        return timeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

    // Helper function to format the time left
    const formatTimeLeft = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

  const coupon = couponId
    ? coupons[couponId]
    : (undefined as Coupon | undefined);

  return (
    <View style={{flex: 1, alignItems: "center", alignContent: "center", justifyContent: "center"}}>
        <Image
          source={{ uri: coupon?.couponImage }}
          resizeMode="contain"
          style={{ width: width*0.9, height: width*0.9 }}
        />
      <Text style={{fontSize: 20, fontWeight: "bold"}}>{coupon?.couponName}</Text>
      <Text style={{fontSize: 15, fontWeight: "800"}}>Timer: {formatTimeLeft(timeLeft)}</Text>
    </View>
  );
}
