import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "../../components/icon";

export default function HomeLayout() {
  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home/index"
          options={{
            href: "/home",
            tabBarLabel: "Home",
            tabBarIcon: ({}) => (
              <Icon color={"#B0DCC5"} height={20} width={20}>
                home
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="postListings"
          options={{
            href: "/postListings",
            tabBarLabel: "Post",
            tabBarIcon: ({}) => (
              <Icon color={"#B0DCC5"} height={20} width={20}>
                postlogo
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
              <Icon color={"#B0DCC5"} height={20} width={20}>
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
              <Icon color={"#B0DCC5"} height={20} width={20}>
                user
              </Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="detailitem/[listingId]"
          options={{
            // href: "/detailitem",
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
