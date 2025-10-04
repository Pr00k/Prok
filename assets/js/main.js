document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Carousel
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  let index = 0;
  setInterval(() => {
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 3000);
});
