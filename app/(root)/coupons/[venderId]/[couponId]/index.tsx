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
  const { user, coupons } = useAuth() as UserContextType;
  const { couponId } = useLocalSearchParams<{ couponId: string }>();
  const coupon = couponId
    ? coupons[couponId]
    : (undefined as Coupon | undefined);

  return (
    <View>
      <Text>{coupon?.couponName}</Text>
    </View>
  );
}
