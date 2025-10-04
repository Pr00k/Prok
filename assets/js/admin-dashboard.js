(async function(){
  if(!window.firebase || !window.firebaseConfig){ alert('أضف firebase-config.js'); window.location.href='login.html'; return; }
  try{ firebase.initializeApp(window.firebaseConfig); }catch(e){}
  const auth = firebase.auth();
  const db = firebase.firestore();
  const ALLOWED = 'aaaab9957@gmail.com';

  const isAdminSession = sessionStorage.getItem('prok_admin')==='1';
  auth.onAuthStateChanged(async user=>{
    if(!user || !isAdminSession || user.email.toLowerCase()!==ALLOWED.toLowerCase()){
      alert('غير مصرح. الرجاء تسجيل الدخول كأدمن.'); window.location.href='login.html'; return;
    }
    document.getElementById('adminEmail').textContent = user.email;
    try{
      const doc = await db.collection('site').doc('content').get();
      const apps = doc.exists && doc.data().apps ? doc.data().apps : [];
      renderApps(apps);
    }catch(e){ console.warn(e); renderApps([]); }
  });

  function renderApps(apps){
    const list = document.getElementById('appsEditor');
    list.innerHTML = '';
    apps.forEach((a,idx)=>{
      const card = document.createElement('div'); card.className='app-card';
      card.dataset.idx = idx;
      card.innerHTML = `<div class="meta"><strong class="app-title">${a.title||''}</strong><div class="app-desc">${a.desc||''}</div></div>
        <div class="app-actions"><button class="icon-edit">✎</button><button class="btn remove">حذف</button></div>`;
      list.appendChild(card);
    });
    attach();
  }

  function attach(){
    document.querySelectorAll('.icon-edit').forEach(b=> b.addEventListener('click', e=>{
      const c = e.target.closest('.app-card');
      c.classList.toggle('editing');
      const title = c.querySelector('.app-title');
      const desc = c.querySelector('.app-desc');
      if(c.classList.contains('editing')){ title.contentEditable='true'; desc.contentEditable='true'; title.focus(); }
      else { title.contentEditable='false'; desc.contentEditable='false'; }
    }));
    document.querySelectorAll('.remove').forEach(b=> b.addEventListener('click', e=> e.target.closest('.app-card').remove()));
  }

  document.getElementById('addApp').addEventListener('click', ()=>{
    const t = document.getElementById('newTitle').value.trim(); const d = document.getElementById('newDesc').value.trim();
    if(!t) return alert('ضع اسم للتطبيق');
    const list = document.getElementById('appsEditor');
    const card = document.createElement('div'); card.className='app-card editing';
    card.innerHTML = `<div class="meta"><strong class="app-title">${t}</strong><div class="app-desc">${d}</div></div><div class="app-actions"><button class="icon-edit">✎</button><button class="btn remove">حذف</button></div>`;
    list.prepend(card); attach();
    document.getElementById('newTitle').value=''; document.getElementById('newDesc').value='';
  });

  document.getElementById('saveAll').addEventListener('click', async ()=>{
    const status = document.getElementById('status'); status.textContent='جاري الحفظ...';
    const user = auth.currentUser; if(!user || user.email.toLowerCase()!==ALLOWED.toLowerCase()){ alert('غير مصرح'); status.textContent='خطأ'; return; }
    const apps = Array.from(document.querySelectorAll('.app-card')).map(c=>({ title:c.querySelector('.app-title').textContent.trim(), desc:c.querySelector('.app-desc').textContent.trim() }));
    try{ await db.collection('site').doc('content').set({ apps, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: user.email }, { merge:true }); status.textContent='تم الحفظ ✅'; }catch(e){ console.error(e); status.textContent='خطأ: '+(e.message||e.code); }
  });

  document.getElementById('signOut').addEventListener('click', async ()=>{ await auth.signOut(); sessionStorage.removeItem('prok_admin'); window.location.href='login.html'; });
})();