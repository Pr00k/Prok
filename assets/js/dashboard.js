// منع أي شخص يدخل لوحة التحكم بدون تسجيل دخول
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "index.html";
});
