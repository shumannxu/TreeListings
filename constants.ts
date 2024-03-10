import { CategoryType } from "./types";

export const CATEGORIES: readonly { label: string; value: CategoryType }[] = [
  { label: "Electronics", value: CategoryType.ELECTRONICS },
  { label: "Services", value: CategoryType.SERVICE },
  { label: "Vehicles", value: CategoryType.VEHICLES },
  { label: "Property Rentals", value: CategoryType.PROPERTY_RENTALS },
  { label: "Apparel", value: CategoryType.APPAREL },
  { label: "Leisure", value: CategoryType.ENTERTAINMENT }, // Edited from Entertainment -> Leisure
  { label: "Family", value: CategoryType.FAMILY },
  { label: "Free Stuff", value: CategoryType.FREE_STUFF },
  { label: "Garden & Outdoor", value: CategoryType.GARDEN_OUTDOOR },
  { label: "Hobbies", value: CategoryType.HOBBIES },
  { label: "Home Goods", value: CategoryType.HOME_GOODS },
  { label: "Music", value: CategoryType.MUSICAL_INSTRUMENTS },
  { label: "Office Supplies", value: CategoryType.OFFICE_SUPPLIES },
  { label: "Pet Supplies", value: CategoryType.PET_SUPPLIES },
  { label: "Sporting Goods", value: CategoryType.SPORTING_GOODS },
  { label: "Toys & Games", value: CategoryType.TOYS_GAMES },
] as const;
