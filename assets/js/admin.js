// ✅ تسجيل الدخول بواسطة Google
const adminBtn = document.getElementById("adminBtn");
const adminControls = document.querySelector(".admin-controls");

adminBtn.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // 🔒 السماح فقط للإيميل المصرح له
    if (user.email === "aaaab9957@gmail.com") {
      localStorage.setItem("adminLogged", "true");
      alert("✅ تم تسجيل الدخول كأدمن!");
      location.reload();
    } else {
      alert("❌ ليس لديك صلاحية الدخول كأدمن!");
      auth.signOut();
    }
  } catch (err) {
    console.error(err);
  }
});

// ✅ حفظ الجلسة
window.addEventListener("load", () => {
  const isAdmin = localStorage.getItem("adminLogged") === "true";
  if (isAdmin) enableAdminMode();
});

function enableAdminMode() {
  document.querySelectorAll(".edit-icon").forEach(el => el.style.display = "inline");
  adminControls.style.display = "block";
  document.body.classList.add("admin-mode");
  console.log("🛠️ Admin mode activated");
}

// ✅ تسجيل الخروج بالنقر مرتين على زر الأدمن
let logoutClickCount = 0;
adminBtn.addEventListener("dblclick", () => {
  auth.signOut().then(() => {
    localStorage.removeItem("adminLogged");
    location.reload();
  });
});
