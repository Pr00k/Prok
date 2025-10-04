Prok — Advanced Starter (Multilingual + Admin)

How to use:
1. Edit assets/js/firebase-config.js and confirm it contains your Firebase project's config.
2. In Firebase Console:
   - Enable Authentication → Google Sign-In.
   - Create Firestore database (mode: production or test).
   - (Optional) Set Firestore rules to restrict writes to your admin email.
3. Upload the project to GitHub or deploy with Firebase Hosting.
4. Open admin/index.html to sign in with Google, then dashboard.html to edit content.
5. index.html uses Firestore document `site/content` if available, otherwise falls back to built-in content.

Files included:
- index.html, about.html, services.html, contact.html
- admin/index.html (login), admin/dashboard.html (editor)
- assets/css/style.css
- assets/js/firebase-config.js (pre-filled), lang.js, main.js
- README with deployment steps
