/**
 * النظام المتطور - Main Application Script
 * نظام إدارة متكامل مع تحليلات ذكية
 */

class SystemManager {
    constructor() {
        this.currentUser = null;
        this.apps = [];
        this.settings = {
            theme: 'dark',
            language: 'ar',
            notifications: true
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeApps();
        this.setupIntersectionObserver();
        this.startPerformanceMonitoring();
        
        console.log('✅ النظام جاهز للعمل');
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Auth buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showAuthModal('register'));
        
        // Modal handling
        this.setupModalHandlers();
        
        // Theme toggle
        this.setupThemeToggle();
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        const element = document.querySelector(target);
        
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    }

    showAuthModal(type) {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    setupModalHandlers() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });
    }

    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    setupThemeToggle() {
        // يمكن إضافة تبديل السمة هنا
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .app-card').forEach(el => {
            observer.observe(el);
        });
    }

    initializeApps() {
        // تحميل التطبيقات من localStorage أو API
        this.loadApps();
    }

    loadApps() {
        const savedApps = localStorage.getItem('system_apps');
        if (savedApps) {
            this.apps = JSON.parse(savedApps);
        } else {
            // تطبيقات افتراضية
            this.apps = [
                {
                    id: 1,
                    name: 'إدارة المحتوى',
                    description: 'نظام متكامل لإدارة المحتوى الرقمي',
                    enabled: true,
                    category: 'content'
                },
                {
                    id: 2,
                    name: 'التقارير الذكية',
                    description: 'تحليلات متقدمة وتقارير تفاعلية',
                    enabled: false,
                    category: 'analytics'
                }
            ];
            this.saveApps();
        }
        this.renderApps();
    }

    saveApps() {
        localStorage.setItem('system_apps', JSON.stringify(this.apps));
    }

    renderApps() {
        const appsGrid = document.querySelector('.apps-grid');
        if (!appsGrid) return;

        appsGrid.innerHTML = this.apps.map(app => `
            <div class="app-card" data-app-id="${app.id}">
                <div class="app-icon">
                    <i class="fas fa-cube"></i>
                </div>
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                    <div class="app-actions">
                        <button class="btn ${app.enabled ? 'btn-secondary' : 'btn-primary'}" 
                                onclick="systemManager.toggleApp(${app.id})">
                            ${app.enabled ? 'تعطيل' : 'تفعيل'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleApp(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (app) {
            app.enabled = !app.enabled;
            this.saveApps();
            this.renderApps();
            this.showNotification(
                `تم ${app.enabled ? 'تفعيل' : 'تعطيل'} ${app.name}`,
                app.enabled ? 'success' : 'warning'
            );
        }
    }

    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // إضافة الأنيميشن
        notification.style.animation = 'slideInRight 0.3s ease';
        
        // إضافة للإشعارات
        const container = document.getElementById('notifications') || this.createNotificationsContainer();
        container.appendChild(notification);

        // إزالة تلقائية بعد 5 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    createNotificationsContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    startPerformanceMonitoring() {
        // مراقبة أداء الصفحة
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        console.log('Page Load Time:', entry.loadEventEnd - entry.navigationStart);
                    }
                }
            });
            observer.observe({ entryTypes: ['navigation', 'paint'] });
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('system_settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // تطبيق الإعدادات
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.documentElement.setAttribute('dir', this.settings.language === 'ar' ? 'rtl' : 'ltr');
    }

    // إدارة المستخدمين
    async login(email, password) {
        try {
            // محاكاة عملية تسجيل الدخول
            await this.simulateApiCall();
            this.currentUser = { email, name: 'مستخدم' };
            this.showNotification('تم تسجيل الدخول بنجاح', 'success');
            return true;
        } catch (error) {
            this.showNotification('فشل تسجيل الدخول', 'error');
            return false;
        }
    }

    logout() {
        this.currentUser = null;
        this.showNotification('تم تسجيل الخروج', 'info');
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    // تحليلات واستخدام
    trackEvent(eventName, data = {}) {
        const analytics = {
            event: eventName,
            timestamp: new Date().toISOString(),
            ...data
        };
        console.log('📊 Analytics Event:', analytics);
    }
}

// CSS إضافي للأنيميشن والإشعارات
const additionalStyles = `
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

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notifications-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .notification {
        background: var(--card-bg);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        box-shadow: var(--shadow-lg);
        min-width: 300px;
    }

    .notification-success {
        border-left: 4px solid var(--success);
    }

    .notification-warning {
        border-left: 4px solid var(--warning);
    }

    .notification-error {
        border-left: 4px solid var(--error);
    }

    .notification-info {
        border-left: 4px solid var(--info);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .animate-in {
        animation: fadeInUp 0.6s ease;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .btn-sm {
        padding: var(--space-sm) var(--space-md);
        font-size: 0.8rem;
    }

    .w-100 {
        width: 100%;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
    }

    .input-group input {
        padding: var(--space-md);
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.05);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: 1rem;
        transition: var(--transition-normal);
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--accent-primary);
        background: rgba(255,255,255,0.1);
    }

    .link {
        color: var(--accent-primary);
        text-decoration: none;
        transition: var(--transition-fast);
    }

    .link:hover {
        color: var(--accent-secondary);
    }
`;

// إضافة الـ CSS الإضافي
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// تهيئة النظام
const systemManager = new SystemManager();

// جعل النظام متاحاً globally
window.systemManager = systemManager;

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    systemManager.trackEvent('page_loaded');
});
