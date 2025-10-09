/* ======= Prok — All-in-one JS ======= */
/* Features:
 - visitor counter (local demo)
 - carousel auto (3s)
 - admin simple auth (local password)
 - edit mode: pencil icons, inline edit, upload image (local)
 - AI assistant (local scanner) + optional OpenAI call if admin provides key
 - protection: block copy/right click, blur overlay on visibilitychange
 - animations apply (5 types)
 - applyFix saves to localStorage (simulate deploy)
*/

/* ---------- visitor counter ---------- */
(function(){
  const el = document.getElementById('visCount');
  try{
    const n = parseInt(localStorage.getItem('prok_vis')||'0',10) + 1;
    localStorage.setItem('prok_vis', n);
    if(el) el.textContent = n;
  }catch(e){ if(el) el.textContent='—'; }
})();

/* ---------- carousel ---------- */
(function(){
  const slides = document.getElementById('slides');
  if(!slides) return;
  const imgs = slides.children;
  let idx = 0;
  function show(i){
    const w = imgs[0].clientWidth + 12;
    slides.style.transform = `translateX(${ -i * w }px)`;
  }
  function next(){ idx = (idx+1) % imgs.length; show(idx); }
  window.addEventListener('resize', ()=> show(idx));
  setInterval(next, 3000);
})();

/* ---------- protection ---------- */
(function(){
  document.addEventListener('contextmenu', e=> e.preventDefault());
  document.addEventListener('copy', e=> e.preventDefault());
  // block common dev shortcuts
  document.addEventListener('keydown', e=>{
    if((e.ctrlKey||e.metaKey) && (e.key==='u' || e.key==='s' || (e.shiftKey && e.key==='I'))) e.preventDefault();
  });
  // visibility: try to blur quickly to mess screenshots
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      // quick overlay blur
      const ov = document.createElement('div');
      ov.style.position='fixed'; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0;
      ov.style.background='rgba(0,0,0,0.55)'; ov.style.backdropFilter='blur(14px)';
      ov.style.zIndex = 999999;
      document.body.appendChild(ov);
      setTimeout(()=> ov.remove(), 1200);
    }
  });
})();

/* ---------- render demo apps (and edit icons) ---------- */
(function(){
  const sample = [
    {id:'p1', title:'لعبة سباق', desc:'سريعة وممتعة', img:''},
    {id:'p2', title:'محرر صور', desc:'فلاتر وادوات', img:''},
    {id:'p3', title:'قارئ مقالات', desc:'سهل ومُنظّم', img:''}
  ];
  const container = document.querySelector('.apps.grid');
  if(!container) return;
  function render(){
    container.innerHTML = '';
    sample.forEach(s=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<span class="edit-icon" data-id="${s.id}" title="تعديل">✏️</span><h4>${s.title}</h4><p>${s.desc}</p><div style="margin-top:8px"><button class="small" onclick="alert('فتح ${s.title}')">تفاصيل</button></div>`;
      container.appendChild(div);
    });
  }
  render();
})();

/* ---------- admin simple auth (local) ---------- */
(function(){
  // admin password is local: change this before deployment
  const ADMIN_PASS = 'admin123'; // CHANGE this locally to secure
  const adminBtn = document.getElementById('adminBtn');
  adminBtn && adminBtn.addEventListener('click', (e)=>{
    // open admin.html normally; but ensure auth saved
    // we'll use localStorage flag; admin.html checks it
    const ok = localStorage.getItem('prok_admin') === '1';
    if(!ok){
      const pass = prompt('أدخل كلمة مرور الأدمن:');
      if(pass === ADMIN_PASS){
        localStorage.setItem('prok_admin','1');
        // go to admin page
        window.location.href = 'admin.html';
      } else {
        alert('خطأ: كلمة المرور غير صحيحة.');
      }
    } else {
      window.location.href = 'admin.html';
    }
  });
})();

/* ---------- admin page logic (shared) ---------- */
(function(){
  // run only on admin.html
  if(!document.body.classList.contains('admin-page')) return;

  // ensure admin auth
  if(localStorage.getItem('prok_admin') !== '1'){
    alert('غير مسموح. سجّل دخول الأدمن أولاً.');
    window.location.href = '/';
    return;
  }

  // logout btn
  const logout = document.getElementById('logoutBtn');
  logout && (logout.onclick = ()=>{ localStorage.removeItem('prok_admin'); location.href='/'});

  // app list sample management
  const appList = document.getElementById('appList');
  const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
  const sample = apps.length ? apps : [
    {id:'p1',title:'لعبة سباق',desc:'سريعة وممتعة'},
    {id:'p2',title:'محرر صور',desc:'فلاتر وادوات'},
  ];
  function saveApps(){ localStorage.setItem('prok_apps', JSON.stringify(sample)); renderList(); }
  function renderList(){
    appList.innerHTML=''; sample.forEach(a=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<span class="edit-icon" data-id="${a.id}">✏️</span><h4>${a.title}</h4><p>${a.desc}</p>
        <div style="margin-top:8px"><button class="btn" data-id="${a.id}" data-act="edit">تعديل</button><button class="btn" data-id="${a.id}" data-act="del">حذف</button></div>`;
      appList.appendChild(el);
    });
    // attach handlers
    appList.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', (ev)=>{
        const id = b.dataset.id; const act=b.dataset.act;
        const idx = sample.findIndex(x=>x.id===id);
        if(act==='del'){ if(confirm('تأكيد حذف؟')){ sample.splice(idx,1); saveApps(); } }
        if(act==='edit'){ const t = prompt('عنوان جديد', sample[idx].title); if(t) sample[idx].title = t; const d = prompt('وصف جديد', sample[idx].desc); if(d) sample[idx].desc = d; saveApps(); }
      });
    });
  }
  renderList();

  /* upload image (local blob) */
  document.getElementById('uploadImage').addEventListener('click', ()=>{
    const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange = ()=> {
      const f = inp.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = ()=> {
        // store as dataURL for demo; in real use upload to storage
        localStorage.setItem('prok_img_'+Date.now(), reader.result);
        alert('تم رفع الصورة محلياً (demo). استخدم وضع التعديل لتضع الصورة في العنصر.');
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  });

  /* toggle edit mode */
  document.getElementById('toggleEdit').addEventListener('click', ()=>{
    document.body.classList.toggle('admin-mode');
    if(document.body.classList.contains('admin-mode')){
      // make editable elements contentEditable
      document.querySelectorAll('h1,h2,h3,h4,p,.card').forEach(el=>{ el.contentEditable = true; el.style.outline='1px dashed rgba(255,255,255,.06)'; });
      alert('وضع التعديل مفعل: عدّل النصوص ثم اضغط "تطبيق التصحيح" لحفظ محلي.');
    } else {
      // collect edits
      const edits = [];
      document.querySelectorAll('[contenteditable="true"]').forEach(el=>{
        edits.push({selector: selector(el), html: el.innerHTML});
        el.contentEditable = false; el.style.outline='none';
      });
      localStorage.setItem('prok_edits', JSON.stringify(edits));
      alert('تم حفظ التعديلات محلياً.');
    }
  });

  function selector(el){
    if(el.id) return '#'+el.id;
    let path=''; let node=el;
    while(node && node!==document.body){
      const tag=node.tagName.toLowerCase(); path = tag + (node.className?'.'+node.className.split(' ')[0]:'') + (path? ' > ' + path : '');
      node = node.parentElement;
    }
    return path;
  }

  /* animations: apply to .card elements */
  document.getElementById('applyAnim').addEventListener('click', ()=>{
    const v = document.getElementById('animationSelect').value;
    const container = document.querySelectorAll('.card');
    container.forEach(c=>{
      c.style.animation = '';
      c.classList.remove('anim-fade','anim-slide','anim-float','anim-zoom');
    });
    if(v==='fade') document.querySelectorAll('.card').forEach(c=> c.classList.add('anim-fade'));
    if(v==='slide') document.querySelectorAll('.card').forEach(c=> c.classList.add('anim-slide'));
    if(v==='float') document.querySelectorAll('.card').forEach(c=> c.classList.add('anim-float'));
    if(v==='zoom') document.querySelectorAll('.card').forEach(c=> c.classList.add('anim-zoom'));
    alert('تم تطبيق الإنيميشن محلياً.');
  });

  /* local AutoFix scanner */
  window.ProkAutoFix = {
    scan: function(){
      const issues = [];
      if(!document.querySelector('h1')) issues.push({kind:'seo', desc:'لا يوجد H1'});
      document.querySelectorAll('img').forEach(img=>{ if(!img.alt || img.alt.trim()==='') issues.push({kind:'a11y', desc:'صورة بدون alt', selector: selector(img)}); });
      document.querySelectorAll('button').forEach(b=>{ if(!b.onclick && !b.dataset.handler) issues.push({kind:'ui', desc:'زر ربما لا يعمل', selector: selector(b)}); });
      return issues;
    },
    applyPatches: function(patches){
      patches.forEach(p=>{
        try{
          const el = document.querySelector(p.selector);
          if(!el) return;
          if(p.action==='set-html') el.innerHTML = p.value;
          if(p.action==='set-attr') el.setAttribute(p.attr, p.value);
        }catch(e){ console.error(e); }
      });
      localStorage.setItem('prok_patches', JSON.stringify(patches));
    }
  };

  /* run scan */
  document.getElementById('runScan').addEventListener('click', ()=>{
    const r = ProkAutoFix.scan();
    document.getElementById('scanReport').textContent = JSON.stringify(r, null, 2);
  });

  /* applyFix (simulate deploy) */
  document.getElementById('applyFix').addEventListener('click', ()=>{
    const edits = JSON.parse(localStorage.getItem('prok_edits')||'[]');
    const patches = JSON.parse(localStorage.getItem('prok_patches')||'[]');
    localStorage.setItem('prok_saved_edits', JSON.stringify({edits, patches, date: new Date().toISOString()}));
    alert('تم حفظ "النشر" محلياً (محاكاة). لربط GitHub/Functions، أستطيع أساعدك تضبطها لاحق.');
  });

  /* AI chat (local simulation + optional OpenAI if key provided) */
  document.getElementById('aiSend').addEventListener('click', async ()=>{
    const q = document.getElementById('aiInput').value.trim(); if(!q) return;
    const hist = document.getElementById('aiHistory');
    hist.innerHTML += `<div style="color:#9ff">أنت: ${escapeHtml(q)}</div>`;
    document.getElementById('aiInput').value='';
    // local analysis first
    hist.innerHTML += `<div style="color:#efe">المساعد: جارٍ الفحص المحلي...</div>`;
    setTimeout(()=>{
      const issues = ProkAutoFix.scan();
      hist.innerHTML += `<div style="color:#dfd">المساعد: وجد ${issues.length} مشكلة. افتح "فحص الموقع" لرؤية التفاصيل.</div>`;
    },700);

    // OPTIONAL: if admin provided OpenAI key (stored sessionStorage.openai_key) call OpenAI
    const openaiKey = sessionStorage.getItem('prok_openai_key');
    if(openaiKey){
      hist.innerHTML += `<div style="color:#ffd;">المساعد: يتواصل مع OpenAI...</div>`;
      try{
        const resp = await fetch('https://api.openai.com/v1/chat/completions',{
          method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+openaiKey},
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{role:'system', content:'You are a helpful site developer.'},{role:'user', content: q + "\\n\\nHTML:\\n" + document.documentElement.outerHTML}],
            max_tokens: 800
          })
        });
        const data = await resp.json();
        const ans = data.choices?.[0]?.message?.content || JSON.stringify(data);
        hist.innerHTML += `<div style="color:#9ff">المساعد(OpenAI): ${escapeHtml(ans.slice(0,1000))}</div>`;
      }catch(e){
        hist.innerHTML += `<div style="color:#fdd">خطأ اتصال OpenAI: ${escapeHtml(e.message || e)}</div>`;
      }
    }
    hist.scrollTop = hist.scrollHeight;
  });

  // helper escape
  function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }
})();
