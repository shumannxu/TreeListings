import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './icon';

const TopNav = ({ backgroundColor, iconColor }) => {
  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logoText.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.tab}>
                <MaterialCommunityIcons name="offer" size={24} color={ iconColor } />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
            <MaterialCommunityIcons name="cart-variant" size={24} color={ iconColor } />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
                <LinearGradient
                    colors={["#55F1E9", "#FFDF75"]}
                    style={styles.iconCircle}
                >
                    <MaterialCommunityIcons name="tree-outline" size={24} color="#307E79" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100, 
    marginLeft: -55,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopNav;
