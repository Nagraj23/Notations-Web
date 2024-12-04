"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import Image from "next/image";
import Link from "next/link";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { metadata } from "../layout";



export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password fields.");
      return;
    }
  
    try {
      const response = await fetch("https://notations.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        // Save token and user details in AsyncStorage
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userDetails", JSON.stringify(data.userData));
        console.log("User details saved:", data.userData);
  
        // Navigate to the home page (without directly passing data)
        router.push("/home"); // The home page will retrieve the data from AsyncStorage
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.logoContainer}>
          <Image
            src="/lg.png"
            alt="Logo"
            width={180}
            height={180}
            className={styles.logo}
          />
        </div>
        <h1 className={styles.title}>Notations</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>
          Login
        </button> 
        
        <Link href="register" className={styles.link}>
          Dont have an account? Sign up.
        </Link>
      </div>
    </div>
  );
}
