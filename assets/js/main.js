document.addEventListener('DOMContentLoaded', ()=> {
  // menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if(menuToggle && mainNav){
    menuToggle.addEventListener('click', ()=> mainNav.classList.toggle('show'));
    // close when click outside on mobile
    document.addEventListener('click', (e)=>{
      if(window.innerWidth <= 768 && mainNav.classList.contains('show')){
        if(!mainNav.contains(e.target) && e.target !== menuToggle) mainNav.classList.remove('show');
      }
    });
  }

  // progress simple
  const progress = document.createElement('div');
  progress.style.position='fixed';progress.style.left='0';progress.style.top='0';
  progress.style.height='3px';progress.style.width='0';progress.style.background='linear-gradient(90deg,var(--accent),var(--accent2))';
  progress.style.zIndex=9999;document.body.appendChild(progress);
  function setProgress(n){progress.style.width = n + '%';}
  setProgress(10);

  // default content (fallback)
  const DEFAULT = {
    heroTitle: "مرحباً بك في Prok — عصري وسريع",
    heroSub: "قالب متعدد اللغات بخفة وسلاسة.",
    heroTitle_ar: "مرحباً بك في Prok — عصري وسريع",
    heroSub_ar: "قالب متعدد اللغات بخفة وسلاسة.",
    features: [
      {title:"Modern Design", desc:"Clean interfaces", title_ar:"تصميم عصري", desc_ar:"واجهات نظيفة"},
      {title:"Fast", desc:"Optimized for speed", title_ar:"سريع", desc_ar:"محسّن للسرعة"}
    ],
    footerText: "© Prok — 2025"
  };

  // try Firestore
  async function tryFirestore(){
    if(!(window.firebaseConfig && window.firebase && window.firebase.firestore)) return false;
    try{ firebase.initializeApp(window.firebaseConfig); }catch(e){}
    try{
      const db = firebase.firestore();
      const snap = await db.collection('site').doc('content').get();
      if(snap.exists){ render(snap.data()); setProgress(100); return true; }
    }catch(e){ console.warn('firestore error', e); }
    return false;
  }

  function render(data){
    const lang = localStorage.getItem('prok_lang') || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');
    document.getElementById('heroTitle').textContent = (lang==='ar' && data.heroTitle_ar) ? data.heroTitle_ar : (data.heroTitle || '');
    document.getElementById('heroSub').textContent = (lang==='ar' && data.heroSub_ar) ? data.heroSub_ar : (data.heroSub || '');
    document.getElementById('footerText').textContent = data.footerText || '';
    const c = document.getElementById('features');
    c.innerHTML = '';
    (data.features || []).forEach(f=>{
      const el = document.createElement('article'); el.className = 'card';
      const t = (localStorage.getItem('prok_lang') === 'ar') ? (f.title_ar || f.title) : (f.title || '');
      const d = (localStorage.getItem('prok_lang') === 'ar') ? (f.desc_ar || f.desc) : (f.desc || '');
      el.innerHTML = `<h3>${t}</h3><p>${d}</p>`;
      c.appendChild(el);
    });
    // intersection animation
    const obs = new IntersectionObserver((entries, obs)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); obs.unobserve(en.target); }});
    }, {threshold:0.15});
    document.querySelectorAll('.card').forEach(card=>obs.observe(card));
  }

  setProgress(30);
  render(DEFAULT);
  setProgress(60);
  tryFirestore().then(ok=>{ if(!ok) setProgress(100); });
});
