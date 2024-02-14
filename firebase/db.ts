import { firestore } from "../firebaseConfig";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { uploadImageAsync } from "./storage";
import { Listing, ListingId, UserId } from "../types";

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
): Promise<void> => {
  const documentRef = doc(firestore, path);
  await setDoc(documentRef, data, { merge });
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
  const collectionRef = collection(firestore, "listings");
  const documentRef = doc(collectionRef);
  const listingData = {
    listingId: documentRef.id,
    sellerId: sellerId,
    title: title,
    price: price,
    datePosted: datePosted,
    description: description,
    categories: categories,
    isListingActive: isListingActive,
  } as Listing;

  if (image) {
    const uploadUrl = await uploadImageAsync(image, documentRef.id);
    listingData.imagePath = uploadUrl;
  }
  await setDocument(`listings/${listingData.listingId}`, listingData);
};

export { getDocument, setDocument, uploadListing };
