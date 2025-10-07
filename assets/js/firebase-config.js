// assets/js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
  authDomain: "prok-58f05.firebaseapp.com",
  projectId: "prok-58f05",
  storageBucket: "prok-58f05.appspot.com",
  messagingSenderId: "978563434886",
  appId: "1:978563434886:web:d16c70551240ca4f31c407",
  measurementId: "G-PWTGTT2VJT"
};

(function initFirebase(){
  try {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not found. Make sure SDK scripts are loaded in HTML.');
      return;
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized (Prok).');
    } else {
      console.log('⚠️ Firebase already initialized.');
    }
  } catch (e) {
    console.error('Failed to initialize Firebase:', e);
  }
})();

window.ProkFirebase = {
  auth: (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null,
  db: (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null,
  storage: (typeof firebase !== 'undefined' && firebase.storage) ? firebase.storage() : null
};