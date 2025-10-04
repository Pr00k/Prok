const firebaseConfig = {
    apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
    authDomain: "prok-58f05.firebaseapp.com",
    projectId: "prok-58f05",
    storageBucket: "prok-58f05.appspot.com",
    messagingSenderId: "978563434886",
    appId: "1:978563434886:web:d16c70551240a05c81c407",
    measurementId: "G-PWTGTT2VJT"
};

const ADMIN_EMAIL = "aaaab9957@gmail.com";

let app, auth, db, storage;
let firebaseInitialized = false;

try {
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        firebaseInitialized = true;
        console.log('✅ Firebase initialized successfully');
    } else {
        console.warn('⚠️ Firebase SDK not loaded');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}
