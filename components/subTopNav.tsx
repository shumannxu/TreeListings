import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { HeaderText } from './text';

const SubTopNav = ({ title, image, showSearchIcon, logoImage }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      {title ? (
        <HeaderText color="white">{title}</HeaderText>
      ) : (
        <Image source={image} style={styles.image} />
      )}

      {showSearchIcon && (
        <TouchableOpacity style={styles.iconContainer}>
          <MaterialIcons name="search" size={30} color="white" />
        </TouchableOpacity>
      )}
      {!showSearchIcon && (
        <MaterialIcons name="search" size={30} color="#00BF63" /> // cleanup needed
        // <Image source={image} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#00BF63',
    height: 60,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    flex: 3,
    height: 60,
    resizeMode: 'contain',
    padding: 1,
  },
});

export default SubTopNav;
