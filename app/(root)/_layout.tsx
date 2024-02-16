import React from 'react';
import { StyleSheet } from 'react-native';
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
              <Icon color={"#B0DCC5"} height={20} width={20}>home</Icon>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: "/search",
            tabBarLabel: "Search",
          }}
        />
        <Tabs.Screen
          name="postListings"
          options={{
            href: "/postListings",
            tabBarLabel: "Post",
            tabBarIcon: ({}) => (
              <Icon color={"#B0DCC5"} height={20} width={20}>postlogo</Icon>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#e0f2f1', // Your tab bar's background color
    // Add other styling to match the design image provided
  },
  // Add more styles if needed
});
