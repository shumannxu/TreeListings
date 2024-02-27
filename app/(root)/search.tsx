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
} from "react-native";
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import { Listing, UserContextType } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryType } from "../../types";
import { CATEGORIES } from "../../constants";

/* Search Result Screen */
export default function Search() {
  const { user, setUser, listings } = useAuth() as UserContextType;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Listing[] | null>(
    listings ? Object.values(listings) : null
  );

  const safeAreaInsets = useSafeAreaInsets();
  const [sortByDropdownVisible, setSortByDropdownVisible] =
    useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(""); // State to track the sorting criteria

  // State for category dropdown
  const [categoryDropdownVisible, setCategoryDropdownVisible] =
    useState<boolean>(false);
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((category) => category.value)
  );

  // Function to toggle selection of categories
  const toggleCategorySelection = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Function to toggle all categories selection
  const toggleAllCategories = () => {
    if (selectedCategories.length === CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(CATEGORIES.map((category) => category.value));
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery && listings) {
        const results = Object.values(listings).filter((listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        // Filter by selected categories if any categories are selected
        if (selectedCategories.length > 0) {
          // if there is search query
          if (searchQuery) {
            const filteredByCategoryAndSearch = results.filter(
              (listing) =>
                // Check if the listing title includes the search query
                listing.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) &&
                // Check if the listing belongs to any of the selected categories
                selectedCategories.some((category) =>
                  listing.categories.includes(category)
                )
            );
            setFilteredResults(filteredByCategoryAndSearch);
          } else {
            // no search query
            const filteredByCategory = results.filter((listing) =>
              selectedCategories.some((category) =>
                listing.categories.includes(category)
              )
            );
            setFilteredResults(filteredByCategory);
          }
        } else {
          // display nothing when user de-selected all categories
          setFilteredResults([]);
        }
      } else {
        // If there's no search query, apply category filter if any categories are selected
        if (selectedCategories.length > 0) {
          const filteredByCategory = Object.values(listings).filter((listing) =>
            selectedCategories.some((category) =>
              listing.categories.includes(category)
            )
          );
          setFilteredResults(filteredByCategory);
        } else {
          // display nothing
          setFilteredResults([]);
        }
      }
    }, 500); // 500 ms delay

    return () => clearTimeout(delayDebounce);
    // }, [searchQuery, listings]);
  }, [searchQuery, listings, selectedCategories]);

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => <SearchItem item={item} />,
    []
  );

  // methods for sorting (for drop down menus)
  const sortByRecentlyAdded = () => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => b.datePosted - a.datePosted
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  };

  const sortByPriceDescending = () => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => b.price - a.price
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  };

  const sortByPriceAscending = () => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => a.price - b.price
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  };

  const sortBySellerRating = () => {
    const sortedResults = [...(filteredResults ?? [])].sort(
      (a, b) => a.sellerRating - b.sellerRating
    );
    setFilteredResults(sortedResults);
    setSortByDropdownVisible(false); // Close the dropdown after sorting
  };

  const resetSort = () => {
    // Restore original search results without affecting the current filtering
    const results = Object.values(listings).filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
    setSortByDropdownVisible(false); // Close the dropdown after resetting
  };

  return (
    // dropdown menu dissapears if user touches anywhere else on the screen
    <TouchableWithoutFeedback
      onPress={() => {
        setSortByDropdownVisible(false);
        setCategoryDropdownVisible(false);
      }}
    >
      <View style={{ flex: 1, marginTop: safeAreaInsets.top }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            marginHorizontal: 20,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 45,
              // borderColor: "black",
              borderWidth: 1,
              paddingHorizontal: 10,
              backgroundColor: "#E0D6FA",
              borderColor: "#E0D6FA",
              shadowColor: "#508EBA",
              shadowOffset: { width: 5, height: 7 }, // Shadow offset
              shadowOpacity: 0.5, // Shadow opacity
              shadowRadius: 5, // Shadow radius
              elevation: 2, // Elevation for Android
              borderRadius: 10,
              // borderWidth: 1,
            }}
            placeholder="Search..."
            value={searchQuery} // input value
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {/* Sort By Button */}
        <TouchableOpacity
          onPress={() => setSortByDropdownVisible(!sortByDropdownVisible)}
          style={{
            position: "absolute",
            top: safeAreaInsets.top + 10,
            marginHorizontal: 20,
            width: 140,
            height: 40,
            // backgroundColor: "white",
            padding: 10,
            zIndex: 1,
            backgroundColor: "lavender",
            borderColor: "lavender",
            shadowColor: "#508EBA",
            shadowOffset: { width: 3, height: 4 }, // Shadow offset
            shadowOpacity: 0.5, // Shadow opacity
            shadowRadius: 5, // Shadow radius
            elevation: 2, // Elevation for Android
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text>Sort By</Text>
        </TouchableOpacity>

        {/* Sort By Dropdown */}
        {sortByDropdownVisible && (
          <View
            style={{
              position: "absolute",
              top: safeAreaInsets.top + 50,
              // left: safeAreaInsets.left + 10,
              marginHorizontal: 20,
              width: 140,
              backgroundColor: "white",
              borderColor: "white",
              shadowColor: "#508EBA",
              shadowOffset: { width: 2, height: 2 }, // Shadow offset
              shadowOpacity: 0.5, // Shadow opacity
              shadowRadius: 5, // Shadow radius
              elevation: 2, // Elevation for Android
              borderWidth: 1,
              padding: 10,
              zIndex: 1,
              borderRadius: 10,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={sortByRecentlyAdded}>
                <Text>Recently Added</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={sortByPriceDescending}>
                <Text>Price Descending</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={sortByPriceAscending}>
                <Text>Price Ascending</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={sortBySellerRating}>
                <Text>Seller Rating</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={resetSort}>
                <Text>Reset Sort</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Categories Dropdown */}
        <TouchableOpacity
          onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
          style={{
            position: "absolute",
            top: safeAreaInsets.top + 10,
            right: safeAreaInsets.right + 20, // Adjust as needed
            width: 190,
            height: 40,
            padding: 10,
            zIndex: 1,
            // backgroundColor: "#E6E6FA",
            backgroundColor: "#E0F6FA",
            borderColor: "#E6E6FA",
            shadowColor: "#508EBA",
            shadowOffset: { width: 3, height: 4 }, // Shadow offset
            shadowOpacity: 0.5, // Shadow opacity
            shadowRadius: 5, // Shadow radius
            elevation: 2, // Elevation for Android
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "left" }}>
            Categories ({selectedCategories.length}/{CATEGORIES.length}){" "}
          </Text>
        </TouchableOpacity>

        {/* Category Dropdown Menu */}
        {categoryDropdownVisible && (
          <View
            style={{
              position: "absolute",
              top: safeAreaInsets.top + 50,
              right: safeAreaInsets.right + 20,
              width: 190,
              backgroundColor: "white",
              borderColor: "white",
              borderWidth: 1,
              padding: 10,
              zIndex: 1,
              borderRadius: 10,
            }}
          >
            {/* <ScrollView style={{ maxHeight: 400 }}> */}
            <TouchableOpacity onPress={toggleAllCategories}>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Select/Deselect All
              </Text>
            </TouchableOpacity>
            <ScrollView
              style={{
                maxHeight: 400,
                marginTop: 5,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "gray",
              }}
            >
              {CATEGORIES.map((category) => (
                <View key={category.value} style={{ marginBottom: 10 }}>
                  <TouchableOpacity
                    onPress={() => toggleCategorySelection(category.value)}
                    style={{
                      backgroundColor: selectedCategories.includes(
                        category.value
                      )
                        ? "lightblue"
                        : "transparent",
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text>{category.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Categories Dropdown END */}

        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              top: safeAreaInsets.top + 15,
              marginLeft: 20,
            }}
          >
            Search Results
          </Text>
        </View>

        <FlatList
          data={filteredResults ? filteredResults : []}
          initialNumToRender={7}
          renderItem={renderItem}
          keyExtractor={(item) => item.listingId}
          style={{ marginTop: 60 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
