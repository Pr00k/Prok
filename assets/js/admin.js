// assets/js/admin.js
(function(){
  'use strict';
  const ADMIN_EMAIL = 'aaaab9957@gmail.com';

  function toast(msg, time=2000){ const t=document.getElementById('sys-toast'); if(!t) return console.log('TOAST',msg); t.textContent=msg; t.classList.add('show'); t.hidden=false; setTimeout(()=>{ t.classList.remove('show'); t.hidden=true; t.textContent=''; }, time); }

  async function ensureFirebase(){ const P = window.ProkFirebase || {}; if(!P.auth || !P.db || !P.storage) throw new Error('Firebase not ready'); return P; }

  async function signInAdmin(){ try{ const P = window.ProkFirebase || {}; if(!P.auth) throw new Error('Firebase Auth missing'); await P.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); const provider = new firebase.auth.GoogleAuthProvider(); const res = await P.auth.signInWithPopup(provider); const user = res.user; if(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()){ localStorage.setItem('prok_admin','1'); toast('تم تسجيل دخول الأدمن'); location.reload(); } else { toast('هذا الحساب غير مصرح كأدمن'); await P.auth.signOut(); } }catch(e){ console.error('signInAdmin', e); toast('فشل تسجيل الدخول'); } }

  async function signOutAdmin(){ try{ const P = window.ProkFirebase || {}; if(P.auth) await P.auth.signOut(); }catch(e){ console.warn(e); } localStorage.removeItem('prok_admin'); toast('تم تسجيل الخروج'); setTimeout(()=>location.reload(),700); }

  function wireEditIcons(){
    document.body.addEventListener('click', function(e){
      const el = e.target.closest && e.target.closest('.edit-icon');
      if(!el) return;
      const type = el.dataset.type;
      if(type === 'app'){ const i = Number(el.dataset.appIndex); editApp(i); }
      if(type === 'banner'){ const i = Number(el.dataset.bannerIndex); editBanner(i); }
      if(type === 'text'){ const target = el.dataset.target; const node = document.querySelector(target); if(!node) return toast('العنصر غير موجود'); const newVal = prompt('النص الجديد:', node.textContent.trim()); if(newVal === null) return; node.textContent = newVal; const parent = node.closest('.editable'); const path = parent ? parent.dataset.path : null; if(path) saveSimplePath(path, newVal); }
    });
  }

  async function saveSimplePath(path, value){
    try{
      const P = await ensureFirebase(); const docRef = P.db.collection('site').doc('content'); const snap = await docRef.get(); const data = snap.exists ? snap.data() : {}; setByPath(data, path, value); await docRef.set(data, { merge: true }); toast('تم حفظ النص'); }catch(e){ console.error('saveSimplePath', e); toast('خطأ حفظ النص'); }
  }

  function setByPath(obj, path, value){ try{ const parts = path.replace(/\]/g,'').split(/\.|\[/).filter(Boolean); let cur = obj; for(let i=0;i<parts.length-1;i++){ const p = parts[i]; if(!(p in cur)) cur[p] = isFinite(parts[i+1]) ? [] : {}; cur = cur[p]; } cur[parts[parts.length-1]] = value; }catch(e){ console.error('setByPath', e); } }

  async function editApp(index){
    try{
      const P = await ensureFirebase();
      const snap = await P.db.collection('site').doc('content').get();
      const data = snap.exists ? snap.data() : { apps: [] };
      const apps = data.apps || [];
      const app = apps[index];
      if(!app) return toast('التطبيق غير موجود');
      const newTitle = prompt('عنوان التطبيق:', app.title||'');
      if(newTitle === null) return;
      const newDesc = prompt('وصف التطبيق:', app.desc||'');
      if(newDesc === null) return;
      const newVer = prompt('الإصدار:', app.version||'');
      if(newVer === null) return;
      if(confirm('هل تريد رفع ملف جديد (نسخة)؟')){
        const input = document.createElement('input'); input.type='file'; input.accept='*/*'; input.onchange=async ()=>{ const file = input.files[0]; if(!file) return toast('لم يتم اختيار ملف'); const ref = P.storage.ref('apps/' + Date.now() + '_' + file.name); const snapu = await ref.put(file); const url = await snapu.ref.getDownloadURL(); app.fileUrl = url; finish(); }; input.click();
      } else finish();
      async function finish(){ app.title = newTitle; app.desc = newDesc; app.version = newVer; apps[index] = app; await P.db.collection('site').doc('content').set({ apps }, { merge: true }); toast('تم حفظ التطبيق'); setTimeout(()=>location.reload(),700); }
    }catch(e){ console.error('editApp', e); toast('خطأ تعديل التطبيق'); }
  }

  async function addApp(){
    try{
      const P = await ensureFirebase();
      const title = prompt('عنوان التطبيق:'); if(!title) return;
      const desc = prompt('وصف:'); const version = prompt('الاصدار:');
      const snap = await P.db.collection('site').doc('content').get(); const data = snap.exists ? snap.data() : { apps: [] };
      data.apps = data.apps || []; data.apps.unshift({ title, desc, version });
      await P.db.collection('site').doc('content').set({ apps: data.apps }, { merge: true });
      toast('تم إضافة التطبيق'); setTimeout(()=>location.reload(),700);
    }catch(e){ console.error('addApp', e); toast('خطأ إضافة التطبيق'); }
  }

  async function editBanner(index){
    try{
      const P = await ensureFirebase();
      const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange = async ()=>{
        const file = input.files[0]; if(!file) return toast('لم تختار صورة');
        const ref = P.storage.ref('banners/' + Date.now() + '_' + file.name);
        const snap = await ref.put(file);
        const url = await snap.ref.getDownloadURL();
        const snapDoc = await P.db.collection('site').doc('content').get();
        const data = snapDoc.exists ? snapDoc.data() : { apps: [], banners: [], settings: {} };
        data.banners = data.banners || []; data.banners[index] = { imageUrl: url, title: file.name };
        await P.db.collection('site').doc('content').set({ banners: data.banners }, { merge: true });
        toast('تم رفع البانر'); setTimeout(()=>location.reload(),700);
      }; input.click();
    }catch(e){ console.error('editBanner', e); toast('خطأ رفع البانر'); }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const adminBtn = document.getElementById('adminBtn');
    if(adminBtn){
      adminBtn.addEventListener('click', async ()=>{ const P = window.ProkFirebase || {}; if(P.auth && P.auth.currentUser){ toast('مسجل دخول. انقر مزدوجًا للخروج.'); return; } await signInAdmin(); });
      adminBtn.addEventListener('dblclick', async ()=>{ await signOutAdmin(); });
    }
    try{
      const P = window.ProkFirebase || {};
      if(P.auth){
        P.auth.onAuthStateChanged(user=>{
          try{
            if(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()){
              document.body.classList.add('admin-mode');
              document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='block');
              document.querySelectorAll('.edit-icon').forEach(el=>el.style.display='inline-flex');
              document.getElementById('admin-chat-btn')?.classList.remove('hidden');
              wireEditIcons();
              document.querySelectorAll('.card').forEach(card=>{
                card.addEventListener('dragover', e=>e.preventDefault());
                card.addEventListener('drop', async (ev)=>{
                  ev.preventDefault();
                  const file = ev.dataTransfer.files[0];
                  if(!file) return;
                  try{
                    const ref = P.storage.ref('apps/' + Date.now() + '_' + file.name);
                    const snap = await ref.put(file);
                    const url = await snap.ref.getDownloadURL();
                    toast('تم رفع الصورة'); setTimeout(()=>location.reload(),700);
                  }catch(err){ console.error(err); toast('خطأ رفع الصورة'); }
                });
              });
            } else {
              document.body.classList.remove('admin-mode');
              document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='none');
              document.querySelectorAll('.edit-icon').forEach(el=>el.style.display='none');
              document.getElementById('admin-chat-btn')?.classList.add('hidden');
            }
          }catch(e){ console.error('onAuthState', e); }
        });
      }
    }catch(e){ console.error(e); }
    document.getElementById('addAppBtn')?.addEventListener('click', ()=> addApp());
    document.getElementById('pickAnimationBtn')?.addEventListener('click', ()=>{ const p = prompt('اختر الانميشن: none, fade, slide, float, pulse, zoom','fade'); if(p) { (async ()=>{ try{ const P = await ensureFirebase(); await P.db.collection('site').doc('content').set({ settings: { animation: p } }, { merge: true }); document.documentElement.setAttribute('data-animation', p); toast('تم حفظ الانميشن'); }catch(e){console.error(e)} })(); } });
  });
  window.ProkAdmin = { signInAdmin, signOutAdmin, editApp, addApp, editBanner };
})();