import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import firebaseConfig from "./config.js"; // Import the Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ban-suggestion-form");

    if (!form) {
        console.error("Form element not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values safely
        const playerName = document.getElementById("player-name")?.value.trim() || "";
        const team = document.getElementById("team")?.value.trim() || "";
        const reason = document.getElementById("sport")?.value || "";
        const comments = document.getElementById("comments")?.value.trim() || "";

        if (!playerName || !team || !reason) {
            alert("Please fill in all required fields.");
            return;
        }

        // Create submission object
        const suggestion = {
            playerName,
            team,
            reason,
            comments,
            timestamp: new Date().toISOString()
        };

        // Push to Firebase Database
        push(ref(database, "suggestions"), suggestion)
            .then(() => {
                document.getElementById("submission-message").style.display = "block";
                form.reset();
            })
            .catch((error) => {
                console.error("Error submitting suggestion:", error);
            });
    });
});
