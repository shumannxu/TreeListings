import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../context";
import { useLocalSearchParams } from "expo-router";
import {
  createCouponsListener,
  getVender,
  setDocument,
} from "../../../../firebase/db";
import {
  Coupon,
  CouponId,
  UserContextType,
  Vender,
  VenderId,
} from "../../../../types";
import { router } from "expo-router";
import CustomAlert from "../../../components/alert";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";
import { MainText, HeaderText } from "../../../../components/text";
import TopNav from "../../../../components/topNav";
import SubTopNav from "../../../../components/subTopNav";

export default function VenderItem() {
  const { user, setCoupons, coupons } = useAuth() as UserContextType;
  const { venderId } = useLocalSearchParams<{ venderId: VenderId }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [couponClaimed, setcouponClaimed] = useState<boolean>(false);
  const [currCoupons, setCurrCoupons] = useState<Coupon[]>([]);
  const [currCouponNav, setCurrCouponNav] = useState<Coupon | null>(null);
  const [venderItem, setVenderItem] = useState<Vender | null>(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function fetchVender() {
      if (venderId) {
        let venter = await getVender(venderId);
        if (venter) {
          setVenderItem(venter);
        }
      }
    }

    fetchVender();
  }, [venderId]);

  const navigateToCoupon = useCallback(
    (couponId: CouponId) => {
      router.push({
        pathname: "/coupons/[venderId]/[couponId]",
        params: { venderId: venderId, couponId: couponId },
      });
    },
    [venderId]
  );

  useEffect(() => {
    if (!venderId) {
      console.error("No vender ID provided");
      return;
    }

    setLoading(true);
    const unsubscribe = createCouponsListener(venderId, (coupons) => {
      // Assuming 'coupons' is a dictionary, but your state expects an array
      // We need to convert the dictionary values to an array
      setCoupons(coupons);
      const couponsArray = Object.values(coupons);
      setCurrCoupons(couponsArray);
      setLoading(false);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [venderId, setCurrCoupons, setLoading]);

  // user hasn't used the coupon yet or has used but can still access it
  const onConfirm = useCallback(() => {
    if (currCouponNav && user) {
      const couponRef = doc(firestore, `coupon/${currCouponNav.couponId}`);
      getDoc(couponRef).then((docSnap) => {
        // Build the field path for the specific user's claim date
        const userClaimField = `usersClaimed.${user.id}`;

        const now = new Date();
        const tenMinutesLater = new Date(now);
        tenMinutesLater.setMinutes(now.getMinutes() + 10);
        const updateData = {
          [userClaimField]: tenMinutesLater,
        };

        // Update the document with the specific user's claim date
        updateDoc(couponRef, updateData)
          .then(() => {
            // console.log("User added to usersClaimed dictionary");
            setAlert(false);
            navigateToCoupon(currCouponNav.couponId);
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      });
    }
  }, [currCouponNav, user, navigateToCoupon, setAlert]);

  const onCouponPress = useCallback(
    ({ item }: { item: Coupon }) => {
      if (item.usersClaimed && user && user?.id in item.usersClaimed) {
        const deadline = item.usersClaimed[user.id];
        const claimedDate = new Date(
          deadline.seconds * 1000 + deadline.nanoseconds / 1000000
        );
        const currentTime = new Date();
        if (currentTime > claimedDate) {
          setcouponClaimed(true);
          return;
        } else {
          navigateToCoupon(item.couponId);
          return;
        }
      }
      setAlert(true);
      setCurrCouponNav(item);
    },
    [setcouponClaimed, setAlert, setCurrCouponNav, user]
  );

  const renderCoupon = useCallback(
    ({ item }: { item: Coupon }) => (
      <TouchableOpacity
        key={item.couponId}
        style={[
          styles.couponCard,
          {
            backgroundColor:
              user && user?.id in item.usersClaimed ? "grey" : "white",
          },
        ]}
        onPress={() => onCouponPress({ item })}
      >
        <Image
          source={{ uri: item.couponImage }}
          style={styles.couponImage}
          resizeMode="contain" // Ensures the image is scaled to fit within the view without being cropped
          onError={(e) =>
            console.log(`Error loading image: ${e.nativeEvent.error}`)
          }
        />
        <Text style={styles.couponText}>{item.couponName}</Text>
      </TouchableOpacity>
    ),
    []
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00BF63" }}>
      <StatusBar backgroundColor="#00BF63" barStyle="dark-content" />
      <TopNav backgroundColor="#00BF63" iconColor="white" />
      <View style={{ flex: 1, backgroundColor: "#FFF6EC" }}>
        <SubTopNav title={venderItem?.venderName} showSearchIcon={false} />
        {/* {venderItem && (
        <View
        style={{ alignItems: "center", padding: 10, flexDirection: "row"}}
        >
        <Image
          style={{ width: width*0.3, height:  width*0.3 }}
          source={{ uri: venderItem.logo }}
        />
        <View style={{alignItems: "flex-start", padding: 10}}>
          <Text
          style={{ fontSize: 20, fontWeight: "bold" }}
          >{venderItem.venderName}</Text>
          <Text>"Click the coupon you want to use"</Text>
        </View>
        </View>
      )} */}
        {/* <View style={{width: width, height: 2, backgroundColor: "black"}}/> */}
        <FlatList
          data={currCoupons}
          renderItem={renderCoupon}
          numColumns={2} // Ensures that the number of columns is set to 2
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <MainText
                style={{ paddingTop: 50, alignSelf: "center", fontSize: 20 }}
                color="black"
              >
                No coupons available!
              </MainText>
              <Image source={require("../../../../assets/sadtreeicon.png")} />
            </View>
          }
        />
      </View>
      <CustomAlert
        modalVisible={couponClaimed}
        setModalVisible={setcouponClaimed}
        textPrompt={"You have already claimed this coupon"}
        onConfirm={() => setcouponClaimed(false)}
        onCancel={() => setcouponClaimed(false)}
        onDismiss={() => setcouponClaimed(false)}
      />
      <CustomAlert
        modalVisible={alert}
        setModalVisible={setAlert}
        textPrompt={
          "Please make sure you are within distance from the store. You will only have 10 minutes once you confirm"
        }
        onConfirm={onConfirm}
        onCancel={() => setAlert(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  couponCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: 175,
    alignItems: "center",
  },
  couponImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  couponText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
