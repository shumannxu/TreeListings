import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type UserId = string;
export type ListingId = string;
export type VenderId = string;
export type CouponId = string;

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
  coupons: { [id: CouponId]: Coupon };
  setCoupons: (coupons: { [id: CouponId]: Coupon }) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  selfListings: Listing[];
  setSelfListings: (listing: Listing[]) => void;
  outgoingOffers: Offer[];
  setOutgoingOffers: (offers: Offer[]) => void;
  incomingOffers: Offer[];
  setIncomingOffers: (offers: Offer[]) => void;
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
  imagePath?: string; // old keeping so the old posting could still be shown
  imagesPath?: string[]; // new
  isListingActive: boolean;
  allInteractions?: string[];
  isListingAppropriate?: boolean;
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
  BIKES = "BIKE",
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

export type Vender = {
  venderId: VenderId;
  venderName: string;
  logo: string;
  categories: string[];
  coupons: CouponId[];
};

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type UserClaims = {
  [userId: UserId]: FirestoreTimestamp;
};

export type Coupon = {
  couponDescription: string;
  couponImage: string;
  couponName: string;
  datePosted: Date;
  couponId: CouponId;
  discount: number;
  expDate: Date;
  isBOGO: boolean;
  isDollar: boolean;
  isPercent: boolean;
  numberOfCoupons: number;
  usersClaimed: UserClaims;
  venderId: VenderId;
};

// Bike categories
export enum BikeCategoryType {
  ROAD = "ROAD",
  SPORT = "SPRT",
  COMMUTER_URBAN = "COMU",
  COMFORT = "COMF",
  FITNESS = "FITN",
  HYBRID = "HYBR",
  ELECTRIC = "ELEC",
}

// Bike Brands
export enum BikeBrandType {
  KHS = "KHS",
  FUJI = "FUJI",
  VELOTRIC = "VELO",
  JAMIS = "JAMI",
  NORCO = "NOR",
  BIRIA = "BIRI",
  EVO = "EVO",
  SERFAS = "SER",
  OTHERS = "OTHER",
}

// Gender
export enum BikeGender {
  UNISEX = "UNI",
  MENS = "MEN",
  WOMENS = "WOM",
  NOT_DESIGNATED = "ND",
}
