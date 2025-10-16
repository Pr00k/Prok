/**
 * النظام المتطور - الإصدار المتقدم مع AI
 * نظام إدارة شامل مع مساعد ذكي غير محدود
 */

class AdvancedSystemManager {
    constructor() {
        this.isAdmin = false;
        this.adminPassword = "admin123"; // كلمة المرور الافتراضية
        this.aiAssistant = null;
        this.init();
    }

    init() {
        this.checkAdminSession();
        this.setupEventListeners();
        this.initializeAI();
        this.setupSecurity();
        
        console.log('🚀 النظام المتطور جاهز للعمل');
    }

    setupEventListeners() {
        // تسجيل الدخول للإدمن
        document.getElementById('adminLoginBtn')?.addEventListener('click', () => this.showAdminLogin());
        
        // التنقل
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // تأثير التمرير
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    checkAdminSession() {
        const adminSession = localStorage.getItem('admin_session');
        if (adminSession === 'active') {
            this.isAdmin = true;
            this.enableAdminFeatures();
        }
    }

    showAdminLogin() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    handleAdminLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === 'admin' && password === this.adminPassword) {
            this.isAdmin = true;
            localStorage.setItem('admin_session', 'active');
            this.enableAdminFeatures();
            this.hideAdminModal();
            this.showNotification('تم تسجيل الدخول كمدير بنجاح', 'success');
            
            // تحميل لوحة التحكم بعد 1 ثانية
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            this.showNotification('كلمة المرور غير صحيحة', 'error');
        }
    }

    enableAdminFeatures() {
        // تفعيل جميع مميزات الإدمن
        console.log('🔓 مميزات الإدمن مفعلة');
    }

    hideAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
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
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    initializeAI() {
        this.aiAssistant = new AdvancedAIAssistant();
    }

    setupSecurity() {
        // حماية إضافية للنظام
        this.preventInspection();
        this.monitorActivity();
    }

    preventInspection() {
        // منع فتح أدوات المطورين (يمكن تعطيله للتطوير)
        /*
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                window.close();
            }
        }, 1000);
        */
    }

    monitorActivity() {
        // مراقبة النشاط المشبوه
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.showNotification('هذا الإجراء غير مسموح', 'warning');
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.animation = 'slideInRight 0.3s ease';
        
        const container = document.getElementById('notifications') || this.createNotificationsContainer();
        container.appendChild(notification);

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

    // وظائف متقدمة للإدمن
    async analyzeSystem() {
        if (!this.isAdmin) {
            this.showNotification('غير مصرح', 'error');
            return;
        }

        const analysis = await this.aiAssistant.comprehensiveAnalysis();
        return analysis;
    }

    async fixAllIssues() {
        if (!this.isAdmin) {
            this.showNotification('غير مصرح', 'error');
            return;
        }

        const results = await this.aiAssistant.autoFixAll();
        this.showNotification(`تم إصلاح ${results.fixed} مشكلة`, 'success');
        return results;
    }

    async optimizePerformance() {
        if (!this.isAdmin) {
            this.showNotification('غير مصرح', 'error');
            return;
        }

        const optimization = await this.aiAssistant.optimizeSystem();
        this.showNotification('تم تحسين الأداء بنجاح', 'success');
        return optimization;
    }
}

// دالة تسجيل الدخول العالمية
function handleAdminLogin(event) {
    event.preventDefault();
    systemManager.handleAdminLogin(event);
}

function showAdminLogin() {
    systemManager.showAdminLogin();
}

// تهيئة النظام
const systemManager = new AdvancedSystemManager();
window.systemManager = systemManager;

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 النظام يعمل بكفاءة');
});
