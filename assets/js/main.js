// 🌙 تبديل السمة (الداكن / الفاتح)
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

// 📱 القائمة الجانبية
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// 🔁 تحميل البطاقات ديناميكيًا (مثال بسيط)
const cards = document.getElementById("cards");
const sampleApps = [
  { name: "لعبة الأكشن", desc: "إثارة وتشويق لا تنتهي", img: "assets/img/banner1.svg" },
  { name: "تطبيق التصوير", desc: "أفضل أداة للكاميرا", img: "assets/img/banner2.svg" },
  { name: "لعبة المغامرة", desc: "رحلة لا تُنسى!", img: "assets/img/banner3.svg" },
];

cards.innerHTML = sampleApps.map(app => `
  <article class="card fade-in">
    <img src="${app.img}" alt="${app.name}">
    <h3>${app.name}</h3>
    <p>${app.desc}</p>
  </article>
`).join("");
