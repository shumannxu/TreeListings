import React, { useContext, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signIn, resetPassword } from "../../firebase/auth";
import { useAuth } from "../../context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainText, HeaderText } from "../../components/text";

export default function Login() {
  const { setUser } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onFooterLinkPress = () => {
    router.push("/registration");
  };

  const onLoginPress = () => {
    signIn(email, password).then((user) => {
      // setUser(user);
      setUser(user);
      if (user) router.replace({ pathname: "/preferenceSurvey" });
    });
  };
  const sendVerificationEmail = () => {};

  const forgotPassword = () => {
    if (email.trim()) {
      // Check if the email field is not empty
      resetPassword(email).catch(console.error);
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("../../assets/fullLogo.png")}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <HeaderText style={styles.buttonTitle} color="white">log in</HeaderText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor:"#38B39C"}]}
          onPress={() => forgotPassword()}
        >
          <MainText style={styles.buttonTitle} color="white">Forgot Password</MainText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor:"#38B39C"}]}
          onPress={() => sendVerificationEmail()}
        >
          <MainText style={styles.buttonTitle} color="white">Send Verification Email Again</MainText>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <MainText style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </MainText>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF6EC",
    paddingTop: 100
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: "center",
    width: 150,
    height: 150,
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#16524E",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#38B39C",
    fontWeight: "bold",
    fontSize: 16,
  },
});
