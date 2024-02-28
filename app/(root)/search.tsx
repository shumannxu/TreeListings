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
import { useAuth } from "../../context";
import SearchItem from "../components/searchItem";
import { CategoryType, Listing, UserContextType } from "../../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "../../constants";

/* Search Result Screen */
export default function Search() {
  const { listings } = useAuth() as UserContextType;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Listing[] | null>(
    listings ? Object.values(listings) : null
  );

  const safeAreaInsets = useSafeAreaInsets();
  const [sortByDropdownVisible, setSortByDropdownVisible] =
    useState<boolean>(false);

  // State for category dropdown
  const [categoryDropdownVisible, setCategoryDropdownVisible] =
    useState<boolean>(false);

  const [isInputFocused, setInputFocused] = useState<boolean>(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((category) => category.value)
  );

  // Function to toggle selection of categories
  const toggleCategorySelection = useCallback(
    (category: string) => {
      if (selectedCategories.includes(category)) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      } else {
        setSelectedCategories([...selectedCategories, category]);
      }
    },
    [selectedCategories]
  );

  // Function to toggle all categories selection
  const toggleAllCategories = useCallback(() => {
    if (selectedCategories.length === CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(CATEGORIES.map((category) => category.value));
    }
  }, []);

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
        if (selectedCategories.length > 0 && listings) {
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

  // const sortBySellerRating = useCallback(() => {
  //   const sortedResults = [...(filteredResults ?? [])].sort(
  //     (a, b) => a?.sellerRating ?? 0 - b.sellerRating
  //   );
  //   setFilteredResults(sortedResults);
  //   setSortByDropdownVisible(false); // Close the dropdown after sorting
  // }, [filteredResults]);

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
            marginTop: safeAreaInsets.top,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>Browse</Text>

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
              placeholder="Search..."
              value={searchQuery} // input value
              onChangeText={(text) => setSearchQuery(text)}
              onFocus={() => setInputFocused(true)} // Set focus state to true
              onBlur={() => setInputFocused(false)} // Set focus state to false
            />
          </View>
          {!isInputFocused && searchQuery.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                paddingVertical: 10,
              }}
            >
              <FlatList
                contentContainerStyle={{ justifyContent: "center" }}
                data={CATEGORIES}
                numColumns={4}
                scrollEnabled={false} // Enable scrolling to accommodate overflow
                showsHorizontalScrollIndicator={false} // Show horizontal scroll indicator
                renderItem={({
                  item,
                }: {
                  item: { label: string; value: CategoryType };
                }) => (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      paddingVertical: 10,
                      margin: 5,
                      width: "22%", // Fixed width to ensure proper centering
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: selectedCategories.includes(item.value)
                        ? "#E6E6E6"
                        : "transparent",
                    }}
                    onPress={() => toggleCategorySelection(item.value)}
                  >
                    <MaterialIcons name="devices" size={24} color="black" />
                    <Text style={{ textAlign: "center" }}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <ScrollView
            horizontal
            scrollEnabled={true}
            contentContainerStyle={{
              paddingHorizontal: 5,
              flexGrow: 1,
              marginTop: isInputFocused && searchQuery.length == 0 ? 25 : 0,
            }}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={sortByRecentlyAdded}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
                marginRight: 20,
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sortByPriceDescending}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
                marginRight: 20,
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                Price Descending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sortByPriceAscending}
              style={{
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#E6E6E6",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                Price Ascending
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                marginTop: 10,
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
