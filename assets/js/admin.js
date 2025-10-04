// admin.js handles auth and Firestore read/write for admin pages
if(typeof window !== 'undefined'){
  (function(){
    if(!window.firebaseConfig){ console.warn('No firebaseConfig'); }
    try{ firebase.initializeApp(window.firebaseConfig); }catch(e){}
    const auth = firebase.auth();
    const db = firebase.firestore();

    // login page bindings (if present)
    const googleBtn = document.getElementById('googleBtn');
    if(googleBtn){
      const provider = new firebase.auth.GoogleAuthProvider();
      googleBtn.addEventListener('click', ()=> auth.signInWithPopup(provider).catch(e=> document.getElementById('msg').textContent=e.message));
    }
    const emailSign = document.getElementById('emailSign');
    const emailCreate = document.getElementById('emailCreate');
    if(emailSign){
      emailSign.addEventListener('click', async ()=>{
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value.trim();
        if(!email||!pass) return document.getElementById('msg').textContent='أدخل البريد والكلمة';
        try{ await auth.signInWithEmailAndPassword(email, pass); location.href='dashboard.html'; }catch(e){ document.getElementById('msg').textContent=e.message; }
      });
    }
    if(emailCreate){
      emailCreate.addEventListener('click', async ()=>{
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value.trim();
        if(!email||!pass) return document.getElementById('msg').textContent='أدخل البريد والكلمة';
        try{ await auth.createUserWithEmailAndPassword(email, pass); location.href='dashboard.html'; }catch(e){ document.getElementById('msg').textContent=e.message; }
      });
    }

    // dashboard page bindings
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmail = document.getElementById('userEmail');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const status = document.getElementById('status');

    auth.onAuthStateChanged(async user=>{
      if(!user){
        // if on dashboard redirect to login
        if(window.location.pathname.endsWith('dashboard.html')) location.href = 'index.html';
        return;
      }
      if(userEmail) userEmail.textContent = user.email;
      // load content if dashboard
      if(window.location.pathname.endsWith('dashboard.html')){
        try{
          const doc = await db.collection('site').doc('content').get();
          if(doc.exists){
            const data = doc.data();
            document.getElementById('hero_ar').value = data.heroTitle_ar || '';
            document.getElementById('hero_en').value = data.heroTitle || '';
            document.getElementById('sub_ar').value = data.heroSub_ar || '';
            document.getElementById('sub_en').value = data.heroSub || '';
            document.getElementById('features').value = JSON.stringify(data.features||[],null,2);
            status.textContent = 'تم التحميل';
          } else {
            status.textContent = 'لا يوجد محتوى بعد';
          }
        }catch(e){ status.textContent = 'خطأ: '+e.message; }
      }
    });

    if(logoutBtn) logoutBtn.addEventListener('click', ()=> auth.signOut().then(()=> location.href='index.html'));

    if(saveBtn){
      saveBtn.addEventListener('click', async ()=>{
        let parsed = [];
        try{ parsed = JSON.parse(document.getElementById('features').value || '[]'); if(!Array.isArray(parsed)) throw new Error('Features must be array'); }catch(e){ status.textContent='JSON Error: '+e.message; return; }
        status.textContent='جاري الحفظ...';
        try{
          await db.collection('site').doc('content').set({
            heroTitle: document.getElementById('hero_en').value,
            heroTitle_ar: document.getElementById('hero_ar').value,
            heroSub: document.getElementById('sub_en').value,
            heroSub_ar: document.getElementById('sub_ar').value,
            features: parsed,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          status.textContent='تم الحفظ ✅';
        }catch(e){ status.textContent='حفظ خطأ: '+e.message; }
      });
    }

    if(loadBtn) loadBtn.addEventListener('click', ()=> location.reload());
  })();
}
