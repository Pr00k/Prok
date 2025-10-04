/**
 * Firebase Configuration for Prok
 * Enhanced with error handling and fallbacks
 */

// Sample data fallback
const SAMPLE_DATA = {
    banners: [
        {
            id: 1,
            image: 'assets/img/banner1.svg',
            title: 'مرحباً بك في Prok',
            description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
            link: '#apps',
            animation: 'fade-in'
        },
        {
            id: 2,
            image: 'assets/img/banner2.svg',
            title: 'تطبيقات مذهلة',
            description: 'مجموعة مختارة من أفضل التطبيقات',
            link: '#apps',
            animation: 'slide-up'
        },
        {
            id: 3,
            image: 'assets/img/banner3.svg',
            title: 'ألعاب رائعة',
            description: 'استمتع بألعاب مجانية ممتعة',
            link: '#games',
            animation: 'zoom-in'
        }
    ],
    apps: [
        {
            id: 1,
            name: 'تطبيق الإنتاجية',
            description: 'تطبيق مميز لزيادة الإنتاجية',
            image: 'assets/img/app-placeholder.svg',
            rating: 4.5,
            size: '15MB',
            category: 'productivity',
            downloadLink: '#',
            animation: 'fade-in'
        },
        {
            id: 2,
            name: 'تطبيق التواصل',
            description: 'تواصل مع الأصدقاء بسهولة',
            image: 'assets/img/app-placeholder.svg',
            rating: 4.2,
            size: '25MB',
            category: 'social',
            downloadLink: '#',
            animation: 'slide-up'
        }
    ],
    games: [
        {
            id: 1,
            name: 'لعبة المغامرة',
            description: 'لعبة مغامرة مثيرة',
            image: 'assets/img/game-placeholder.svg',
            rating: 4.8,
            size: '50MB',
            category: 'adventure',
            downloadLink: '#',
            animation: 'zoom-in'
        }
    ],
    siteContent: {
        title: 'Prok - تطبيقات وألعاب مجانية',
        description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
        aboutText: 'منصة Prok تقدم أفضل التطبيقات والألعاب المجانية بعالية الجودة وسهولة الاستخدام.'
    }
};

class FirebaseManager {
    constructor() {
        this.isConfigured = false;
        this.isInitialized = false;
        this.currentUser = null;
        this.isAdmin = false;
        this.adminEmail = 'aaaab9957@gmail.com';
        
        this.init();
    }

    init() {
        try {
            // Check if Firebase SDK is available
            if (typeof firebase === 'undefined' || !firebase.app) {
                throw new Error('Firebase SDK not loaded');
            }

            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
                authDomain: "prok-58f05.firebaseapp.com",
                projectId: "prok-58f05",
                storageBucket: "prok-58f05.appspot.com",
                messagingSenderId: "978563434886",
                appId: "1:978563434886:web:d16c70551240a05c81c407",
                measurementId: "G-PWTGTT2VJT"
            };

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.isConfigured = true;
            this.isInitialized = true;
            
            // Initialize services
            this.auth = firebase.auth();
            this.firestore = firebase.firestore();
            this.storage = firebase.storage();
            
            this.setupAuthListener();
            this.showToast('تم تهيئة Firebase بنجاح', 'success');
            
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.isConfigured = false;
            this.showToast('وضع العرض: استخدام البيانات التجريبية', 'warning');
        }
    }

    setupAuthListener() {
        if (!this.isConfigured) return;

        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.isAdmin = user && user.email === this.adminEmail;
            
            // Update UI based on auth state
            this.updateAuthUI();
            
            if (user && this.isAdmin) {
                this.showToast(`مرحباً ${user.displayName || 'مدير'}`, 'success');
            } else if (user && !this.isAdmin) {
                this.showToast('ليس لديك صلاحية المدير', 'error');
                this.signOut();
            }
        });
    }

    async signInWithGoogle() {
        if (!this.isConfigured) {
            this.showToast('Firebase غير مهيأ', 'error');
            return;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            await this.auth.signInWithPopup(provider);
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showToast('فشل تسجيل الدخول', 'error');
        }
    }

    async signOut() {
        if (!this.isConfigured) return;
        
        try {
            await this.auth.signOut();
            this.showToast('تم تسجيل الخروج', 'success');
        } catch (error) {
            console.error('Sign out error:', error);
            this.showToast('فشل تسجيل الخروج', 'error');
        }
    }

    updateAuthUI() {
        const adminBtn = document.getElementById('admin-login-btn');
        const adminPanel = document.getElementById('admin-panel');
        const adminLogin = document.getElementById('admin-login');

        if (!adminBtn) return;

        if (this.currentUser && this.isAdmin) {
            adminBtn.textContent = `مدير (${this.currentUser.displayName || 'مستخدم'})`;
            adminBtn.onclick = () => this.signOut();
            
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminLogin) adminLogin.style.display = 'none';
            
            // Enable edit mode
            document.body.classList.add('edit-mode');
            this.initializeEditMode();
        } else {
            adminBtn.textContent = 'تسجيل المدير';
            adminBtn.onclick = () => this.showAdminModal();
            
            if (adminPanel) adminPanel.style.display = 'none';
            if (adminLogin) adminLogin.style.display = 'block';
            
            // Disable edit mode
            document.body.classList.remove('edit-mode');
        }

        adminBtn.style.display = 'block';
    }

    showAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Data Management Methods
    async getSiteData() {
        if (!this.isConfigured || !this.isAdmin) {
            return SAMPLE_DATA;
        }

        try {
            const doc = await this.firestore.collection('site').doc('content').get();
            if (doc.exists) {
                return doc.data();
            } else {
                // Create initial document if doesn't exist
                await this.firestore.collection('site').doc('content').set(SAMPLE_DATA);
                return SAMPLE_DATA;
            }
        } catch (error) {
            console.error('Error getting site data:', error);
            this.showToast('جاري استخدام البيانات المحلية', 'warning');
            return SAMPLE_DATA;
        }
    }

    async updateSiteData(data) {
        if (!this.isConfigured || !this.isAdmin) {
            this.showToast('غير مصرح بالتحديث', 'error');
            return false;
        }

        try {
            await this.firestore.collection('site').doc('content').set(data, { merge: true });
            this.showToast('تم حفظ التغييرات', 'success');
            return true;
        } catch (error) {
            console.error('Error updating site data:', error);
            this.showToast('فشل حفظ التغييرات', 'error');
            return false;
        }
    }

    async uploadImage(file, path) {
        if (!this.isConfigured || !this.isAdmin) {
            this.showToast('غير مصرح برفع الصور', 'error');
            return null;
        }

        try {
            const storageRef = this.storage.ref();
            const fileRef = storageRef.child(`${path}/${Date.now()}_${file.name}`);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            this.showToast('تم رفع الصورة', 'success');
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('فشل رفع الصورة', 'error');
            return null;
        }
    }

    // Edit Mode Initialization
    initializeEditMode() {
        if (!this.isAdmin) return;

        // Add edit indicators to editable elements
        this.addEditIndicators();
        
        // Initialize sortable functionality
        this.initializeSortable();
        
        // Add admin toolbar
        this.createAdminToolbar();
    }

    addEditIndicators() {
        // Add edit indicators to various elements
        const editableSelectors = [
            '.section-title',
            '.section-subtitle',
            '.card-title',
            '.card-description',
            '.about-text p',
            '.carousel-content h2',
            '.carousel-content p'
        ];

        editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.querySelector('.edit-indicator')) {
                    const indicator = document.createElement('button');
                    indicator.className = 'edit-indicator';
                    indicator.innerHTML = '✏️';
                    indicator.title = 'تعديل';
                    indicator.onclick = (e) => {
                        e.stopPropagation();
                        this.openTextEditor(element);
                    };
                    element.classList.add('editable');
                    element.style.position = 'relative';
                    element.appendChild(indicator);
                }
            });
        });
    }

    openTextEditor(element) {
        // Implementation for inline text editing
        const currentText = element.textContent;
        const input = document.createElement('textarea');
        input.value = currentText;
        input.style.width = '100%';
        input.style.height = '100px';
        input.style.padding = '10px';
        input.style.border = '2px solid var(--primary-color)';
        input.style.borderRadius = 'var(--border-radius)';
        
        // Replace element with textarea
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element);
        
        // Add save/cancel buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'حفظ';
        saveBtn.className = 'btn btn-primary';
        saveBtn.onclick = () => {
            element.textContent = input.value;
            element.style.display = '';
            input.remove();
            buttonContainer.remove();
            this.showToast('تم حفظ التغيير', 'success');
        };
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'إلغاء';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.onclick = () => {
            element.style.display = '';
            input.remove();
            buttonContainer.remove();
        };
        
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);
        input.parentNode.insertBefore(buttonContainer, input.nextSibling);
        
        input.focus();
    }

    initializeSortable() {
        // Initialize drag and drop for sortable lists
        // This would require a library like SortableJS
        console.log('Sortable functionality ready to be implemented');
    }

    createAdminToolbar() {
        // Create floating admin toolbar
        let toolbar = document.getElementById('admin-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'admin-toolbar';
            toolbar.className = 'admin-toolbar';
            toolbar.innerHTML = `
                <h4>أدوات المدير</h4>
                <div class="admin-tools">
                    <button class="admin-tool-btn" data-action="edit-banners">تحرير اللافتات</button>
                    <button class="admin-tool-btn" data-action="edit-apps">تحرير التطبيقات</button>
                    <button class="admin-tool-btn" data-action="edit-games">تحرير الألعاب</button>
                    <button class="admin-tool-btn" data-action="save-changes">حفظ التغييرات</button>
                </div>
            `;
            document.body.appendChild(toolbar);
        }
    }

    showToast(message, type = 'info') {
        // Implementation for toast notifications
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    }
}

// Initialize Firebase Manager
const firebaseManager = new FirebaseManager();

// Global access
window.firebaseManager = firebaseManager;

// Admin modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const adminModal = document.getElementById('admin-modal');
    const googleLoginBtn = document.getElementById('google-login');
    const modalCloseBtn = document.querySelector('.modal-close');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            firebaseManager.signInWithGoogle();
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            firebaseManager.hideAdminModal();
        });
    }
    
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                firebaseManager.hideAdminModal();
            }
        });
    }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseManager;
}
