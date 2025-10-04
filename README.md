Prok — Ready package (updated)
Files included:
- index.html, about.html, services.html, contact.html
- admin/index.html (login), admin/dashboard.html (editor)
- assets/css/style.css, assets/js/firebase-config.js, assets/js/lang.js, assets/js/darkmode.js, assets/js/admin.js, assets/js/main.js
- assets/data/content.json
Instructions:
1. Verify assets/js/firebase-config.js contains your Firebase project config.
2. Enable Authentication -> Google and Email/Password in Firebase Console and create Firestore DB.
3. (Optional) Set Firestore write rules to allow writes only for admin emails.
4. Deploy to GitHub Pages or Firebase Hosting. Use admin/index.html to login and admin/dashboard.html to edit site content.
