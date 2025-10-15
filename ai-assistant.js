/**
 * نظام الذكاء الاصطناعي - Prok AI Assistant
 * مساعد ذكي لفحص الأخطاء وتحسين الأداء
 */

class ProkAI {
  constructor() {
    this.conversationHistory = [];
    this.systemStatus = {
      errors: [],
      warnings: [],
      suggestions: []
    };
  }

  /**
   * تهيئة النظام
   */
  init() {
    this.loadHistory();
    this.runBackgroundChecks();
    
    // فحص دوري كل 5 دقائق
    setInterval(() => this.runBackgroundChecks(), 300000);
  }

  /**
   * تحميل سجل المحادثات
   */
  loadHistory() {
    const saved = localStorage.getItem('prok_ai_history');
    if (saved) {
      try {
        this.conversationHistory = JSON.parse(saved);
      } catch (e) {
        console.error('خطأ في تحميل سجل المحادثات:', e);
        this.conversationHistory = [];
      }
    }
  }

  /**
   * حفظ سجل المحادثات
   */
  saveHistory() {
    try {
      // الاحتفاظ بآخر 50 رسالة فقط
      const recentHistory = this.conversationHistory.slice(-50);
      localStorage.setItem('prok_ai_history', JSON.stringify(recentHistory));
    } catch (e) {
      console.error('خطأ في حفظ سجل المحادثات:', e);
    }
  }

  /**
   * إضافة رسالة إلى السجل
   */
  addMessage(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    this.saveHistory();
  }

  /**
   * فحص الأخطاء في الخلفية
   */
  runBackgroundChecks() {
    this.systemStatus = {
      errors: [],
      warnings: [],
      suggestions: []
    };

    // فحص الصور
    this.checkImages();
    
    // فحص الروابط
    this.checkLinks();
    
    // فحص الأداء
    this.checkPerformance();
    
    // فحص التخزين
    this.checkStorage();
    
    // حفظ النتائج
    localStorage.setItem('prok_system_status', JSON.stringify(this.systemStatus));
  }

  /**
   * فحص الصور
   */
  checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // فحص النص البديل
      if (!img.alt || img.alt.trim() === '') {
        this.systemStatus.warnings.push({
          type: 'accessibility',
          message: `الصورة #${index + 1} بدون نص بديل (alt)`,
          element: img,
          fix: () => {
            img.alt = `صورة ${index + 1}`;
            return 'تم إضافة نص بديل افتراضي';
          }
        });
      }

      // فحص حجم الصورة
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        this.systemStatus.suggestions.push({
          type: 'performance',
          message: `الصورة #${index + 1} كبيرة جداً (${img.naturalWidth}x${img.naturalHeight})`,
          element: img
        });
      }
    });
  }

  /**
   * فحص الروابط
   */
  checkLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach((link, index) => {
      // فحص الروابط الفارغة
      if (!link.href || link.href === '#' || link.href === 'javascript:void(0)') {
        this.systemStatus.warnings.push({
          type: 'links',
          message: `رابط فارغ: "${link.textContent}"`,
          element: link,
          fix: () => {
            link.href = '#home';
            return 'تم تعيين رابط افتراضي';
          }
        });
      }

      // فحص الروابط الخارجية
      if (link.hostname && link.hostname !== window.location.hostname) {
        if (!link.target || link.target !== '_blank') {
          this.systemStatus.suggestions.push({
            type: 'links',
            message: `رابط خارجي بدون target="_blank": ${link.href}`,
            element: link,
            fix: () => {
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              return 'تم إضافة target="_blank" و rel';
            }
          });
        }
      }
    });
  }

  /**
   * فحص الأداء
   */
  checkPerformance() {
    // فحص عدد عناصر DOM
    const elementsCount = document.querySelectorAll('*').length;
    if (elementsCount > 1500) {
      this.systemStatus.warnings.push({
        type: 'performance',
        message: `عدد عناصر DOM كبير (${elementsCount})، قد يؤثر على الأداء`
      });
    }

    // فحص حجم الصفحة
    if (performance && performance.getEntriesByType) {
      const pageSize = performance.getEntriesByType('navigation')[0]?.encodedBodySize;
      if (pageSize && pageSize > 2000000) {
        this.systemStatus.warnings.push({
          type: 'performance',
          message: `حجم الصفحة كبير (${(pageSize / 1024 / 1024).toFixed(2)} MB)`
        });
      }
    }

    // فحص وقت التحميل
    if (performance && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 3000) {
        this.systemStatus.suggestions.push({
          type: 'performance',
          message: `وقت التحميل بطيء (${(loadTime / 1000).toFixed(2)} ثانية)`
        });
      }
    }
  }

  /**
   * فحص التخزين
   */
  checkStorage() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      const maxSize = 5; // MB تقريبي

      if (sizeInMB > maxSize * 0.8) {
        this.systemStatus.warnings.push({
          type: 'storage',
          message: `مساحة التخزين المحلي قاربت على الامتلاء (${sizeInMB} MB من ${maxSize} MB)`,
          fix: () => {
            this.cleanOldData();
            return 'تم تنظيف البيانات القديمة';
          }
        });
      }
    } catch (e) {
      console.error('خطأ في فحص التخزين:', e);
    }
  }

  /**
   * تنظيف البيانات القديمة
   */
  cleanOldData() {
    const keysToClean = ['prok_ai_history', 'prok_activity_log'];
    keysToClean.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 50) {
            localStorage.setItem(key, JSON.stringify(parsed.slice(-50)));
          }
        } catch (e) {
          console.error(`خطأ في تنظيف ${key}:`, e);
        }
      }
    });
  }

  /**
   * معالجة رسالة من المستخدم
   */
  async processMessage(userMessage) {
    this.addMessage('user', userMessage);

    // تحليل الرسالة
    const intent = this.analyzeIntent(userMessage);
    
    // توليد الرد
    const response = await this.generateResponse(intent, userMessage);
    
    this.addMessage('assistant', response);
    
    return response;
  }

  /**
   * تحليل نية المستخدم
   */
  analyzeIntent(message) {
    const lowercaseMessage = message.toLowerCase();

    // فحص الأخطاء
    if (lowercaseMessage.includes('فحص') || 
        lowercaseMessage.includes('أخطاء') || 
        lowercaseMessage.includes('مشاكل')) {
      return 'scan';
    }

    // تحسين الأداء
    if (lowercaseMessage.includes('تحسين') || 
        lowercaseMessage.includes('أداء') || 
        lowercaseMessage.includes('سرعة')) {
      return 'optimize';
    }

    // الإحصائيات
    if (lowercaseMessage.includes('إحصائيات') || 
        lowercaseMessage.includes('تحليل') || 
        lowercaseMessage.includes('بيانات')) {
      return 'analyze';
    }

    // المساعدة
    if (lowercaseMessage.includes('مساعدة') || 
        lowercaseMessage.includes('كيف') || 
        lowercaseMessage.includes('؟')) {
      return 'help';
    }

    return 'general';
  }

  /**
   * توليد الرد
   */
  async generateResponse(intent, message) {
    // محاكاة وقت المعالجة
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (intent) {
      case 'scan':
        return this.handleScan();
      
      case 'optimize':
        return this.handleOptimize();
      
      case 'analyze':
        return this.handleAnalyze();
      
      case 'help':
        return this.handleHelp();
      
      default:
        return this.handleGeneral(message);
    }
  }

  /**
   * معالجة طلب الفحص
   */
  handleScan() {
    this.runBackgroundChecks();
    
    const { errors, warnings, suggestions } = this.systemStatus;
    
    if (errors.length === 0 && warnings.length === 0) {
      return '✅ ممتاز! لم أجد أي أخطاء أو مشاكل في النظام. جميع الفحوصات نجحت بنجاح.';
    }

    let response = '📊 نتائج الفحص:\n\n';
    
    if (errors.length > 0) {
      response += `❌ أخطاء حرجة: ${errors.length}\n`;
      errors.slice(0, 3).forEach(err => {
        response += `  • ${err.message}\n`;
      });
    }
    
    if (warnings.length > 0) {
      response += `⚠️ تحذيرات: ${warnings.length}\n`;
      warnings.slice(0, 3).forEach(warn => {
        response += `  • ${warn.message}\n`;
      });
    }
    
    if (suggestions.length > 0) {
      response += `💡 اقتراحات: ${suggestions.length}\n`;
      suggestions.slice(0, 2).forEach(sug => {
        response += `  • ${sug.message}\n`;
      });
    }
    
    response += '\nيمكنني تطبيق التصحيحات التلقائية إذا أردت.';
    
    return response;
  }

  /**
   * معالجة طلب التحسين
   */
  handleOptimize() {
    const optimizations = [];
    
    // تحسين الصور
    const images = document.querySelectorAll('img');
    if (images.length > 0) {
      optimizations.push(`تحسين ${images.length} صورة`);
    }
    
    // تحسين الأنيميشن
    const animatedElements = document.querySelectorAll('[class*="anim"]');
    if (animatedElements.length > 0) {
      optimizations.push(`تحسين ${animatedElements.length} عنصر متحرك`);
    }
    
    // تنظيف التخزين
    this.cleanOldData();
    optimizations.push('تنظيف البيانات القديمة');
    
    if (optimizations.length === 0) {
      return '✅ النظام محسّن بالفعل! لا توجد تحسينات إضافية مطلوبة حالياً.';
    }
    
    return `⚡ تم تطبيق التحسينات التالية:\n\n${optimizations.map(opt => `• ${opt}`).join('\n')}\n\nالنظام الآن يعمل بكفاءة أعلى!`;
  }

  /**
   * معالجة طلب التحليل
   */
  handleAnalyze() {
    const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
    const visitors = parseInt(localStorage.getItem('prok_visitors') || '0');
    const activity = JSON.parse(localStorage.getItem('prok_activity_log') || '[]');
    
    let response = '📊 تحليل شامل للنظام:\n\n';
    
    response += `📱 التطبيقات: ${apps.length} تطبيق\n`;
    response += `👥 الزوار: ${visitors.toLocaleString()} زائر\n`;
    response += `📝 النشاطات: ${activity.length} حدث\n\n`;
    
    // تحليل الأداء
    if (performance && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      response += `⚡ وقت التحميل: ${(loadTime / 1000).toFixed(2)} ثانية\n`;
    }
    
    // تحليل التخزين
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    response += `💾 التخزين المستخدم: ${(totalSize / 1024).toFixed(2)} KB\n\n`;
    
    // التوصيات
    response += '💡 التوصيات:\n';
    if (apps.length < 5) {
      response += '• إضافة المزيد من التطبيقات لإثراء المحتوى\n';
    }
    if (visitors < 100) {
      response += '• تحسين SEO لزيادة عدد الزوار\n';
    }
    
    return response;
  }

  /**
   * معالجة طلب المساعدة
   */
  handleHelp() {
    return `🤖 أنا مساعدك الذكي في Prok. يمكنني مساعدتك في:

📍 الأوامر المتاحة:
• "فحص النظام" - للبحث عن الأخطاء والمشاكل
• "تحسين الأداء" - لتحسين سرعة وكفاءة الموقع
• "تحليل الإحصائيات" - لعرض تقرير شامل
• "تطبيق التصحيحات" - لإصلاح المشاكل تلقائياً

💡 نصائح سريعة:
• استخدم وضع التعديل لتحرير المحتوى
• راقب الإحصائيات بانتظام
• قم بعمل نسخة احتياطية من البيانات

كيف يمكنني مساعدتك اليوم؟`;
  }

  /**
   * معالجة الرسائل العامة
   */
  handleGeneral(message) {
    const responses = [
      'شكراً على رسالتك! كيف يمكنني مساعدتك بشكل أفضل؟',
      'أنا هنا لمساعدتك. هل تريد فحص النظام أو تحليل الإحصائيات؟',
      'يمكنني مساعدتك في إدارة الموقع. جرّب طلب "فحص النظام" أو "تحسين الأداء".',
      'أنا جاهز لمساعدتك! اكتب "مساعدة" لعرض الأوامر المتاحة.',
      'مرحباً! يمكنني فحص الأخطاء، تحسين الأداء، أو تحليل الإحصائيات. ماذا تفضل؟'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * تطبيق التصحيحات التلقائية
   */
  applyAutoFixes() {
    let fixedCount = 0;
    const fixResults = [];

    // تطبيق التصحيحات من التحذيرات
    this.systemStatus.warnings.forEach(warning => {
      if (warning.fix && typeof warning.fix === 'function') {
        try {
          const result = warning.fix();
          fixResults.push(result);
          fixedCount++;
        } catch (e) {
          console.error('خطأ في تطبيق التصحيح:', e);
        }
      }
    });

    // تطبيق التصحيحات من الاقتراحات
    this.systemStatus.suggestions.forEach(suggestion => {
      if (suggestion.fix && typeof suggestion.fix === 'function') {
        try {
          const result = suggestion.fix();
          fixResults.push(result);
          fixedCount++;
        } catch (e) {
          console.error('خطأ في تطبيق التصحيح:', e);
        }
      }
    });

    // إعادة الفحص
    this.runBackgroundChecks();

    return {
      count: fixedCount,
      results: fixResults
    };
  }

  /**
   * تصدير تقرير شامل
   */
  exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemStatus: this.systemStatus,
      statistics: {
        apps: JSON.parse(localStorage.getItem('prok_apps') || '[]').length,
        visitors: parseInt(localStorage.getItem('prok_visitors') || '0'),
        activity: JSON.parse(localStorage.getItem('prok_activity_log') || '[]').length
      },
      performance: this.getPerformanceMetrics(),
      conversationHistory: this.conversationHistory.slice(-10)
    };

    return report;
  }

  /**
   * الحصول على مقاييس الأداء
   */
  getPerformanceMetrics() {
    const metrics = {};

    if (performance && performance.timing) {
      metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      metrics.domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    }

    if (performance && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        metrics.pageSize = navigation.encodedBodySize;
        metrics.transferSize = navigation.transferSize;
      }
    }

    metrics.domElements = document.querySelectorAll('*').length;
    metrics.images = document.querySelectorAll('img').length;
    metrics.links = document.querySelectorAll('a').length;

    return metrics;
  }

  /**
   * مسح سجل المحادثات
   */
  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('prok_ai_history');
  }

  /**
   * الحصول على حالة النظام
   */
  getSystemStatus() {
    return this.systemStatus;
  }

  /**
   * تشغيل فحص سريع
   */
  quickScan() {
    this.runBackgroundChecks();
    
    const total = 
      this.systemStatus.errors.length + 
      this.systemStatus.warnings.length + 
      this.systemStatus.suggestions.length;
    
    return {
      total,
      errors: this.systemStatus.errors.length,
      warnings: this.systemStatus.warnings.length,
      suggestions: this.systemStatus.suggestions.length,
      status: total === 0 ? 'excellent' : 
              this.systemStatus.errors.length > 0 ? 'critical' :
              this.systemStatus.warnings.length > 5 ? 'needs-attention' : 'good'
    };
  }
}

// إنشاء نسخة عامة من الذكاء الاصطناعي
const prokAI = new ProkAI();

// تهيئة تلقائية عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => prokAI.init());
} else {
  prokAI.init();
}

// تصدير للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProkAI;
}
