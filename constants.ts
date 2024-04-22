import {
  CategoryType,
  BikeCategoryType,
  BikeBrandType,
  BikeGender,
} from "./types";

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

export const BIKE_CATEGORIES: readonly {
  label: string;
  value: BikeCategoryType;
}[] = [
  { label: "Road", value: BikeCategoryType.ROAD },
  { label: "Sport", value: BikeCategoryType.SPORT },
  { label: "Electric", value: BikeCategoryType.ELECTRIC },
  { label: "Commuter/Urban", value: BikeCategoryType.COMMUTER_URBAN },
  { label: "Comfort", value: BikeCategoryType.COMFORT },
  { label: "Fitness", value: BikeCategoryType.FITNESS },
  { label: "Hybrid", value: BikeCategoryType.HYBRID },
];

export const BIKE_BRANDS: readonly {
  label: string;
  value: BikeBrandType;
}[] = [
  { label: "KHS", value: BikeBrandType.KHS },
  { label: "Fuji", value: BikeBrandType.FUJI },
  { label: "Velotric", value: BikeBrandType.VELOTRIC },
  { label: "Jamis", value: BikeBrandType.JAMIS },
  { label: "Norco", value: BikeBrandType.NORCO },
  { label: "Biria", value: BikeBrandType.BIRIA },
  { label: "EVO", value: BikeBrandType.EVO },
  { label: "Serfas", value: BikeBrandType.SERFAS },
  { label: "Others", value: BikeBrandType.OTHERS },
];

export const BIKE_GENDER: readonly {
  label: string;
  value: BikeGender;
}[] = [
  { label: "Unisex", value: BikeGender.UNISEX },
  { label: "Men's", value: BikeGender.MENS },
  { label: "Women's", value: BikeGender.WOMENS },
  { label: "Not Designated", value: BikeGender.NOT_DESIGNATED },
];
