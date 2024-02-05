import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { User } from "../types";

const interestsList = ["Art", "Technology", "Music", "Sports", "Fashion"];

const PreferenceSurvey = ({ user }: { user: User }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [animationFinished, setAnimationFinished] = useState(false); // State to track if animation has finished
  const shakeAnimation = useRef(new Animated.Value(0)).current; // Initial value for tree shake

  useEffect(() => {
    // Tree shake animation
    Animated.sequence([
      Animated.delay(1500), // Wait for 1.5 seconds
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimationFinished(true)); // Set animationFinished to true when animation ends
  }, [shakeAnimation]);

  const handleSelectInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {};

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
      <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 20 }}>
        Choose Your Interests
      </Text>
      {interestsList.map((interest, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: selectedInterests.includes(interest)
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
              color: selectedInterests.includes(interest) ? "#fff" : "#000",
            }}
          >
            {interest}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={{
          backgroundColor: "#f4511e",
          padding: 10,
          marginTop: 20,
          borderRadius: 20,
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "#fff" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PreferenceSurvey;
