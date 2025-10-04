// assets/js/admin-controls.js
// Requires: firebase initialized (compat). Uses firebase.auth(), firestore(), storage()
(function(){
  if (!window.firebase) { console.warn('firebase not loaded'); return; }
  const FB_AUTH = firebase.auth();
  const FB_DB = firebase.firestore();
  const FB_STORAGE = firebase.storage();

  // helper: read/write site content doc
  const SITE_DOC = FB_DB.collection('site').doc('content');

  async function getSite() {
    const doc = await SITE_DOC.get();
    return doc.exists ? doc.data() : { apps: [], banners: [], settings: {} };
  }
  async function saveSite(payload) {
    // payload: partial; merge true
    await SITE_DOC.set(payload, { merge: true });
  }

  // show simple prompt-based editor for different types
  async function editText(targetSelector) {
    const el = document.querySelector(targetSelector);
    if (!el) return alert('لم يتم العثور على العنصر');
    const old = el.textContent || '';
    const val = prompt('اكتب النص الجديد:', old);
    if (val === null) return;
    el.textContent = val;
    // persist: if element has data-path attribute, use it to save in Firestore
    const path = el.dataset.path; // e.g. "header.title"
    if (path) {
      // path split
      const parts = path.split('.');
      const current = await getSite();
      let node = current;
      for (let i=0;i<parts.length-1;i++){
        const p = parts[i];
        node[p] = node[p] || {};
        node = node[p];
      }
      node[parts[parts.length-1]] = val;
      await saveSite(current);
      alert('تم الحفظ');
    }
  }

  // edit app object: expects data-app-index attribute on the element
  async function editApp(index) {
    const site = await getSite();
    site.apps = site.apps || [];
    const app = site.apps[index];
    if (!app) return alert('خطأ: التطبيق غير موجود');
    const newTitle = prompt('عنوان التطبيق:', app.title || '');
    if (newTitle === null) return;
    const newDesc = prompt('وصف التطبيق:', app.desc || '');
    if (newDesc === null) return;
    const newVer = prompt('الإصدار (version):', app.version || '');
    if (newVer === null) return;
    // optional: upload a new apk/file version
    const wantUpload = confirm('هل تريد رفع نسخة جديدة (ملف) للتطبيق؟');
    if (wantUpload) {
      const input = document.createElement('input'); input.type='file';
      input.accept='*/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return alert('لم يتم اختيار ملف');
        const ref = FB_STORAGE.ref(`apps/${Date.now()}_${file.name}`);
        const snap = await ref.put(file);
        const url = await snap.ref.getDownloadURL();
        app.fileUrl = url;
        app.fileName = file.name;
        finish();
      };
      input.click();
    } else {
      finish();
    }

    async function finish(){
      app.title = newTitle;
      app.desc = newDesc;
      app.version = newVer;
      site.apps[index] = app;
      await saveSite({ apps: site.apps });
      alert('تم حفظ بيانات التطبيق');
      // optional: refresh page to show updates
      window.location.reload();
    }
  }

  // delete app
  async function deleteApp(index) {
    if (!confirm('تأكيد حذف التطبيق نهائياً؟')) return;
    const site = await getSite();
    site.apps = site.apps || [];
    site.apps.splice(index, 1);
    await saveSite({ apps: site.apps });
    alert('تم الحذف');
    window.location.reload();
  }

  // set an app as promoted (ad banner)
  async function setPromotedApp(index) {
    const site = await getSite();
    site.settings = site.settings || {};
    site.settings.promotedAppIndex = index;
    // create a banner entry from app
    const app = (site.apps || [])[index];
    if (app) {
      site.banners = site.banners || [];
      // banner uses app.image or app.icon if exists; else keep existing
      const banner = { imageUrl: app.imageUrl || app.icon || '', title: app.title, desc: app.desc, appIndex: index };
      // put it first
      site.banners = site.banners.filter(b => b.appIndex !== index);
      site.banners.unshift(banner);
    }
    await saveSite(site);
    alert('تم تعيين التطبيق كإعلان (بانر).');
    window.location.reload();
  }

  // change animation preset
  async function setAnimation(presetName) {
    const site = await getSite();
    site.settings = site.settings || {};
    site.settings.animation = presetName;
    await saveSite({ settings: site.settings });
    // apply immediately
    document.documentElement.setAttribute('data-animation', presetName);
    alert('تم تغيير الأنيميشن إلى: ' + presetName);
  }

  // expose API
  window.adminControls = {
    handleEditClick: async ({ type, targetSelector, el }) => {
      if (type === 'text') return editText(targetSelector);
      if (type === 'app') {
        const idx = Number(el.dataset.appIndex);
        // show options: edit / delete / promote
        const choice = prompt('اختار: 1=تعديل  2=حذف  3=تعيين كإعلان', '1');
        if (choice === '1') return editApp(idx);
        if (choice === '2') return deleteApp(idx);
        if (choice === '3') return setPromotedApp(idx);
        return;
      }
      if (type === 'animation') {
        // choose preset
        const presets = ['none','fade','slide','float','pulse'];
        const sel = prompt('اكتب اسم الانميشن (none,fade,slide,float,pulse):', 'fade');
        if (!sel) return;
        if (!presets.includes(sel)) return alert('اسم غير صالح');
        return setAnimation(sel);
      }
      if (type === 'banner') {
        // allow replacing banner image
        const input = document.createElement('input'); input.type='file'; input.accept='image/*';
        input.onchange = async ()=>{
          const file = input.files[0];
          if (!file) return alert('لم يتم اختيار ملف');
          const ref = FB_STORAGE.ref(`banners/${Date.now()}_${file.name}`);
          const snap = await ref.put(file);
          const url = await snap.ref.getDownloadURL();
          // replace banner path: el.dataset.bannerIndex
          const bIndex = Number(el.dataset.bannerIndex);
          const site = await getSite();
          site.banners = site.banners || [];
          if (site.banners[bIndex]) site.banners[bIndex].imageUrl = url;
          else site.banners.unshift({ imageUrl: url, title: file.name });
          await saveSite({ banners: site.banners });
          alert('تم استبدال البانر وحفظه');
          window.location.reload();
        };
        input.click();
      }
    },
    // helper for admin dashboard (load site)
    getSite,
    saveSite
  };

})();
