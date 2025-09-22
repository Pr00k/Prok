import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
  authDomain: "prok-58f05.firebaseapp.com",
  projectId: "prok-58f05",
  storageBucket: "prok-58f05.appspot.com",
  messagingSenderId: "978563434886",
  appId: "1:978563434886:web:d16c70551240a05c81c407",
  measurementId: "G-PWTGTT2VJT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// عند الضغط على زر الحفظ
document.getElementById("saveBtn").addEventListener("click", async () => {
  const title = document.getElementById("siteTitle").value;
  const bg = document.getElementById("siteBg").value;

  await setDoc(doc(db, "siteContent", "homepage"), {
    title: title,
    background: bg
  });

  alert("✅ تم حفظ التغييرات");
});
