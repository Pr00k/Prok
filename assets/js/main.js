let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const track = document.getElementById('carouselTrack');

function moveCarousel() {
  currentIndex = (currentIndex + 1) % slides.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}
setInterval(moveCarousel, 3000);
