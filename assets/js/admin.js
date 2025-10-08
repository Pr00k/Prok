document.addEventListener('DOMContentLoaded', ()=>{

  const scanBtn = document.getElementById('scanSite');
  const applyBtn = document.getElementById('applyPatches');
  const toggleEdit = document.getElementById('toggleEdit');
  const logoutBtn = document.getElementById('logout');
  const report = document.getElementById('report');

  scanBtn?.addEventListener('click', ()=>{
    report.textContent = 'جارٍ الفحص...';
    const issues = window.ProkAutoFix ? window.ProkAutoFix.scan() : [{desc:'AutoFix not loaded'}];
    report.textContent = JSON.stringify(issues, null, 2);
  });

  applyBtn?.addEventListener('click', ()=>{
    const patches = JSON.parse(localStorage.getItem('prok_patches')||'[]');
    if(patches.length){ window.ProkAutoFix.applyPatches(patches); report.textContent = 'تم تطبيق التصحيحات'; }
    else report.textContent = 'لا توجد تصحيحات محفوظة.';
  });

  toggleEdit?.addEventListener('click', ()=>{
    document.body.classList.toggle('admin-mode');
    // enable basic inline edit
    if(document.body.classList.contains('admin-mode')){
      document.querySelectorAll('h1,h2,p,button,a').forEach(el=>{
        el.contentEditable = true; el.dataset.orig = el.innerHTML; el.style.outline = '1px dashed rgba(255,255,255,0.06)';
      });
      alert('وضع التعديل مفعل: عدّل النصوص ثم اغلق الوضع لحفظ التغييرات محلياً.');
    } else {
      const edits = [];
      document.querySelectorAll('[data-orig]').forEach(el=>{
        if(el.innerHTML !== el.dataset.orig) edits.push({selector: selector(el), html: el.innerHTML});
        el.contentEditable = false; el.style.outline = 'none'; delete el.dataset.orig;
      });
      if(edits.length){ localStorage.setItem('prok_edits', JSON.stringify(edits)); alert('تم حفظ التعديلات محلياً'); } else alert('لا تغييرات');
    }
  });

  logoutBtn?.addEventListener('click', ()=>{
    localStorage.removeItem('prok_admin');
    if(window.firebase && firebase.auth) firebase.auth().signOut();
    window.location.href = '../index.html';
  });

  function selector(el){
    if(el.id) return '#'+el.id;
    let path=''; let node=el;
    while(node && node!==document.body){
      const tag = node.tagName.toLowerCase(); path = tag + (node.className?'.'+node.className.split(' ')[0]:'') + (path? ' > ' + path : '');
      node = node.parentElement;
    }
    return path;
  }
});
