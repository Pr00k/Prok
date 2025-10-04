(function(){
  if(!window.firebase){ console.warn('Firebase not loaded - admin functions disabled'); return; }
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const SITE_DOC = db.collection('site').doc('content');
  async function loadSite(){
    try{
      const snap = await SITE_DOC.get();
      const data = snap.exists ? snap.data() : { apps: [], banners: [], settings: {} };
      renderContent(data);
    }catch(e){ console.error('loadSite', e); }
  }
  function renderContent(data){
    const track = document.getElementById('carouselTrack'); track.innerHTML = '';
    (data.banners || []).forEach((b,idx)=>{
      const div = document.createElement('div'); div.className='slide';
      const img = document.createElement('img'); img.src = b.imageUrl || 'assets/img/banner1.svg'; img.alt = b.title || 'banner';
      div.appendChild(img);
      if(document.body.classList.contains('admin-mode')){
        const ei = document.createElement('span'); ei.className='edit-icon'; ei.dataset.type='banner'; ei.dataset.bannerIndex = idx; ei.textContent='✏️';
        ei.addEventListener('click', ()=> adminEditBanner(idx));
        div.appendChild(ei);
      }
      track.appendChild(div);
    });
    const cards = document.getElementById('cards'); cards.innerHTML = '';
    (data.apps || []).forEach((a,idx)=>{
      const art = document.createElement('article'); art.className='card editable'; art.dataset.appIndex = idx;
      art.innerHTML = `<h3 class="app-title">${a.title||'بدون اسم'}</h3><p class="app-desc">${a.desc||''}</p><p class="app-ver">الإصدار: ${a.version||''}</p>`;
      if(document.body.classList.contains('admin-mode')){
        const ei = document.createElement('span'); ei.className='edit-icon'; ei.dataset.type='app'; ei.dataset.appIndex = idx; ei.textContent='✏️';
        ei.addEventListener('click', ()=> adminEditApp(idx));
        art.appendChild(ei);
      }
      cards.appendChild(art);
    });
    const ani = (data.settings && data.settings.animation) || 'fade';
    document.documentElement.setAttribute('data-animation', ani);
    if(window.reinitCarousel) window.reinitCarousel();
  }
  window.adminEditApp = async function(index){
    const snap = await SITE_DOC.get(); const data = snap.exists ? snap.data() : { apps: [], banners: [], settings: {} };
    const app = (data.apps || [])[index];
    if(!app) return alert('التطبيق غير موجود');
    const newTitle = prompt('عنوان التطبيق:', app.title || '');
    if(newTitle === null) return;
    const newDesc = prompt('وصف التطبيق:', app.desc || '');
    if(newDesc === null) return;
    const newVer = prompt('الاصدار:', app.version || '');
    if(newVer === null) return;
    if(confirm('هل تريد رفع نسخة جديدة (ملف)؟')){
      const input = document.createElement('input'); input.type='file'; input.accept='*/*';
      input.onchange = async ()=>{
        const file = input.files[0]; if(!file) return alert('لم يتم اختيار ملف');
        const ref = storage.ref('apps/' + Date.now() + '_' + file.name);
        const snapUp = await ref.put(file);
        const url = await snapUp.ref.getDownloadURL();
        app.fileUrl = url; app.fileName = file.name;
        finishSave();
      };
      input.click();
    } else {
      finishSave();
    }
    async function finishSave(){
      app.title = newTitle; app.desc = newDesc; app.version = newVer;
      data.apps[index] = app;
      await SITE_DOC.set({ apps: data.apps }, { merge: true });
      alert('تم حفظ التطبيق'); loadSite();
    }
  };
  window.adminEditBanner = async function(index){
    const input = document.createElement('input'); input.type='file'; input.accept='image/*';
    input.onchange = async ()=>{
      const file = input.files[0]; if(!file) return alert('لم تختار صورة');
      const ref = storage.ref('banners/' + Date.now() + '_' + file.name);
      const snapUp = await ref.put(file);
      const url = await snapUp.ref.getDownloadURL();
      const snap = await SITE_DOC.get(); const data = snap.exists ? snap.data() : { apps: [], banners: [], settings: {} };
      data.banners = data.banners || [];
      data.banners[index] = { imageUrl: url, title: file.name };
      await SITE_DOC.set({ banners: data.banners }, { merge: true });
      alert('تم رفع البانر'); loadSite();
    };
    input.click();
  };
  document.getElementById('addAppBtn')?.addEventListener('click', async ()=>{
    const title = prompt('عنوان التطبيق:');
    if(!title) return;
    const desc = prompt('وصف:');
    const version = prompt('الاصدار:');
    const snap = await SITE_DOC.get(); const data = snap.exists ? snap.data() : { apps: [], banners: [], settings: {} };
    data.apps = data.apps || [];
    data.apps.unshift({ title, desc, version });
    await SITE_DOC.set({ apps: data.apps }, { merge: true });
    alert('تم الإضافة'); loadSite();
  });
  document.getElementById('pickAnimationBtn')?.addEventListener('click', ()=>{
    const choice = prompt('اختر الانميشن: none, fade, slide, float, pulse, zoom', 'fade');
    if(!choice) return alert('لم تختار');
    const presets = ['none','fade','slide','float','pulse','zoom'];
    if(!presets.includes(choice)) return alert('قيمة غير صالحة');
    SITE_DOC.set({ settings: { animation: choice } }, { merge: true }).then(()=>{
      document.documentElement.setAttribute('data-animation', choice);
      alert('تم حفظ الانميشن: '+choice);
    }).catch(e=>{ alert('خطأ حفظ الانميشن'); console.error(e); });
  });
  auth.onAuthStateChanged(user => {
    loadSite().then(()=>{
      if(user && user.email && user.email.toLowerCase() === 'aaaab9957@gmail.com') {
        document.body.classList.add('admin-mode');
        document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='block');
        loadSite();
      } else {
        document.body.classList.remove('admin-mode');
        document.querySelectorAll('.admin-controls').forEach(el=>el.style.display='none');
        loadSite();
      }
    });
  });
})();