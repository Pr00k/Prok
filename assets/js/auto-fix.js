window.ProkAutoFix = {
  scan: function(){
    const issues = [];
    if(document.querySelectorAll('h1').length === 0) issues.push({kind:'seo', desc:'لا يوجد عنوان H1'});
    document.querySelectorAll('img').forEach(img=>{
      if(!img.alt || img.alt.trim()==='') issues.push({kind:'accessibility', desc:'صورة بدون alt', selector: selector(img)});
    });
    document.querySelectorAll('button').forEach(b=>{
      if(!b.onclick && !b.dataset.handler) issues.push({kind:'ui', desc:'زر قد لا يعمل', selector: selector(b)});
    });
    return issues;
    function selector(el){
      if(el.id) return '#'+el.id;
      let path=''; let node=el;
      while(node && node!==document.body){
        const tag = node.tagName.toLowerCase(); path = tag + (node.className?'.'+node.className.split(' ')[0]:'') + (path? ' > '+path : '');
        node = node.parentElement;
      }
      return path;
    }
  },
  applyPatches: function(patches){
    patches.forEach(p=>{
      try{
        const el = document.querySelector(p.selector);
        if(!el) return;
        if(p.action === 'set-alt') el.setAttribute('alt', p.value);
        if(p.action === 'set-onclick') el.setAttribute('onclick', p.value);
      }catch(e){ console.error(e); }
    });
    localStorage.setItem('prok_patches', JSON.stringify(patches));
    return patches;
  }
};
