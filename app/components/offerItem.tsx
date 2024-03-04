import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Offer, User, UserContextType } from "../../types";
import { useAuth } from "../../context";
import { Listing } from "../../types";
import {getDocument, setDocument} from "../../firebase/db";
import Toast from "react-native-root-toast";
import * as MailComposer from "expo-mail-composer";

interface ItemProps {
  item: Offer;
}

const OfferItem: React.FC<ItemProps> = ({ item }) => {
    console.log(item.offerId)
    const { user, setUser, listings, setListings } = useAuth() as UserContextType;
    const [listing, setListing] = useState<Listing | null>(null);
    const [buyer, setBuyer] = useState<User | null>(null);

    useEffect(() => {
        const getInfo = async () => {
            const userDocPath = `users/${item.buyerId}`;
            const user = await getDocument(userDocPath);
            setBuyer(user);

            const listingDocPath = `listings/${item.listingId}`;
            const listing = await getDocument(listingDocPath);
            setListing(listing);
          
        };
    
        getInfo();
      }, []);

 

    const showToast = async(message: string)  => {
        let toast = Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
              // calls on toast\`s appear animation start
            },
            onShown: () => {
              // calls on toast\`s appear animation end.
            },
            onHide: () => {
              // calls on toast\`s hide animation start.
            },
            onHidden: () => {
              // calls on toast\`s hide animation end.
            },
          });
          setTimeout(function () {
            Toast.hide(toast);
          }, 1500);
    };

    const acceptOffer = async () => {
        if (!user) {
            return;
        }
        const offerDocPath = `offers/${user.id}/sellerOffers/${item.offerId}`;
        const updatedOffer = {...item, dateActionTaken: new Date(), accepted: true};
        if (await setDocument(offerDocPath, updatedOffer)){
            showToast("Succesfully Accepted Offer");
            const isAvailable = await MailComposer.isAvailableAsync();

            if (isAvailable && buyer) {
                await MailComposer.composeAsync({
                    recipients: [buyer.email],
                    subject: "Accepting Offer on TreeListing App",
                    body: `(Get in contact with the buyer)  \n\n
                    Regards,\n${user.fullName}`,
                    isHtml: false, // Set to true if you want to use HTML content in the body
                    });
        
                    console.log("Offer submitted via email");
            }

            
        } else {
            showToast("Error in accepting offer");
        }
    };

    const declineOffer = async () => {
        if (!user) {
            return;
        }
        const offerDocPath = `offers/${user.id}/sellerOffers/${item.offerId}`;
        const updatedOffer = {...item, dateActionTaken: new Date(), accepted: false};
        if (await setDocument(offerDocPath, updatedOffer)){
            showToast("Succesfully Rejected Offer");
        } else {
            showToast("Error in accepting offer");
        }
    };

  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.title}>{listing?.title}</Text>
            <Image source={{ uri: listing?.imagePath }} style={styles.image} />
        </View>

        <View style={{flexDirection: "column", alignItems: "center"}}>
            <Text style={styles.title}>{buyer?.fullName}</Text>
            <Text>Want&apos;s to offer {item.price}</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity
                style={[styles.button, {backgroundColor: "#3ac981",}]}
                onPress={acceptOffer}
                >
                    <Text>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                 style={[styles.button, {backgroundColor: "#f44336",}]}
                 onPress={declineOffer}
                >
                    <Text>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>

    </View>
  );
}

export default OfferItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FCFBF4",
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        elevation: 1, // for Android shadow
        shadowColor: "#000", // for iOS shadow
        shadowOffset: { width: 0, height: 1 }, // for iOS shadow
        shadowOpacity: 0.22, // for iOS shadow
        shadowRadius: 2.22, // for iOS shadow
      },
    image: {
        width: 140,
        height: 140,
        borderRadius: 10, // Rounded corners for the image
      },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    button: {
        padding: 10,
        borderRadius: 10,
        margin: 10,
    }
});