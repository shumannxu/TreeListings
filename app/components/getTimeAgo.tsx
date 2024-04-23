import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Function to calculate time difference and return formatted string
//
// Example Usage:
//
//      timeSincePosted: getTimeAgo(new Date(Date.now() - datePosted.getTime()))
//          -> Date.now() gets time now in milisec, datePosted.getTime() gets time when posting was made in milisec
//             If time now was Jan 14th, 9:36 AM and if the posting was made on Jan 14th, 6:30 AM,
//             will return "3 hours ago". Same applies for seconds, minutes, hours, days.
//
// Input: Date type
// Returns: formatted String  ("X hours ago" or "Y minutes ago" or "Z seconds ago" or "J days ago")
const getTimeAgo = (time: any): string => {
  const now = new Date();
  time = new Date(new Date(time.seconds * 1000 + time.nanoseconds / 1000000));
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // Difference in seconds

  if (diff < 60) {
    return `${diff}s`;
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days}d`;
  }
};

const getTimeAgo2 = (time: any): string => {
  const now = new Date();
  time = new Date(new Date(time.seconds * 1000 + time.nanoseconds / 1000000));
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // Difference in seconds

  if (diff < 60) {
    return `${diff} seconds ago`;
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minutes ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days} days ago`;
  }
};

export  {getTimeAgo, getTimeAgo2};
