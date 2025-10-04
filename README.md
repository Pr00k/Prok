# Prok — النسخة المطورة (Ready-to-deploy)

مرحبًا! هذا مشروع ويب جاهز تقدر ترفعه مباشرة على GitHub ثم تنشره على Netlify/Vercel.
المشروع مصمم بالعربية (RTL) ومع واجهة حديثة وتجربة إدارة تجريبية.

## ماذا في الحزمة؟
- صفحات: `index.html`, `about.html`, `services.html`, `contact.html`
- مدونة: `blog/` مع ملفات Markdown
- لوحة إدارة: `admin/` مع Dashboard تجريبي
- ملفات Assets: `assets/` (css, js, img)
- ملف `.env` placeholder لمفاتيحك (لا ترفع المفاتيح للمستودع العام)

## كيف تبدأ (الطريقة الأسهل)
1. فك الضغط وارفع مجلد `Prok` إلى GitHub (حط الملفات في مستودع جديد).
2. شغّل عبر Live Server محليًا أو استخدم:
   ```
   npx http-server .
   ```
3. لربط Firebase: أضف مفاتيحك في backend أو استخدم Firebase Hosting وأضف config في admin/js/config.js

## نشر على Netlify/Vercel
- امّا اربط المستودع مباشرة من GitHub واختر `build` = none، `publish` = `/` لأن الموقع ستاتيكي.

## ملاحظة أمان
- لا تضع مفاتيح API في الملفات الأمامية. استخدم خادمًا وسيطًا أو متغيرات بيئة على الاستضافة.

## لو احتجت تطوير إضافي
أقدر أضيف:
- Backend بـ Node/Express أو FastAPI
- تسجيل فعلي بواسطة Firebase Auth
- CI/CD (GitHub Actions)
- تكامل AI/LLM

بالتوفيق! 😎
