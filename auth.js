import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyABqp_3IFVgUo_u1AR2cU6MVMiUT2FLo1s",
    authDomain: "reichi-000000.firebaseapp.com",
    projectId: "reichi-000000",
    storageBucket: "reichi-000000.appspot.com",
    messagingSenderId: "314742770635",
    appId: "1:314742770635:web:76588a3b719cf77d52844e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistence Configuration
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Persistence persistence error:", error);
    });

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const portalContent = document.getElementById('portalContent');
const userProfile = document.getElementById('userProfile');
const userEmailSpan = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginContainer.classList.add('hidden');
        portalContent.classList.remove('hidden');
        userProfile.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
    } else {
        // User is signed out
        loginContainer.classList.remove('hidden');
        portalContent.classList.add('hidden');
        userProfile.classList.add('hidden');
        userEmailSpan.textContent = '';
    }
});

// Event Listeners
document.getElementById('googleLogin').onclick = () => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(err => alert(err.message));
};

document.getElementById('msLogin').onclick = () => {
    const provider = new OAuthProvider('microsoft.com');
    signInWithPopup(auth, provider).catch(err => alert(err.message));
};

document.getElementById('appleLogin').onclick = () => {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider).catch(err => alert(err.message));
};

document.getElementById('emailSignUp').onclick = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) return alert("Please enter email and password");

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => alert("Account created! You are now signed in."))
        .catch(err => alert(err.message));
};

document.getElementById('emailSignIn').onclick = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) return alert("Please enter email and password");

    signInWithEmailAndPassword(auth, email, password)
        .catch(err => alert("Login failed: " + err.message));
};

logoutBtn.onclick = () => signOut(auth);
