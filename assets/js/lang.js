// lightweight i18n
const I18N = {
  en: {"nav.home":"Home","nav.about":"About","nav.services":"Services","nav.contact":"Contact","nav.admin":"Admin","cta.explore":"Explore","ads.one":"Limited Upgrade — 30 days","ads.two":"Pro Templates","ads.three":"High Performance","about.title":"About"},
  ar: {"nav.home":"الرئيسية","nav.about":"عنّا","nav.services":"الخدمات","nav.contact":"اتصل","nav.admin":"لوحة الإدارة","cta.explore":"استكشف","ads.one":"ترقية محدودة — ٣٠ يوم","ads.two":"قوالب Pro","ads.three":"أداء فائق","about.title":"من نحن"}
};
function translatePage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const key=el.getAttribute('data-i18n'); if(I18N[lang]&&I18N[lang][key]) el.textContent=I18N[lang][key]; });
}
document.addEventListener('DOMContentLoaded', ()=>{
  const sel=document.getElementById('langSwitcher');
  const saved=localStorage.getItem('prok_lang')|| (navigator.language && navigator.language.startsWith('ar')?'ar':'en');
  if(sel){ sel.value=saved; sel.addEventListener('change', e=>{ localStorage.setItem('prok_lang', e.target.value); translatePage(e.target.value); location.reload(); }); }
  translatePage(saved);
});
