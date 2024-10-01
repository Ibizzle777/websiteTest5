// Import the Firebase SDK components you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your Firebase config
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display tourneys
async function fetchTournaments() {
    const tourneyList = document.getElementById('tourney-list');
    const querySnapshot = await getDocs(collection(db, 'tourneys'));

    if (querySnapshot.empty) {
        tourneyList.innerHTML = "<p>No tournaments available at the moment.</p>";
    }
    else {
        querySnapshot.forEach((doc) => {
            const tourneyData = doc.data();
            const tourneyElement = document.createElement('div');
            tourneyElement.classList.add('tourney');

            // Create HTML structure for each tournament
            tourneyElement.innerHTML = `
                <h3>${tourneyData.comp_name}</h3>
                <p>Prize: ${tourneyData.comp_prize ? tourneyData.comp_prize : 'No Prize'}</p>
                <p>Registration Closes: ${tourneyData.registration_close_date}</p>
                <p>Tournament Date: ${tourneyData.comp_date}</p>
                <p>Tournament Time: ${tourneyData.comp_time}</p>
                <p>Format: ${tourneyData.comp_format}</p>
                <p><a href="${tourneyData.comp_discord}" target="_blank">Join the Discord</a></p>
            `;

            tourneyList.appendChild(tourneyElement);
        });
    }
}

// Call the function to fetch and display the tournaments
fetchTournaments();