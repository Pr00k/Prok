// assets/js/firebase-config.js

// Initialize Firebase (v9+)
const firebaseConfig = {
  apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
  authDomain: "prok-58f05.firebaseapp.com",
  projectId: "prok-58f05",
  storageBucket: "prok-58f05.appspot.com",
  messagingSenderId: "978563434886",
  appId: "1:978563434886:web:d16c70551240a05c81c407",
  measurementId: "G-PWTGTT2VJT"
};

// Initialize Firebase (Compat version)
if (window.firebase && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("🔥 Firebase initialized successfully!");
}
