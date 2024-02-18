import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput } from "react-native";
import React, { useEffect, useState,} from "react";
import { signOutUser } from "../../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context";
import { User } from "../../types";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from "../../components/icon";
import {setDocument} from "../../firebase/db";
import { collection, doc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";



export default function Profile(){
    const { user, setUser } = useAuth();
    const safeAreaInsets = useSafeAreaInsets();
    const {height, width} = useWindowDimensions();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [change, setChange] = useState(false);

    useEffect(() => {
        setUserInfo(user);
    }, [user]);

    const handleLogout = async () => {
        signOutUser().then(async () => {
          await AsyncStorage.removeItem("userInfo");
          setUser(null);
        });
      };

    const saveChanges = () => {
        if (userInfo){
            setDocument(`users/${userInfo?.id}`, userInfo, true);
            setChange(false);
            setUser(userInfo);
            AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
    };


    return (
        <ScrollView 
        contentContainerStyle={{
            flex: 1,
            paddingTop: safeAreaInsets.top,
            alignItems: "center",
        }}
        >
        
        <View style={{flexDirection:"row", alignItems: "center"}}>
            <Icon color={"#664147"} height={30} style={{marginHorizontal: 10}}>profile</Icon>
                <Text style={{         
                    fontSize: 30,
                    fontWeight: "bold",
                    letterSpacing: 1,
                    color: "#664147"
            }}>{userInfo?.fullName}&apos;s Dashboard</Text>
          </View>
        <View style={{width: "100%", paddingHorizontal: width * 0.1}}>
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                letterSpacing: 1,
                color: "#2F9C95",
                marginTop: 20,
                marginBottom: 10,
            }}>User Information</Text>

            {change && 
            <TouchableOpacity
            onPress={saveChanges}
            style={{backgroundColor: "#2F9C95", padding: 10, borderRadius: 10, alignItems: "center", justifyContent: "center"}}
            >
                <Text style={[styles.textFirst, {color: "white"}]}>Save Changes</Text>
            </TouchableOpacity>
                }

            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>First name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your first name"
                    value={userInfo?.firstName}
                    onChangeText={(text) => {setUserInfo({...userInfo, firstName: text}); setChange(true)}}
                />
                <TouchableOpacity>
                    <Icon color={"black"} height={20}>edit</Icon>
                </TouchableOpacity>
            </View>

            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Last name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your last name"
                    value={userInfo?.lastName}
                    onChangeText={(text) => {setUserInfo({...userInfo, lastName: text}); setChange(true)}}/>
                <TouchableOpacity>
                    <Icon color={"black"} height={20}>edit</Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Username:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your username"
                    value={userInfo?.username}
                    onChangeText={(text) => {setUserInfo({...userInfo, username: text}); setChange(true)}}/>
                <TouchableOpacity>
                    <Icon color={"black"} height={20}>edit</Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Phone:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your phone number"
                    value={userInfo?.phone}
                    inputMode="numeric"
                    onChangeText={(text) => {setUserInfo({...userInfo, phone: text}); setChange(true)}}/>
                <TouchableOpacity>
                    <Icon color={"black"} height={20}>edit</Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your email"
                    value={userInfo?.email}
                    onChangeText={(text) => {setUserInfo({...userInfo, email: text}); setChange(true)}}/>
                <TouchableOpacity>
                    <Icon color={"black"} height={20}>edit</Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Buyer Rating:</Text>
                <Text style={styles.textSecond}> {userInfo?.buyerRating}</Text>
            </View>
            <View style={styles.userInformationContainer}>
                <Text style={styles.textFirst}>Seller Rating:</Text>
                <Text style={styles.textSecond}> {userInfo?.sellerRating}</Text>
            </View>
        </View>
            <Button onPress={handleLogout} title="Sign Out" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    userInformationContainer:{
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5
    },
    textFirst: {
        fontSize: 18,
        marginBottom: 10,  
        fontWeight: "800",   
    },
    textSecond: {
        fontSize: 16,
        marginBottom: 10,     
    },
    input: {
        height: 40,
        borderColor: "#e7e7e7",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
      },
});
