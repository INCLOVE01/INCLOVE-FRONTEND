// Firebase initialization and shared exports for Inclove
// Using Firebase v12 modular SDK via ESM imports from gstatic

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvIkc7x8-DL1pTZliKfqaOcJ2Wi8PFWKM",
    authDomain: "inclove-566c5.firebaseapp.com",
    projectId: "inclove-566c5",
    storageBucket: "inclove-566c5.firebasestorage.app",
    messagingSenderId: "959816752975",
    appId: "1:959816752975:web:da3b079d68270e2930ef3a",
    measurementId: "G-MDW7090S7V"
};

// Initialize (support hot reload without duplicating apps)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics when available (won't break if unsupported)
let analytics = null;
try {
    analytics = getAnalytics(app);
    console.log("Analytics initialized", analytics);
} catch (err) {
    console.warn("Analytics not supported in this environment:", err?.message || err);
}

// Initialize Auth and persist session locally
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((e) => {
    console.warn("Auth persistence setup failed:", e?.message || e);
});

// Initialize Firestore
const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();

console.log("Firebase initialized successfully", app);

export { app, analytics, auth, db, googleProvider };