// simple dark/light theme toggle
(function(){
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('prok_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved==='dark'?'dark':'light');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('prok_theme', cur);
  });
})();
