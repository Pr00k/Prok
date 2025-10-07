// assets/js/error-handler.js
(function(){
  'use strict';
  function safeSendLog(payload){
    try{
      const Prok = window.ProkFirebase || {};
      if(Prok.db && typeof Prok.db.collection === 'function'){
        Prok.db.collection('clientErrors').add(Object.assign({ts: new Date().toISOString()}, payload)).catch(()=>{});
      }
      if(navigator.sendBeacon){
        navigator.sendBeacon('/log-client-error', JSON.stringify(payload));
      }
    }catch(e){ console.warn('safeSendLog fail', e); }
  }

  window.addEventListener('error', function(ev){
    const payload = { message: ev.message, source: ev.filename, lineno: ev.lineno, colno: ev.colno, stack: ev.error && ev.error.stack };
    console.error('Captured client error', payload);
    safeSendLog(payload);
    try{
      fetch('/ai-chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt: 'Please analyze this client error and suggest fixes: ' + JSON.stringify(payload) }) });
    }catch(e){}
  });

  window.addEventListener('unhandledrejection', function(ev){
    const payload = { message: ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason), stack: ev.reason && ev.reason.stack };
    console.error('Unhandled rejection', payload);
    safeSendLog(payload);
  });
})();