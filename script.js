/* ===== Prok Enhanced Script ===== */
/* يعتمد على Firebase Auth لتسجيل الأدمن، والذكاء المحلي، والفحص التلقائي */

/* ---------- Firebase Admin Auth ---------- */
(function(){
  // يجب أن تضيف إعدادات Firebase في firebase-config.js
  if(window.firebase && firebase.auth){
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        // مسجّل دخول الأدمن، أظهر الأدمن صفحة
        if(location.pathname.endsWith('admin.html')){
          // داخل لوحة الأدمن
          initAdmin();
        } else {
          // إذا ضغط على زر الأدمن
          document.getElementById('adminBtn').onclick = ()=> location.href = 'admin.html';
        }
      } else {
        // ليس مسجّل: عند الضغط على الأدمن تفتح صفحة تسجيل Firebase
        document.getElementById('adminBtn').onclick = async ()=>{
          try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
            location.href = 'admin.html';
          } catch(e){
            alert('فشل تسجيل الأدمن: '+ e.message);
          }
        };
      }
    });
  } else {
    console.warn('Firebase Auth not available.');
  }
})();

/* ---------- visitor counter ---------- */
(function(){
  const el = document.getElementById('visCount');
  try {
    const n = parseInt(localStorage.getItem('prok_vis')||'0',10)+1;
    localStorage.setItem('prok_vis', n);
    if(el) el.textContent = n;
  } catch(e){
    if(el) el.textContent = '—';
  }
})();

/* ---------- carousel ---------- */
(function(){
  const slides = document.getElementById('slides');
  if(!slides) return;
  const items = slides.children;
  let idx = 0;
  function show(i){
    const w = items[0].clientWidth + 12;
    slides.style.transform = `translateX(${ -i * w }px)`;
  }
  function next(){ idx = (idx + 1) % items.length; show(idx); }
  window.addEventListener('resize', ()=> show(idx));
  setInterval(next, 3000);
})();

/* ---------- protection ---------- */
(function(){
  document.addEventListener('contextmenu', e=> e.preventDefault());
  document.addEventListener('copy', e=> e.preventDefault());
  document.addEventListener('keydown', e=>{
    if((e.ctrlKey||e.metaKey) && (e.key==='u' || e.key==='s' || (e.shiftKey && e.key==='I'))) e.preventDefault();
  });
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      const ov = document.createElement('div');
      ov.style.position='fixed'; ov.style.left=0; ov.style.top=0;
      ov.style.right=0; ov.style.bottom=0;
      ov.style.background='rgba(0,0,0,0.55)'; ov.style.backdropFilter='blur(14px)';
      ov.style.zIndex=999999;
      document.body.appendChild(ov);
      setTimeout(()=> ov.remove(), 1500);
    }
  });
})();

/* ---------- Admin init & logic ---------- */
function initAdmin(){
  document.body.classList.add('admin-mode');
  // logout
  const lo = document.getElementById('logoutBtn');
  lo && (lo.onclick = async ()=>{
    await firebase.auth().signOut();
    localStorage.removeItem('prok_admin');
    location.href = '/';
  });

  /* load apps list from localStorage or default */
  const listEl = document.getElementById('appList');
  const apps = JSON.parse(localStorage.getItem('prok_apps')||'[]') || [
    {id:'a1', title:'لعبة سباق', desc:'ممتعة وسريعة'},
    {id:'a2', title:'محرر صور', desc:'أدوات سريعة'}
  ];
  function render(){
    listEl.innerHTML = '';
    apps.forEach(a=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<span class="edit-icon" data-id="${a.id}">✏️</span>
        <h4>${a.title}</h4><p>${a.desc}</p>
        <div><button data-id="${a.id}" data-act="edit" class="small">تعديل</button><button data-id="${a.id}" data-act="del" class="small">حذف</button></div>`;
      listEl.appendChild(div);
    });
    listEl.querySelectorAll('button').forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.id, act = b.dataset.act;
        const idx = apps.findIndex(x=>x.id===id);
        if(act==='del'){ if(confirm('حذف؟')) { apps.splice(idx,1); save(); } }
        if(act==='edit'){
          const nt = prompt('عنوان جديد', apps[idx].title);
          const nd = prompt('وصف جديد', apps[idx].desc);
          if(nt) apps[idx].title = nt;
          if(nd) apps[idx].desc = nd;
          save();
        }
      }
    });
  }
  function save(){
    localStorage.setItem('prok_apps', JSON.stringify(apps));
    render();
  }
  render();

  // uploadImage
  document.getElementById('uploadImage').onclick = ()=>{
    const inp = document.createElement('input');
    inp.type='file'; inp.accept='image/*';
    inp.onchange = ()=> {
      const f = inp.files[0];
      const reader = new FileReader();
      reader.onload = ()=>{
        localStorage.setItem('prok_img_'+Date.now(), reader.result);
        alert('تم رفع الصورة محليًا.');
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  };

  // toggleEdit
  document.getElementById('toggleEdit').onclick = ()=>{
    document.body.classList.toggle('admin-mode');
    const editableEls = document.querySelectorAll('h1,h2,h3,h4,p');
    if(document.body.classList.contains('admin-mode')){
      editableEls.forEach(el=>{ el.contentEditable = true; el.style.outline='1px dashed rgba(255,255,255,0.06)'; });
      alert('في وضع التعديل — غير النصوص ثم اضغط "تطبيق التصحيحات".');
    } else {
      const edits = [];
      editableEls.forEach(el=>{
        edits.push({selector: selector(el), html: el.innerHTML});
        el.contentEditable = false; el.style.outline='none';
      });
      localStorage.setItem('prok_edits', JSON.stringify(edits));
      alert('تم حفظ التعديلات محليًا.');
    }
  };

  // applyAnim
  document.getElementById('applyAnim').onclick = ()=>{
    const v = document.getElementById('animationSelect').value;
    document.querySelectorAll('.card').forEach(c=>{
      c.classList.remove('anim-fade','anim-slide','anim-float','anim-zoom');
      void c.offsetWidth;
      if(v==='fade') c.classList.add('anim-fade');
      if(v==='slide') c.classList.add('anim-slide');
      if(v==='float') c.classList.add('anim-float');
      if(v==='zoom') c.classList.add('anim-zoom');
    });
    alert('تطبيق الأنيميشن تم.');
  };

  // runScan
  document.getElementById('runScan').onclick = ()=>{
    if(window.ProkAutoFix){
      const issues = ProkAutoFix.scan();
      document.getElementById('scanReport').textContent = JSON.stringify(issues, null, 2);
    } else {
      document.getElementById('scanReport').textContent = 'AutoFix غير مفعل.';
    }
  };

  // applyFix (simulate deploy)
  document.getElementById('applyFix').onclick = ()=>{
    const edits = JSON.parse(localStorage.getItem('prok_edits')||'[]');
    const patches = []; // يمكن أن يبنى بناء على تحليل ProkAutoFix
    localStorage.setItem('prok_patches', JSON.stringify(patches));
    alert('تم حفظ التعديلات محليًا. لنشر حقيقي يلزم ربط دالة خادم.');
  };

  // selector helper
  function selector(el){
    if(el.id) return '#'+el.id;
    let path=''; let node=el;
    while(node && node!==document.body){
      const tag = node.tagName.toLowerCase();
      path = tag + (node.className?'.'+node.className.split(' ')[0]:'') + (path? ' > '+path : '');
      node = node.parentElement;
    }
    return path;
  }
}

/* ---------- AutoFix scanner (مشابه السابق) ---------- */
window.ProkAutoFix = {
  scan: function(){
    const issues = [];
    if(!document.querySelector('h1')) issues.push({kind:'seo', desc:'لا يوجد عنوان H1'});
    document.querySelectorAll('img').forEach(img=>{
      if(!img.alt || img.alt.trim()==='') issues.push({kind:'a11y', desc:'صورة بدون alt', selector: selector(img)});
    });
    document.querySelectorAll('button').forEach(b=>{
      if(!b.onclick && !b.dataset.handler) issues.push({kind:'ui', desc:'زر قد لا يعمل', selector: selector(b)});
    });
    return issues;
    function selector(el){
      if(el.id) return '#'+el.id;
      let path=''; let node=el;
      while(node && node!==document.body){
        const tag=node.tagName.toLowerCase();
        path = tag + (node.className?'.'+node.className.split(' ')[0]:'') + (path? ' > '+path : '');
        node = node.parentElement;
      }
      return path;
    }
  }
};
