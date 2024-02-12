import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, Text, Button } from "react-native";
// import { useUser } from "../../context";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../../../firebase/auth";

export default function Home() {
  // const { setUser } = useUser();
  const handleLogout = async () => {
    signOutUser().then(async () => {
      await AsyncStorage.removeItem("userInfo");
    });
    // setUser(null);
    router.replace("/login");
  };
  return (
    <SafeAreaView>
      <View>
        <Text>Feed screen</Text>
        <Button onPress={handleLogout} title="Hello"></Button>
      </View>
    </SafeAreaView>
  );
}
