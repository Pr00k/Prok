// ===== Scroll Animation (Cards تظهر عند التمرير) =====
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // ما نرجع نعملها أنيميشن مرة ثانية
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => {
  observer.observe(card);
});
