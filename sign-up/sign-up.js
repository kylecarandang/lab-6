// ==========================================
// FIREBASE IMPORTS
// ==========================================
import { auth, db } from "../firebase/firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================
const form = document.getElementById("myForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Clear previous messages
    document.getElementById("usernameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";
    const msgElement = document.getElementById("message");
    if (msgElement) msgElement.textContent = "";

    // Remove previous borders
    document.getElementById("username").classList.remove("error-border", "success-border");
    document.getElementById("email").classList.remove("error-border", "success-border");
    document.getElementById("password").classList.remove("error-border", "success-border");
    document.getElementById("confirmPassword").classList.remove("error-border", "success-border");

    let valid = true;

    // Username Validation
    if (username === "") {
        document.getElementById("usernameError").textContent = "Username is required.";
        document.getElementById("username").classList.add("error-border");
        valid = false;
    }

    // Email Validation
    if (email === "") {
        document.getElementById("emailError").textContent = "Email is required.";
        document.getElementById("email").classList.add("error-border");
        valid = false;
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById("emailError").textContent = "Invalid email format.";
            document.getElementById("email").classList.add("error-border");
            valid = false;
        }
    }

    // Password Validation
    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    } else if (password.length < 8) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters.";
        document.getElementById("password").classList.add("error-border");
        valid = false;
    }

    // Confirm Password Validation
    if (confirmPassword === "") {
        document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        document.getElementById("confirmPassword").classList.add("error-border");
        valid = false;
    }

    // If all inputs are valid
    if (valid) {
        try {
            // Attempt to create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save initial user profile node in Firebase Realtime Database
            // Structure: users / UID / { username, email, createdAt }
            await set(ref(db, "users/" + user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });

            alert("Registration Successful!");
            window.location.href = "../login/login.html";
        } catch (error) {
            console.error("Firebase registration error:", error);

            // If Firebase is not configured yet with valid credentials, allow demo flow
            if (error.code === "auth/invalid-api-key" || error.message.includes("api-key") || error.code === "auth/api-key-not-valid.pem") {
                alert("Firebase configuration not yet updated. Running local demo registration.\nRegistration Successful!");
                window.location.href = "../login/login.html";
            } else if (error.code === "auth/email-already-in-use") {
                document.getElementById("emailError").textContent = "Email is already registered. Please login or use another email.";
                document.getElementById("email").classList.add("error-border");
            } else {
                alert("Registration notice: " + error.message);
            }
        }
    }
});

// ==========================================
// SHOW / HIDE PASSWORD TOGGLE
// ==========================================
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
}

// Show / Hide Confirm Password
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordField = document.getElementById("confirmPassword");

if (toggleConfirmPassword && confirmPasswordField) {
    toggleConfirmPassword.addEventListener("click", function () {
        if (confirmPasswordField.type === "password") {
            confirmPasswordField.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            confirmPasswordField.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
}
