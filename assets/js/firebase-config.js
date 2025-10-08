// firebase-config.js (placeholder) - DO NOT commit real keys publicly.
// For production: create assets/js/config.local.js with:
// window.FIREBASE_CONFIG_LOCAL = { apiKey: "...", authDomain: "...", projectId: "...", ... };

if(window.FIREBASE_CONFIG_LOCAL && window.firebase && !firebase.apps.length){
  try{
    firebase.initializeApp(window.FIREBASE_CONFIG_LOCAL);
    console.log('Firebase initialized (local config).');
  }catch(e){
    console.warn('Firebase init failed', e);
  }
} else {
  console.log('No local Firebase config found; auth/DB disabled.');
}
