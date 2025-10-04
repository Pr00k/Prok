// main frontend logic (keeps progress simple and lightweight)
document.addEventListener('DOMContentLoaded', ()=>{
  const progress = document.getElementById('progress');
  function setProgress(n){ if(progress) progress.style.width = n+'%'; }
  setProgress(10);

  // default content
  const DEFAULT = JSON.parse(`{"heroTitle":"Welcome to Prok — modern, fast, friendly","heroSub":"A lightweight starter with smooth animations.","heroTitle_ar":"مرحبا بك في Prok — عصري وسريع","heroSub_ar":"قالب متعدد اللغات بخفة وسلاسة.","features":[{"title":"Modern Design","desc":"Clean, responsive interfaces","title_ar":"تصميم عصري","desc_ar":"واجهات نظيفة ومتجاوبة"},{"title":"High Performance","desc":"Optimized for speed","title_ar":"آداء عالي","desc_ar":"محسّن للسرعة"},{"title":"Easy to Customize","desc":"Change content from Admin","title_ar":"سهل التخصيص","desc_ar":"عدّل المحتوى من لوحة الإدارة"}],"aboutText":"We build modern websites with speed in mind.","aboutText_ar":"نحن نبني مواقع عصرية مع التركيز على السرعة.","footerText":"© Prok — 2025"}`);

  async function renderFromFirestore(){
    if(!(window.firebaseConfig && window.firebase && window.firebase.firestore)) return false;
    try{
      try{ firebase.initializeApp(window.firebaseConfig); }catch(e){}
      const db = firebase.firestore();
      const doc = await db.collection('site').doc('content').get();
      if(doc.exists){ render(doc.data()); setProgress(100); return true; }
    }catch(e){ console.warn('firestore error', e); }
    return false;
  }

  function render(data){
    const lang = localStorage.getItem('prok_lang') || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');
    document.getElementById('heroTitle').textContent = (lang==='ar' && data.heroTitle_ar) ? data.heroTitle_ar : data.heroTitle;
    document.getElementById('heroSub').textContent = (lang==='ar' && data.heroSub_ar) ? data.heroSub_ar : data.heroSub;
    document.getElementById('footerText').textContent = data.footerText || '© Prok';
    const container = document.getElementById('features'); container.innerHTML='';
    (data.features||[]).forEach(f=>{
      const el = document.createElement('article'); el.className='card';
      const title = (lang==='ar') ? (f.title_ar||f.title) : (f.title||'');
      const desc = (lang==='ar') ? (f.desc_ar||f.desc) : (f.desc||'');
      el.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
      container.appendChild(el);
    });
    // animate cards
    const obs = new IntersectionObserver((entries, o)=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); o.unobserve(en.target); } }); }, {threshold:0.15});
    document.querySelectorAll('.card').forEach(c=>obs.observe(c));
  }

  setProgress(25);
  render(DEFAULT);
  setProgress(60);
  renderFromFirestore().then(ok=>{ if(!ok){ setProgress(100); } });
});
