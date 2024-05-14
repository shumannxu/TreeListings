import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { useAuth } from "../../../context";
import SearchItem from "../../components/searchItem";
import {
  CategoryType,
  Listing,
  UserContextType,
  BikeCategoryType,
  BikeBrandType,
  BikeGender,
} from "../../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORIES,
  BIKE_CATEGORIES,
  BIKE_BRANDS,
  BIKE_GENDER,
} from "../../../constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* Search Result Screen */
export default function Search() {
  const { listings } = useAuth() as UserContextType;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Listing[] | null>(
    listings ? Object.values(listings) : null
  );

  // map
  const categoryIcons = {
    electronics: "electronics-picture",
    clothing: "clothing-picture",
    food: "food-picture",
  };

  const safeAreaInsets = useSafeAreaInsets();
  const [sortByDropdownVisible, setSortByDropdownVisible] =
    useState<boolean>(false);

  // State for category dropdown
  const [categoryDropdownVisible, setCategoryDropdownVisible] =
    useState<boolean>(false);

  const [isInputFocused, setInputFocused] = useState<boolean>(false);

  // for general categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((category) => category.value)
  );

  // for bike categories
  const [selectedBikeCategories, setSelectedBikeCategories] = useState<
    string[]
  >(BIKE_CATEGORIES.map((category) => category.value));

  // for brand categories
  const [selectedBrandCategories, setSelectedBrandCategories] = useState<
    string[]
  >(BIKE_BRANDS.map((category) => category.value));

  // for gender categories
  const [selectedGenderCategories, setSelectedGenderCategories] = useState<
    string[]
  >(BIKE_GENDER.map((category) => category.value));

  // Function to toggle selection of categories
  const toggleBikeCategorySelection = useCallback(
    (category: string) => {
      if (selectedBikeCategories.includes(category)) {
        setSelectedBikeCategories(
          selectedBikeCategories.filter((c) => c !== category)
        );
      } else {
        setSelectedBikeCategories([...selectedBikeCategories, category]);
      }
    },
    [selectedBikeCategories]
  );

  // Function to toggle selection of categories
  const toggleBrandCategorySelection = useCallback(
    (category: string) => {
      if (selectedBrandCategories.includes(category)) {
        setSelectedBrandCategories(
          selectedBrandCategories.filter((c) => c !== category)
        );
      } else {
        setSelectedBrandCategories([...selectedBrandCategories, category]);
      }
    },
    [selectedBrandCategories]
  );

  // Function to toggle selection of Gender Categories
  const toggleGenderCategorySelection = useCallback(
    (category: string) => {
      if (selectedGenderCategories.includes(category)) {
        setSelectedGenderCategories(
          selectedGenderCategories.filter((c) => c !== category)
        );
      } else {
        setSelectedGenderCategories([...selectedGenderCategories, category]);
      }
    },
    [selectedGenderCategories]
  );

  // Function to toggle all categories selection
  const toggleBikeAllCategories = useCallback(() => {
    if (selectedBikeCategories.length === BIKE_CATEGORIES.length) {
      // If all categories are currently selected, deselect all
      setSelectedBikeCategories([]);
    } else {
      // If not all categories are selected, select all
      setSelectedBikeCategories(
        BIKE_CATEGORIES.map((category) => category.value)
      );
    }
  }, [selectedBikeCategories]);

  // Function to toggle all categories selection
  const toggleBrandAllCategories = useCallback(() => {
    if (selectedBrandCategories.length === BIKE_BRANDS.length) {
      // If all categories are currently selected, deselect all
      setSelectedBrandCategories([]);
    } else {
      // If not all categories are selected, select all
      setSelectedBrandCategories(BIKE_BRANDS.map((category) => category.value));
    }
  }, [selectedBrandCategories]);

  // Function to toggle all categories selection
  const toggleGenderAllCategories = useCallback(() => {
    if (selectedGenderCategories.length === BIKE_GENDER.length) {
      // If all categories are currently selected, deselect all
      setSelectedGenderCategories([]);
    } else {
      // If not all categories are selected, select all
      setSelectedGenderCategories(
        BIKE_GENDER.map((category) => category.value)
      );
    }
  }, [selectedGenderCategories]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // (edge case) if there are no listings, there is nothing to show
      if (!listings) {
        setFilteredResults([]);
        // if there are listings
      } else {
        // filter out all non-bike listings
        const results = Object.values(listings).filter((listing) =>
          listing.categories.includes(CategoryType.BIKES)
        );
        // if there is NO search query (but yes listings)
        if (!searchQuery) {
          // (1) if any filters have "deselect all" OR No Listing
          if (
            selectedBikeCategories.length == 0 ||
            selectedBrandCategories.length == 0 ||
            selectedGenderCategories.length == 0
          ) {
            // set filter results to nothing
            setFilteredResults([]);
            // (2) if there all filters have some selection (and yes Listing but no search query )
          } else {
            // filter by each of the three categories
            const filteredByAllBikeCategories = results.filter((listing) => {
              // filter by bike category
              const matchesBikeategory = selectedBikeCategories.some(
                (category) => listing.bikeCategory?.includes(category)
              );
              // filter by bike brand
              const matchesBrandCategory =
                listing.bikeBrand &&
                selectedBrandCategories.includes(listing.bikeBrand);
              // filter by bike gender
              const matchesGenderCategory =
                listing.bikeGender &&
                selectedGenderCategories.includes(listing.bikeGender);
              // return true if all filter has matches
              return (
                matchesBikeategory &&
                matchesBrandCategory &&
                matchesGenderCategory
              );
            });
            setFilteredResults(filteredByAllBikeCategories);
          }
          // there IS search query (and yes listings)
        } else {
          // (3) not all filter has selection (and yes search query) -> nothing
          if (
            selectedBikeCategories.length == 0 ||
            selectedBrandCategories.length == 0 ||
            selectedGenderCategories.length == 0
          ) {
            setFilteredResults([]);
            // (4) there all filter has some selection (and yes search query) -> condition by all
          } else {
            const filteredByAllBikeCategories = results.filter((listing) => {
              // filter by bike category
              const matchesBikeategory = selectedBikeCategories.some(
                (category) => listing.bikeCategory?.includes(category)
              );
              // filter by bike brand
              const matchesBrandCategory =
                listing.bikeBrand &&
                selectedBrandCategories.includes(listing.bikeBrand);
              // filter by bike gender
              const matchesGenderCategory =
                listing.bikeGender &&
                selectedGenderCategories.includes(listing.bikeGender);

              const matchesSearchQuery = listing.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

              // return true if all filter has matches
              return (
                matchesBikeategory &&
                matchesBrandCategory &&
                matchesGenderCategory &&
                matchesSearchQuery
              );
            });
          }
        }
      }
    }, 500); // 500 ms delay
    return () => clearTimeout(delayDebounce);
  }, [
    searchQuery,
    listings,
    selectedBikeCategories,
    selectedBrandCategories,
    selectedGenderCategories,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <SearchItem item={item} />,
    []
  );

  // methods for sorting (for drop down menus)
  const sortByRecentlyAdded = useCallback(() => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => b.datePosted - a.datePosted
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  }, [filteredResults]);

  const sortByPriceDescending = useCallback(() => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => b.price - a.price
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  }, [filteredResults]);

  const sortByPriceAscending = useCallback(() => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => a.price - b.price
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  }, [filteredResults]);

  const resetSort = useCallback(() => {
    // Restore original search results without affecting the current filtering
    const results = Object.values(listings).filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
    setSortByDropdownVisible(false); // Close the dropdown after resetting
  }, [listings, searchQuery]);

  return (
    // dropdown menu dissapears if user touches anywhere else on the screen
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: safeAreaInsets.top + 10, // Adjust for safe area
          left: 10,
          zIndex: 10, // Ensure it's above other elements
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back-outline" size={40} color="#38B39C" />
      </TouchableOpacity>

      <TouchableWithoutFeedback
        onPress={() => {
          setSortByDropdownVisible(false);
          setCategoryDropdownVisible(false);
          setInputFocused(false);
          Keyboard.dismiss();
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: safeAreaInsets.top + 60,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            Bikes & Accessories{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              marginTop: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: 45,
                // borderColor: "black",
                paddingHorizontal: 10,
                backgroundColor: "#E6E6E6",
                shadowColor: "black",
                shadowOffset: { width: 1, height: 4 }, // Shadow offset
                shadowOpacity: 0.2, // Shadow opacity
                shadowRadius: 5, // Shadow radius
                elevation: 2, // Elevation for Android
                borderRadius: 30,
                // borderWidth: 1,
              }}
              placeholder="Search Bike Brand, Name, Type..."
              value={searchQuery} // input value
              onChangeText={(text) => setSearchQuery(text)}
              onFocus={() => setInputFocused(true)} // Set focus state to true
              onBlur={() => setInputFocused(false)} // Set focus state to false
            />
            <TouchableOpacity
              onPress={() => Keyboard.dismiss()}
              style={{
                position: "absolute", // Position the button absolutely
                right: 10, // Adjust the right spacing as needed
                zIndex: 1, // Ensure the button is above other content
              }}
            >
              <MaterialIcons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* (1) For Bike Categories */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 0,
              marginBottom: 5,
              marginTop: 15,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Filter by Bike Types
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 5,
                marginTop: 10,
              }}
              onPress={toggleBikeAllCategories}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginRight: 10,
                  textAlign: "center",
                }}
              >
                {selectedBikeCategories.length === BIKE_CATEGORIES.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          {!isInputFocused && searchQuery.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                paddingVertical: 0,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {BIKE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                      paddingBottom: 10,
                      paddingTop: 5,
                      marginTop: 0,
                      marginBottom: 10,
                      marginHorizontal: 5,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: selectedBikeCategories.includes(
                        category.value
                      )
                        ? "#E6E6E6"
                        : "transparent",
                    }}
                    onPress={() => toggleBikeCategorySelection(category.value)}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 18,
                        // fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* (2) For Brand Categories */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 0,
              marginBottom: 5,
              marginTop: 0,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Filter by Brands
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 5,
                marginTop: 10,
              }}
              onPress={toggleBrandAllCategories}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginRight: 10,
                  textAlign: "center",
                }}
              >
                {selectedBrandCategories.length === BIKE_BRANDS.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          {!isInputFocused && searchQuery.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                paddingVertical: 0,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {BIKE_BRANDS.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                      paddingBottom: 10,
                      paddingTop: 5,
                      marginTop: 0,
                      marginBottom: 10,
                      marginHorizontal: 5,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: selectedBrandCategories.includes(
                        category.value
                      )
                        ? "#E6E6E6"
                        : "transparent",
                    }}
                    onPress={() => toggleBrandCategorySelection(category.value)}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 18,
                        // fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* (3) For Brand Categories */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 0,
              marginBottom: 5,
              marginTop: 0,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Filter by Gender
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 5,
                marginTop: 10,
              }}
              onPress={toggleGenderAllCategories}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginRight: 10,
                  textAlign: "center",
                }}
              >
                {selectedGenderCategories.length === BIKE_GENDER.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          {!isInputFocused && searchQuery.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                paddingVertical: 0,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {BIKE_GENDER.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                      paddingBottom: 10,
                      paddingTop: 5,
                      marginTop: 0,
                      marginBottom: 10,
                      marginHorizontal: 5,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: selectedGenderCategories.includes(
                        category.value
                      )
                        ? "#E6E6E6"
                        : "transparent",
                    }}
                    onPress={() =>
                      toggleGenderCategorySelection(category.value)
                    }
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 18,
                        // fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 20, paddingBottom: 10 }}>
            Sort by
          </Text>

          <ScrollView
            horizontal
            scrollEnabled={true}
            contentContainerStyle={{
              paddingHorizontal: 5,
              flexGrow: 1,
              marginTop: !isInputFocused && !searchQuery.length ? 0 : 15, // edited the logic to resolve overlaps with search tab
            }}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={sortByRecentlyAdded}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
                marginRight: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>Recent </Text>
              <MaterialIcons name="access-time" size={24} color="#38B39C" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sortByPriceDescending}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
                marginRight: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                Price Descending{" "}
              </Text>
              <MaterialCommunityIcons
                name="order-numeric-descending"
                size={24}
                color="#38B39C"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sortByPriceAscending}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                Price Ascending{" "}
              </Text>
              <MaterialCommunityIcons
                name="order-numeric-ascending"
                size={24}
                color="#38B39C"
              />
            </TouchableOpacity>
          </ScrollView>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                marginTop: 20,
              }}
            >
              Search Results
            </Text>
          </View>

          <FlatList
            data={filteredResults}
            initialNumToRender={7}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.listingId}
          />
          {isInputFocused && (
            <View
              style={{
                position: "absolute",
                top: 90,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "auto",
                zIndex: 1, // Make sure it covers other components
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
