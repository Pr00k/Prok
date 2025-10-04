document.addEventListener('DOMContentLoaded', ()=>{
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle && sidebar) sidebarToggle.addEventListener('click', ()=> sidebar.classList.toggle('open'));
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('prok_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  if(themeToggle) themeToggle.addEventListener('click', ()=>{
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('prok_theme', t);
  });
  const adminBtn = document.getElementById('adminBtn');
  if(adminBtn){
    adminBtn.addEventListener('click', async ()=>{
      if(!window.firebase){ alert('Firebase غير مفعّل. ضع إعدادات firebase-config.js'); return; }
      const auth = firebase.auth();
      try{
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        alert('تم تسجيل الدخول كأدمن (إن لم تظهر أدوات التحرير، حدث الصفحة)');
      }catch(e){
        alert('خطأ في تسجيل الدخول: '+ (e.message||e.code));
        console.error(e);
      }
    });
  }
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  if(track){
    let idx = 0, timer=null;
    function update(){ track.style.transform = `translateX(-${idx * 100}%)`; Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i===idx)); }
    function nextSlide(){ idx = (idx+1) % track.children.length; update(); }
    function prevSlide(){ idx = (idx-1+track.children.length) % track.children.length; update(); }
    function start(){ stop(); timer = setInterval(nextSlide, 3000); }
    function stop(){ if(timer) clearInterval(timer); timer=null; }
    if(next) next.addEventListener('click', ()=>{ nextSlide(); reset(); });
    if(prev) prev.addEventListener('click', ()=>{ prevSlide(); reset(); });
    function reset(){ stop(); start(); }
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    let sx=0,dx=0;
    track.addEventListener('touchstart', e=> sx = e.touches[0].clientX, {passive:true});
    track.addEventListener('touchmove', e=> dx = e.touches[0].clientX - sx, {passive:true});
    track.addEventListener('touchend', ()=>{ if(Math.abs(dx) > 40){ if(dx < 0) nextSlide(); else prevSlide(); } dx = 0; reset(); });
    window.reinitCarousel = function(){ dotsWrap.innerHTML = ''; for(let i=0;i<track.children.length;i++){ const d=document.createElement('div'); d.className='dot'; d.addEventListener('click', ()=>{ idx = i; update(); reset(); }); dotsWrap.appendChild(d); } idx = 0; update(); start(); }
  }
  if(window.firebase && firebase.auth){
    const auth = firebase.auth();
    auth.onAuthStateChanged(async user => {
      if(user){
        const adminEmail = 'aaaab9957@gmail.com';
        if(user.email && user.email.toLowerCase() === adminEmail.toLowerCase()){
          document.body.classList.add('admin-mode');
          const controls = document.querySelectorAll('.admin-controls'); controls.forEach(c=>c.style.display='block');
        } else {
          document.body.classList.remove('admin-mode');
          const controls = document.querySelectorAll('.admin-controls'); controls.forEach(c=>c.style.display='none');
        }
      } else {
        document.body.classList.remove('admin-mode');
        const controls = document.querySelectorAll('.admin-controls'); controls.forEach(c=>c.style.display='none');
      }
    });
  }
});