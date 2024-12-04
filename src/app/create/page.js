"use client"; // Ensure this is treated as a client component

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // Replace next/router with next/navigation
import Image from "next/image"; // Next.js optimized image component
import AsyncStorage from "@react-native-async-storage/async-storage"; // Mock for token storage
// import saveIcon from "../public/save.png"; // Adjust the path if needed
// import { ThemeContext } from "../context/ThemeContext";

export default function Create() {
  const router = useRouter(); // Use useRouter from next/navigation
//   const { darkMode } = useContext(ThemeContext);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          setToken(storedToken);
        } else {
          throw new Error("Token is missing. Please log in again.");
        }

        const storedDetails = await AsyncStorage.getItem("userDetails");
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
        } else {
          throw new Error("User details are missing. Please log in again.");
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        alert(error.message);
        router.push("/login"); // Navigate using router.push
      }
    };

    initializeData();
  }, [router]);

  const handleSave = async () => {
    if (!title.trim() || !note.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    if (!userDetails?.id || !token) {
      alert("Authentication is missing. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const requestData = {
        title: title.trim(),
        content: note.trim(),
        user_id: userDetails.id,
      };

      const response = await fetch("https://notations.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Note creation failed. Please try again.");
      }

      alert("Note created successfully");
      router.push("/home");
    } catch (error) {
      console.error("Create Note Error:", error);
      alert(error.message);
    }
  };


  return (
    <div style={styles.container}>
      <label style={styles.label}>Add a Title</label>
      <input
        type="text"
        style={styles.titleInput}
        placeholder="Enter title here"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label style={styles.label}>Write Your Note</label>
      <textarea
        style={styles.noteInput}
        placeholder="Start writing your note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>

      <button style={styles.floatingButton} onClick={handleSave}>
        {/* Add an icon or text for the button */}
        <Image
            src="/save.png"
            alt="Logo"
            width={60}
            height={60}
            
          />
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1E1E2F", // Dark purple
    padding: "20px",
    height: "100vh",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "20px",
    color: "#CFCFF0", // Light lavender
    marginBottom: "4px",
    fontWeight: "600",
  },
  titleInput: {
    height: "50px",
    backgroundColor: "#2A2A3E", // Slightly lighter purple
    padding: "12px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#E0E0F6", // Off-white
    border: "1px solid #3A3A5C", // Medium purple for border
    borderRadius: "8px",
    marginBottom: "12px",
    outline: "none",
    boxShadow: "0 0 3px rgba(255, 255, 255, 0.1)",
  },
  noteInput: {
    flex: 1,
    backgroundColor: "#2A2A3E", // Slightly lighter purple
    padding: "12px",
    fontSize: "16px",
    color: "#E0E0F6", // Off-white
    border: "1px solid #3A3A5C", // Medium purple for border
    borderRadius: "8px",
    marginBottom: "12px",
    outline: "none",
    resize: "none",
    height: "200px",
    boxShadow: "0 0 3px rgba(255, 255, 255, 0.1)",
  },
  floatingButton: {
    position: "fixed",
    bottom: "50px",
    right: "25px",
    backgroundColor: "#5A5AF6", // Bright purple for button
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#FFFFFF", // White icon
    fontSize: "20px",
    border: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
  },
};