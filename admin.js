/**
 * نظام إدارة لوحة التحكم - Prok Admin Panel
 * لوحة تحكم متكاملة مع إدارة التطبيقات والإحصائيات
 */

class AdminManager {
  constructor() {
    this.currentIndex = 1;
    this.totalItems = 0;
    this.currentUser = null;
    this.deleteTarget = null;
  }

  /**
   * تهيئة النظام
   */
  init() {
    this.checkAuth();
    this.loadStats();
    this.setupEventListeners();
    this.loadApps();
    this.loadRecentActivity();
    this.startLiveClock();
    
    // تحديث دوري للإحصائيات
    setInterval(() => this.loadStats(), 30000);
  }

  /**
   * التحقق من صلاحية الوصول
   */
  checkAuth() {
    const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
    
    if (!user) {
      alert('يجب تسجيل الدخول أولاً');
      window.location.href = 'index.html';
      return;
    }

    this.currentUser = user;
    const emailDisplay = document.getElementById('adminEmail');
    if (emailDisplay) {
      emailDisplay.textContent = user.email;
    }
  }

  /**
   * تحميل الإحصائيات
   */
  loadStats() {
    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const visitors = localStorage.getItem('prok_visitors') || '0';
    
    // تحديث القيم
    this.updateStatValue('totalApps', apps.length);
    this.updateStatValue('totalVisitors', parseInt(visitors));
    this.updateStatValue('activeUsers', Math.floor(Math.random() * 50) + 10);
    
    // فحص المشاكل من الذكاء الاصطناعي
    if (typeof prokAI !== 'undefined') {
      const quickScan = prokAI.quickScan();
      this.updateStatValue('issuesCount', quickScan.total);
    } else {
      this.updateStatValue('issuesCount', 0);
    }

    this.totalItems = apps.length;
    this.updateIndexDisplay();
  }

  /**
   * تحديث قيمة إحصائية بشكل متحرك
   */
  updateStatValue(id, targetValue) {
    const element = document.getElementById(id);
    if (!element) return;

    const currentValue = parseInt(element.textContent) || 0;
    const increment = Math.ceil(Math.abs(targetValue - currentValue) / 20);
    
    const animate = () => {
      const current = parseInt(element.textContent);
      
      if (current < targetValue) {
        element.textContent = Math.min(current + increment, targetValue);
        requestAnimationFrame(animate);
      } else if (current > targetValue) {
        element.textContent = Math.max(current - increment, targetValue);
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // الفهرس
    document.getElementById('indexPrev')?.addEventListener('click', () => this.navigateIndex(-1));
    document.getElementById('indexNext')?.addEventListener('click', () => this.navigateIndex(1));
    document.getElementById('goToStart')?.addEventListener('click', () => this.goToIndex(1));
    document.getElementById('goToEnd')?.addEventListener('click', () => this.goToIndex(this.totalItems));

    // التطبيقات
    document.getElementById('addAppBtn')?.addEventListener('click', () => this.showAddAppModal());
    document.getElementById('saveApp')?.addEventListener('click', () => this.saveApp());
    document.getElementById('cancelApp')?.addEventListener('click', () => this.hideAddAppModal());

    // أدوات التحكم
    document.getElementById('runScan')?.addEventListener('click', () => this.runSystemScan());
    document.getElementById('applyFix')?.addEventListener('click', () => this.applyFixes());
    document.getElementById('exportData')?.addEventListener('click', () => this.exportData());

    // الذكاء الاصطناعي
    document.getElementById('aiSend')?.addEventListener('click', () => this.sendAIMessage());
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendAIMessage();
      });
    }

    document.querySelectorAll('.ai-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('.ai-action-btn').dataset.action;
        this.handleAIAction(action);
      });
    });

    // نافذة الحذف
    document.getElementById('cancelDelete')?.addEventListener('click', () => this.hideDeleteModal());
  }

  /**
   * التنقل في الفهرس
   */
  navigateIndex(direction) {
    this.currentIndex = Math.max(1, Math.min(this.totalItems, this.currentIndex + direction));
    this.updateIndexDisplay();
    this.showToast(`انتقل إلى الفهرس: ${this.currentIndex}`, 'info');
  }

  /**
   * الانتقال إلى فهرس محدد
   */
  goToIndex(index) {
    this.currentIndex = Math.max(1, Math.min(this.totalItems, index));
    this.updateIndexDisplay();
    const message = index === 1 ? 'انتقل إلى البداية' : 'انتقل إلى النهاية';
    this.showToast(message, 'info');
  }

  /**
   * تحديث عرض الفهرس
   */
  updateIndexDisplay() {
    const currentElement = document.getElementById('currentIndex');
    const totalElement = document.getElementById('totalItems');
    
    if (currentElement) currentElement.textContent = this.currentIndex;
    if (totalElement) totalElement.textContent = this.totalItems;
  }

  /**
   * تحميل التطبيقات
   */
  loadApps() {
    const appList = document.getElementById('appList');
    if (!appList) return;

    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    
    if (apps.length === 0) {
      appList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">لا توجد تطبيقات بعد. قم بإضافة تطبيق جديد!</p>';
      return;
    }

    appList.innerHTML = apps.map((app, index) => `
      <div class="card">
        <div class="card-header">
          <h4>${app.title}</h4>
          ${app.category ? `<span class="app-category">${app.category}</span>` : ''}
        </div>
        <p style="color: var(--muted); margin: 10px 0;">${app.description}</p>
        <div class="card-actions">
          <button class="btn small" onclick="adminManager.viewApp(${index})">
            <i class="fas fa-eye"></i> عرض
          </button>
          <button class="btn small" onclick="adminManager.editApp(${index})">
            <i class="fas fa-edit"></i> تعديل
          </button>
          <button class="btn small danger" onclick="adminManager.confirmDeleteApp(${index})">
            <i class="fas fa-trash"></i> حذف
          </button>
        </div>
      </div>
    `).join('');

    this.totalItems = apps.length;
    this.updateIndexDisplay();
  }

  /**
   * عرض نافذة إضافة تطبيق
   */
  showAddAppModal() {
    const modal = document.getElementById('addAppModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  /**
   * إخفاء نافذة إضافة تطبيق
   */
  hideAddAppModal() {
    const modal = document.getElementById('addAppModal');
    if (modal) {
      modal.classList.remove('show');
      this.clearAppForm();
    }
  }

  /**
   * مسح نموذج التطبيق
   */
  clearAppForm() {
    document.getElementById('appTitle').value = '';
    document.getElementById('appDescription').value = '';
    document.getElementById('appImage').value = '';
    document.getElementById('appCategory').value = '';
  }

  /**
   * حفظ تطبيق جديد
   */
  saveApp() {
    const title = document.getElementById('appTitle').value.trim();
    const description = document.getElementById('appDescription').value.trim();
    const image = document.getElementById('appImage').value.trim();
    const category = document.getElementById('appCategory').value.trim();

    if (!title || !description) {
      this.showToast('يرجى ملء الحقول المطلوبة', 'error');
      return;
    }

    const newApp = {
      id: Date.now().toString(),
      title,
      description,
      image: image || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
      category: category || 'عام',
      createdAt: new Date().toISOString()
    };

    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    apps.push(newApp);
    localStorage.setItem('prok_apps', JSON.stringify(apps));

    this.loadApps();
    this.loadStats();
    this.hideAddAppModal();
    this.showToast('تم إضافة التطبيق بنجاح', 'success');
    this.logActivity(`تم إضافة تطبيق جديد: ${title}`);
  }

  /**
   * عرض تفاصيل التطبيق
   */
  viewApp(index) {
    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const app = apps[index];

    if (!app) return;

    const date = new Date(app.createdAt).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    alert(`عرض التطبيق\n\n` +
          `العنوان: ${app.title}\n\n` +
          `الوصف: ${app.description}\n\n` +
          `الفئة: ${app.category || 'غير محدد'}\n\n` +
          `تاريخ الإضافة: ${date}`);
  }

  /**
   * تعديل تطبيق
   */
  editApp(index) {
    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const app = apps[index];

    if (!app) return;

    const newTitle = prompt('اسم التطبيق الجديد:', app.title);
    if (newTitle === null) return;

    const newDesc = prompt('الوصف الجديد:', app.description);
    if (newDesc === null) return;

    const newCategory = prompt('الفئة الجديدة:', app.category || '');

    if (newTitle.trim()) apps[index].title = newTitle.trim();
    if (newDesc.trim()) apps[index].description = newDesc.trim();
    if (newCategory !== null) apps[index].category = newCategory.trim();

    localStorage.setItem('prok_apps', JSON.stringify(apps));
    this.loadApps();
    this.showToast('تم تحديث التطبيق', 'success');
    this.logActivity(`تم تعديل تطبيق: ${app.title}`);
  }

  /**
   * تأكيد حذف التطبيق
   */
  confirmDeleteApp(index) {
    this.deleteTarget = index;
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.add('show');
      
      const confirmBtn = document.getElementById('confirmDelete');
      if (confirmBtn) {
        confirmBtn.onclick = () => this.deleteApp();
      }
    }
  }

  /**
   * حذف تطبيق
   */
  deleteApp() {
    if (this.deleteTarget === null) return;

    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const app = apps[this.deleteTarget];

    if (!app) {
      this.showToast('التطبيق غير موجود', 'error');
      return;
    }

    apps.splice(this.deleteTarget, 1);
    localStorage.setItem('prok_apps', JSON.stringify(apps));

    this.loadApps();
    this.loadStats();
    this.hideDeleteModal();
    this.showToast('تم حذف التطبيق', 'success');
    this.logActivity(`تم حذف تطبيق: ${app.title}`);

    this.deleteTarget = null;
  }

  /**
   * إخفاء نافذة الحذف
   */
  hideDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.remove('show');
    }
    this.deleteTarget = null;
  }

  /**
   * فحص النظام
   */
  runSystemScan() {
    const scanReport = document.getElementById('scanReport');
    if (!scanReport) return;

    scanReport.textContent = 'جاري فحص النظام...';
    this.showToast('بدء فحص النظام', 'info');

    setTimeout(() => {
      if (typeof prokAI !== 'undefined') {
        prokAI.runBackgroundChecks();
        const status = prokAI.getSystemStatus();

        let report = '=== نتائج الفحص ===\n\n';

        if (status.errors.length === 0 && status.warnings.length === 0 && status.suggestions.length === 0) {
          report += '✅ ممتاز! النظام يعمل بشكل مثالي\n';
          report += 'لم يتم اكتشاف أي أخطاء أو مشاكل';
        } else {
          if (status.errors.length > 0) {
            report += `❌ أخطاء حرجة (${status.errors.length}):\n`;
            status.errors.forEach(err => {
              report += `  • ${err.message}\n`;
            });
            report += '\n';
          }

          if (status.warnings.length > 0) {
            report += `⚠️  تحذيرات (${status.warnings.length}):\n`;
            status.warnings.forEach(warn => {
              report += `  • ${warn.message}\n`;
            });
            report += '\n';
          }

          if (status.suggestions.length > 0) {
            report += `💡 اقتراحات (${status.suggestions.length}):\n`;
            status.suggestions.forEach(sug => {
              report += `  • ${sug.message}\n`;
            });
          }
        }

        scanReport.textContent = report;
        this.showToast('تم الانتهاء من الفحص', 'success');
        this.loadStats(); // تحديث عدد المشاكل
      } else {
        scanReport.textContent = '⚠️ نظام الذكاء الاصطناعي غير متاح';
        this.showToast('فشل الفحص', 'error');
      }

      this.logActivity('تم إجراء فحص تلقائي للنظام');
    }, 2000);
  }

  /**
   * تطبيق التصحيحات
   */
  applyFixes() {
    if (typeof prokAI === 'undefined') {
      this.showToast('نظام الذكاء الاصطناعي غير متاح', 'error');
      return;
    }

    this.showToast('جاري تطبيق التصحيحات...', 'info');

    setTimeout(() => {
      const result = prokAI.applyAutoFixes();
      
      if (result.count > 0) {
        this.showToast(`تم تطبيق ${result.count} تصحيح بنجاح`, 'success');
        
        const scanReport = document.getElementById('scanReport');
        if (scanReport) {
          scanReport.textContent = 
            `✅ تم تطبيق التصحيحات بنجاح!\n\n` +
            `عدد التصحيحات: ${result.count}\n\n` +
            `التصحيحات المطبقة:\n` +
            result.results.map(r => `• ${r}`).join('\n');
        }
        
        this.logActivity(`تم تطبيق ${result.count} تصحيح تلقائي`);
      } else {
        this.showToast('لا توجد تصحيحات متاحة', 'info');
      }

      this.loadStats();
    }, 2000);
  }

  /**
   * تصدير البيانات
   */
  exportData() {
    const data = {
      apps: JSON.parse(localStorage.getItem('prok_apps') || '[]'),
      visitors: localStorage.getItem('prok_visitors') || '0',
      settings: JSON.parse(localStorage.getItem('prok_settings') || '{}'),
      activity: JSON.parse(localStorage.getItem('prok_activity_log') || '[]'),
      messages: JSON.parse(localStorage.getItem('prok_messages') || '[]'),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `prok-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.showToast('تم تصدير البيانات بنجاح', 'success');
    this.logActivity('تم تصدير بيانات النظام');
  }

  /**
   * إرسال رسالة للذكاء الاصطناعي
   */
  async sendAIMessage() {
    const input = document.getElementById('aiInput');
    const history = document.getElementById('aiHistory');

    if (!input || !history) return;

    const message = input.value.trim();
    if (!message) return;

    // إضافة رسالة المستخدم
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = `أنت: ${message}`;
    history.appendChild(userMsg);

    input.value = '';
    history.scrollTop = history.scrollHeight;

    // معالجة الرسالة
    try {
      const response = await prokAI.processMessage(message);

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      botMsg.innerHTML = `<strong>المساعد:</strong> ${response}`;
      history.appendChild(botMsg);

      history.scrollTop = history.scrollHeight;
    } catch (error) {
      console.error('خطأ في معالجة الرسالة:', error);
      this.showToast('حدث خطأ في الاتصال بالمساعد', 'error');
    }
  }

  /**
   * معالجة إجراءات الذكاء الاصطناعي السريعة
   */
  handleAIAction(action) {
    const input = document.getElementById('aiInput');
    if (!input) return;

    const messages = {
      scan: 'افحص النظام بالكامل',
      optimize: 'حسّن أداء الموقع',
      analyze: 'حلل إحصائيات الموقع'
    };

    input.value = messages[action] || '';
    this.sendAIMessage();
  }

  /**
   * تحميل السجل الحديث
   */
  loadRecentActivity() {
    const activityElement = document.getElementById('recentActivity');
    if (!activityElement) return;

    const activity = JSON.parse(localStorage.getItem('prok_activity_log') || '[]');

    if (activity.length === 0) {
      activityElement.textContent = 'لا توجد نشاطات حديثة';
      return;
    }

    const recent = activity.slice(-10).reverse();
    activityElement.textContent = recent.map(act => {
      const date = new Date(act.timestamp).toLocaleString('ar-SA');
      return `[${date}] ${act.activity} - ${act.user}`;
    }).join('\n');
  }

  /**
   * بدء الساعة المباشرة
   */
  startLiveClock() {
    const updateClock = () => {
      const clockElement = document.getElementById('currentTime');
      if (clockElement) {
        const now = new Date();
        clockElement.textContent = 
          now.toLocaleTimeString('ar-SA') + ' - ' +
          now.toLocaleDateString('ar-SA');
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  /**
   * تسجيل نشاط
   */
  logActivity(activity) {
    const log = JSON.parse(localStorage.getItem('prok_activity_log') || '[]');
    log.push({
      timestamp: new Date().toISOString(),
      activity,
      user: this.currentUser?.email || 'غير معروف'
    });

    // الاحتفاظ بآخر 100 نشاط
    if (log.length > 100) {
      log.splice(0, log.length - 100);
    }

    localStorage.setItem('prok_activity_log', JSON.stringify(log));
    this.loadRecentActivity();
  }

  /**
   * تسجيل الخروج
   */
  logout() {
    if (!confirm('هل تريد تسجيل الخروج؟')) return;

    localStorage.removeItem('prok_admin_user');
    this.showToast('تم تسجيل الخروج', 'info');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  /**
   * عرض إشعار
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position: fixed; top: 90px; right: 20px; z-index: 3000; display: flex; flex-direction: column; gap: 10px;';
      document.body.appendChild(container);
    }

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

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

/**
 * تهيئة مدير لوحة التحكم
 */
const adminManager = new AdminManager();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => adminManager.init());
} else {
  adminManager.init();
}
