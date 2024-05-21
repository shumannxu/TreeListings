import { firestore } from "../firebaseConfig";

import {
  collection,
  doc,
  getDoc,
  increment,
  runTransaction,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  collectionGroup,
  updateDoc,
} from "firebase/firestore";
import { uploadImageAsync } from "./storage";
import {
  Listing,
  ListingId,
  User,
  UserId,
  Offer,
  CategoryType,
} from "../types";

/**
 * Retrieves a document from Firestore.
 * @param {string} path - The path to the document in Firestore.
 * @returns {Promise<any>} - The document data or null if not found.
 */
const getDocument = async (path: string): Promise<any> => {
  const documentRef = doc(firestore, path);
  const documentSnapshot = await getDoc(documentRef);
  if (documentSnapshot.exists()) {
    return documentSnapshot.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

/**
 * Sets or updates a document in Firestore.
 * @param {string} path - The path to the document in Firestore.
 * @param {Object} data - The data to set or update in the document.
 * @param {boolean} merge - Whether to merge the data with the existing document.
 * @returns {Promise<void>}
 */
const setDocument = async (
  path: string,
  data: Object,
  merge: boolean = true
): Promise<boolean> => {
  const documentRef = doc(firestore, path);
  try {
    await setDoc(documentRef, data, { merge: true });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * Uploads listing data to Firestore database.
 * @param {ListingId} listingId - The unique identifier for the listing.
 * @param {UserId} sellerId - The unique identifier for the seller.
 * @param {string} title - The title of the listing.
 * @param {number} price - The price of the listing.
 * @param {Date} datePosted - The date the listing was posted.
 * @param {string} description - The description of the listing.
 * @param {string[]} categories - The categories of the listing.
 * @param {boolean} isListingActive - The status of the listing.
 * @param {string[]} allInteractions - All interactions related to the listing.
 * @param {string} [imagePath] - The path of the image associated with the listing.
 * @returns {Promise<void>}
 */
const uploadListing = async ({
  sellerId,
  title,
  price,
  images,
  datePosted,
  description,
  categories,
  isListingActive,
  bikeBrandValue,
  bikeCategoryValue,
  bikeGenderValue,
}: {
  sellerId: UserId;
  title: string;
  price: number;
  datePosted: Date;
  images: string[] | null;
  description: string;
  categories: string[];
  isListingActive: boolean;
  bikeBrandValue: string | undefined;
  bikeCategoryValue: string[] | undefined;
  bikeGenderValue: string | undefined;
}): Promise<void> => {
  await runTransaction(firestore, async (transaction) => {
    const collectionRef = collection(firestore, "listings");
    const documentRef = doc(collectionRef);
    let uploadUrls: string[] = [];

    if (images) {
      // Use map to create a list of promises and then wait for all of them
      const uploadPromises = images.map((image) =>
        uploadImageAsync(image, documentRef.id)
      );
      uploadUrls = await Promise.all(uploadPromises);
    }

    // First, read all necessary documents
    const categoryRefs = categories.map((category) =>
      doc(firestore, "categories", category)
    );
    const categoryDocs = await Promise.all(
      categoryRefs.map((categoryRef) => transaction.get(categoryRef))
    );

    // Then, proceed with writes
    const listingData = {
      listingId: documentRef.id,
      sellerId: sellerId,
      title: title,
      price: price,
      datePosted: datePosted,
      description: description,
      categories: categories,
      isListingActive: isListingActive,
      ...(categories.includes(CategoryType.BIKES) && {
        bikeBrand: bikeBrandValue,
        bikeCategory: bikeCategoryValue,
        bikeGender: bikeGenderValue,
      }),
      ...(uploadUrls && { imagesPath: uploadUrls }),
    } as Listing;

    transaction.set(documentRef, listingData);

    categoryDocs.forEach((categoryDoc, index) => {
      const categoryRef = categoryRefs[index];
      if (categoryDoc.exists()) {
        transaction.update(categoryRef, { countActiveListings: increment(1) });
      } else {
        transaction.set(categoryRef, { countActiveListings: 1 });
      }
    });
  });
};

// usage for uploading coupon
export const uploadCoupon = async (coupon: {
  couponName: string;
  couponImage: string[];
  numberOfCoupons: number;
}) => {
  const couponRef = doc(collection(firestore, "coupon"));
  await setDoc(couponRef, coupon);
};

const getUserProfile = async (userId: UserId): Promise<User | null> => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/**
 * Retrieves all listings from Firestore.
 * @returns {Promise<Listing[]>} - An array of all listing documents.
 */
const getAllListings = async (): Promise<{ [id: ListingId]: Listing }> => {
  const listingsRef = query(collection(firestore, "listings"));
  const querySnapshot = await getDocs(listingsRef);
  return querySnapshot.docs.reduce(
    (acc, doc) => ({
      ...acc,
      [doc.id]: doc.data(),
    }),
    {}
  ) as { [id: string]: Listing };
};
const getSelfListings = async (
  id: UserId
): Promise<{ [id: ListingId]: Listing }> => {
  const listingsRef = query(
    collection(firestore, "listings"),
    where("sellerId", "==", id)
  );
  const querySnapshot = await getDocs(listingsRef);
  return querySnapshot.docs.reduce(
    (acc, doc) => ({
      ...acc,
      [doc.id]: doc.data(),
    }),
    {}
  ) as { [id: string]: Listing };
};

const createPostListingListener = ({
  userId,
  setSelfListings,
  setListings,
}: {
  userId: UserId;
  setSelfListings: (listings: Listing[]) => void;
  setListings: (listings: { [id: ListingId]: Listing } | null) => void;
}): (() => void) => {
  const q = query(collection(firestore, "listings"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newListings = querySnapshot.docs.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.id]: doc.data(),
      }),
      {}
    ) as { [id: string]: Listing };
    const filteredListings = {} as { [id: ListingId]: Listing };
    const selfListing = {} as { [id: ListingId]: Listing };
    Object.entries(newListings).forEach(([id, listingItem]) => {
      if (listingItem.isListingAppropriate !== false) {
        if (listingItem.sellerId !== userId) {
          filteredListings[id] = listingItem;
        } else {
          selfListing[id] = listingItem;
        }
      }
    });
    setListings(filteredListings);
    setSelfListings(Object.values(selfListing)); // Assuming you want to do something with newListings here
  });
  return unsubscribe;
};

/**
 * Uploads an offer to Firestore database.
 * @param {string} listingId - The unique identifier for the listing.
 * @param {string} buyerId - The unique identifier for the buyer.
 * @param {string} sellerId - The unique identifier for the seller.
 * @param {number} price - The price of the offer.
 * @param {string} message - The message of the offer (assuming from your code).
 * @param {Date} date - The date of the offer (assuming from your code).
 */
const createOffer = async ({
  listingId,
  buyerId,
  sellerId,
  price,
}: {
  listingId: ListingId;
  buyerId: UserId;
  sellerId: UserId;
  price: number;
}) => {
  try {
    const sellerOffersPath = `offers/${sellerId}/sellerOffers`;
    const sellerOffersCollectionRef = collection(firestore, sellerOffersPath);

    const querySnapshot = await getDocs(
      query(
        sellerOffersCollectionRef,
        where("listingId", "==", listingId),
        where("buyerId", "==", buyerId)
      )
    );

    if (!querySnapshot.empty) {
      const existingOfferRef = querySnapshot.docs[0].ref;
      await updateDoc(existingOfferRef, {
        price,
        dateOffered: new Date(),
        accepted: null,
      });
    } else {
      const newOfferRef = doc(sellerOffersCollectionRef);
      await setDoc(newOfferRef, {
        offerId: newOfferRef.id,
        listingId,
        buyerId,
        sellerId,
        price,
        dateOffered: new Date(),
        accepted: null,
      });
      console.log("New offer created successfully.");
    }

    return true;
  } catch (e) {
    console.error("Error creating or updating offer: ", e);
    return false;
  }
};

/**
 * Retrieves all offers made to a specific user from Firestore where the 'accepted' field is null.
 * @param {string} userId - The unique identifier for the user (seller).
 * @returns {Promise<{ [offerId: string]: Offer }>} - An object of all offer documents made to the user, keyed by offerId.
 */
const getAllIncomingOffersUser = async (
  userId: string
): Promise<{ [offerId: string]: Offer }> => {
  // Define the path to the specific user's offers collection
  const userOffersPath = `offers/${userId}/sellerOffers`;
  const offersRef = collection(firestore, userOffersPath);
  // Create a query that looks for documents where `accepted` is null
  const offersQuery = query(offersRef, where("accepted", "==", null));

  const querySnapshot = await getDocs(offersQuery);
  return querySnapshot.docs.reduce(
    (acc, doc) => ({
      ...acc,
      [doc.id]: doc.data(),
    }),
    {}
  ) as { [offerId: string]: Offer };
};

/**
 * Uploads an offer to Firestore database.
 * @param {string} listingId - The unique identifier for the listing.
 * @param {string} sellerId - The unique identifier for the seller.
 * @param {string} offerId - The unique identifier for the offer.
 * @param {string} transactionType - The unique identifier for the offer.
 */
const offerTransaction = async ({
  sellerId,
  offerId,
  listingId,
  transactionType,
}: {
  sellerId: UserId;
  listingId: ListingId;
  offerId: string;
  transactionType: "accept" | "decline";
}) => {
  try {
    await runTransaction(firestore, async (transaction) => {
      // Define the path to the specific seller's offer doc
      const offerRef = doc(
        firestore,
        `offers/${sellerId}/sellerOffers/${offerId}`
      );

      // Retrieve the listing document reference
      const listingRef = doc(firestore, `listings/${listingId}`);

      // Get the offer document to update its status
      const offerDoc = await transaction.get(offerRef);
      if (!offerDoc.exists()) {
        throw new Error("Document does not exist!");
      }
      const offerData = offerDoc.data();
      offerData.accepted = transactionType === "accept";
      offerData.dateActionTaken = new Date();

      // Update the offer document within the transaction
      transaction.update(offerRef, offerData);

      // Update the listing document to mark it as inactive
      transaction.update(listingRef, { isActiveListing: false });

      // Retrieve and update category documents
      const categories = offerData.categories; // Assuming categories are stored in the offer data
      if (categories) {
        categories.forEach((categoryId: CategoryType) => {
          const categoryRef = doc(firestore, `categories/${categoryId}`);
          transaction.get(categoryRef).then((categoryDoc) => {
            if (categoryDoc.exists()) {
              const newCount = categoryDoc.data().countActiveListings - 1;
              transaction.update(categoryRef, {
                countActiveListings: newCount,
              });
            }
          });
        });
      }
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
/**
 * Retrieves all offers made to a specific user from Firestore where the 'accepted' field is null.
 * @param {string} userId - The unique identifier for the user (seller).
 * @returns {Promise<{ [offerId: string]: Offer }>} - An object of all offer documents made to the user, keyed by offerId.
 */
const getAllOutgoingOffersUser = async (
  userId: string
): Promise<{ [offerId: string]: Offer }> => {
  // Define the path to the specific user's offers collection
  const outgoingOffersRef = collectionGroup(firestore, "sellerOffers");
  const outgoingOffersQuery = query(
    outgoingOffersRef,
    where("buyerId", "==", userId)
  );

  const querySnapshot = await getDocs(outgoingOffersQuery);
  return querySnapshot.docs.reduce(
    (acc, doc) => ({
      ...acc,
      [doc.id]: doc.data(),
    }),
    {}
  ) as { [offerId: string]: Offer };
};

const createOfferListener = ({
  userId,
  setOutgoingOffers,
  setIncomingOffers,
}: {
  userId: UserId;
  setOutgoingOffers: (offers: Offer[]) => void;
  setIncomingOffers: (offers: Offer[]) => void;
}): (() => void) => {
  const userOffersPath = `offers/${userId}/sellerOffers`;
  const incomingOffersRef = collection(firestore, userOffersPath);

  const incomingOffersQuery = query(
    incomingOffersRef,
    where("accepted", "==", null)
  );
  const outgoingOffersRef = collectionGroup(firestore, "sellerOffers");
  const outgoingOffersQuery = query(
    outgoingOffersRef,
    where("buyerId", "==", userId)
  );

  const unsubscribeIncoming = onSnapshot(
    incomingOffersQuery,
    (querySnapshot) => {
      const newListings = querySnapshot.docs.reduce(
        (acc, doc) => ({
          ...acc,
          [doc.id]: doc.data(),
        }),
        {}
      ) as { [id: string]: Offer };
      setIncomingOffers(Object.values(newListings));
    }
  );
  const unsubscribeOutgoing = onSnapshot(
    outgoingOffersQuery,
    (querySnapshot) => {
      const newListings = querySnapshot.docs.reduce(
        (acc, doc) => ({
          ...acc,
          [doc.id]: doc.data(),
        }),
        {}
      ) as { [id: string]: Offer };
      setOutgoingOffers(Object.values(newListings));
    }
  );
  return () => {
    unsubscribeIncoming();
    unsubscribeOutgoing();
  };
};
export {
  getDocument,
  setDocument,
  uploadListing,
  getAllListings,
  getUserProfile,
  getSelfListings,
  createPostListingListener,
  createOfferListener,
  createOffer,
  getAllIncomingOffersUser,
  getAllOutgoingOffersUser,
  offerTransaction,
};
