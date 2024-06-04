import { View, Text as RNText, StyleSheet } from "react-native";
import {
  JosefinSans_500Medium,
  Pacifico_400Regular,
} from "@expo-google-fonts/dev";

interface HeaderTextProps {
  children: React.ReactNode;
  style?: object;
  color?: string;
}

const HeaderText = ({ children, style, color, ...props }: HeaderTextProps) => (
  <View style={{ paddingHorizontal: 20 }}>
    <RNText style={[styles.header, style, { color }]} {...props}>
      {children}
    </RNText>
  </View>
);

const MainText = ({ children, style, color, ...props }: HeaderTextProps) => (
  <RNText style={[styles.main, style, { color }]} {...props}>
    {children}
  </RNText>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontFamily: "Pacifico_400Regular",
  },
  main: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: "JosefinSans_500Medium",
  },
});

export { HeaderText, MainText };
