import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Offer, User, UserContextType } from "../../types";
import { useAuth } from "../../context";
import { Listing } from "../../types";
import { getDocument, offerTransaction, setDocument } from "../../firebase/db";
import Toast from "react-native-root-toast";
import * as MailComposer from "expo-mail-composer";
import { router } from "expo-router";
import { MainText } from "../../components/text";
interface ItemProps {
  item: Offer;
  type: "incoming" | "outgoing";
}

const OfferItem: React.FC<ItemProps> = ({ item, type }) => {
  const { user } = useAuth() as UserContextType;
  const [listing, setListing] = useState<Listing | null>(null);
  const [buyer, setBuyer] = useState<User | null>(null);
  const [seller, setSeller] = useState<User | null>(null);

  useEffect(() => {
    const getInfo = async () => {
      const userDocPath = `users/${item.buyerId}`;
      const user = await getDocument(userDocPath);
      setBuyer(user);
      const sellerPath = `users/${item.sellerId}`;
      const seller = await getDocument(sellerPath);
      setSeller(seller);

      const listingDocPath = `listings/${item.listingId}`;
      const listing = await getDocument(listingDocPath);
      setListing(listing);
    };

    getInfo();
  }, []);

  const navigateToDetail = () => {
    router.push({
      pathname: "/detailitem/[listingId]",
      params: { listingId: item.listingId },
    });
  };

  const showToast = async (message: string) => {
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
    const approved = await offerTransaction({
      sellerId: user.id,
      offerId: item.offerId,
      listingId: item.listingId,
      transactionType: "accept",
    });
    if (approved) {
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
    const approved = await offerTransaction({
      sellerId: user.id,
      offerId: item.offerId,
      listingId: item.listingId,
      transactionType: "decline",
    });
    if (approved) {
      showToast("Succesfully Rejected Offer");
    } else {
      showToast("Error in accepting offer");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToDetail}>
      <MainText style={styles.title}>{listing?.title}</MainText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Image source={{ 
              uri: listing?.imagePath || (listing?.imagesPath && listing.imagesPath.length > 0 ? listing.imagesPath[0] : 'https://firebasestorage.googleapis.com/v0/b/treelistings.appspot.com/o/Screenshot%202024-05-06%20at%204.02.47%E2%80%AFPM.png?alt=media&token=6a0b9378-cce8-4b60-886a-9ba4ea391ea6')
              }} style={styles.image} />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            {type === "incoming" ? (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <MainText style={styles.title}>{buyer?.fullName}</MainText>
                <MainText>Want&apos;s to offer {item.price}</MainText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#3ac981" }]}
                    onPress={acceptOffer}
                  >
                    <MainText>Accept</MainText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#f44336" }]}
                    onPress={declineOffer}
                  >
                    <MainText>Decline</MainText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <MainText style={styles.title}>{seller?.fullName}</MainText>
                {item.accepted ? (
                  <MainText
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    color={"#3ac981"}
                  >
                    Offer Accepted
                  </MainText>
                ) : item.accepted === null ? (
                  <MainText
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    color={"#f9a825"}
                  >
                    Offer is Pending
                  </MainText>
                ) : (
                  <MainText
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    color={"#f44336"}
                  >
                    Offer Rejected
                  </MainText>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(OfferItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FCFBF4",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    elevation: 1, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 1 }, // for iOS shadow
    shadowOpacity: 0.22, // for iOS shadow
    shadowRadius: 2.22, // for iOS shadow,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10, // Rounded corners for the image
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
});
