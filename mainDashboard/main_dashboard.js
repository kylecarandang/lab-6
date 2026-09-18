// ==========================================
// FIREBASE IMPORTS
// ==========================================
import { auth, db } from "../firebase/firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ==========================================
// AUTH STATE CHECK & ACCESS CONTROL (Activity 4 & 6)
// ==========================================
onAuthStateChanged(auth, async (user) => {
    // Unauthenticated protection: redirect unauthenticated users
    if (!user) {
        const isMockAdmin = sessionStorage.getItem("isMockAdmin");
        if (!isMockAdmin) {
            window.location.href = "../login/login.html";
            return;
        }
        const welcomeEl = document.getElementById("welcomeUser");
        if (welcomeEl) welcomeEl.textContent = "Welcome back, Admin!";
        return;
    }

    // Authenticated user: display greeting with their name/username
    try {
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);
        const welcomeEl = document.getElementById("welcomeUser");

        if (snapshot.exists()) {
            const data = snapshot.val();
            let name = data.username;
            if (data.profile && data.profile.givenName) {
                name = data.profile.givenName;
            }
            if (welcomeEl) welcomeEl.textContent = `Welcome back, ${name}!`;
        } else {
            const fallbackName = user.displayName || (user.email ? user.email.split("@")[0] : "User");
            if (welcomeEl) welcomeEl.textContent = `Welcome back, ${fallbackName}!`;
        }
    } catch (e) {
        console.warn("Notice loading user greeting:", e);
    }
});

// ==========================================
// LOGOUT FUNCTION (Activity 4 & 6)
// ==========================================
async function logout() {
    try {
        sessionStorage.removeItem("isMockAdmin");
        await signOut(auth);
    } catch (error) {
        console.warn("Logout notice:", error);
    }
    alert("You have been logged out.");
    window.location.href = "../login/login.html";
}

// Make logout available globally for HTML onclick
window.logout = logout;
