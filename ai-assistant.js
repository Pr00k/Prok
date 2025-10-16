/**
 * المساعد الذكي - نظام تحليل وتوصيات ذكي
 * يحسن الأداء ويكتشف المشاكل تلقائياً
 */

class IntelligentAssistant {
    constructor() {
        this.issues = [];
        this.recommendations = [];
        this.performanceMetrics = {};
        this.settings = {
            autoScan: true,
            scanInterval: 300000, // 5 دقائق
            notifyIssues: true
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupPerformanceMonitoring();
        this.startPeriodicScans();
        console.log('🤖 المساعد الذكي جاهز');
    }

    setupPerformanceMonitoring() {
        // مراقبة أداء الصفحة
        if ('performance' in window) {
            this.performanceMetrics = this.capturePerformanceMetrics();
        }

        // مراقبة استخدام الذاكرة
        this.monitorMemoryUsage();

        // مراقبة أخطاء JavaScript
        window.addEventListener('error', this.handleRuntimeError.bind(this));
    }

    capturePerformanceMetrics() {
        const metrics = {};
        
        if (performance.getEntriesByType('navigation').length > 0) {
            const navigation = performance.getEntriesByType('navigation')[0];
            metrics.pageLoadTime = navigation.loadEventEnd - navigation.navigationStart;
            metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
        }

        metrics.memoryUsage = performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        } : null;

        return metrics;
    }

    monitorMemoryUsage() {
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                
                if (usagePercent > 80) {
                    this.addIssue({
                        type: 'memory',
                        severity: 'high',
                        message: 'استخدام الذاكرة مرتفع',
                        suggestion: 'تحسين إدارة الذاكرة وحذف البيانات غير الضرورية'
                    });
                }
            }, 30000);
        }
    }

    handleRuntimeError(event) {
        this.addIssue({
            type: 'javascript',
            severity: 'high',
            message: `خطأ في JavaScript: ${event.message}`,
            suggestion: 'فحص الكود وإصلاح الأخطاء'
        });
    }

    startPeriodicScans() {
        if (this.settings.autoScan) {
            setInterval(() => {
                this.runComprehensiveScan();
            }, this.settings.scanInterval);
        }
    }

    runComprehensiveScan() {
        this.issues = [];
        this.recommendations = [];

        this.scanImages();
        this.scanLinks();
        this.scanPerformance();
        this.scanAccessibility();
        this.scanSEO();

        this.generateReport();
    }

    scanImages() {
        const images = document.images;
        Array.from(images).forEach((img, index) => {
            // فحص النص البديل
            if (!img.alt) {
                this.addIssue({
                    type: 'accessibility',
                    severity: 'medium',
                    message: `الصورة ${index + 1} تفتقد النص البديل`,
                    element: img,
                    fix: () => img.alt = `صورة ${index + 1}`
                });
            }

            // فحص حجم الصورة
            if (img.naturalWidth > 2000) {
                this.addRecommendation({
                    type: 'performance',
                    message: `الصورة ${index + 1} كبيرة الحجم`,
                    suggestion: 'تحسين ضغط الصورة'
                });
            }
        });
    }

    scanLinks() {
        const links = document.links;
        Array.from(links).forEach(link => {
            if (link.href === '#' || !link.href) {
                this.addIssue({
                    type: 'usability',
                    severity: 'low',
                    message: 'رابط فارغ',
                    element: link,
                    fix: () => link.href = '#'
                });
            }
        });
    }

    scanPerformance() {
        const metrics = this.capturePerformanceMetrics();
        
        if (metrics.pageLoadTime > 3000) {
            this.addRecommendation({
                type: 'performance',
                message: 'وقت تحميل الصفحة بطيء',
                suggestion: 'تحسين أداء التحميل'
            });
        }

        // فحص عدد عناصر DOM
        const domElements = document.querySelectorAll('*').length;
        if (domElements > 1500) {
            this.addRecommendation({
                type: 'performance',
                message: 'عدد عناصر DOM كبير',
                suggestion: 'تبسيط هيكل الصفحة'
            });
        }
    }

    scanAccessibility() {
        // فحص تباين الألوان
        this.checkColorContrast();
        
        // فحص العناوين
        this.checkHeadingsStructure();
    }

    scanSEO() {
        // فحص العناوين والوصف
        const title = document.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        
        if (!title || title.length < 10) {
            this.addIssue({
                type: 'seo',
                severity: 'medium',
                message: 'العنوان قصير جداً',
                suggestion: 'إضافة عنوان وصفي'
            });
        }

        if (!metaDescription) {
            this.addIssue({
                type: 'seo',
                severity: 'medium',
                message: 'الوصف التعريفي مفقود',
                suggestion: 'إضافة وصف meta'
            });
        }
    }

    addIssue(issue) {
        this.issues.push({
            ...issue,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });

        if (this.settings.notifyIssues) {
            this.notifyIssue(issue);
        }
    }

    addRecommendation(recommendation) {
        this.recommendations.push({
            ...recommendation,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });
    }

    notifyIssue(issue) {
        if (window.systemManager) {
            window.systemManager.showNotification(
                `⚠️ ${issue.message}`,
                issue.severity === 'high' ? 'error' : 'warning'
            );
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            issues: this.issues,
            recommendations: this.recommendations,
            performance: this.performanceMetrics,
            summary: {
                totalIssues: this.issues.length,
                totalRecommendations: this.recommendations.length,
                criticalIssues: this.issues.filter(i => i.severity === 'high').length
            }
        };

        console.log('📊 تقرير المساعد الذكي:', report);
        return report;
    }

    getHealthScore() {
        const totalIssues = this.issues.length;
        const criticalIssues = this.issues.filter(i => i.severity === 'high').length;
        
        let score = 100;
        score -= totalIssues * 5;
        score -= criticalIssues * 20;
        
        return Math.max(0, score);
    }

    autoFixIssues() {
        const fixed = [];
        this.issues.forEach(issue => {
            if (issue.fix && typeof issue.fix === 'function') {
                try {
                    issue.fix();
                    fixed.push(issue.id);
                } catch (error) {
                    console.error('فشل الإصلاح التلقائي:', error);
                }
            }
        });

        // إزالة المشاكل التي تم إصلاحها
        this.issues = this.issues.filter(issue => !fixed.includes(issue.id));
        
        return fixed.length;
    }

    loadSettings() {
        const saved = localStorage.getItem('assistant_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('assistant_settings', JSON.stringify(this.settings));
    }

    // واجهة برمجة للتكامل مع النظام الرئيسي
    getSystemRecommendations() {
        return {
            issues: this.issues,
            recommendations: this.recommendations,
            healthScore: this.getHealthScore(),
            performance: this.performanceMetrics
        };
    }

    // مسح سريع عند الطلب
    quickScan() {
        this.runComprehensiveScan();
        return this.generateReport();
    }
}

// التهيئة التلقائية
const intelligentAssistant = new IntelligentAssistant();

// التصدير للاستخدام العام
window.intelligentAssistant = intelligentAssistant;

// دعم module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntelligentAssistant;
}
