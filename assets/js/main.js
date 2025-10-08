document.addEventListener('DOMContentLoaded', ()=>{

  // sample apps (replace via Firestore if configured)
  const apps = [
    {id:'a1', title:'لعبة سريعة', desc:'ممتعة وخفيفة', type:'game'},
    {id:'a2', title:'محرر صور', desc:'أدوات احترافية', type:'app'},
    {id:'a3', title:'قارئ مقالات', desc:'مريح للقراءة', type:'app'}
  ];

  const container = document.getElementById('apps');
  function render(list){
    container.innerHTML = '';
    list.forEach(a=>{
      const card = document.createElement('article');
      card.className = 'app-card';
      card.innerHTML = `<h3>${a.title}</h3><p>${a.desc}</p><small>${a.type}</small>`;
      container.appendChild(card);
    });
  }
  render(apps);

  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('prok_theme');
  if(saved === 'light') document.body.classList.add('theme-light');

  themeToggle?.addEventListener('click', ()=>{
    document.body.classList.toggle('theme-light');
    const mode = document.body.classList.contains('theme-light') ? 'light':'dark';
    localStorage.setItem('prok_theme', mode);
  });

  // restore patches saved earlier
  const patches = JSON.parse(localStorage.getItem('prok_patches')||'[]');
  if(patches.length) console.log('Restored patches', patches);
});
