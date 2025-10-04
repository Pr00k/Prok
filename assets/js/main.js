// main.js - Prok Best
document.addEventListener('DOMContentLoaded', ()=>{
  // Sidebar toggle for small screens
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle && sidebar) sidebarToggle.addEventListener('click', ()=> sidebar.classList.toggle('open'));

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('prok_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme==='dark'?'dark':'light');
  if(themeToggle) themeToggle.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('prok_theme', cur);
  });

  // Admin quick link
  const adminBtn = document.getElementById('adminLoginBtn');
  if(adminBtn) adminBtn.addEventListener('click', ()=> window.location.href='admin/login.html');

  // Render sample cards (will be replaced from Firestore)
  const cardsData = [
    {title:'تطبيق صور', desc:'محرر صور نيون'},
    {title:'لعبة سباق', desc:'سباقات ممتعة وسريعة'},
    {title:'مشغل موسيقى', desc:'قوائم تشغيل ذكية'}
  ];
  const cards = document.getElementById('cards');
  cardsData.forEach(c=>{
    const el = document.createElement('article'); el.className='card';
    el.innerHTML = `<h3>${c.title}</h3><p>${c.desc}</p>`;
    cards.appendChild(el);
  });

  // Carousel logic
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let index = 0;
  let autoplay = true;
  let autoplayInterval = 3000;
  let timer = null;

  function updateSlides(){
    slides.forEach((s,i)=>{
      s.classList.toggle('active', i===index);
      // transform for 3D effect: center slide scale 1 others scale .9 and translateZ
      if(i===index){ s.style.transform='scale(1) translateZ(0)'; s.style.opacity='1'; }
      else if(i===index-1 || (index===0 && i===slides.length-1)){ s.style.transform='scale(.92) translateZ(-80px)'; s.style.opacity='0.75'; }
      else { s.style.transform='scale(.9) translateZ(-120px)'; s.style.opacity='0.5'; }
    });
    Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i===index));
  }

  // create dots
  slides.forEach((_,i)=>{
    const d = document.createElement('div'); d.className='dot'; d.addEventListener('click', ()=>{ index=i; resetTimer(); updateSlides(); });
    dotsWrap.appendChild(d);
  });

  function next(){ index = (index+1) % slides.length; updateSlides(); }
  function prev(){ index = (index-1+slides.length) % slides.length; updateSlides(); }
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); resetTimer(); });
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); resetTimer(); });

  function startTimer(){ if(timer) clearInterval(timer); timer = setInterval(()=>{ next(); }, autoplayInterval); }
  function resetTimer(){ if(autoplay) { clearInterval(timer); startTimer(); } }

  updateSlides();
  if(autoplay) startTimer();

  // pause on hover
  track.addEventListener('mouseenter', ()=>{ clearInterval(timer); });
  track.addEventListener('mouseleave', ()=>{ if(autoplay) startTimer(); });

});