import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("error");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // ✅ لو نجح تسجيل الدخول
      sessionStorage.setItem("adminLoggedIn", "true");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      errorMsg.textContent = "❌ خطأ: " + error.message;
    });
});
