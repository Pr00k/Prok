// نظام الحماية المتقدم للموقع
class AdvancedProtectionSystem {
    constructor() {
        this.protectionEnabled = true;
        this.screenshotAttempts = 0;
        this.maxAttempts = 3;
        this.sensitiveSelectors = [
            '.password-field',
            '.sensitive-content',
            '[data-sensitive="true"]',
            '.credit-card',
            '.personal-info'
        ];
        
        this.init();
    }

    init() {
        console.log('🛡️ نظام الحماية المتقدم يعمل...');
        
        // تفعيل جميع أنظمة الحماية
        this.enableCopyProtection();
        this.enableScreenshotProtection();
        this.enableContextMenuProtection();
        this.enableDevToolsProtection();
        this.enableKeyboardProtection();
        this.protectSensitiveElements();
        this.enableMouseProtection();
        this.enableResizeProtection();
        this.enableVisibilityProtection();
        this.enableBlurProtection();
        
        // مراقبة الديناميكية
        this.observeDynamicContent();
    }

    // ===== نظام منع النسخ =====
    enableCopyProtection() {
        document.addEventListener('copy', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ النسخ غير مسموح في هذا الموقع');
                return false;
            }
        });

        document.addEventListener('cut', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ القص غير مسموح في هذا الموقع');
                return false;
            }
        });

        document.addEventListener('paste', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ اللصق غير مسموح في هذا الموقع');
                return false;
            }
        });

        // منع سحب المحتوى
        document.addEventListener('dragstart', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                return false;
            }
        });
    }

    // ===== نظام منع لقطات الشاشة =====
    enableScreenshotProtection() {
        // منع اختصارات التقاط الشاشة
        document.addEventListener('keydown', (e) => {
            if (!this.protectionEnabled) return;

            const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44;
            const isWindowsSnip = e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey);
            const isMacScreenshot = (e.metaKey && e.shiftKey && [3,4,5].includes(e.keyCode));

            if (isPrintScreen || isWindowsSnip || isMacScreenshot) {
                e.preventDefault();
                e.stopPropagation();
                this.triggerScreenshotProtection();
                return false;
            }
        });

        // حماية إضافية للجوال
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 3) { // 3 أصابع أو أكثر قد تشير إلى لقطة شاشة
                this.triggerScreenshotProtection();
            }
        }, { passive: false });
    }

    // ===== تشغيل الحماية عند محاولة لقطة شاشة =====
    triggerScreenshotProtection() {
        this.screenshotAttempts++;
        
        const protectionLayer = document.getElementById('screenProtection');
        if (protectionLayer) {
            protectionLayer.classList.add('protection-active', 'protection-screenshot');
            
            // زيادة الحماية مع كل محاولة
            const blurIntensity = Math.min(20 + (this.screenshotAttempts * 10), 50);
            protectionLayer.style.backdropFilter = `blur(${blurIntensity}px) hue-rotate(${this.screenshotAttempts * 120}deg) contrast(0.3)`;
            
            setTimeout(() => {
                protectionLayer.classList.remove('protection-screenshot');
            }, 1000);
        }

        this.showNotification(`🚫 محاولة لقطة شاشة تم منعها (${this.screenshotAttempts}/${this.maxAttempts})`);
        
        if (this.screenshotAttempts >= this.maxAttempts) {
            this.lockWebsite();
        }
    }

    // ===== قفل الموقع بعد محاولات متعددة =====
    lockWebsite() {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(45deg, #ff0000, #000000);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2147483647;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <h1 style="font-size: 3rem; margin-bottom: 2rem;">🚫 تم حظر الوصول</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                    تم اكتشاف محاولات متعددة لأخذ لقطات شاشة.<br>
                    هذا الموقع محمي ولا يسمح بالتقاط الصور.
                </p>
                <div style="
                    animation: spin 1s linear infinite;
                    font-size: 4rem;
                    margin-bottom: 2rem;
                ">🛡️</div>
                <p style="color: #ff9999;">
                    يرجى الاتصال بالدعم الفني لإعادة الوصول
                </p>
            </div>
        `;
        
        // منع أي تفاعل إضافي
        document.addEventListener('keydown', (e) => e.preventDefault());
        document.addEventListener('click', (e) => e.preventDefault());
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // ===== منع القائمة المنبثقة =====
    enableContextMenuProtection() {
        document.addEventListener('contextmenu', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ القائمة المنبثقة غير مسموحة');
                return false;
            }
        });
    }

    // ===== حماية أدوات المطورين =====
    enableDevToolsProtection() {
        // كشف فتح أدوات المطورين
        const devToolsCallback = () => {
            if (this.protectionEnabled) {
                this.triggerScreenshotProtection();
                setInterval(() => {
                    window.location.reload();
                }, 1000);
            }
        };

        // طرق كشف متعددة
        this.detectDevTools(devToolsCallback);
    }

    detectDevTools(callback) {
        let element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                callback();
                return 'devtools-detected';
            }
        });

        console.log('%c', element);

        // كشف حجم الشاشة
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            callback();
        }
    }

    // ===== حماية لوحة المفاتيح =====
    enableKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            // منع F12
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                this.triggerScreenshotProtection();
                return false;
            }

            // منع Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.triggerScreenshotProtection();
                return false;
            }

            // منع Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.triggerScreenshotProtection();
                return false;
            }

            // منع Ctrl+U
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.triggerScreenshotProtection();
                return false;
            }
        });
    }

    // ===== حماية العناصر الحساسة =====
    protectSensitiveElements() {
        this.sensitiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.applySensitiveProtection(element);
            });
        });
    }

    applySensitiveProtection(element) {
        // إضافة حماية إضافية للعناصر الحساسة
        element.style.position = 'relative';
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: repeating-linear-gradient(
                45deg,
                rgba(255,0,0,0.1),
                rgba(255,0,0,0.1) 10px,
                rgba(0,0,255,0.1) 10px,
                rgba(0,0,255,0.1) 20px
            );
            pointer-events: none;
            z-index: 9999;
            border-radius: inherit;
        `;
        
        element.appendChild(overlay);
    }

    // ===== حماية حركة الماوس =====
    enableMouseProtection() {
        let mouseMoveCount = 0;
        const maxMoves = 100;
        
        document.addEventListener('mousemove', (e) => {
            if (!this.protectionEnabled) return;
            
            mouseMoveCount++;
            
            // إذا تحرك الماوس بشكل مريب (كثير جداً)
            if (mouseMoveCount > maxMoves) {
                this.triggerScreenshotProtection();
                mouseMoveCount = 0;
            }
        });

        // إعادة تعيين العداد كل ثانية
        setInterval(() => {
            mouseMoveCount = Math.max(0, mouseMoveCount - 50);
        }, 1000);
    }

    // ===== حماية تغيير الحجم =====
    enableResizeProtection() {
        let resizeCount = 0;
        
        window.addEventListener('resize', () => {
            if (!this.protectionEnabled) return;
            
            resizeCount++;
            
            if (resizeCount > 5) {
                this.triggerScreenshotProtection();
                resizeCount = 0;
            }
        });
    }

    // ===== حماية تغيير الرؤية =====
    enableVisibilityProtection() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.protectionEnabled) {
                setTimeout(() => {
                    this.triggerScreenshotProtection();
                }, 100);
            }
        });
    }

    // ===== حماية عند فقدان التركيز =====
    enableBlurProtection() {
        window.addEventListener('blur', () => {
            if (this.protectionEnabled) {
                setTimeout(() => {
                    this.triggerScreenshotProtection();
                }, 500);
            }
        });
    }

    // ===== مراقبة المحتوى الديناميكي =====
    observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // عنصر
                        this.protectSensitiveElements();
                        this.applyCopyProtection(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    applyCopyProtection(element) {
        if (element.querySelectorAll) {
            element.querySelectorAll('*').forEach(child => {
                child.classList.add('protected-content');
            });
        }
        element.classList.add('protected-content');
    }

    // ===== عرض التنبيهات =====
    showNotification(message) {
        // إزالة التنبيه السابق إذا موجود
        const existingNotification = document.getElementById('copyNotification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // إنشاء تنبيه جديد
        const notification = document.createElement('div');
        notification.id = 'copyNotification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 2147483646;
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
            border-left: 4px solid #fff;
            font-weight: bold;
            animation: fadeIn 0.3s ease-in;
        `;

        document.body.appendChild(notification);

        // إخفاء التنبيه تلقائياً بعد 3 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // ===== التحكم في النظام =====
    disableProtection() {
        this.protectionEnabled = false;
        console.log('🛡️ نظام الحماية معطل');
    }

    enableProtection() {
        this.protectionEnabled = true;
        console.log('🛡️ نظام الحماية مفعل');
    }
}

// ===== نظام إدارة المحتوى =====
class ContentManagementSystem {
    constructor() {
        this.isAdmin = false;
        this.editMode = false;
        this.init();
    }

    init() {
        this.checkAdminStatus();
        this.setupEditMode();
        this.setupEventListeners();
    }

    checkAdminStatus() {
        // التحقق من حالة الأدمن (يمكن تعديل هذا حسب نظامك)
        this.isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        this.updateUI();
    }

    setupEditMode() {
        // تفعيل وضع التحرير للعناصر
        document.querySelectorAll('.editable').forEach(element => {
            this.makeEditable(element);
        });
    }

    makeEditable(element) {
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-icon';
        editIcon.innerHTML = '✏️';
        editIcon.title = 'انقر للتحرير';
        
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editElement(element);
        });

        element.appendChild(editIcon);
    }

    editElement(element) {
        if (!this.isAdmin) {
            this.showNotification('❌ تحتاج صلاحية أدمن للتحرير');
            return;
        }

        const currentContent = element.textContent.trim();
        const newContent = prompt('عدل المحتوى:', currentContent);
        
        if (newContent !== null && newContent !== currentContent) {
            element.textContent = newContent;
            this.makeEditable(element); // إعادة إضافة أيقونة التحرير
            this.showNotification('✅ تم حفظ التعديلات');
            
            // حفظ التغييرات (يمكن إضافة API call هنا)
            this.saveChanges(element);
        }
    }

    saveChanges(element) {
        // حفظ التغييرات في localStorage أو إرسالها للخادم
        const elementId = element.id || `element-${Date.now()}`;
        const content = element.textContent;
        
        const changes = JSON.parse(localStorage.getItem('contentChanges') || '{}');
        changes[elementId] = content;
        localStorage.setItem('contentChanges', JSON.stringify(changes));
    }

    setupEventListeners() {
        // زر دخول الأدمن
        const adminLoginBtn = document.getElementById('adminLogin');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAdminLogin();
            });
        }

        // إدارة الملفات
        const fileUploads = document.querySelectorAll('input[type="file"]');
        fileUploads.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        });
    }

    showAdminLogin() {
        const password = prompt('أدخل كلمة مرور الأدمن:');
        if (password === 'admin123') { // يمكن تغيير هذه إلى تحقق آمن
            this.isAdmin = true;
            localStorage.setItem('adminLoggedIn', 'true');
            this.updateUI();
            this.showNotification('✅ تم تسجيل الدخول كأدمن');
        } else {
            this.showNotification('❌ كلمة المرور خاطئة');
        }
    }

    updateUI() {
        const adminPanel = document.getElementById('adminPanel');
        const editIcons = document.querySelectorAll('.edit-icon');
        
        if (this.isAdmin) {
            if (adminPanel) adminPanel.style.display = 'block';
            editIcons.forEach(icon => icon.style.display = 'block');
        } else {
            if (adminPanel) adminPanel.style.display = 'none';
            editIcons.forEach(icon => icon.style.display = 'none');
        }
    }

    handleFileUpload(input) {
        const file = input.files[0];
        if (file) {
            this.showNotification(`✅ تم رفع الملف: ${file.name}`);
            // هنا يمكن إضافة منطق رفع الملف للخادم
        }
    }

    showNotification(message) {
        // استخدام نفس نظام التنبيهات الموجود في نظام الحماية
        const protectionSystem = window.protectionSystem;
        if (protectionSystem && typeof protectionSystem.showNotification === 'function') {
            protectionSystem.showNotification(message);
        } else {
            alert(message);
        }
    }
}

// ===== تهيئة الأنظمة عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الحماية
    window.protectionSystem = new AdvancedProtectionSystem();
    
    // تهيئة نظام إدارة المحتوى
    window.cms = new ContentManagementSystem();
    
    // إعداد قائمة الهامبرغر للجوال
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // إضافة طبقة الحماية للشاشة
    const protectionLayer = document.createElement('div');
    protectionLayer.id = 'screenProtection';
    document.body.appendChild(protectionLayer);
    
    // إضافة أنماط CSS للتنبيهات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 جميع الأنظمة تعمل بنجاح!');
});

// منع التحميل في الإطارات
if (window.top !== window.self) {
    window.top.location = window.self.location;
}
