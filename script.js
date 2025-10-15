/**
 * نظام إدارة Prok - السكريبت الرئيسي
 * نظام متكامل لإدارة المحتوى مع حماية وذكاء اصطناعي
 */

class ProkSystem {
  constructor() {
    this.isAdmin = false;
    this.currentUser = null;
    this.carouselIndex = 0;
    this.carouselInterval = null;
    this.editTarget = null;
  }

  /**
   * تهيئة النظام
   */
  init() {
    this.checkAdminStatus();
    this.setupEventListeners();
    this.initCarousel();
    this.loadApps();
    this.updateVisitorCount();
    this.setupProtection();
    this.loadSettings();
  }

  /**
   * التحقق من حالة الأدمن
   */
  checkAdminStatus() {
    const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
    if (user) {
      this.currentUser = user;
      this.isAdmin = true;
      document.body.classList.add('admin-mode');
      
      const emailDisplay = document.getElementById('adminEmail');
      if (emailDisplay) {
        emailDisplay.textContent = user.email;
      }
    }
  }

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // القائمة المحمولة
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
      });
    }

    // الثيمات
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // زر الأدمن
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        if (this.isAdmin) {
          window.location.href = 'admin.html';
        } else {
          this.showAdminModal();
        }
      });
    }

    // زر الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // تسجيل دخول الأدمن
    const adminLogin = document.getElementById('adminLogin');
    if (adminLogin) {
      adminLogin.addEventListener('click', () => this.handleAdminLogin());
    }

    const adminCancel = document.getElementById('adminCancel');
    if (adminCancel) {
      adminCancel.addEventListener('click', () => this.hideAdminModal());
    }

    // تسجيل دخول Google
    const googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
      googleLogin.addEventListener('click', () => this.handleGoogleLogin());
    }

    // الذكاء الاصطناعي
    const aiBtn = document.getElementById('aiBtn');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => this.showAIModal());
    }

    const aiClose = document.getElementById('aiClose');
    if (aiClose) {
      aiClose.addEventListener('click', () => this.hideAIModal());
    }

    const aiSend = document.getElementById('aiSend');
    if (aiSend) {
      aiSend.addEventListener('click', () => this.sendAIMessage());
    }

    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendAIMessage();
      });
    }

    // أزرار الإجراءات السريعة للذكاء الاصطناعي
    document.querySelectorAll('.ai-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('.ai-action-btn').dataset.action;
        this.handleAIAction(action);
      });
    });

    // نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
    }

    // إضافة تطبيق
    const addAppBtn = document.getElementById('addAppBtn');
    if (addAppBtn) {
      addAppBtn.addEventListener('click', () => this.showAddAppModal());
    }

    // أيقونات التعديل
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-icon')) {
        const editType = e.target.dataset.edit;
        this.showEditModal(editType);
      }
    });

    // التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          
          // إغلاق القائمة المحمولة
          if (mainNav) {
            mainNav.classList.remove('active');
          }
        }
      });
    });
  }

  /**
   * تهيئة الكاروسيل
   */
  initCarousel() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!slides.length || !dotsContainer) return;

    // إنشاء النقاط
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    // أزرار التنقل
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // التشغيل التلقائي
    this.startCarousel();
  }

  /**
   * الانتقال إلى شريحة معينة
   */
  goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!slides.length) return;

    // إزالة النشط من الجميع
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // تعيين النشط للشريحة الحالية
    this.carouselIndex = index;
    slides[this.carouselIndex].classList.add('active');
    dots[this.carouselIndex].classList.add('active');
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
   * بدء الكاروسيل التلقائي
   */
  startCarousel() {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => this.nextSlide(), 5000);
  }

  /**
   * إيقاف الكاروسيل
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

    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    
    // تطبيقات افتراضية إذا كانت القائمة فارغة
    if (apps.length === 0) {
      const defaultApps = [
        {
          id: '1',
          title: 'تطبيق التجارة',
          description: 'منصة متكاملة للتجارة الإلكترونية مع نظام دفع آمن',
          image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop'
        },
        {
          id: '2',
          title: 'تطبيق التعليم',
          description: 'منصة تعليمية تفاعلية مع محتوى عربي غني',
          image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
        },
        {
          id: '3',
          title: 'تطبيق الصحة',
          description: 'تتبع صحتك اليومية مع نصائح طبية موثوقة',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop'
        }
      ];
      localStorage.setItem('prok_apps', JSON.stringify(defaultApps));
      this.loadApps();
      return;
    }

    appsGrid.innerHTML = apps.map(app => `
      <div class="app-card" data-app-id="${app.id}">
        <img src="${app.image}" alt="${app.title}">
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
    `).join('');
  }

  /**
   * تحديث عدد الزوار
   */
  updateVisitorCount() {
    const visCount = document.getElementById('visCount');
    if (!visCount) return;

    let count = parseInt(localStorage.getItem('prok_visitors') || '0');
    
    // زيادة العدد إذا كان زائراً جديداً
    const lastVisit = localStorage.getItem('prok_last_visit');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastVisit || (now - parseInt(lastVisit)) > oneDay) {
      count++;
      localStorage.setItem('prok_visitors', count.toString());
      localStorage.setItem('prok_last_visit', now.toString());
    }

    // عرض العدد مع تأثير متحرك
    let current = 0;
    const increment = Math.ceil(count / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        current = count;
        clearInterval(timer);
      }
      visCount.textContent = current.toLocaleString();
    }, 20);
  }

  /**
   * إعداد نظام الحماية
   */
  setupProtection() {
    // منع النسخ (للأدمن فقط يمكنه النسخ)
    if (!this.isAdmin) {
      document.addEventListener('copy', (e) => {
        e.preventDefault();
        this.showProtectionAlert();
      });

      // منع الفحص
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.showProtectionAlert();
      });

      // منع اختصارات لوحة المفاتيح
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'u') ||
            e.key === 'F12') {
          e.preventDefault();
          this.showProtectionAlert();
        }
      });
    }
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
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = document.body.classList.contains('theme-dark') ? 
        'fas fa-moon' : 'fas fa-sun';
    }
    
    this.showToast('تم تغيير الثيم', 'success');
  }

  /**
   * عرض نافذة تسجيل دخول الأدمن
   */
  showAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  /**
   * إخفاء نافذة الأدمن
   */
  hideAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.classList.remove('show');
      document.getElementById('adminEmailInput').value = '';
      document.getElementById('adminPassInput').value = '';
    }
  }

  /**
   * معالجة تسجيل دخول الأدمن
   */
  handleAdminLogin() {
    const email = document.getElementById('adminEmailInput').value.trim();
    const password = document.getElementById('adminPassInput').value;

    if (!email || !password) {
      this.showToast('يرجى ملء جميع الحقول', 'error');
      return;
    }

    // التحقق من بيانات الاعتماد (في الإنتاج، يجب أن يكون هذا من الخادم)
    if (email === 'admin@prok.com' && password === 'admin123') {
      const user = { email, role: 'admin' };
      localStorage.setItem('prok_admin_user', JSON.stringify(user));
      
      this.currentUser = user;
      this.isAdmin = true;
      document.body.classList.add('admin-mode');
      
      this.hideAdminModal();
      this.showToast('مرحباً بك في لوحة التحكم!', 'success');
      
      // إعادة تحميل التطبيقات لإظهار أزرار الحذف
      this.loadApps();
    } else {
      this.showToast('بيانات الاعتماد غير صحيحة', 'error');
    }
  }

  /**
   * معالجة تسجيل دخول Google
   */
  handleGoogleLogin() {
    // محاكاة تسجيل الدخول بـ Google
    this.showToast('جاري الاتصال بـ Google...', 'info');
    
    setTimeout(() => {
      const user = {
        email: 'admin@gmail.com',
        role: 'admin',
        provider: 'google'
      };
      
      localStorage.setItem('prok_admin_user', JSON.stringify(user));
      this.currentUser = user;
      this.isAdmin = true;
      document.body.classList.add('admin-mode');
      
      this.hideAdminModal();
      this.showToast('تم تسجيل الدخول بنجاح!', 'success');
      this.loadApps();
    }, 1500);
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
    this.loadApps();
    
    // إعادة تحميل الصفحة بعد ثانية
    setTimeout(() => window.location.reload(), 1000);
  }

  /**
   * عرض نافذة الذكاء الاصطناعي
   */
  showAIModal() {
    const modal = document.getElementById('aiModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  /**
   * إخفاء نافذة الذكاء الاصطناعي
   */
  hideAIModal() {
    const modal = document.getElementById('aiModal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  /**
   * إرسال رسالة للذكاء الاصطناعي
   */
  async sendAIMessage() {
    const input = document.getElementById('aiInput');
    const messages = document.getElementById('aiMessages');
    
    if (!input || !messages) return;
    
    const message = input.value.trim();
    if (!message) return;

    // إضافة رسالة المستخدم
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = `<div class="message-content">${message}</div>`;
    messages.appendChild(userMsg);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // معالجة الرسالة بواسطة الذكاء الاصطناعي
    try {
      const response = await prokAI.processMessage(message);
      
      // إضافة رد الذكاء الاصطناعي
      const botMsg = document.createElement('div');
      botMsg.className = 'message bot-message';
      botMsg.innerHTML = `<div class="message-content"><strong>المساعد:</strong> ${response}</div>`;
      messages.appendChild(botMsg);
      
      messages.scrollTop = messages.scrollHeight;
    } catch (error) {
      console.error('خطأ في معالجة الرسالة:', error);
      this.showToast('حدث خطأ في معالجة الرسالة', 'error');
    }
  }

  /**
   * معالجة إجراءات الذكاء الاصطناعي السريعة
   */
  async handleAIAction(action) {
    const input = document.getElementById('aiInput');
    if (!input) return;

    switch (action) {
      case 'scan':
        input.value = 'افحص النظام بالكامل';
        break;
      case 'optimize':
        input.value = 'حسّن أداء الموقع';
        break;
      case 'analyze':
        input.value = 'حلل إحصائيات الموقع';
        break;
    }

    this.sendAIMessage();
  }

  /**
   * معالجة نموذج الاتصال
   */
  handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // محاكاة إرسال النموذج
    this.showToast('جاري إرسال الرسالة...', 'info');
    
    setTimeout(() => {
      this.showToast('تم إرسال رسالتك بنجاح!', 'success');
      form.reset();
      
      // حفظ الرسالة في السجل
      const messages = JSON.parse(localStorage.getItem('prok_messages') || '[]');
      messages.push({
        timestamp: new Date().toISOString(),
        data: Object.fromEntries(formData)
      });
      localStorage.setItem('prok_messages', JSON.stringify(messages));
    }, 1500);
  }

  /**
   * تحميل تطبيق
   */
  downloadApp(appId) {
    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const app = apps.find(a => a.id === appId);
    
    if (!app) {
      this.showToast('التطبيق غير موجود', 'error');
      return;
    }

    this.showToast(`جاري تحميل ${app.title}...`, 'info');
    
    // محاكاة التحميل
    setTimeout(() => {
      this.showToast(`تم تحميل ${app.title} بنجاح!`, 'success');
      
      // تحديث سجل التحميلات
      const downloads = JSON.parse(localStorage.getItem('prok_downloads') || '[]');
      downloads.push({
        appId,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('prok_downloads', JSON.stringify(downloads));
    }, 2000);
  }

  /**
   * حذف تطبيق
   */
  deleteApp(appId) {
    if (!this.isAdmin) {
      this.showToast('غير مصرح لك بهذا الإجراء', 'error');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
      return;
    }

    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const index = apps.findIndex(a => a.id === appId);
    
    if (index === -1) {
      this.showToast('التطبيق غير موجود', 'error');
      return;
    }

    apps.splice(index, 1);
    localStorage.setItem('prok_apps', JSON.stringify(apps));
    
    this.loadApps();
    this.showToast('تم حذف التطبيق', 'success');
    
    // تسجيل الحدث
    this.logActivity(`تم حذف تطبيق: ${appId}`);
  }

  /**
   * عرض نافذة التعديل
   */
  showEditModal(editType) {
    if (!this.isAdmin) {
      this.showToast('يجب تسجيل الدخول كأدمن للتعديل', 'error');
      return;
    }

    const modal = document.getElementById('editModal');
    const title = document.getElementById('editModalTitle');
    const content = document.getElementById('editModalContent');
    
    if (!modal || !title || !content) return;

    this.editTarget = editType;
    title.innerHTML = `<i class="fas fa-edit"></i> تعديل ${editType}`;
    
    // إنشاء حقل التعديل بناءً على النوع
    content.innerHTML = `
      <div class="input-group">
        <label>المحتوى الجديد:</label>
        <textarea class="input" id="editContent" rows="5" placeholder="أدخل المحتوى الجديد..."></textarea>
      </div>
    `;
    
    modal.classList.add('show');
    
    // إعداد أزرار الحفظ والإلغاء
    const saveBtn = document.getElementById('saveEdit');
    const cancelBtn = document.getElementById('cancelEdit');
    
    if (saveBtn) {
      saveBtn.onclick = () => this.saveEdit();
    }
    
    if (cancelBtn) {
      cancelBtn.onclick = () => this.hideEditModal();
    }
  }

  /**
   * إخفاء نافذة التعديل
   */
  hideEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show');
      this.editTarget = null;
    }
  }

  /**
   * حفظ التعديل
   */
  saveEdit() {
    const content = document.getElementById('editContent').value.trim();
    
    if (!content) {
      this.showToast('يرجى إدخال المحتوى', 'error');
      return;
    }

    // حفظ التعديل في الإعدادات
    const settings = JSON.parse(localStorage.getItem('prok_settings') || '{}');
    settings[this.editTarget] = content;
    localStorage.setItem('prok_settings', JSON.stringify(settings));
    
    this.hideEditModal();
    this.showToast('تم حفظ التعديل بنجاح', 'success');
    
    // تسجيل الحدث
    this.logActivity(`تم تعديل: ${this.editTarget}`);
    
    // إعادة تحميل الإعدادات
    this.loadSettings();
  }

  /**
   * تحميل الإعدادات المحفوظة
   */
  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('prok_settings') || '{}');
    
    // تطبيق الإعدادات على العناصر
    Object.keys(settings).forEach(key => {
      const element = document.querySelector(`[data-edit="${key}"]`);
      if (element && element.nextElementSibling) {
        element.nextElementSibling.textContent = settings[key];
      }
    });
  }

  /**
   * عرض إشعار Toast
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * تسجيل نشاط
   */
  logActivity(activity) {
    const log = JSON.parse(localStorage.getItem('prok_activity_log') || '[]');
    log.push({
      timestamp: new Date().toISOString(),
      activity,
      user: this.currentUser?.email || 'ضيف'
    });
    
    // الاحتفاظ بآخر 100 نشاط فقط
    if (log.length > 100) {
      log.splice(0, log.length - 100);
    }
    
    localStorage.setItem('prok_activity_log', JSON.stringify(log));
  }

  /**
   * عرض نافذة إضافة تطبيق (في الصفحة الرئيسية)
   */
  showAddAppModal() {
    if (!this.isAdmin) {
      this.showToast('يجب تسجيل الدخول كأدمن', 'error');
      return;
    }
    
    // إعادة التوجيه إلى لوحة الأدمن
    window.location.href = 'admin.html';
  }
}

/**
 * تهيئة النظام عند تحميل الصفحة
 */
const prokSystem = new ProkSystem();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => prokSystem.init());
} else {
  prokSystem.init();
}

/**
 * إضافة أنماط CSS للإشعارات
 */
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    border-radius: 10px;
    background: var(--card);
    color: var(--text);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: slideInRight 0.3s ease;
    min-width: 280px;
    border-right: 4px solid var(--accent);
  }

  .toast.success {
    border-right-color: var(--success);
  }

  .toast.success i {
    color: var(--success);
  }

  .toast.error {
    border-right-color: var(--danger);
  }

  .toast.error i {
    color: var(--danger);
  }

  .toast.warning {
    border-right-color: var(--warning);
  }

  .toast.warning i {
    color: var(--warning);
  }

  .toast.info {
    border-right-color: var(--info);
  }

  .toast.info i {
    color: var(--info);
  }

  .toast i {
    font-size: 1.2rem;
  }

  .toast span {
    flex: 1;
    font-weight: 600;
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

  /* ثيم فاتح */
  body.theme-light {
    --bg: #f0f4f8;
    --bg2: #ffffff;
    --card: #ffffff;
    --text: #1a202c;
    --muted: #4a5568;
  }

  body.theme-light .topbar {
    background: rgba(255, 255, 255, 0.95);
  }

  body.theme-light .app-card,
  body.theme-light .feature,
  body.theme-light .stat-card,
  body.theme-light .card {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }

  body.theme-light .modal-content {
    background: #ffffff;
  }

  body.theme-light .input {
    background: #f7fafc;
    border-color: #e2e8f0;
    color: #1a202c;
  }

  /* تحسينات التجاوب */
  @media (max-width: 480px) {
    .toast {
      min-width: auto;
      max-width: calc(100vw - 40px);
    }

    .hero-grid {
      padding: 20px 0;
    }

    .title {
      font-size: 2rem;
    }

    .cta {
      font-size: 0.9rem;
      padding: 12px 20px;
    }
  }
`;
document.head.appendChild(toastStyles);

/**
 * حماية إضافية ضد DevTools
 */
(function() {
  const isAdmin = localStorage.getItem('prok_admin_user');
  if (!isAdmin) {
    // كشف DevTools
    const devtools = /./;
    devtools.toString = function() {
      prokSystem.showProtectionAlert();
    };
    console.log('%c', devtools);
  }
})();

/**
 * تصدير للاستخدام العام
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProkSystem;
}
