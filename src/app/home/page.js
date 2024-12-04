"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js routing
import { format } from "date-fns"; // Importing date formatting utility
import styles from "./home.module.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard({ route }) {
  //  const { token: routeToken} = route.params || {};
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);


  const getToken = async () => {
    try {
      return  (await AsyncStorage.getItem("userToken"));
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };
  
  // Fetch user details and token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetailsString = localStorage.getItem("userDetails");
        const userToken = localStorage.getItem("userToken");

        if (userToken && userDetailsString) {
          setUserDetails(JSON.parse(userDetailsString));
        } else {
          alert("No user details found. Redirecting to login...");
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch notes from the API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Await the token retrieval
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setError("Authentication token is missing.");
          return;
        }
  
        const response = await fetch("https://notations.onrender.com/notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token correctly
          },
        });
  
        // Log the response for debugging
        console.log("Response:", response);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch notes.");
        }
  
        const data = await response.json();
  
        // Ensure `notes` is an array before processing
        if (Array.isArray(data.notes)) {
          setNotes(
            data.notes.map((note) => ({
              ...note,
              id: note.id || note._id, // Use a fallback for the ID
            }))
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch notes:", err.message);
      }
    };
  
    fetchNotes();
  }, []);
  

  // Open the modal for a selected note
  const openModal = (note) => {
    if (!note || !note.id) {
      console.error("Invalid note: ", note);
      alert("This note does not have a valid ID.");
      return;
    }
    setSelectedNote(note);
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedNote(null);
    setModalVisible(false);
  };

  // Delete a note
  const handleDelete = async (id) => {
    console.log("Initiating delete process for note ID:", id); // Log note ID
  
    try {
      const token = await getToken();
      if (!token) {
        console.error("Token retrieval failed: Authentication token is missing.");
        throw new Error("Authentication token is missing.");
      }
  
      console.log("Token retrieved successfully:", token);
  
      // Log the API endpoint
      const endpoint = `https://notations.onrender.com/delete/${id}`;
      console.log("Sending DELETE request to:", endpoint);
  
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Log response status and headers
      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers.entries()],
      });
  
      if (!response.ok) {
        // Attempt to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (parsingError) {
          console.error("Error parsing response JSON:", parsingError);
          throw new Error(
            `Failed to delete the note. Response status: ${response.status} ${response.statusText}`
          );
        }
  
        console.error("Error response from server:", errorData);
        throw new Error(errorData.error || "Failed to delete the note.");
      }
  
      // Log success
      console.log("Note deleted successfully. Updating state...");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
  
      // Provide success feedback
      alert("Success", "Note deleted successfully.");
      closeModal();
    } catch (error) {
      console.error("An error occurred while deleting the note:", error);
      alert("Error", error.message || "Failed to delete the note.");
    }
  };
  
  // Navigate to the edit page
  const navigateToEdit = (note) => {
    closeModal();
   AsyncStorage.setItem("selectedNote", JSON.stringify(note));
    router.push(`/edit/${note._id}`);
  };
  

  // Navigate to the create page
  const navigateToCreate = () => {
    router.push("/create");
  };

  return (
    <>
      <div className={styles.thoughts}>
        <h1 className={styles.add}>Add your thoughts here!</h1>
      </div>

      {/* Modal */}
      {modalVisible && selectedNote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {selectedNote.title || "Note Details"}
            </h3>
            <p className={styles.modalBody}>
              {selectedNote.content || "No content available"}
            </p>
            <p className={styles.modalDetails}>
              Date:{" "}
              {selectedNote.createdAt
                ? format(new Date(selectedNote.createdAt), "yyyy-MM-dd")
                : "N/A"}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.actionButton}
                onClick={() => navigateToEdit(selectedNote)}
              >
                Edit
              </button>
              <button
                className={styles.actionButton}
                onClick={() => handleDelete(selectedNote.id)}
              >
                Delete
              </button>
            </div>
            <button className={styles.closeButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      <div className={styles.scrollContainer}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={styles.card}
            onClick={() => openModal(note)}
          >
            <span className={styles.title}>{note.title}</span>
            <p className={styles.content}>{note.content}</p>
           
          </div>
        ))}
      </div>

      {/* Add button */}
      <button className={styles.addButton} onClick={navigateToCreate}>
        +
      </button>

     
    </>
  );
}
