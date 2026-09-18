// ==========================================
// FIREBASE IMPORTS
// ==========================================
import { auth, db } from "../firebase/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ==========================================
// LOGIN FORM HANDLER
// ==========================================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ==========================================
    // GET VALUES
    // ==========================================
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    // ==========================================
    // CLEAR PREVIOUS MESSAGES
    // ==========================================
    document.getElementById("loginUsernameError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    document.getElementById("loginMessage").textContent = "";
    document.getElementById("loginMessage").className = "";

    let valid = true;

    // ==========================================
    // USERNAME / EMAIL VALIDATION
    // ==========================================
    if (username === "") {
        document.getElementById("loginUsernameError").textContent = "Username is required.";
        valid = false;
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================
    if (password === "") {
        document.getElementById("loginPasswordError").textContent = "Password is required.";
        valid = false;
    }

    // ==========================================
    // LOGIN AUTHENTICATION
    // ==========================================
    if (valid) {
        // First check for teacher's default test account from laboratory manual
        const correctUsername = "admin";
        const correctPassword = "12345678";

        if (username === correctUsername && password === correctPassword) {
            sessionStorage.setItem("isMockAdmin", "true");
            alert("Login Successful! (Admin test account)");
            window.location.href = "../mainDashboard/main_dashboard.html";
            return;
        }

        // Try Firebase Authentication
        try {
            let emailToAuth = username;

            // If user entered a username instead of email, look up their email in Firebase Database
            if (!username.includes("@")) {
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    for (const uid in users) {
                        if (users[uid].username && users[uid].username.toLowerCase() === username.toLowerCase()) {
                            emailToAuth = users[uid].email;
                            break;
                        }
                    }
                }
            }

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, emailToAuth, password);
            alert("Login Successful!");
            window.location.href = "../mainDashboard/main_dashboard.html";
        } catch (error) {
            console.error("Firebase Login Error:", error);

            // Handle invalid credentials or configuration
            if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                document.getElementById("loginMessage").textContent = "Invalid username or password.";
                document.getElementById("loginMessage").className = "login-error";
            } else if (error.code === "auth/invalid-api-key" || error.message.includes("api-key")) {
                // If student has not yet pasted their real Firebase keys
                document.getElementById("loginMessage").textContent = "Please configure your Firebase keys in firebase/firebase-config.js or test with admin / 12345678";
                document.getElementById("loginMessage").className = "login-error";
            } else {
                document.getElementById("loginMessage").textContent = error.message || "Invalid username or password.";
                document.getElementById("loginMessage").className = "login-error";
            }
        }
    }
});

// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPasswordField = document.getElementById("loginPassword");

if (toggleLoginPassword && loginPasswordField) {
    toggleLoginPassword.addEventListener("click", function () {
        if (loginPasswordField.type === "password") {
            loginPasswordField.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            loginPasswordField.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
}
