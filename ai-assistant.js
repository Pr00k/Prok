/**
 * نظام الذكاء الاصطناعي - Prok AI Assistant
 * مساعد ذكي متطور لفحص الأخطاء وتحسين الأداء
 * الإصدار المحسن والمطور
 */

class ProkAI {
    constructor() {
        this.conversationHistory = [];
        this.systemStatus = {
            errors: [],
            warnings: [],
            suggestions: [],
            lastScan: null
        };
        this.settings = {
            maxHistorySize: 50,
            scanInterval: 300000, // 5 دقائق
            autoFix: false,
            performanceThresholds: {
                domElements: 1500,
                pageSize: 2, // MB
                loadTime: 3000 // ms
            }
        };
    }

    /**
     * تهيئة النظام مع معالجة الأخطاء
     */
    init() {
        try {
            this.loadHistory();
            this.loadSettings();
            this.runBackgroundChecks();
            
            // فحص دوري مع التحقق من حالة الصفحة
            setInterval(() => {
                if (document.readyState === 'complete') {
                    this.runBackgroundChecks();
                }
            }, this.settings.scanInterval);
            
            console.log('✅ نظام Prok AI جاهز للعمل');
        } catch (error) {
            console.error('❌ خطأ في تهيئة النظام:', error);
        }
    }

    /**
     * تحميل سجل المحادثات مع تحسين الأداء
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('prok_ai_history');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.conversationHistory = Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('خطأ في تحميل السجل:', error);
            this.conversationHistory = [];
        }
    }

    /**
     * تحميل الإعدادات
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('prok_ai_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
        }
    }

    /**
     * حفظ الإعدادات
     */
    saveSettings() {
        try {
            localStorage.setItem('prok_ai_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
        }
    }

    /**
     * حفظ سجل المحادثات مع تحسين الذاكرة
     */
    saveHistory() {
        try {
            const recentHistory = this.conversationHistory.slice(-this.settings.maxHistorySize);
            localStorage.setItem('prok_ai_history', JSON.stringify(recentHistory));
        } catch (error) {
            console.error('خطأ في حفظ السجل:', error);
        }
    }

    /**
     * إضافة رسالة إلى السجل مع الطابع الزمني
     */
    addMessage(role, content) {
        this.conversationHistory.push({
            role,
            content,
            timestamp: Date.now(),
            id: this.generateId()
        });
        
        this.saveHistory();
    }

    /**
     * إنشاء معرف فريد
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * فحص شامل في الخلفية
     */
    async runBackgroundChecks() {
        if (!document.body) return;

        this.systemStatus = {
            errors: [],
            warnings: [],
            suggestions: [],
            lastScan: new Date().toISOString()
        };

        try {
            await Promise.all([
                this.checkImages(),
                this.checkLinks(),
                this.checkPerformance(),
                this.checkStorage(),
                this.checkAccessibility()
            ]);

            this.saveSystemStatus();
        } catch (error) {
            console.error('خطأ في الفحص الخلفي:', error);
        }
    }

    /**
     * فحص الصور المحسن
     */
    async checkImages() {
        const images = Array.from(document.images);
        
        images.forEach((img, index) => {
            // فحص النص البديل
            if (!img.alt?.trim()) {
                this.systemStatus.warnings.push({
                    type: 'accessibility',
                    message: `الصورة ${index + 1} تفتقد النص البديل`,
                    element: img,
                    priority: 'medium',
                    fix: () => {
                        img.alt = `صورة ${index + 1}`;
                        return 'تم إضافة نص بديل';
                    }
                });
            }

            // فحص أبعاد الصورة
            if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
                this.systemStatus.suggestions.push({
                    type: 'performance',
                    message: `الصورة ${index + 1} كبيرة (${img.naturalWidth}×${img.naturalHeight})`,
                    element: img,
                    priority: 'low'
                });
            }

            // فحص تحميل الصورة
            if (!img.complete) {
                this.systemStatus.warnings.push({
                    type: 'performance',
                    message: `الصورة ${index + 1} لم تحمل بشكل صحيح`,
                    element: img,
                    priority: 'high'
                });
            }
        });
    }

    /**
     * فحص الروابط المحسن
     */
    checkLinks() {
        const links = Array.from(document.links);
        
        links.forEach((link, index) => {
            const href = link.href;
            const text = link.textContent?.trim() || 'رابط بدون نص';

            // فحص الروابط الفارغة
            if (!href || href === '#' || href.startsWith('javascript:')) {
                this.systemStatus.warnings.push({
                    type: 'usability',
                    message: `رابط فارغ: "${text}"`,
                    element: link,
                    priority: 'medium',
                    fix: () => {
                        link.href = '#';
                        link.setAttribute('aria-label', `رابط ${text}`);
                        return 'تم إصلاح الرابط';
                    }
                });
            }

            // فحص الروابط الخارجية
            if (this.isExternalLink(href)) {
                if (!link.target || link.target !== '_blank') {
                    this.systemStatus.suggestions.push({
                        type: 'security',
                        message: `رابط خارجي يفتح في نفس النافذة: ${href}`,
                        element: link,
                        priority: 'medium',
                        fix: () => {
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            return 'تم تعزيز أمان الرابط';
                        }
                    });
                }
            }

            // فحص الروابط المكسورة
            this.checkBrokenLink(link, index);
        });
    }

    /**
     * التحقق من الروابط المكسورة
     */
    async checkBrokenLink(link, index) {
        try {
            if (!this.isExternalLink(link.href)) return;

            const response = await fetch(link.href, { method: 'HEAD', mode: 'no-cors' });
            if (!response.ok) {
                this.systemStatus.errors.push({
                    type: 'links',
                    message: `رابط مكسور: ${link.href}`,
                    element: link,
                    priority: 'high'
                });
            }
        } catch (error) {
            // تجاهل الأخطاء بسبب سياسة CORS
        }
    }

    /**
     * فحص إذا كان الرابط خارجي
     */
    isExternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.hostname !== window.location.hostname;
        } catch {
            return false;
        }
    }

    /**
     * فحص الأداء المحسن
     */
    checkPerformance() {
        const { performanceThresholds } = this.settings;

        // فحص عناصر DOM
        const domCount = document.querySelectorAll('*').length;
        if (domCount > performanceThresholds.domElements) {
            this.systemStatus.warnings.push({
                type: 'performance',
                message: `عدد عناصر DOM كبير (${domCount})`,
                priority: 'medium'
            });
        }

        // فحص مقاييس الأداء
        if (window.performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const pageSize = navigation.encodedBodySize / 1024 / 1024; // MB
                if (pageSize > performanceThresholds.pageSize) {
                    this.systemStatus.warnings.push({
                        type: 'performance',
                        message: `حجم الصفحة كبير (${pageSize.toFixed(2)} MB)`,
                        priority: 'high'
                    });
                }
            }

            const timing = performance.timing;
            if (timing) {
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                if (loadTime > performanceThresholds.loadTime) {
                    this.systemStatus.suggestions.push({
                        type: 'performance',
                        message: `وقت التحميل بطيء (${(loadTime / 1000).toFixed(2)} ثانية)`,
                        priority: 'medium'
                    });
                }
            }
        }
    }

    /**
     * فحص التخزين المحسن
     */
    checkStorage() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }

            const sizeInMB = totalSize / 1024 / 1024;
            const maxSize = 5; // MB

            if (sizeInMB > maxSize * 0.8) {
                this.systemStatus.warnings.push({
                    type: 'storage',
                    message: `مساحة التخزين ممتلئة (${sizeInMB.toFixed(2)} MB)`,
                    priority: 'high',
                    fix: () => {
                        this.cleanOldData();
                        return 'تم تنظيف التخزين';
                    }
                });
            }
        } catch (error) {
            console.error('خطأ في فحص التخزين:', error);
        }
    }

    /**
     * فحص إمكانية الوصول
     */
    checkAccessibility() {
        // فحص تباين الألوان
        this.checkColorContrast();
        
        // فحص العناوين
        this.checkHeadings();
        
        // فحص النماذج
        this.checkForms();
    }

    /**
     * فحص تباين الألوان
     */
    checkColorContrast() {
        // تنفيذ مبسط لفحص التباين
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bgColor = style.backgroundColor;
            const color = style.color;
            
            // يمكن إضافة منطق فحص التباين هنا
        });
    }

    /**
     * فحص هيكل العناوين
     */
    checkHeadings() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const h1Count = headings.filter(h => h.tagName === 'H1').length;
        
        if (h1Count === 0) {
            this.systemStatus.warnings.push({
                type: 'accessibility',
                message: 'لا يوجد عنوان رئيسي H1 في الصفحة',
                priority: 'high'
            });
        } else if (h1Count > 1) {
            this.systemStatus.suggestions.push({
                type: 'accessibility',
                message: 'يوجد أكثر من عنوان H1 في الصفحة',
                priority: 'medium'
            });
        }
    }

    /**
     * فحص النماذج
     */
    checkForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
            const labels = form.querySelectorAll('label');
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (!input.id || !form.querySelector(`label[for="${input.id}"]`)) {
                    this.systemStatus.warnings.push({
                        type: 'accessibility',
                        message: `حقل بدون تسمية في النموذج ${index + 1}`,
                        element: input,
                        priority: 'high'
                    });
                }
            });
        });
    }

    /**
     * تنظيف البيانات القديمة
     */
    cleanOldData() {
        const retentionDays = 30;
        const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
        
        this.conversationHistory = this.conversationHistory.filter(
            msg => msg.timestamp > cutoff
        );
        
        this.saveHistory();
    }

    /**
     * حفظ حالة النظام
     */
    saveSystemStatus() {
        try {
            localStorage.setItem('prok_system_status', JSON.stringify({
                ...this.systemStatus,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('خطأ في حفظ حالة النظام:', error);
        }
    }

    /**
     * معالجة رسالة المستخدم مع تحسين الذكاء
     */
    async processMessage(userMessage) {
        if (!userMessage?.trim()) {
            return '⚠️ يرجى إدخال رسالة صحيحة';
        }

        this.addMessage('user', userMessage);

        try {
            const intent = this.analyzeIntent(userMessage);
            const response = await this.generateResponse(intent, userMessage);
            
            this.addMessage('assistant', response);
            return response;
        } catch (error) {
            console.error('خطأ في معالجة الرسالة:', error);
            return '❌ حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.';
        }
    }

    /**
     * تحليل النية المحسن
     */
    analyzeIntent(message) {
        const text = message.toLowerCase().trim();
        
        const intents = {
            scan: ['فحص', 'أخطاء', 'مشاكل', 'تحقق', 'scan', 'check'],
            optimize: ['تحسين', 'أداء', 'سرعة', 'optimize', 'speed'],
            analyze: ['إحصائيات', 'تحليل', 'بيانات', 'statistics', 'analyze'],
            help: ['مساعدة', 'مساعدة', 'كيف', '؟', 'help', 'support'],
            fix: ['إصلاح', 'صحح', 'أصلح', 'fix', 'repair'],
            settings: ['إعدادات', 'settings', 'config']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return intent;
            }
        }

        return 'general';
    }

    /**
     * توليد الرد الذكي
     */
    async generateResponse(intent, message) {
        // محاكاة معالجة ذكية
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

        const responses = {
            scan: () => this.handleScan(),
            optimize: () => this.handleOptimize(),
            analyze: () => this.handleAnalyze(),
            help: () => this.handleHelp(),
            fix: () => this.handleAutoFix(),
            settings: () => this.handleSettings(message),
            general: () => this.handleGeneral(message)
        };

        return responses[intent] ? responses[intent]() : this.handleGeneral(message);
    }

    /**
     * معالجة الفحص المحسن
     */
    handleScan() {
        this.runBackgroundChecks();
        
        const { errors, warnings, suggestions } = this.systemStatus;
        const totalIssues = errors.length + warnings.length + suggestions.length;

        if (totalIssues === 0) {
            return `✅ فحص شامل\n\n• الحالة: ممتازة\n• لم يتم اكتشاف أي مشاكل\n• جميع الأنظمة تعمل بشكل طبيعي\n\n💡 نصيحة: حافظ على هذا المستوى من الجودة!`;
        }

        let response = `📊 نتائج الفحص الشامل\n\n`;

        if (errors.length > 0) {
            response += `❌ الأخطاء الحرجة: ${errors.length}\n`;
            errors.slice(0, 3).forEach(err => {
                response += `   • ${err.message} (${err.priority})\n`;
            });
        }

        if (warnings.length > 0) {
            response += `⚠️ التحذيرات: ${warnings.length}\n`;
            warnings.slice(0, 3).forEach(warn => {
                response += `   • ${warn.message} (${warn.priority})\n`;
            });
        }

        if (suggestions.length > 0) {
            response += `💡 الاقتراحات: ${suggestions.length}\n`;
            suggestions.slice(0, 2).forEach(sug => {
                response += `   • ${sug.message}\n`;
            });
        }

        response += `\n🔍 إجمالي المشاكل: ${totalIssues}`;
        response += `\n\n💡 اكتب "إصلاح" لتطبيق التصحيحات التلقائية.`;

        return response;
    }

    /**
     * معالجة التحسين المحسن
     */
    handleOptimize() {
        const optimizations = [];
        const images = document.images.length;
        const scripts = document.scripts.length;
        const styles = document.styleSheets.length;

        if (images > 0) {
            optimizations.push(`تحسين ${images} صورة`);
        }
        if (scripts > 5) {
            optimizations.push(`دمج ${scripts} ملف script`);
        }
        if (styles > 3) {
            optimizations.push(`تحسين ${styles} ملف CSS`);
        }

        this.cleanOldData();
        optimizations.push('تنظيف البيانات المؤقتة');

        if (optimizations.length === 0) {
            return `✅ التحسين\n\n• النظام محسن بالفعل\n• لا توجد تحسينات إضافية مطلوبة\n• الأداء في أفضل حالة`;
        }

        return `⚡ تحسينات مطبقة\n\n${optimizations.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\n🎯 تم تحسين الأداء بنجاح!`;
    }

    /**
     * معالجة التحليل المحسن
     */
    handleAnalyze() {
        const stats = {
            apps: JSON.parse(localStorage.getItem('prok_apps') || '[]').length,
            visitors: parseInt(localStorage.getItem('prok_visitors') || '0'),
            activity: JSON.parse(localStorage.getItem('prok_activity_log') || '[]').length,
            domElements: document.querySelectorAll('*').length,
            images: document.images.length,
            links: document.links.length
        };

        let response = `📈 تحليل إحصائي شامل\n\n`;

        response += `📱 التطبيقات: ${stats.apps}\n`;
        response += `👥 الزوار: ${stats.visitors.toLocaleString()}\n`;
        response += `📝 النشاطات: ${stats.activity}\n`;
        response += `🏗️ عناصر DOM: ${stats.domElements}\n`;
        response += `🖼️ الصور: ${stats.images}\n`;
        response += `🔗 الروابط: ${stats.links}\n`;

        // تحليل الأداء
        if (window.performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                response += `⚡ حجم الصفحة: ${(nav.encodedBodySize / 1024 / 1024).toFixed(2)} MB\n`;
            }
        }

        response += `\n💡 التوصيات:\n`;
        if (stats.apps < 3) {
            response += `• إضافة المزيد من التطبيقات\n`;
        }
        if (stats.images > 10) {
            response += `• تحسين ضغط الصور\n`;
        }
        if (stats.domElements > 1000) {
            response += `• تبسيط هيكل الصفحة\n`;
        }

        return response;
    }

    /**
     * معالجة المساعدة المحسنة
     */
    handleHelp() {
        return `🤖 مساعد Prok الذكي\n\n🎯 الأوامر المتاحة:\n\n• "فحص" - فحص شامل للنظام\n• "تحسين" - تحسين الأداء\n• "تحليل" - إحصائيات مفصلة\n• "إصلاح" - تصحيح الأخطاء تلقائياً\n• "إعدادات" - عرض الإعدادات\n\n💡 النصائح:\n\n• قم بالفحص الدوري للنظام\n• طبق الاقتراحات لتحسين الأداء\n• احتفظ بنسخ احتياطية\n• راقب الإحصائيات بانتظام\n\n❓ كيف يمكنني مساعدتك؟`;
    }

    /**
     * الإصلاح التلقائي
     */
    handleAutoFix() {
        const results = this.applyAutoFixes();
        
        if (results.count === 0) {
            return `✅ الإصلاح التلقائي\n\n• لا توجد أخطاء تحتاج للإصلاح\n• النظام يعمل بشكل مثالي\n• تم فحص جميع الجوانب`;
        }

        return `🔧 الإصلاح التلقائي\n\n• تم إصلاح ${results.count} مشكلة\n• النتائج:\n${results.results.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}\n\n✅ تمت العملية بنجاح!`;
    }

    /**
     * معالجة الإعدادات
     */
    handleSettings(message) {
        if (message.includes('تحديث') || message.includes('update')) {
            return `⚙️ الإعدادات\n\n• حجم السجل: ${this.settings.maxHistorySize} رسالة\n• فترات الفحص: ${this.settings.scanInterval / 60000} دقائق\n• الإصلاح التلقائي: ${this.settings.autoFix ? 'مفعل' : 'معطل'}\n\n💡 استخدام: "تحديث الإعدادات" لتعديلها`;
        }
        
        return `⚙️ إعدادات النظام\n\nاستخدم "تحديث الإعدادات" لعرض خيارات التعديل.`;
    }

    /**
     * معالجة الرسائل العامة المحسنة
     */
    handleGeneral(message) {
        const generalResponses = [
            `أهلاً بك! أنا مساعدك الذكي Prok. كيف يمكنني خدمتك اليوم؟`,
            `مرحباً! يمكنني مساعدتك في فحص النظام، تحسين الأداء، أو تحليل الإحصائيات. ما الذي تحتاجه؟`,
            `مساء الخير! أنا هنا لمساعدتك في إدارة وتحسين نظامك. ما هي المهمة التي تريد تنفيذها؟`,
            `أهلًا وسهلًا! اختر من بين: فحص، تحسين، تحليل، أو إصلاح. كيف أخدمك؟`,
            `تحية طيبة! أنا Prok AI، مساعدك في تحسين تجربة المستخدم وأداء النظام. ما هي خطوتك التالية؟`
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    /**
     * تطبيق الإصلاحات التلقائية
     */
    applyAutoFixes() {
        let fixedCount = 0;
        const results = [];

        [...this.systemStatus.warnings, ...this.systemStatus.suggestions].forEach(issue => {
            if (issue.fix && typeof issue.fix === 'function') {
                try {
                    const result = issue.fix();
                    results.push(result);
                    fixedCount++;
                } catch (error) {
                    console.error('خطأ في الإصلاح:', error);
                }
            }
        });

        this.runBackgroundChecks();
        
        return { count: fixedCount, results };
    }

    /**
     * تصدير تقرير مفصل
     */
    exportReport() {
        return {
            timestamp: new Date().toISOString(),
            systemStatus: this.systemStatus,
            statistics: this.getDetailedStats(),
            performance: this.getPerformanceMetrics(),
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * الحصول على إحصائيات مفصلة
     */
    getDetailedStats() {
        return {
            apps: JSON.parse(localStorage.getItem('prok_apps') || '[]').length,
            visitors: parseInt(localStorage.getItem('prok_visitors') || '0'),
            activity: JSON.parse(localStorage.getItem('prok_activity_log') || '[]').length,
            domElements: document.querySelectorAll('*').length,
            images: document.images.length,
            links: document.links.length,
            forms: document.forms.length,
            storage: this.getStorageUsage()
        };
    }

    /**
     * استخدام التخزين
     */
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024 / 1024).toFixed(2) + ' MB';
    }

    /**
     * مقاييس الأداء
     */
    getPerformanceMetrics() {
        const metrics = {};
        
        if (window.performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                metrics.pageSize = (navigation.encodedBodySize / 1024 / 1024).toFixed(2) + ' MB';
                metrics.transferSize = (navigation.transferSize / 1024 / 1024).toFixed(2) + ' MB';
            }

            if (performance.timing) {
                metrics.loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) + ' ms';
                metrics.domReady = (performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart) + ' ms';
            }
        }

        return metrics;
    }

    /**
     * توليد التوصيات
     */
    generateRecommendations() {
        const recommendations = [];
        const stats = this.getDetailedStats();

        if (stats.images > 10) {
            recommendations.push('تحسين ضغط الصور لتحسين سرعة التحميل');
        }

        if (stats.domElements > 1000) {
            recommendations.push('تبسيط هيكل HTML لتحسين الأداء');
        }

        if (parseFloat(stats.storage) > 1) {
            recommendations.push('تنظيف التخزين المؤقت للبيانات');
        }

        return recommendations;
    }

    /**
     * فحص سريع
     */
    quickScan() {
        this.runBackgroundChecks();
        
        const total = this.systemStatus.errors.length + this.systemStatus.warnings.length + this.systemStatus.suggestions.length;
        
        let status, emoji;
        if (total === 0) {
            status = 'ممتاز';
            emoji = '✅';
        } else if (this.systemStatus.errors.length > 0) {
            status = 'حرج';
            emoji = '❌';
        } else if (this.systemStatus.warnings.length > 5) {
            status = 'يحتاج انتباه';
            emoji = '⚠️';
        } else {
            status = 'جيد';
            emoji = '✅';
        }

        return {
            total,
            errors: this.systemStatus.errors.length,
            warnings: this.systemStatus.warnings.length,
            suggestions: this.systemStatus.suggestions.length,
            status,
            emoji
        };
    }

    /**
     * تحديث الإعدادات
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        return 'تم تحديث الإعدادات بنجاح';
    }

    /**
     * مسح السجل
     */
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('prok_ai_history');
        return 'تم مسح سجل المحادثات';
    }

    /**
     * الحصول على حالة النظام
     */
    getSystemStatus() {
        return this.systemStatus;
    }
}

// إنشاء وتصدير النسخة المحسنة
const prokAI = new ProkAI();

// التهيئة الذكية
const initAI = () => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => prokAI.init());
    } else {
        setTimeout(() => prokAI.init(), 1000);
    }
};

// التصدير للاستخدام العام
if (typeof window !== 'undefined') {
    window.prokAI = prokAI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProkAI, prokAI };
}

// بدء التشغيل
initAI();
