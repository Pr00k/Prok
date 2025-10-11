// ===== Prok System - Simplified =====
document.addEventListener('DOMContentLoaded', initApp);

// النظام الرئيسي
const ProkSystem = {
    init() {
        this.setupAuth();
        this.setupVisitorCounter();
        this.setupCarousel();
        this.setupProtection();
        this.setupApps();
        this.setupEventListeners();
        this.checkAdminStatus();
    },

    // نظام المصادقة
    setupAuth() {
        this.adminBtn = document.getElementById('adminBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.adminModal = document.getElementById('adminModal');

        this.adminBtn?.addEventListener('click', () => {
            const user = this.getCurrentUser();
            user ? window.location.href = 'admin.html' : this.showAdminModal();
        });

        this.logoutBtn?.addEventListener('click', () => {
            localStorage.removeItem('prok_admin_user');
            document.body.classList.remove('admin-mode');
            this.showToast('تم تسجيل الخروج', 'info');
        });

        // نافذة تسجيل الدخول
        document.getElementById('adminLogin')?.addEventListener('click', () => {
            const email = document.getElementById('adminEmailInput').value;
            const password = document.getElementById('adminPassInput').value;
            
            if (email && password) {
                this.loginUser({ email, uid: 'user-' + Date.now() });
                this.adminModal.classList.remove('show');
                this.showToast('تم تسجيل الدخول', 'success');
            }
        });

        document.getElementById('adminCancel')?.addEventListener('click', () => {
            this.adminModal.classList.remove('show');
        });
    },

    // عداد الزوار
    setupVisitorCounter() {
        const visCount = document.getElementById('visCount');
        if (!visCount) return;

        let count = parseInt(localStorage.getItem('prok_visitors') || '0') + 1;
        localStorage.setItem('prok_visitors', count.toString());
        visCount.textContent = count.toLocaleString();
    },

    // الكاروسيل
    setupCarousel() {
        const slides = document.getElementById('carouselSlides');
        const dotsContainer = document.getElementById('carouselDots');
        if (!slides) return;

        let currentSlide = 0;
        const slideElements = slides.querySelectorAll('.slide');

        const updateCarousel = () => {
            slideElements.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
        };

        // إنشاء النقاط
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slideElements.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        // الأزرار
        document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideElements.length;
            updateCarousel();
        });

        document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideElements.length) % slideElements.length;
            updateCarousel();
        });

        // التمرير التلقائي
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slideElements.length;
            updateCarousel();
        }, 4000);

        updateCarousel();
    },

    // نظام الحماية
    setupProtection() {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.showProtectionAlert();
            }
        });
    },

    // نظام التطبيقات
    setupApps() {
        this.appsGrid = document.getElementById('appsGrid');
        this.addAppBtn = document.getElementById('addAppBtn');
        
        this.addAppBtn?.addEventListener('click', () => this.addNewApp());
        this.loadApps();
    },

    loadApps() {
        if (!this.appsGrid) return;

        const apps = this.getApps();
        this.appsGrid.innerHTML = apps.map(app => `
            <div class="app-card">
                <span class="edit-icon" data-edit="app-${app.id}">✏️</span>
                <img src="${app.image}" alt="${app.title}">
                <div class="app-info">
                    <h3>${app.title}</h3>
                    <p>${app.description}</p>
                    <div class="app-actions">
                        <button class="app-btn download" onclick="ProkSystem.downloadApp('${app.id}')">
                            <i class="fas fa-download"></i> تحميل
                        </button>
                        <button class="app-btn delete admin-only" onclick="ProkSystem.deleteApp('${app.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    getApps() {
        const stored = localStorage.getItem('prok_apps');
        if (stored) return JSON.parse(stored);
        
        // تطبيقات افتراضية
        const defaultApps = [
            {
                id: '1',
                title: 'تطبيق الإنتاجية',
                description: 'أداة متكاملة لإدارة المهام والوقت',
                image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop'
            },
            {
                id: '2',
                title: 'مدير الملفات',
                description: 'تنظيم الملفات والوثائق بذكاء',
                image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=300&h=200&fit=crop'
            },
            {
                id: '3',
                title: 'مشغل الوسائط',
                description: 'تشغيل الفيديو والصوت بجودة عالية',
                image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=200&fit=crop'
            }
        ];
        
        localStorage.setItem('prok_apps', JSON.stringify(defaultApps));
        return defaultApps;
    },

    addNewApp() {
        const apps = this.getApps();
        const newApp = {
            id: Date.now().toString(),
            title: 'تطبيق جديد',
            description: 'وصف التطبيق الجديد',
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
        };
        
        apps.push(newApp);
        localStorage.setItem('prok_apps', JSON.stringify(apps));
        this.loadApps();
        this.showToast('تم إضافة تطبيق جديد', 'success');
    },

    deleteApp(appId) {
        const apps = this.getApps().filter(app => app.id !== appId);
        localStorage.setItem('prok_apps', JSON.stringify(apps));
        this.loadApps();
        this.showToast('تم حذف التطبيق', 'success');
    },

    downloadApp(appId) {
        const app = this.getApps().find(a => a.id === appId);
        if (app) {
            this.showToast(`جاري تحميل ${app.title}`, 'info');
            setTimeout(() => {
                this.showToast(`تم تحميل ${app.title}`, 'success');
            }, 1500);
        }
    },

    // نظام الأحداث
    setupEventListeners() {
        // تبديل السمة
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            document.body.classList.toggle('theme-light');
            
            const isLight = document.body.classList.contains('theme-light');
            const btn = document.getElementById('themeToggle');
            if (btn) {
                btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            }
            
            this.showToast(isLight ? 'السمة الفاتحة' : 'السمة الداكنة', 'info');
        });

        // القائمة المتحركة
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('mainNav');
        mobileBtn?.addEventListener('click', () => nav?.classList.toggle('active'));

        // نظام التعديل
        this.setupEditSystem();
    },

    setupEditSystem() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-icon')) {
                this.openEditModal(e.target);
            }
        });

        document.getElementById('saveEdit')?.addEventListener('click', () => this.saveEdit());
        document.getElementById('cancelEdit')?.addEventListener('click', () => {
            document.getElementById('editModal').classList.remove('show');
        });
    },

    openEditModal(icon) {
        const target = icon.getAttribute('data-edit');
        const parent = icon.parentElement;
        const currentValue = parent.textContent.replace('✏️', '').trim();
        
        const modal = document.getElementById('editModal');
        const content = document.getElementById('editModalContent');
        
        if (!modal || !content) return;

        document.getElementById('editModalTitle').textContent = `تعديل ${target}`;
        content.innerHTML = `<input type="text" id="editValue" value="${currentValue}" class="input">`;
        
        modal.classList.add('show');
        this.currentEdit = { target, element: parent };
    },

    saveEdit() {
        const value = document.getElementById('editValue')?.value;
        if (!value || !this.currentEdit) return;

        this.currentEdit.element.innerHTML = 
            `<span class="edit-icon" data-edit="${this.currentEdit.target}">✏️</span> ${value}`;
        
        document.getElementById('editModal').classList.remove('show');
        this.showToast('تم الحفظ', 'success');
    },

    // أدوات مساعدة
    showAdminModal() {
        this.adminModal?.classList.add('show');
    },

    loginUser(user) {
        localStorage.setItem('prok_admin_user', JSON.stringify(user));
        document.body.classList.add('admin-mode');
        document.getElementById('adminEmail').textContent = user.email;
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
    },

    checkAdminStatus() {
        const user = this.getCurrentUser();
        if (user) {
            document.body.classList.add('admin-mode');
            document.getElementById('adminEmail').textContent = user.email;
        }
    },

    showProtectionAlert() {
        const alert = document.getElementById('protectionAlert');
        alert?.classList.add('show');
        setTimeout(() => alert?.classList.remove('show'), 2000);
    },

    showToast(message, type = 'info') {
        // إنشاء toast بسيط
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 12px 20px; border-radius: 8px;
            color: white; font-weight: bold; z-index: 3000;
            background: ${type === 'success' ? '#2ed573' : 
                        type === 'error' ? '#ff4757' : '#00a8ff'};
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
};

// تهيئة التطبيق
function initApp() {
    ProkSystem.init();
}
