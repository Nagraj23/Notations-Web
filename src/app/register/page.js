"use client"; // Add this to make it a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import
import styles from "./Register.module.css";
import Image from "next/image"; // Correct import for Image
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("https://notations.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Registration successful!");
        router.push("/");
      } else {
        const error = await response.json();
        alert(error.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Use Next.js Image component for the logo */}
    <div className={styles.card}>
      <div className={styles.form}>
       <Image 
        src="/lg.png" // Path relative to the 'public' folder
        alt="Logo"
        width={150} // Adjust width
        height={150} // Adjust height
        className={styles.logo} 
      />
      <h1 className={styles.title}>Welcome to Notations </h1>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleRegister} className={styles.button}>
          Register
        </button>
        <p className={styles.link}>
        Already have an account?{" "}
        <Link href="/" className={styles.linkText}>
          Login
        </Link>
      </p>
      </div>
     </div>
    </div>
    
  );
}
