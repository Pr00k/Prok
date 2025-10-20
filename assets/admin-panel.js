// admin-panel.js - handles admin actions, sync, profit settings
const KEY = 'prok_products';
function loadProducts(){return JSON.parse(localStorage.getItem(KEY)||'[]');}
function saveProducts(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
document.addEventListener('DOMContentLoaded', ()=>{
  const profitInput = document.getElementById('profitValue');
  profitInput.value = localStorage.getItem('prok_profit')||5000;
  document.getElementById('saveProfit').addEventListener('click', ()=>{ localStorage.setItem('prok_profit', profitInput.value); alert('تم حفظ هامش الربح'); });
  document.getElementById('logout').addEventListener('click', ()=>{ localStorage.removeItem('prok_admin'); location.href='/'; });
  document.getElementById('exportProducts').addEventListener('click', ()=>{
    const data = JSON.stringify(loadProducts(), null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'prok_products.json'; a.click();
  });
  document.getElementById('syncBtn').addEventListener('click', async ()=>{
    // sync attempt: tries to call a configured external API endpoint stored in localStorage: prok_mojod_api
    const api = localStorage.getItem('prok_mojod_api') || '';
    if(!api){ alert('لم يتم تكوين API المزامنة. ضع رابط API في إعدادات الأدمن.'); return; }
    try{
      const res = await fetch(api);
      if(!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      // expected data.products = [{id,title,desc,lowest,wholesale,images}]
      const products = data.products || [];
      saveProducts(products);
      alert('تمت المزامنة بنجاح. عدد المنتجات: ' + products.length);
      location.reload();
    }catch(err){ alert('فشل المزامنة: ' + err.message); }
  });
  // render admin products
  const list = loadProducts();
  const container = document.getElementById('adminProducts');
  if(list.length===0) container.textContent = 'لا توجد منتجات.';
  else{
    list.forEach(p=>{
      const div = document.createElement('div'); div.style.border='1px solid rgba(255,255,255,0.04)'; div.style.padding='8px'; div.style.marginBottom='8px';
      div.innerHTML = `<strong>${p.title}</strong> — <span>سعر الجملة: ${p.wholesale}</span> — <button class="btn edit" data-id="${p.id}">تعديل</button> <button class="btn del" data-id="${p.id}">حذف</button>`;
      container.appendChild(div);
    });
  }
  container.addEventListener('click', e=>{
    if(e.target.classList.contains('edit')){
      const id = e.target.dataset.id; const products = loadProducts(); const p = products.find(x=>x.id===id);
      const newTitle = prompt('العنوان', p.title); if(newTitle!==null){ p.title=newTitle; saveProducts(products); alert('تم التعديل'); location.reload(); }
    } else if(e.target.classList.contains('del')){
      const id = e.target.dataset.id; let products = loadProducts(); products = products.filter(x=>x.id!==id); saveProducts(products); alert('تم الحذف'); location.reload();
    }
  });
});