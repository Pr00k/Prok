const track = document.querySelector('.carousel-track');
let index = 0;
setInterval(() => {
  index = (index + 1) % track.children.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}, 3000);