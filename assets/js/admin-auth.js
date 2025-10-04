(function(){
  const ADMIN_EMAIL = "aaaab9957@gmail.com"; // change to your admin email
  if(!window.firebase || !window.firebaseConfig){ document.getElementById && (document.getElementById('msg').textContent='أضف firebase-config.js'); return; }
  try{ firebase.initializeApp(window.firebaseConfig); }catch(e){}
  const auth = firebase.auth();
  const btn = document.getElementById('adminSignBtn');
  const msg = document.getElementById('msg');
  function show(m){ if(msg) msg.textContent = m; }
  async function signIn(){
    show('جاري تسجيل الدخول...');
    try{
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await auth.signInWithPopup(provider);
      const user = res.user;
      if(user && user.email && user.email.toLowerCase()===ADMIN_EMAIL.toLowerCase()){
        sessionStorage.setItem('prok_admin','1');
        window.location.href = 'dashboard.html';
      } else {
        await auth.signOut();
        show('هذا الحساب غير مصرح كأدمن.');
      }
    }catch(e){ console.error(e); show('خطأ: '+(e.message||e.code)); }
  }
  if(btn) btn.addEventListener('click', signIn);
})();