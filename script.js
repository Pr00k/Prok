/**
 * نظام Prok - السكريبت الأساسي
 * نظام إدارة محتوى ذكي مع حماية متقدمة
 */

class ProkSystem {
    constructor() {
        this.isAdmin = false;
        this.currentUser = null;
        this.carouselIndex = 0;
        this.carouselInterval = null;
    }

    /**
     * تهيئة النظام الأساسي
     */
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.initCarousel();
        this.loadApps();
        this.updateStats();
        this.setupProtection();
    }

    /**
     * التحقق من المصادقة
     */
    checkAuth() {
        const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
        if (user) {
            this.currentUser = user;
            this.isAdmin = true;
            document.body.classList.add('admin-mode');
            this.updateAdminUI();
        }
    }

    /**
     * تحديث واجهة الأدمن
     */
    updateAdminUI() {
        const emailDisplay = document.getElementById('adminEmail');
        if (emailDisplay && this.currentUser) {
            emailDisplay.textContent = this.currentUser.email;
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupAuthButtons();
        this.setupContactForm();
    }

    /**
     * إعداد التنقل
     */
    setupNavigation() {
        // القائمة المحمولة
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        
        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // التمرير السلس
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    mainNav?.classList.remove('active');
                }
            });
        });
    }

    /**
     * إعداد تبديل الثيم
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    /**
     * إعداد أزرار المصادقة
     */
    setupAuthButtons() {
        // زر الأدمن
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                this.isAdmin ? window.location.href = 'admin.html' : this.showAdminModal();
            });
        }

        // زر الخروج
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // تسجيل الدخول
        const adminLogin = document.getElementById('adminLogin');
        const adminCancel = document.getElementById('adminCancel');
        
        if (adminLogin) adminLogin.addEventListener('click', () => this.handleAdminLogin());
        if (adminCancel) adminCancel.addEventListener('click', () => this.hideAdminModal());
    }

    /**
     * إعداد نموذج الاتصال
     */
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    /**
     * تهيئة الكاروسيل
     */
    initCarousel() {
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.getElementById('carouselDots');
        
        if (!slides.length) return;

        // إنشاء نقاط التنقل
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => this.goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        // أزرار التنقل
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // التشغيل التلقائي
        this.startCarousel();

        // إيقاف التمرير عند التوقف
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopCarousel());
            carousel.addEventListener('mouseleave', () => this.startCarousel());
        }
    }

    /**
     * الانتقال إلى شريحة محددة
     */
    goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (!slides.length) return;

        // تحديث الحالة
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        this.carouselIndex = index;
        slides[this.carouselIndex].classList.add('active');
        if (dots[this.carouselIndex]) {
            dots[this.carouselIndex].classList.add('active');
        }
    }

    /**
     * الشريحة التالية
     */
    nextSlide() {
        const slides = document.querySelectorAll('.slide');
        this.carouselIndex = (this.carouselIndex + 1) % slides.length;
        this.goToSlide(this.carouselIndex);
    }

    /**
     * الشريحة السابقة
     */
    previousSlide() {
        const slides = document.querySelectorAll('.slide');
        this.carouselIndex = (this.carouselIndex - 1 + slides.length) % slides.length;
        this.goToSlide(this.carouselIndex);
    }

    /**
     * بدء التشغيل التلقائي
     */
    startCarousel() {
        this.stopCarousel();
        this.carouselInterval = setInterval(() => this.nextSlide(), 5000);
    }

    /**
     * إيقاف التشغيل التلقائي
     */
    stopCarousel() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    /**
     * تحميل التطبيقات
     */
    loadApps() {
        const appsGrid = document.getElementById('appsGrid');
        if (!appsGrid) return;

        const apps = this.getApps();
        
        if (apps.length === 0) {
            appsGrid.innerHTML = this.getDefaultAppsHTML();
            return;
        }

        appsGrid.innerHTML = apps.map(app => this.createAppCardHTML(app)).join('');
    }

    /**
     * الحصول على التطبيقات
     */
    getApps() {
        const stored = localStorage.getItem('prok_apps');
        if (stored) return JSON.parse(stored);

        // تطبيقات افتراضية
        const defaultApps = [
            {
                id: '1',
                title: 'منصة التجارة',
                description: 'نظام متكامل لإدارة المتاجر الإلكترونية',
                image: 'https://images.unsplash.com/photo-1563013541-2d1f887c57e6?w=300&h=200&fit=crop',
                category: 'أعمال'
            },
            {
                id: '2', 
                title: 'نظام التعليم',
                description: 'منصة تعليمية ذكية مع محتوى تفاعلي',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
                category: 'تعليم'
            },
            {
                id: '3',
                title: 'تطبيق الصحة',
                description: 'تتبع الصحة واللياقة البدنية بشكل ذكي',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
                category: 'صحة'
            }
        ];

        localStorage.setItem('prok_apps', JSON.stringify(defaultApps));
        return defaultApps;
    }

    /**
     * إنشاء كارت التطبيق
     */
    createAppCardHTML(app) {
        return `
            <div class="app-card" data-app-id="${app.id}">
                <img src="${app.image}" alt="${app.title}" loading="lazy">
                <div class="app-info">
                    <h3>${app.title}</h3>
                    <p>${app.description}</p>
                    <div class="app-actions">
                        <button class="app-btn download" onclick="prokSystem.downloadApp('${app.id}')">
                            <i class="fas fa-download"></i> تحميل
                        </button>
                        ${this.isAdmin ? `
                            <button class="app-btn delete" onclick="prokSystem.deleteApp('${app.id}')">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * التطبيقات الافتراضية
     */
    getDefaultAppsHTML() {
        return `
            <div class="no-apps">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد تطبيقات حالياً</h3>
                <p>سيتم إضافة التطبيقات قريباً</p>
            </div>
        `;
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        this.updateVisitorCount();
    }

    /**
     * تحديث عداد الزوار
     */
    updateVisitorCount() {
        const visCount = document.getElementById('visCount');
        if (!visCount) return;

        let count = parseInt(localStorage.getItem('prok_visitors') || '0');
        
        // زيادة العدد مرة واحدة يومياً
        const lastVisit = localStorage.getItem('prok_last_visit');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (!lastVisit || (now - parseInt(lastVisit)) > oneDay) {
            count++;
            localStorage.setItem('prok_visitors', count.toString());
            localStorage.setItem('prok_last_visit', now.toString());
        }

        visCount.textContent = count.toLocaleString();
    }

    /**
     * إعداد الحماية
     */
    setupProtection() {
        if (this.isAdmin) return;

        // منع النسخ
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.showToast('النسخ غير مسموح', 'warning');
        });

        // منع النقر الأيمن
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionAlert();
        });

        // منع أدوات المطورين
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                this.showProtectionAlert();
            }
        });
    }

    /**
     * عرض تنبيه الحماية
     */
    showProtectionAlert() {
        const alert = document.getElementById('protectionAlert');
        if (alert) {
            alert.classList.add('show');
            setTimeout(() => alert.classList.remove('show'), 2000);
        }
    }

    /**
     * تبديل الثيم
     */
    toggleTheme() {
        const isDark = document.body.classList.contains('theme-dark');
        document.body.classList.toggle('theme-dark', !isDark);
        document.body.classList.toggle('theme-light', isDark);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // حفظ التفضيل
        localStorage.setItem('prok_theme', isDark ? 'light' : 'dark');
        this.showToast(`تم تفعيل الثيم ${isDark ? 'الفاتح' : 'الداكن'}`, 'success');
    }

    /**
     * عرض نافذة الأدمن
     */
    showAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) modal.classList.add('show');
    }

    /**
     * إخفاء نافذة الأدمن
     */
    hideAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('show');
            // مسح الحقول
            const inputs = modal.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
        }
    }

    /**
     * معالجة تسجيل الدخول
     */
    handleAdminLogin() {
        const email = document.getElementById('adminEmailInput')?.value.trim();
        const password = document.getElementById('adminPassInput')?.value;

        if (!email || !password) {
            this.showToast('يرجى ملء جميع الحقول', 'error');
            return;
        }

        // محاكاة المصادقة
        if (email === 'admin@prok.com' && password === '123456') {
            const user = { email, role: 'admin' };
            localStorage.setItem('prok_admin_user', JSON.stringify(user));
            
            this.currentUser = user;
            this.isAdmin = true;
            document.body.classList.add('admin-mode');
            
            this.hideAdminModal();
            this.updateAdminUI();
            this.loadApps(); // إعادة تحميل التطبيقات
            this.showToast('مرحباً بك في لوحة التحكم!', 'success');
        } else {
            this.showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        }
    }

    /**
     * تسجيل الخروج
     */
    logout() {
        localStorage.removeItem('prok_admin_user');
        this.currentUser = null;
        this.isAdmin = false;
        document.body.classList.remove('admin-mode');
        
        this.showToast('تم تسجيل الخروج', 'info');
        this.loadApps(); // إعادة تحميل التطبيقات
    }

    /**
     * معالجة نموذج الاتصال
     */
    handleContactForm(e) {
        e.preventDefault();
        
        this.showToast('جاري إرسال رسالتك...', 'info');
        
        setTimeout(() => {
            this.showToast('تم إرسال رسالتك بنجاح!', 'success');
            e.target.reset();
            
            // حفظ الرسالة
            this.saveContactMessage(e.target);
        }, 1500);
    }

    /**
     * حفظ رسالة الاتصال
     */
    saveContactMessage(form) {
        const formData = new FormData(form);
        const message = {
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData)
        };
        
        const messages = JSON.parse(localStorage.getItem('prok_contact_messages') || '[]');
        messages.push(message);
        localStorage.setItem('prok_contact_messages', JSON.stringify(messages));
    }

    /**
     * تحميل تطبيق
     */
    downloadApp(appId) {
        const apps = this.getApps();
        const app = apps.find(a => a.id === appId);
        
        if (!app) {
            this.showToast('التطبيق غير موجود', 'error');
            return;
        }

        this.showToast(`جاري تحميل ${app.title}...`, 'info');
        
        setTimeout(() => {
            this.showToast(`تم تحميل ${app.title} بنجاح!`, 'success');
            this.logDownload(appId);
        }, 2000);
    }

    /**
     * تسجيل التحميل
     */
    logDownload(appId) {
        const downloads = JSON.parse(localStorage.getItem('prok_downloads') || '[]');
        downloads.push({
            appId,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('prok_downloads', JSON.stringify(downloads));
    }

    /**
     * حذف تطبيق
     */
    deleteApp(appId) {
        if (!this.isAdmin) {
            this.showToast('غير مصرح', 'error');
            return;
        }

        if (!confirm('هل أنت متأكد من حذف هذا التطبيق؟')) return;

        const apps = this.getApps();
        const updatedApps = apps.filter(app => app.id !== appId);
        
        localStorage.setItem('prok_apps', JSON.stringify(updatedApps));
        this.loadApps();
        this.showToast('تم حذف التطبيق', 'success');
    }

    /**
     * عرض إشعار
     */
    showToast(message, type = 'info') {
        // إنشاء حاوية الإشعارات إذا لم تكن موجودة
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // الإزالة التلقائية
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * الحصول على أيقونة الإشعار
     */
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

/**
 * تطبيق الأنماط
 */
function applyStyles() {
    const styles = `
        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            margin: 10px;
            border-radius: 12px;
            background: var(--card);
            color: var(--text);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border-left: 4px solid var(--accent);
            animation: slideInRight 0.3s ease;
            transition: opacity 0.3s ease;
            max-width: 400px;
        }

        .toast.success { border-left-color: var(--success); }
        .toast.error { border-left-color: var(--danger); }
        .toast.warning { border-left-color: var(--warning); }
        .toast.info { border-left-color: var(--info); }

        .toast i {
            font-size: 1.2em;
            width: 20px;
        }

        .toast.success i { color: var(--success); }
        .toast.error i { color: var(--danger); }
        .toast.warning i { color: var(--warning); }
        .toast.info i { color: var(--info); }

        #toastContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        }

        .no-apps {
            text-align: center;
            padding: 60px 20px;
            color: var(--muted);
        }

        .no-apps i {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .mobile-menu.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }

        .mobile-menu.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            #toastContainer {
                right: 10px;
                left: 10px;
            }
            
            .toast {
                max-width: none;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

/**
 * تحميل الثيم المحفوظ
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('prok_theme') || 'dark';
    document.body.classList.add(`theme-${savedTheme}`);
    
    // تحديث الأيقونة
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

/**
 * تهيئة التطبيق
 */
function initializeApp() {
    applyStyles();
    loadSavedTheme();
    
    // إنشاء النظام
    window.prokSystem = new ProkSystem();
    prokSystem.init();
}

// البدء عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
