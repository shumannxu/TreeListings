import { View, Text, Button, StyleSheet } from "react-native";
import { signOutUser } from "../../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context";

export default function Profile(){
    const { user, setUser } = useAuth();
    const handleLogout = async () => {
        signOutUser().then(async () => {
          await AsyncStorage.removeItem("userInfo");
          setUser(null);
        });
      };
    return (
        <View style={styles.container}>
            <Text>Profile</Text>
            <Button onPress={handleLogout} title="Sign Out" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});