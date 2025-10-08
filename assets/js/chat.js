document.addEventListener('DOMContentLoaded', ()=>{

  const openAi = document.getElementById('openAi');
  const aiModal = document.getElementById('aiModal');
  const closeAi = document.getElementById('closeAi');
  const aiBody = document.getElementById('aiBody');
  const aiSend = document.getElementById('aiSend');
  const aiInput = document.getElementById('aiInput');

  openAi?.addEventListener('click', ()=> aiModal.classList.remove('hidden'));
  closeAi?.addEventListener('click', ()=> aiModal.classList.add('hidden'));

  function append(type, text){
    const d = document.createElement('div');
    d.className = 'ai-message ' + (type==='bot' ? 'bot' : 'user');
    d.textContent = text;
    aiBody.appendChild(d);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  aiSend?.addEventListener('click', ()=>{
    const txt = aiInput.value.trim();
    if(!txt) return;
    append('user', txt);
    // محاكاة ذكي: نفحص الموقع محليًا
    append('bot', 'جارٍ الفحص المحلي...'); 
    setTimeout(()=>{
      const issues = window.ProkAutoFix ? window.ProkAutoFix.scan() : [{desc:'AutoFix unavailable'}];
      append('bot', 'تم العثور على: ' + JSON.stringify(issues, null, 2));
    }, 800);
    aiInput.value = '';
  });

});
