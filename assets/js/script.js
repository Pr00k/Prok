// تحريك العناصر عند التمرير
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-show');
    }
  });
});

document.querySelectorAll('.card, .hero .content').forEach(el => observer.observe(el));
