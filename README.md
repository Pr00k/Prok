Prok — Full site (ready)
Files included:
- index.html, about.html, services.html, contact.html
- admin/index.html (login), admin/dashboard.html (editor)
- assets/css/style.css, assets/js/firebase-config.js, assets/js/lang.js, assets/js/main.js
- assets/data/content.json
Instructions:
1. Open assets/js/firebase-config.js and ensure the window.firebaseConfig object matches your Firebase project.
2. In Firebase Console: enable Authentication -> Google Sign-in, create Firestore DB.
3. In Firestore create collection 'site' and document 'content' (you can leave empty; dashboard will create defaults).
4. Upload project to GitHub or Firebase Hosting. Open admin/index.html to login and admin/dashboard.html to edit content.
