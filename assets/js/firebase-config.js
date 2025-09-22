// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
  authDomain: "prok-58f05.firebaseapp.com",
  projectId: "prok-58f05",
  storageBucket: "prok-58f05.firebasestorage.app",
  messagingSenderId: "978563434886",
  appId: "1:978563434886:web:d16c70551240a05c81c407",
  measurementId: "G-PWTGTT2VJT"
};

// initialize
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
