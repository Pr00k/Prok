// ✅ تفعيل Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
  authDomain: "prok-58f05.firebaseapp.com",
  projectId: "prok-58f05",
  storageBucket: "prok-58f05.firebasestorage.app",
  messagingSenderId: "978563434886",
  appId: "1:978563434886:web:d16c70551240a05c81c407",
  measurementId: "G-PWTGTT2VJT"
};

// ✅ تحقق إذا لم يتم تهيئة Firebase من قبل
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase App initialized successfully!");
} else if (firebase.apps.length) {
  console.log("⚠️ Firebase already initialized.");
} else {
  console.error("❌ Firebase SDK not loaded properly!");
}

// ✅ يمكنك استخدام Firestore وAuth الآن
const auth = firebase.auth();
const db = firebase.firestore();
