import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import Home from "./home";
import Login from "./(auth)/login";

export default function Root() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  return user ? <Home /> : <Login />;
}
