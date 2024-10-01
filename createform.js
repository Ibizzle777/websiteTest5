// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: config.api_key,
    authDomain: config.auth_domain,
    projectId: config.project_id,
    storageBucket: config.storage_bucket,
    messagingSenderId: config.messaging_sender_id,
    appId: config.app_id,
    measurementId: config.measurement_id
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
console.log("Firebase initialized.");

// Function to show messages
function showMessage(message, tourneyMessage) {
    var messageDiv = document.getElementById(tourneyMessage);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Event listener for creating a new tournament
const createTourney = document.getElementById('createButton');
createTourney.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("Create button clicked.");

    // Check if the user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is authenticated:", user.uid);

            // Retrieve form values
            const compName = document.getElementById('comp-name').value;
            const prize = document.getElementById('prize').value;
            const registrationsClose = document.getElementById('registrations-close').value;
            const compDate = document.getElementById('comp-date').value;
            const compTime = document.getElementById('comp-time').value;
            const tourneyFormat = document.getElementById('tourney-format').value;
            const discordLink = document.getElementById('discord-link').value;
            const TandCs = document.getElementById('TandCs').value;

            console.log("Form values retrieved:", {compName, prize, registrationsClose, compDate, compTime, tourneyFormat, discordLink, TandCs});

            // Data to be stored in the "tourneys" collection
            const tourneyData = {
                comp_name: compName,
                comp_prize: prize,
                registration_close_date: registrationsClose,
                comp_date: compDate,
                comp_time: compTime,
                comp_format: tourneyFormat,
                comp_discord: discordLink,
                tandcs_agreement: TandCs,
                organizerUid: user.uid, // Store the user's UID as the tournament organizer
                created_at: Timestamp.now() // Add a timestamp of creation
            };

            console.log("Attempting to create Firestore document...");

            // Create a new document in the "tourneys" collection
            const docRef = doc(collection(db, "tourneys")); // Create a new unique document
            setDoc(docRef, tourneyData)
                .then(() => {
                    console.log("Tournament created successfully.");
                    showMessage('Tournament Created Successfully', 'tourneyMessage');
                    window.location.href = 'tourneyLanding.html'; // Redirect upon success
                })
                .catch((error) => {
                    console.error("Error writing document:", error);
                    showMessage('Failed to Create Tournament', 'tourneyMessage');
                });
        } else {
            console.log("User is not authenticated.");
            showMessage('User is not logged in', 'tourneyMessage');
        }
    });
});