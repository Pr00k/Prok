// assets/js/main.js
(function(){
  'use strict';
  function toast(msg, time=3000){
    const t = document.getElementById('sys-toast');
    if(!t){ console.log('TOAST', msg); return; }
    t.textContent = msg; t.classList.add('show'); t.hidden = false;
    setTimeout(()=>{ t.classList.remove('show'); t.hidden = true; t.textContent=''; }, time);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const themeToggle = document.getElementById('themeToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const adminBtn = document.getElementById('adminBtn');
    const cardsEl = document.getElementById('cards');
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('dots');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    const SAMPLE = {
      apps:[{title:'لعبة الأكشن',desc:'إثارة',version:'1.0',image:'assets/img/banner1.svg'},{title:'تطبيق الكاميرا',desc:'صور',version:'2.1',image:'assets/img/banner2.svg'}],
      banners:[{imageUrl:'assets/img/banner1.svg'},{imageUrl:'assets/img/banner2.svg'},{imageUrl:'assets/img/banner3.svg'}],
      settings:{animation:'fade'}
    };

    try{ const saved = localStorage.getItem('prok_theme'); if(saved === 'light') document.body.classList.remove('dark'); else document.body.classList.add('dark'); }catch(e){}

    themeToggle?.addEventListener('click', ()=>{ document.body.classList.toggle('dark'); localStorage.setItem('prok_theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });

    sidebarToggle?.addEventListener('click', ()=> sidebar?.classList.toggle('open'));

    function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

    function renderApps(apps){
      if(!cardsEl) return;
      cardsEl.innerHTML='';
      apps.forEach((a, idx)=>{
        const art = document.createElement('article'); art.className='card editable'; art.dataset.appIndex = idx;
        const img = a.image || a.imageUrl || 'assets/img/banner1.svg';
        art.innerHTML = `<img src="${img}" alt="${escapeHtml(a.title)}"><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.desc)}</p><p class="ver">الإصدار: ${escapeHtml(a.version||'')}</p>`;
        const ei = document.createElement('span'); ei.className='edit-icon'; ei.dataset.type='app'; ei.dataset.appIndex = idx; ei.textContent='✏️';
        art.appendChild(ei);
        cardsEl.appendChild(art);
      });
    }

    function renderBanners(banners){
      if(!track) return;
      track.innerHTML='';
      banners.forEach((b, idx)=>{
        const div = document.createElement('div'); div.className='slide'; div.setAttribute('role','listitem');
        const img = document.createElement('img'); img.src = b.imageUrl || b.image || 'assets/img/banner1.svg'; img.alt = b.title || 'banner';
        div.appendChild(img);
        const ei = document.createElement('span'); ei.className='edit-icon'; ei.dataset.type='banner'; ei.dataset.bannerIndex = idx; ei.textContent='✏️';
        div.appendChild(ei);
        track.appendChild(div);
      });
      window.reinitCarousel && window.reinitCarousel();
    }

    (async function loadContent(){
      try{
        const Prok = window.ProkFirebase || {};
        if(Prok.db && typeof Prok.db.collection === 'function'){
          const snap = await Prok.db.collection('site').doc('content').get().catch(()=>null);
          if(snap && snap.exists){
            const data = snap.data();
            renderApps(data.apps || SAMPLE.apps);
            renderBanners(data.banners || SAMPLE.banners);
            document.documentElement.setAttribute('data-animation', (data.settings && data.settings.animation) || SAMPLE.settings.animation);
            return;
          }
        }
      }catch(e){ console.error('loadContent error', e); }
      renderApps(SAMPLE.apps); renderBanners(SAMPLE.banners); document.documentElement.setAttribute('data-animation', SAMPLE.settings.animation); toast('تم تحميل محتوى تجريبي (Firebase غير مهيأ).');
    })();

    (function(){ let idx=0, timer=null;
      function update(){ if(!track) return; track.style.transform = `translateX(-${idx*100}%)`; Array.from(dotsWrap?.children||[]).forEach((d,i)=>d.classList.toggle('active', i===idx)); }
      function nextSlide(){ if(!track) return; idx=(idx+1)%Math.max(1, track.children.length); update(); }
      function prevSlide(){ if(!track) return; idx=(idx-1+Math.max(1, track.children.length))%Math.max(1, track.children.length); update(); }
      function start(){ stop(); timer=setInterval(nextSlide, 3000); }
      function stop(){ if(timer) clearInterval(timer); timer=null; }
      next?.addEventListener('click', ()=>{ nextSlide(); reset(); }); prev?.addEventListener('click', ()=>{ prevSlide(); reset(); });
      function reset(){ stop(); start(); }
      let sx=0, dx=0;
      track?.addEventListener('touchstart', e=> sx=e.touches[0].clientX, {passive:true});
      track?.addEventListener('touchmove', e=> dx=e.touches[0].clientX - sx, {passive:true});
      track?.addEventListener('touchend', ()=>{ if(Math.abs(dx)>40){ if(dx<0) nextSlide(); else prevSlide(); } dx=0; reset(); });
      window.reinitCarousel = function(){ if(!dotsWrap||!track) return; dotsWrap.innerHTML=''; for(let i=0;i<track.children.length;i++){ const d=document.createElement('div'); d.className='dot'; d.addEventListener('click', ()=>{ idx=i; update(); reset(); }); dotsWrap.appendChild(d); } idx=0; update(); start(); }
    })();

    [['themeToggle',themeToggle],['sidebarToggle',sidebarToggle],['adminBtn',adminBtn]].forEach(([n,e])=>{ if(!e) console.warn('Missing element', n); });

  });
})();