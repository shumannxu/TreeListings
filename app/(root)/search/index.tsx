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
import { CategoryType, Listing, UserContextType } from "../../../types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "../../../constants";
import { MainText } from "../../../components/text";
import TopNav from "../../../components/topNav";
import SubTopNav from "../../../components/subTopNav";

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

  // function to navigate
  const navigateToBikeSearch = useCallback(() => {
    router.push("/search/bikeSearch");
  }, []);

  // Function to toggle all categories selection
  const toggleAllCategories = useCallback(() => {
    if (selectedCategories.length === CATEGORIES.length) {
      // If all categories are currently selected, deselect all
      setSelectedCategories([]);
    } else {
      // If not all categories are selected, select all
      setSelectedCategories(CATEGORIES.map((category) => category.value));
    }
  }, [selectedCategories]);

  // Stemmer function
  function stemWord(word) {
    // Step 1a
    if (word.endsWith("sses")) {
      word = word.slice(0, -2);
    } else if (word.endsWith("ies") || word.endsWith("ss")) {
      // do nothing
    } else if (word.endsWith("s")) {
      word = word.slice(0, -1);
    }

    // Step 1b
    if (word.endsWith("eed")) {
      if (word.length - 4 >= 1) {
        word = word.slice(0, -1);
      }
    } else if (word.endsWith("ed") && word.search(/[aeiou]/) != -1) {
      word = word.slice(0, -2);
      if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
        word += "e";
      } else if (
        word.length >= 2 &&
        word.endsWith(word[word.length - 1]) &&
        !word.endsWith("l") &&
        !word.endsWith("s") &&
        !word.endsWith("z")
      ) {
        word = word.slice(0, -1);
      } else if (
        word.length >= 3 &&
        word.search(/[^aeiou][aeiou][^aeiouwxy]$/) != -1
      ) {
        word += "e";
      }
    } else if (word.endsWith("ing") && word.search(/[aeiou]/) != -1) {
      word = word.slice(0, -3);
      if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
        word += "e";
      } else if (
        word.length >= 2 &&
        word.endsWith(word[word.length - 1]) &&
        !word.endsWith("l") &&
        !word.endsWith("s") &&
        !word.endsWith("z")
      ) {
        word = word.slice(0, -1);
      } else if (
        word.length >= 3 &&
        word.search(/[^aeiou][aeiou][^aeiouwxy]$/) != -1
      ) {
        word += "e";
      }
    }

    // Step 1c
    if (word.endsWith("y") && word.search(/[aeiou]/) != -1) {
      word = word.slice(0, -1) + "i";
    }

    // Return the stemmed word
    return word;
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery && listings) {
        // Tokenize the search query into individual words
        const queryWords = searchQuery
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length >= 3) // filtering by word length 3 to prevent queries like 'Apple o' to display all results that include 'o' in the title
          .map((word) => stemWord(word)); // Apply the stemWord function to each word

        const directMatches = Object.values(listings).filter(
          (listing) =>
            // Check for direct character or word matches in title or keywords
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (listing.keywords !== null &&
              listing.keywords?.some((keyword) =>
                keyword.toLowerCase().includes(searchQuery.toLowerCase())
              ))
        );

        // Check for matches of any word in the query matching title or keywords
        const wordMatches = Object.values(listings).filter((listing) =>
          queryWords.some(
            (word) =>
              listing.title.toLowerCase().includes(word.toLowerCase()) ||
              (listing.keywords !== null &&
                listing.keywords?.some((keyword) =>
                  keyword.toLowerCase().includes(word.toLowerCase())
                ))
          )
        );

        // Combine direct matches and word matches
        const results = [...new Set([...directMatches, ...wordMatches])];

        // Filter by selected categories if any categories are selected
        if (selectedCategories.length > 0) {
          // if there is search query
          // Filter by user's selected categories
          const filteredByCategory = results.filter((listing) =>
            selectedCategories.some((category) =>
              listing.categories.includes(category)
            )
          );
          // set the filtered results
          setFilteredResults(filteredByCategory);
        } else {
          // display all results if no categories are selected
          setFilteredResults(results);
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
            marginTop: safeAreaInsets.top + 10,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>Browse</Text>

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

          <TouchableOpacity
            onPress={navigateToBikeSearch}
            style={{
              padding: 10,
              backgroundColor: "#38B39C",
              borderRadius: 5,
              marginBottom: 5,
              marginTop: 15,
              height: 85,
              alignItems: "center", // Center the content horizontally
            }}
          >
            {/* Remove the extra parentheses */}
            <MaterialIcons name="bike-scooter" size={40} color="#fff" />
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Tap Here to Explore Bikes
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 0,
              marginBottom: 5,
              marginTop: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              General Categories
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 5,
                marginTop: 5,
              }}
              onPress={toggleAllCategories}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginRight: 10,
                }}
              >
                {selectedCategories.length === CATEGORIES.length
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
                      height: 75, // Fixed height
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",

                      backgroundColor: selectedCategories.includes(item.value)
                        ? "#E6E6E6"
                        : "transparent",
                    }}
                    onPress={() => toggleCategorySelection(item.value)}
                  >
                    {item.value === CategoryType.ELECTRONICS && (
                      <MaterialIcons name="devices" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.SERVICE && (
                      <MaterialIcons
                        name="home-repair-service"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.VEHICLES && (
                      <MaterialIcons
                        name="bike-scooter"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.PROPERTY_RENTALS && (
                      <FontAwesome5
                        name="house-user"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.APPAREL && (
                      <FontAwesome5 name="tshirt" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.ENTERTAINMENT && (
                      <FontAwesome5 name="tv" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.FAMILY && (
                      <AntDesign name="heart" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.FREE_STUFF && (
                      <MaterialIcons
                        name="money-off"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.GARDEN_OUTDOOR && (
                      <Entypo name="flower" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.HOBBIES && (
                      <FontAwesome5
                        name="paint-brush"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.HOME_GOODS && (
                      <FontAwesome5 name="couch" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.MUSICAL_INSTRUMENTS && (
                      <MaterialCommunityIcons
                        name="violin"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.OFFICE_SUPPLIES && (
                      <MaterialCommunityIcons
                        name="office-building"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.PET_SUPPLIES && (
                      <MaterialIcons name="pets" size={24} color="#38B39C" />
                    )}
                    {item.value === CategoryType.SPORTING_GOODS && (
                      <FontAwesome
                        name="soccer-ball-o"
                        size={24}
                        color="#38B39C"
                      />
                    )}
                    {item.value === CategoryType.TOYS_GAMES && (
                      <Entypo
                        name="game-controller"
                        size={24}
                        color="#38B39C"
                      />
                    )}

                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9.5, // set the fontsize
                        fontWeight: "bold", // set it bold
                        marginTop: 7.5,
                      }}
                    >
                      {item.label}
                    </Text>
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
