# Prok - Enhanced static bundle with Admin (Firebase)

## ماذا يحتوي هذا الحزمة؟
- صفحات HTML للموقع (index, about, services, contact, blog).
- لوحة ادمن (admin/index.html - login, admin/dashboard.html - dashboard).
- سكربتات جاهزة للتعامل مع Firebase Auth و Firestore (باستخدام compat SDK عبر CDN).
- ملف netlify.toml مع هيدرز أمنية بسيطة.

## خطوات سريعة لتفعيل لوحة الادمن (Firebase)
1. اذهب إلى https://console.firebase.google.com/ وأنشئ مشروع جديد.
2. في Project Overview: اضغط على "Add app" واختر Web app وسجّل التطبيق — ستأخذ `firebaseConfig` (apiKey, authDomain, projectId, ...).
3. افتح `admin/index.html` و`admin/dashboard.html` وابحث عن قسم:
   ```
   const firebaseConfig = {
     apiKey: "REPLACE_API_KEY",
     authDomain: "REPLACE_AUTH_DOMAIN",
     projectId: "REPLACE_PROJECT_ID",
     storageBucket: "REPLACE_STORAGE_BUCKET",
     messagingSenderId: "REPLACE_MSG_SENDER_ID",
     appId: "REPLACE_APP_ID"
   };
   ```
   وضع القيم الحقيقية بدل `REPLACE_...`.
4. فعّل Authentication -> Email/Password في Firebase Console.
5. أنشئ مستخدم (email/password) في Firebase -> Authentication -> Users. هذا الإيميل هو الادمن الوحيد.
6. في Firestore Database: أنشئ قاعدة بيانات في وضع Native mode. لا تحتاج لقواعد معقدة الآن، لكن لاحقًا أنصح ضبط قواعد Security لتسمح بالقراءة للجميع والكتابة للمستخدمين المصادقين فقط.

### قواعد أمان Firestore مبدئية (اختياري)
للسهولة خلال التطوير، يمكنك جعل الكتابة مقصورة على المستخدمين المدققين:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## نشر على Netlify
- اصنع repo على GitHub وارفع الملفات.
- في Netlify: New site -> Import from GitHub -> اختَر الريبو.
- Publish directory: اتركها `.` لأن المشروع HTML ثابت في الجذر.
- بعد النشر، زر `/admin/index.html` للدخول، وضع الإيميل/الباسورد اللي أنشأته في Firebase.

## ملاحظات أمنية مهمة
- هذا مشروع ستاتيك يستخدم Firebase client-side. التأمين الفعلي يعتمد على قواعد Firestore وAuthentication.
- لاحقًا إن أردت حماية أقوى (مثلاً role-based admin) اسألني أظبطلك Cloud Functions أو server middleware.

---
لو تبي، أعمللك الآن:
1) أملأ `firebaseConfig` بقيمك (أعطني القيم أو ألهمك كيف تأخذها)،
2) أرفع الحزمة كـ ZIP جاهز للتحميل،
3) أو أعمل repo على GitHub واربطه بـ Netlify (أحتاج صلاحية GitHub أو تعمل Push بنفسك).

قلّي تختار أي وحدة الآن: "ZIP" أو "GitHub+Netlify"؟
