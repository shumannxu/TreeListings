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
} from "firebase/firestore";
import { uploadImageAsync } from "./storage";
import { Listing, ListingId, User, UserId, Offer } from "../types";

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
  try{
    await setDoc(documentRef, data, { merge: true });
  return true;
  }catch(e){
    console.log(e);
    return false
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
  image,
  datePosted,
  description,
  categories,
  isListingActive,
}: {
  sellerId: UserId;
  title: string;
  price: number;
  datePosted: Date;
  image: string | null;
  description: string;
  categories: string[];
  isListingActive: boolean;
}): Promise<void> => {
  await runTransaction(firestore, async (transaction) => {
    const collectionRef = collection(firestore, "listings");
    const documentRef = doc(collectionRef);
    let uploadUrl = null;

    if (image) {
      uploadUrl = await uploadImageAsync(image, documentRef.id);
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
      ...(uploadUrl && { imagePath: uploadUrl }),
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
const getAllListings = async (
  id: UserId
): Promise<{ [id: ListingId]: Listing }> => {
  const listingsRef = query(
    collection(firestore, "listings"),
    // where("sellerId", "!=", id)
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
  setListings,
}: {
  userId: UserId;
  setListings: (listings: { [id: ListingId]: Listing } | null) => void;
}): (() => void) => {
  const q = query(
    collection(firestore, "listings"),
    where("sellerId", "!=", userId)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newListings = querySnapshot.docs.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.id]: doc.data(),
      }),
      {}
    ) as { [id: string]: Listing };
    setListings(newListings); // Assuming you want to do something with newListings here
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
    await runTransaction(firestore, async (transaction) => {
      // Define the path to the specific seller's offer collection
      const sellerOffersPath = `offers/${sellerId}/sellerOffers`;
      const sellerOffersCollectionRef = collection(firestore, sellerOffersPath);
      
      // Create a new document reference within the seller's offer collection
      const newOfferRef = doc(sellerOffersCollectionRef);

      // Prepare the offer data, including the generated offer ID
      const offerData = {
        offerId: newOfferRef.id, 
        listingId,
        buyerId,
        sellerId,
        price,
        dateOffered: new Date(),
        accepted: null,
      };

      // Set the new offer data in the transaction
      transaction.set(newOfferRef, offerData);
    });
    return true;
  } catch (e) {
    return false
  }
};

/**
 * Retrieves all offers made to a specific user from Firestore where the 'accepted' field is null.
 * @param {string} userId - The unique identifier for the user (seller).
 * @returns {Promise<{ [offerId: string]: Offer }>} - An object of all offer documents made to the user, keyed by offerId.
 */
const getAllOffersForUser = async (userId: string): Promise<{ [offerId: string]: Offer }> => {
  // Define the path to the specific user's offers collection
  const userOffersPath = `offers/${userId}/sellerOffers`;
  const offersRef = collection(firestore, userOffersPath);

  // Create a query that looks for documents where `accepted` is null
  const offersQuery = query(offersRef, where("accepted", "==", null));

  const querySnapshot = await getDocs(offersQuery);
  return querySnapshot.docs.reduce((acc, doc) => ({
    ...acc,
    [doc.id]: doc.data(),
  }), {}) as { [offerId: string]: Offer };
};


export {
  getDocument,
  setDocument,
  uploadListing,
  getAllListings,
  getUserProfile,
  createPostListingListener,
  createOffer,
  getAllOffersForUser
};
