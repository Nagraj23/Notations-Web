"use client";

import { useState, useEffect } from "react";
import Dashboard from "./home/page";
import Login from "./login/page";

export default function home() {
  const [userDetails, setUserDetails] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true); // To manage the initial loading state

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userDetailsString = localStorage.getItem("userDetails");
        const token = localStorage.getItem("userToken");

        if (token && userDetailsString) {
          setUserDetails(JSON.parse(userDetailsString));
          setUserToken(token);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false); // Loading finished
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loader while data is being fetched
  }

  return userToken && userDetails ? <Dashboard /> : <Login />;
}
