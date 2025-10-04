// ======================
// Prok Advanced Script
// ======================

// ✅ تفعيل AOS (أنيميشن مع التمرير)
AOS.init({
  duration: 1000,
  once: true
});

// ✅ تأثير كتابة حرف بحرف
function typewriter(element, speed = 100) {
  const text = element.textContent;
  element.textContent = "";
  let i = 0;
  (function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  })();
}

window.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("h1");
  if (title) typewriter(title, 90);
});

// ✅ حركة دخول العناصر (GSAP)
gsap.from("header h1", { y: -50, opacity: 0, duration: 1.2, ease: "bounce.out" });
gsap.from("header p", { opacity: 0, delay: 0.6, duration: 1 });
gsap.from("header a", { scale: 0.8, opacity: 0, delay: 1.2, duration: 0.8 });

// ✅ تأثير Tilt للكروت
if (typeof VanillaTilt !== "undefined") {
  VanillaTilt.init(document.querySelectorAll(".p-6.bg-white"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3
  });
}

// ✅ شريط تقدم بالتمرير
const progressBar = document.createElement("div");
progressBar.id = "progress";
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "4px";
progressBar.style.background = "#3b82f6";
progressBar.style.zIndex = "9999";
progressBar.style.transition = "width 0.2s ease";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  let scrollTop = window.scrollY;
  let docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + "%";
});

// ✅ رسم الإحصائيات (Chart.js)
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("visitorsChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو"],
        datasets: [{
          label: "عدد الزوار",
          data: [200, 500, 1000, 750, 1300],
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.15)",
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
});
