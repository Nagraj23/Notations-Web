"use client";

import { useState, useEffect } from "react";

import Dashboard from "./home/page";
import Login from "./login/page";


export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return userToken && userDetails ? <Dashboard /> : <Login />;
}
