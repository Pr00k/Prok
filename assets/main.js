// main.js - renders products and handles language/theme
const STORAGE_PRODUCTS_KEY = 'prok_products';
function formatPrice(n){ return new Intl.NumberFormat('ar-EG').format(n) + ' د.ع'; }

function getProducts(){ try{ const p = localStorage.getItem(STORAGE_PRODUCTS_KEY); if(p) return JSON.parse(p); }catch(e){} return [] }

function calcSelling(wholesale){
  const profitRaw = Number(localStorage.getItem('prok_profit')||5000);
  if(profitRaw>1000) return wholesale + profitRaw;
  return Math.round(wholesale * (1 + (profitRaw/100)));
}

function renderProducts(){
  const grid = document.getElementById('appsGrid'); grid.innerHTML='';
  const list = getProducts();
  if(!list.length){ grid.innerHTML='<p style="opacity:.75">لا توجد منتجات مضافة.</p>'; return; }
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const selling = calcSelling(p.wholesale||0);
    card.innerHTML = `<h3>${p.title}</h3><p>${p.desc||''}</p><p>أقل سعر متاح: <strong>${formatPrice(p.lowest||p.wholesale||0)}</strong></p><p>سعر العرض: <strong>${formatPrice(selling)}</strong></p><a class="btn" href="product.html?id=${p.id}">عرض</a>`;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  // ensure initial demo data if empty (non-demo wording but seed content)
  if(!localStorage.getItem(STORAGE_PRODUCTS_KEY)){
    const seed = [
      {id:'p1',title:'جهاز تمارين رياضية',desc:'جهاز منزلي للتمارين',wholesale:15000,lowest:15000,images:['assets/img/p1.jpg']},
      {id:'p2',title:'سماعة بلوتوث',desc:'صوت نقي',wholesale:8000,lowest:8000,images:['assets/img/p2.jpg']}
    ];
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(seed));
  }
  // render
  renderProducts();
  // search
  document.getElementById('search')?.addEventListener('input', ()=>{ const q=(document.getElementById('search').value||'').toLowerCase(); const list=getProducts().filter(p=>p.title.toLowerCase().includes(q)|| (p.desc||'').toLowerCase().includes(q)); const grid=document.getElementById('appsGrid'); grid.innerHTML=''; list.forEach(p=>{ const card=document.createElement('div'); card.className='card'; const selling=calcSelling(p.wholesale||0); card.innerHTML=`<h3>${p.title}</h3><p>${p.desc||''}</p><p>أقل سعر: <strong>${formatPrice(p.lowest||p.wholesale||0)}</strong></p><p>سعر: <strong>${formatPrice(selling)}</strong></p><a class="btn" href="product.html?id=${p.id}">عرض</a>`; grid.appendChild(card); }); });
  // carousel auto
  const slides=document.querySelectorAll('.hero-carousel .slide'); let idx=0; if(slides.length){ setInterval(()=>{ slides[idx].classList.remove('active'); idx=(idx+1)%slides.length; slides[idx].classList.add('active'); },3000); }
  // apply saved lang
  const saved = localStorage.getItem('prok_lang')||'ar'; applyLang(saved);
});