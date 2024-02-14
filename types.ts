import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type UserId = string;
export type ListingId = string;

export type User = {
  email: string;
  fullName: string;
  dateCreated: Date;
  interests?: string[];
  id: UserId;
};

export interface UserContextType {
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
