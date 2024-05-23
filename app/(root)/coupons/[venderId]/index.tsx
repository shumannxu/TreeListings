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
} from "../../../../firebase/db";
import { Listing, User, UserContextType } from "../../../../types";
import { getTimeAgo2 } from "../../../components/getTimeAgo";
import Icon from "../../../../components/icon";
import ListingItem from "../../../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from "expo-mail-composer";
import { useAuth } from "../../../../context";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

export default function VenderItem() {
  const { user, setUser, listings, setListings, selfListings } =
    useAuth() as UserContextType;
  const { venderId } = useLocalSearchParams<{ venderId: string }>();

  const navigateToCoupon = useCallback(
    (item) => {
      router.push({
        pathname: "/coupons/[venderId]/[couponId]",
        params: { venderId: venderId, couponId: item.couponId },
      });
    },
    [venderId]
  );

  return (
    <View>
      <Text>{venderId}</Text>
    </View>
  );
}
