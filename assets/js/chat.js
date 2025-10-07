// assets/js/chat.js
(function(){
  'use strict';
  const chatBtn = document.getElementById('admin-chat-btn');
  const chatModal = document.getElementById('aiChatModal');
  const aiClose = document.getElementById('aiCloseBtn');
  const aiBody = document.getElementById('aiChatBody');
  const aiInput = document.getElementById('aiInput');
  const aiFile = document.getElementById('aiFile');
  const aiSend = document.getElementById('aiSend');

  function appendMessage(who, text){
    const div = document.createElement('div'); div.className = 'ai-msg ' + (who==='me' ? 'me' : 'ai');
    div.innerHTML = `<div class="who">${who==='me' ? 'أنت' : 'المساعد'}</div><div class="text">${text}</div>`;
    aiBody.appendChild(div); aiBody.scrollTop = aiBody.scrollHeight;
  }

  function showModal(show){ if(show){ chatModal.classList.remove('hidden'); aiBody.scrollTop = aiBody.scrollHeight; } else chatModal.classList.add('hidden'); }

  chatBtn?.addEventListener('click', ()=> showModal(true));
  aiClose?.addEventListener('click', ()=> showModal(false));

  aiSend?.addEventListener('click', async ()=>{
    const text = aiInput.value && aiInput.value.trim();
    const file = aiFile.files && aiFile.files[0];
    if(!text && !file) return appendMessage('ai','اكتب شيئاً أو ارفع ملفاً.');
    appendMessage('me', text || (file && file.name) || '');
    aiInput.value = '';
    let fileUrl = null;
    try{
      if(file){
        const P = window.ProkFirebase || {};
        if(!P.storage) throw new Error('Firebase storage not configured');
        appendMessage('ai','⏳ جارٍ رفع الملف...');
        const ref = P.storage.ref('ai_inputs/' + Date.now() + '_' + file.name);
        const snap = await ref.put(file);
        fileUrl = await snap.ref.getDownloadURL();
        appendMessage('ai','✅ تم رفع الملف');
      }
    }catch(e){ console.error('upload failed', e); appendMessage('ai','فشل رفع الملف: ' + (e.message || e)); return; }

    try{
      appendMessage('ai','⏳ أرسلنا الطلب للمساعد...');
      const payload = { prompt: text || '', fileUrl };
      const res = await fetch('/ai-chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(!res.ok) throw new Error('Server error ' + res.status);
      const data = await res.json();
      appendMessage('ai', data.reply || '[لا يوجد رد]');
      if(data.diagnostics && data.diagnostics.length) appendMessage('ai','<strong>Diagnostics:</strong><br/>' + data.diagnostics.map(d=>'• '+d).join('<br/>'));
      if(data.patches && data.patches.length) appendMessage('ai','<strong>Suggested patches:</strong><br/>' + data.patches.map(p=>p.path).join('<br/>'));
    }catch(e){ console.error('ai request failed', e); appendMessage('ai','فشل الاتصال بالمساعد.'); }
  });
})();