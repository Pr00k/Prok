// assets/js/admin.js - admin flows and robust checks
(function(){ 'use strict';
  function toast(msg, time=2000){ try{ const t=document.getElementById('sys-toast'); if(!t) return console.log('TOAST:',msg); t.hidden=false; t.textContent=msg; setTimeout(()=>{ t.hidden=true; t.textContent=''; }, time);}catch(e){console.log('toast err',e);} }

  const ADMIN_EMAIL = 'aaaab9957@gmail.com';

  async function ensureFirebase(){
    const Prok = window.ProkFirebase || {};
    if(!Prok.auth || !Prok.db || !Prok.storage) throw new Error('Firebase not ready');
    return Prok;
  }

  async function signInAdmin(){
    try{
      const Prok = await ensureFirebase();
      await Prok.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await Prok.auth.signInWithPopup(provider);
      if(res && res.user && res.user.email && res.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()){
        localStorage.setItem('prok_admin','1'); toast('تم تسجيل دخول الأدمن'); location.reload();
      } else { toast('هذا الحساب غير مصرح كأدمن'); await Prok.auth.signOut(); }
    }catch(e){ console.error('signInAdmin',e); toast('خطأ أثناء تسجيل الدخول'); }
  }

  async function signOutAdmin(){
    try{ const Prok = window.ProkFirebase || {}; if(Prok.auth) await Prok.auth.signOut(); }catch(e){console.warn(e)} localStorage.removeItem('prok_admin'); toast('تم تسجيل الخروج'); setTimeout(()=>location.reload(),500);
  }

  async function getSite(){ const Prok = await ensureFirebase(); const snap = await Prok.db.collection('site').doc('content').get(); return snap.exists ? snap.data() : { apps:[], banners:[], settings:{} }; }
  async function saveSite(payload){ const Prok = await ensureFirebase(); await Prok.db.collection('site').doc('content').set(payload, { merge:true }); }

  window.ProkAdmin = { signInAdmin, signOutAdmin, getSite, saveSite };

  // wire admin button
  document.addEventListener('DOMContentLoaded', ()=>{
    const adminBtn = document.getElementById('adminBtn');
    if(!adminBtn) return;
    adminBtn.addEventListener('click', async ()=>{
      const Prok = window.ProkFirebase || {};
      if(Prok.auth && Prok.auth.currentUser){ toast('مسجل دخول. انقر مزدوجًا للخروج.'); return; }
      await signInAdmin();
    });
    adminBtn.addEventListener('dblclick', async ()=>{ await signOutAdmin(); });
    // auth watcher
    if(window.ProkFirebase && window.ProkFirebase.auth){
      window.ProkFirebase.auth.onAuthStateChanged(user=>{
        try{
          if(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()){
            document.body.classList.add('admin-mode');
            document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='block');
            toast('وضع الأدمن مفعل');
            // show edit icons (they already exist in DOM) - admin actions will use functions exposed
            document.querySelectorAll('.edit-icon').forEach(icon=>icon.style.display='inline-flex');
            // attach click behavior for app/banner edit icons
            document.body.addEventListener('click', function(e){
              const el = e.target.closest && e.target.closest('.edit-icon');
              if(!el) return;
              const type = el.dataset.type;
              if(type === 'app') { const i = Number(el.dataset.appIndex); window.open('/admin_placeholder','_self'); /* placeholder, use ProkAdmin.edit flows if UI exists */ }
              if(type === 'banner') { const i = Number(el.dataset.bannerIndex); window.open('/admin_placeholder','_self'); }
              if(type === 'animation') { const p = prompt('اختر الانميشن: none, fade, slide, float, pulse, zoom','fade'); if(p) saveSite({ settings: { animation: p } }).then(()=>{ document.documentElement.setAttribute('data-animation', p); toast('تم حفظ الانميشن'); }); }
              if(type === 'text'){ const target = el.dataset.target; const node = document.querySelector(target); if(!node) return toast('العنصر غير موجود'); const val = prompt('النص الجديد:', node.textContent.trim()); if(val===null) return; node.textContent = val; }
            });
          } else {
            document.body.classList.remove('admin-mode');
            document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='none');
            document.querySelectorAll('.edit-icon').forEach(icon=>icon.style.display='none');
          }
        }catch(e){console.error('onAuthStateChanged handler',e)}
      });
    }
  });

})();