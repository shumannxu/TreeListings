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
  StatusBar
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
import { Coupon, CouponId, Listing, User, UserContextType } from "../../../../../types";
import { getTimeAgo2 } from "../../../../components/getTimeAgo";
import Icon from "../../../../../components/icon";
import ListingItem from "../../../../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from "expo-mail-composer";
import { useAuth } from "../../../../../context";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { MainText } from "../../../../../components/text";
import TopNav from "../../../../../components/topNav";
import SubTopNav from "../../../../../components/subTopNav";

export default function CouponItem() {
  const { user, coupons, setCoupons } = useAuth() as UserContextType;
  const { couponId } = useLocalSearchParams<{ couponId: CouponId }>();
  const { width, height } = useWindowDimensions();
  const [timeLeft, setTimeLeft] = useState(10 * 60); 

  const setTimeleft = (couponId: CouponId) => {
    if (user){
      const coupon = coupons[couponId];
      const deadline = coupon.usersClaimed[user.id];
      const claimedDate = new Date(deadline.seconds * 1000 + deadline.nanoseconds / 1000000).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = Math.max((claimedDate - currentTime)/1000, 0); 
      setTimeLeft(Math.round(timeLeft)); // Convert milliseconds to seconds if necessary
      } else {
        setTimeLeft(0); // Set to 0 if coupon or expiration date is not valid
      }
  }

  useEffect(() => {
    if (couponId) {
      setTimeleft(couponId);
    }
  }, [couponId]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft <= 1) {
          clearInterval(interval);
          // console.log("Timer completed");
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00BF63" }}>
      <StatusBar backgroundColor="#00BF63" barStyle="dark-content" />
      <TopNav backgroundColor="#00BF63" iconColor="white" />
      <View style={{ flex: 1, backgroundColor: '#FFF6EC' }}>
        <SubTopNav title="Redeem Now!" showSearchIcon={false} />
    <View style={{flex: 1, alignItems: "center", alignContent: "center", justifyContent: "center"}}>
        <Image
          source={{ uri: coupon?.couponImage }}
          resizeMode="contain"
          style={{ width: width*0.9, height: width*0.9 }}
        />
        <View style={{paddingVertical:15}}>
      <MainText style={{fontSize: 30, fontWeight: "bold"}}>{coupon?.couponName}</MainText>
      <MainText style={{fontSize: 80, fontWeight: "800"}}>{formatTimeLeft(timeLeft)}</MainText>
      </View>
      </View>
      </View>
    </SafeAreaView>
  );
}
