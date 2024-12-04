"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./edit.module.css";
import Image from "next/image"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const Edit = () => {
  const router = useRouter();
  const [note, setNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const noteData = await AsyncStorage.getItem("selectedNote"); // Await the promise
        if (noteData) {
          const parsedNote = JSON.parse(noteData);
          setNote(parsedNote);
          setTitle(parsedNote.title || "");
          setContent(parsedNote.content || "");
        } else {
          console.error("No note found in AsyncStorage.");
          router.push("/home"); // Redirect back if note is missing
        }
      } catch (error) {
        console.error("Error retrieving note:", error);
        router.push("/home"); // Redirect on error
      }
    };
  
    fetchNoteData();
  }, [router]);
  // Function to save the note
  const saveNote = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const updatedNote = { ...note, title, content };

      const response = await fetch(`https://notations.onrender.com/edit/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to save the note.");
      }

      alert("Note saved successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Error saving note:", error);
      alert(error.message || "Failed to save the note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
      
        onClick={saveNote}
        disabled={loading}
      >
        <Image 
        src="/save.png" // Path relative to the 'public' folder
        alt="Logo"
        width={70} // Adjust width
        height={70} // Adjust height
        className={styles.addButton}
      />
      </button>
    </div>
  );
};

export default Edit;
