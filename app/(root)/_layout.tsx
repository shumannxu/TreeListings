import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "../../components/icon";
import {
  useFonts,
  JosefinSans_500Medium,
  Pacifico_400Regular,
} from "@expo-google-fonts/dev";

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    JosefinSans_500Medium,
    Pacifico_400Regular,
  });
  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            href: "/home",
            tabBarLabel: "Home",
            tabBarIcon: ({}) => (
              <Icon color={"#00BF63"} height={20} width={20}>
                home
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="coupons"
          options={{
            href: "/coupons",
            tabBarLabel: "Coupons",
            tabBarIcon: ({}) => (
              <Icon color={"#00BF63"} height={40} width={20}>
                coupon
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: "/search",
            tabBarLabel: "Search",
            tabBarIcon: ({}) => (
              <Icon color={"#00BF63"} height={20} width={20}>
                search
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: "/profile",
            tabBarLabel: "profile",
            tabBarIcon: ({}) => (
              <Icon color={"#00BF63"} height={20} width={20}>
                profile
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="detailitem/[listingId]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="offers"
          options={{
            href: "/offers",
            tabBarLabel: "offers",
            tabBarIcon: ({}) => (
              <Icon color={"#00BF63"} height={20} width={20}>
                offer
              </Icon>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
