import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type UserId = string;
export type ListingId = string;

export type User = {
  email: string;
  fullName: string;
  dateCreated: Date;
  interests?: string[];
  id: UserId;
  sellerRating?: number;
  buyerRating?: number;
  phone?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
};

export interface UserContextType {
  listings: { [id: ListingId]: Listing } | null;
  setListings: (listing: { [id: ListingId]: Listing } | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export type Listing = {
  listingId: ListingId;
  sellerId: UserId;
  buyerId?: UserId;
  title: string;
  price: number;
  datePosted: Date;
  dateSold?: Date;
  description: string;
  categories: string[];
  keywords?: string[];
  imagePath?: string;
  isListingActive: boolean;
  allInteractions?: string[];
};

export type Category = {
  category: CategoryType;
  keywords?: string[];
  countActiveListings: number;
  countSoldListings: number;
  avgDaysPosted?: number;
};

export enum CategoryType {
  VEHICLES = "VEH", // Vehicles
  PROPERTY_RENTALS = "PROP_RENT", // Property rentals
  APPAREL = "APRL", // Apparel
  ELECTRONICS = "ELECT", // Electronics
  ENTERTAINMENT = "ENT", // Entertainment
  FAMILY = "FAM", // Family
  FREE_STUFF = "FREE", // Free stuff
  GARDEN_OUTDOOR = "GARD_OUT", // Garden & outdoor
  HOBBIES = "HOB", // Hobbies
  HOME_GOODS = "HOME", // Home goods
  MUSICAL_INSTRUMENTS = "MI", // Musical instruments
  OFFICE_SUPPLIES = "OFF_SUP", // Office supplies
  PET_SUPPLIES = "PET_SUP", // Pet supplies
  SPORTING_GOODS = "SPORT", // Sporting goods
  TOYS_GAMES = "TOY", // Toys & games
  SERVICE = "SERV",
}

export type Offer = {
  offerId: string;
  listingId: string;
  buyerId: UserId;
  sellerId: UserId;
  price: number;
  dateOffered: Date;
  dateActionTaken?: Date;
  accepted: boolean | null;
};
