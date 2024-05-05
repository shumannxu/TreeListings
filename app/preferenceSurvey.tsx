import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { User } from "../types";
import { router } from "expo-router";

const allInterestsList = [
  ["Art", "Technology", "Music"],
  ["Sports", "Fashion", "Literature"],
  ["Movies", "Science", "Cooking"],
];

const PreferenceSurvey = ({ user }: { user: User }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[][]>(
    allInterestsList.map(() => [])
  );
  const [currentRound, setCurrentRound] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimationFinished(true));
  }, [shakeAnimation]);

  const handleSelectInterest = (interest: string) => {
    const updatedInterests = [...selectedInterests];
    const currentInterests = updatedInterests[currentRound];
    if (currentInterests.includes(interest)) {
      updatedInterests[currentRound] = currentInterests.filter(
        (item) => item !== interest
      );
    } else {
      updatedInterests[currentRound] = [...currentInterests, interest];
    }
    setSelectedInterests(updatedInterests);
  };

  const handleSubmit = async () => {
    if (currentRound < allInterestsList.length - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      // Navigate to next page or handle final submit
      console.log("Final interests selected:", selectedInterests);
      router.push("/nextPage"); // Assuming nextPage is the route to navigate after final submit
    }
  };

  const handlePrevious = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    }
  };

  const shakeInterpolate = shakeAnimation.interpolate({
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: ["0deg", "-5deg", "5deg", "0deg"],
  });

  const shakeStyle = {
    transform: [{ rotate: shakeInterpolate }],
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Animated.View style={shakeStyle}>
        <Image
          source={require("../assets/treelisting.png")}
          style={{ width: 300, height: 300 }}
        />
      </Animated.View>
      <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}>
        Choose Your Interests (Round {currentRound + 1} of{" "}
        {allInterestsList.length})
      </Text>
      {allInterestsList[currentRound].map((interest, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: selectedInterests[currentRound].includes(interest)
              ? "#f4511e"
              : "#eee",
            padding: 10,
            margin: 5,
            borderRadius: 20,
          }}
          onPress={() => handleSelectInterest(interest)}
        >
          <Text
            style={{
              color: selectedInterests[currentRound].includes(interest)
                ? "#fff"
                : "#000",
            }}
          >
            {interest}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        {Array.from({ length: allInterestsList.length }).map((_, idx) => (
          <Text
            key={idx}
            style={{
              fontSize: idx === currentRound ? 24 : 24,
              color: idx === currentRound ? "#f4511e" : "#ccc",
            }}
          >
            •
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#f4511e",
          padding: 10,
          marginTop: 20,
          borderRadius: 20,
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "#fff" }}>Next</Text>
      </TouchableOpacity>
      {currentRound > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: "#ccc",
            padding: 10,
            marginTop: 10,
            borderRadius: 20,
          }}
          onPress={handlePrevious}
        >
          <Text style={{ color: "#fff" }}>Previous</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PreferenceSurvey;
