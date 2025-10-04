# Prok - منصة التطبيقات والألعاب المجانية

## 🚀 المميزات الجديدة

### الواجهة والمظهر
- تصميم متجاوب متطور يدعم الجوال والكمبيوتر
- نظام ألوان مزدوج (فاتح/مظلم) مع حفظ التفضيلات
- تأثيرات حركية متقدمة (تدرج، انزلاق، تكبير)
- تحسينات SEO وبيانات منظمة
- دعم كامل للغة العربية (RTL)

### نظام الإدارة
- لوحة تحكم متكاملة للمدير
- تحرير مباشر للنصوص والصور
- سحب وإفلات لإعادة الترتيب
- رفع الصور إلى Firebase Storage
- حفظ تلقائي كل دقيقتين
- استيراد/تصدير البيانات
- تحديث فوري للمحتوى

### الأداء والأمان
- تحميل كسول للصور (Lazy Loading)
- تحسين سرعة التحميل
- إشعارات toast للمستخدم
- إدارة أخطاء متقدمة
- قيود أمان Firebase

## 📁 هيكل الملفات

prok-site/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css (التصميم الرئيسي)
│   │   └── edits.css (واجهة التحرير)
│   ├── js/
│   │   ├── firebase-config.js (إعدادات Firebase)
│   │   ├── main.js (الوظائف الرئيسية)
│   │   └── admin.js (لوحة التحكم)
│   └── img/
│       ├── banner1.svg
│       ├── banner2.svg
│       ├── banner3.svg
│       ├── app-placeholder.svg
│       └── game-placeholder.svg
└── admin/ (ملفات الإدارة الإضافية)

## ⚙️ إعدادات Firebase

### الخطوات المطلوبة:

1. **تفعيل المصادقة:**
   - اذهب إلى Firebase Console → Authentication
   - اضغط على "Get Started" 
   - في علامة تبويب "Sign-in method"، فعّل "Google"

2. **إضافة النطاق المسموح:**
   - في Authentication → Settings → Authorized domains
   - أضف: `pr00k.github.io`

3. **قواعد Firestore (الأمان):**
   - اذهب إلى Firestore Database → Rules
   - استخدم القواعد التالية:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/content {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.token.email == "aaaab9957@gmail.com";
    }
  }
}
