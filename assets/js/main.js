// main.js - loads apps and fetches home content from Firestore if available
document.addEventListener('DOMContentLoaded', function(){
  const apps = [
    {title:'لعبة الجبل', desc:'مغامرة وتسلق', link:'#'},
    {title:'محرر الصور', desc:'تعديل سريع', link:'#'},
    {title:'ملاح الأسفار', desc:'خرائط ومسارات', link:'#'}
  ];
  const appsList = document.getElementById('appsList');
  if(appsList){
    appsList.innerHTML = apps.map(a=>`<article class="app-card"><h3>${a.title}</h3><p>${a.desc}</p><a class="btn" href="${a.link}">تحميل</a></article>`).join('');
  }

  // Try to load home settings from Firestore (if firebase config present globally)
  if(window.firebase && firebase.firestore){
    try{
      const db = firebase.firestore();
      db.collection('settings').doc('home').get().then(snap=>{
        if(snap.exists){
          const data = snap.data();
          document.querySelector('.hero h1').textContent = data.title || 'أهلاً بك في Prok';
          document.querySelector('.hero p').textContent = data.desc || 'المتجر التجريبي لتطبيقاتك — ادخل لوحة الادمن لتحديث المحتوى.';
        }
      });
    }catch(e){}
  }
});