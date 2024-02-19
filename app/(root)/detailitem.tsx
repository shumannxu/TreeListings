import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, useWindowDimensions, FlatList, ScrollView} from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";
import { getAllListings, getDocument } from "../../firebase/db";
import { Listing, User } from "../../types";
import getTimeAgo from "../components/getTimeAgo";
import Icon from "../../components/icon";
import ListingItem from "../components/listingItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MailComposer from 'expo-mail-composer';
import { useAuth } from "../../context";

export default function DetailItem() {
  const { selfuser, setSelfUser } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const [selfUserInfo, setSelfUserInfo] = useState<User | null>(null);
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [price, setPrice] = useState("");
  const {height, width} = useWindowDimensions();
  const [listings, setListings] = useState<Listing[] | [] >([]);
  const [timeAgo, setTimeAgo] = useState("");


  useEffect(() => {
    setSelfUserInfo(selfuser);
  }, [selfuser]);

  useEffect(() => {
    const fetchAllListings = async () => {
      const listings = await getAllListings();
      setListings(listings);
    }
    fetchAllListings();
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      if (itemId) { 
        const listingDocPath = `listings/${itemId}`; 
        const listing = await getDocument(listingDocPath);
        setTimeAgo(getTimeAgo(listing.datePosted));
        // console.log(listing);
        setListing(listing);
      }
    };

    fetchListing();
  }, [itemId]); 

  useEffect(() => {
    const fetchUser = async () => {
      if (listing){
        const userDocPath = `users/${listing.sellerId}`;
        const user = await getDocument(userDocPath);
        setUser(user);
      }
    };

    fetchUser();
  }, [user, listing]);

  const styles = StyleSheet.create({
    image: {
      width: width * 0.85,
      height: width * 0.85,
      borderRadius: 10,
    },
    button: {
      backgroundColor: "#38B39C", 
      padding: 10,
      borderRadius: 10
    },
    defaultTextSize:{
      fontSize: 20,
      fontWeight: "400",
      letterSpacing: 1
    }
  });

  if (!itemId) {
    return (
      <SafeAreaView>
        <View>
          <Text>No item ID provided</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onBuyNow = () => {
    console.log("Buy Now");
  }

  const onSubmitOffer = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    
    if (!isAvailable) {
      console.log('Mail services are not available');
      return;
    }
    if(!user){
      console.log("User not loaded yet");
      return;
    }
  
    await MailComposer.composeAsync({
      recipients: [user.email], 
      subject: 'Offer for Your Listing',
      body: `Hello ${user.fullName},\n\nI would like to submit an offer of $${price} for the item listed.\n\nBest regards,\n ${selfUserInfo?.firstName}`, 
      isHtml: false, // Set to true if you want to use HTML content in the body
    });
  
    console.log("Offer submitted via email");
  };

  return (
    <ScrollView
    contentContainerStyle={{
      alignItems: "center",
      paddingVertical: safeAreaInsets.top,
    }}
    >
      <View style={{alignItems: "center"}}>
        <Text style={{fontSize: 30, fontWeight: "bold", letterSpacing: 1}}>{listing.title}</Text>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Icon height={30} color="black">profile</Icon>
          <Text style={styles.defaultTextSize}>{user?.fullName} </Text>
          { user?.sellerRating && <><Text style={styles.defaultTextSize}>{user?.sellerRating}</Text>
           <Icon height={20} color="black">star</Icon>
           </>
          }   
          <Text style={styles.defaultTextSize}>{timeAgo}</Text>
        </View>
       
        <Image source={{ uri: listing.imagePath }} style={styles.image} />
        <Text style={styles.defaultTextSize}>{listing.description}</Text>
        <View style={{flexDirection: "row", alignContent: "flex-end", alignItems: "center", marginVertical:10}}>
          <Text style={[styles.defaultTextSize, {marginHorizontal: 10}]}>Asking Price: ${listing.price}</Text>
          <TouchableOpacity style={styles.button}
          onPress={onBuyNow}
          >
            <Text>Buy Now</Text>
          </TouchableOpacity>
        </View>    
        <View style={{flexDirection: "row", alignContent: "flex-end", alignItems: "center", marginVertical: 10}}>
          <Text style={styles.defaultTextSize} >Best Offer$</Text>
          <TextInput
            style={{marginHorizontal: 10}}
            placeholder="Amount"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TouchableOpacity 
          style={[styles.button, {backgroundColor: price === "" ? "grey" : "#38B39C"}]}
          onPress={onSubmitOffer}
          disabled={price === ""}
          >
            <Text >Submit Offer</Text>
          </TouchableOpacity>
        </View>    
      </View>
      <View style={{width: "100%", height: 1, backgroundColor: "black"}}/>
      <Text style={styles.defaultTextSize}>Similar Items</Text>
      <FlatList
          data={listings}
          renderItem={({ item }:{item:Listing}) => <ListingItem recommend ={false} item={item} />}
          horizontal
          keyExtractor={(item) => item.listingId}
        />
      </ScrollView>
  );
}
