// Simple client-side Markdown loader (works when served over HTTP)
async function loadPosts(){
  const postsContainer = document.getElementById('posts');
  const list = ['posts/post1.md','posts/post2.md'];
  for(const p of list){
    try{
      const res = await fetch(p);
      const text = await res.text();
      // very simple frontmatter split
      const body = text.split('---').slice(2).join('---').trim();
      const titleMatch = text.match(/title:\s*(.*)/);
      const title = titleMatch? titleMatch[1].trim() : 'منشور';
      const el = document.createElement('article');
      el.className = 'p-4 bg-white rounded shadow';
      el.innerHTML = `<h2 class="text-xl font-bold">${title}</h2><div class="mt-2">${marked ? marked(body) : body.replace(/\n/g,'<br>')}</div><a class="mt-3 inline-block text-sm" href="#">اقرأ المزيد</a>`;
      postsContainer.appendChild(el);
    }catch(e){
      console.error('فشل تحميل',p,e);
    }
  }
}
window.addEventListener('DOMContentLoaded', loadPosts);
