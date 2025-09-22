// بيانات مشروعك من Firebase - استبدل القيم بالقيم الخاصة بك
const firebaseConfig = {
    apiKey: "AIzaSyDf...KKn0",
    authDomain: "prok-58f05.firebaseapp.com",
    projectId: "prok-58f05",
    storageBucket: "prok-58f05.appspot.com",
    messagingSenderId: "978563434886",
    appId: "1:978563434886:web:d16c70551240a05c81c047"
};

// حالة التهيئة
let firebaseInitialized = false;

// تحميل مكتبات Firebase
function loadFirebaseDependencies() {
    return new Promise((resolve, reject) => {
        if (typeof firebase === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
            script.onload = () => {
                const script2 = document.createElement('script');
