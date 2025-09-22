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
                script2.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
                script2.onload = () => {
                    const script3 = document.createElement('script');
                    script3.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
                    script3.onload = () => resolve();
                    script3.onerror = reject;
                    document.head.appendChild(script3);
                };
                script2.onerror = reject;
                document.head.appendChild(script2);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        } else {
            resolve();
        }
    });
}

// تهيئة Firebase
async function initializeFirebase() {
    if (firebaseInitialized) return true;
    
    try {
        await loadFirebaseDependencies();
        firebase.initializeApp(firebaseConfig);
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        firebaseInitialized = true;
        console.log("✅ تم تهيئة Firebase بنجاح!");
        return true;
    } catch (error) {
        console.error("❌ فشل تهيئة Firebase:", error);
        return false;
    }
}

// التحقق من جاهزية Firebase
function checkFirebaseReady() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (firebaseInitialized && typeof auth !== 'undefined' && typeof db !== 'undefined') {
                clearInterval(checkInterval);
                resolve(true);
            }
        }, 100);
    });
}

// جعل الدوال متاحة globally
window.initializeFirebase = initializeFirebase;
window.checkFirebaseReady = checkFirebaseReady;