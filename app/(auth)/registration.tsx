import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { registerUserEmailPassword } from "../../firebase/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainText, HeaderText } from "../../components/text";

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const safeAreaInsets = useSafeAreaInsets();
  const onFooterLinkPress = () => {
    router.push("/login");
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    if (!email.endsWith("@stanford.edu")) {
      alert("Email Must be a valid @stanford.edu email address.");
      return;
    }
    registerUserEmailPassword(email, password, fullName).then(() => {
      router.replace("/login");
    });
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
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
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
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[ styles.button, {backgroundColor: "#38B39C"} ]}
          onPress={() => onRegisterPress()}
        >
          <HeaderText style={styles.buttonTitle} color="white">Create account</HeaderText>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <MainText style={styles.footerText}>
            Already got an account?{" "}
            <MainText onPress={onFooterLinkPress} style={styles.footerLink} color="#38B39C">
              Log in
            </MainText>
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
  title: {},
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
    backgroundColor: "#788eec",
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
