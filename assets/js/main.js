// assets/js/main.js
// مسؤول عن: أزرار الهيدر (sidebar/dark), carousel, وإظهار أيقونات التعديل للأدمن
document.addEventListener('DOMContentLoaded', () => {
  // Firebase helpers (تأكد firebase-config.js حمّلت قبل هذا الملف)
  const FB_AUTH = window.firebase && firebase.auth ? firebase.auth() : null;
  const FB_DB = window.firebase && firebase.firestore ? firebase.firestore() : null;

  // ---------- Sidebar toggle ----------
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // ---------- Dark mode toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('prok_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('prok_theme', current);
    });
  }

  // ---------- Carousel (auto 3s + touch + controls) ----------
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');

  if (track) {
    const slides = Array.from(track.querySelectorAll('.slide'));
    let idx = 0, timer = null;
    // create dots
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot';
      d.addEventListener('click', () => { goTo(i); });
      dotsWrap.appendChild(d);
    });
    function update() {
      track.style.transform = `translateX(-${idx * 100}%)`;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    function nextSlide(){ idx = (idx+1) % slides.length; update(); }
    function prevSlide(){ idx = (idx-1+slides.length) % slides.length; update(); }
    function goTo(i){ idx = i % slides.length; update(); reset(); }
    function start(){ stop(); timer = setInterval(nextSlide, 3000); }
    function stop(){ if (timer) clearInterval(timer); timer = null; }
    function reset(){ stop(); start(); }

    if (next) next.addEventListener('click', ()=>{ nextSlide(); reset(); });
    if (prev) prev.addEventListener('click', ()=>{ prevSlide(); reset(); });

    // touch support
    let sx=0, dx=0;
    track.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
    track.addEventListener('touchmove', e => dx = e.touches[0].clientX - sx, {passive:true});
    track.addEventListener('touchend', () => { if (Math.abs(dx)>40) { if (dx<0) nextSlide(); else prevSlide(); } dx=0; reset(); });

    update(); start();
  }

  // ---------- Admin UI: show edit icons when admin ----------
  function setAdminUI(isAdmin) {
    if (isAdmin) document.body.classList.add('admin-mode');
    else document.body.classList.remove('admin-mode');
  }

  // check auth and show admin UI if email matches (client-only UX)
  if (FB_AUTH) {
    FB_AUTH.onAuthStateChanged(async user => {
      if (!user) { setAdminUI(false); return; }
      // optionally refresh token to ensure claims are up-to-date
      try {
        const idToken = await user.getIdTokenResult(true);
        // For UX only: show admin UI if user.email equals your admin (safe permission enforced by Firestore rules)
        const allowedAdminEmail = 'aaaab9957@gmail.com'; // only for UI; actual security enforced server-side
        if (user.email && user.email.toLowerCase() === allowedAdminEmail.toLowerCase()) {
          setAdminUI(true);
        } else {
          setAdminUI(false);
        }
      } catch (e) { console.error('token error', e); setAdminUI(false); }
    });
  }

  // ---------- Delegated click handlers for edit icons (uses admin-controls.js) ----------
  // admin-controls.js exposes window.adminControls if loaded
  document.body.addEventListener('click', e => {
    if (!e.target) return;
    // edit-icon click
    if (e.target.matches('.edit-icon') || e.target.closest('.edit-icon')) {
      const el = e.target.closest('.edit-icon');
      const targetSelector = el.dataset.target; // selector or data-path
      const type = el.dataset.type; // 'text','app','banner','animation'
      // delegate
      if (window.adminControls) window.adminControls.handleEditClick({ type, targetSelector, el });
    }
  });

});
