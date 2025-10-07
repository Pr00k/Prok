// نظام الحماية المتقدم للموقع - Prok
class AdvancedProtectionSystem {
    constructor() {
        this.protectionEnabled = true;
        this.screenshotAttempts = 0;
        this.maxAttempts = 3;
        this.sensitiveSelectors = [
            '.password-field',
            '.sensitive-content',
            '[data-sensitive="true"]',
            '.secret-code',
            '.api-key',
            '.token',
            '.personal-data'
        ];
        
        this.init();
    }

    init() {
        console.log('🛡️ نظام الحماية المتقدم لـ Prok يعمل...');
        
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
        
        // مراقبة المحتوى الجديد
        this.observeDynamicContent();
        
        // حماية خاصة للصور
        this.protectImages();
    }

    // ===== نظام منع النسخ =====
    enableCopyProtection() {
        document.addEventListener('copy', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ النسخ غير مسموح في Prok');
                return false;
            }
        });

        document.addEventListener('cut', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ القص غير مسموح في Prok');
                return false;
            }
        });

        document.addEventListener('paste', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ اللصق غير مسموح في Prok');
                return false;
            }
        });

        // منع سحب المحتوى
        document.addEventListener('dragstart', (e) => {
            if (this.protectionEnabled && (e.target.tagName === 'IMG' || e.target.classList.contains('protected-content'))) {
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
                this.logScreenshotAttempt('keyboard_shortcut');
                return false;
            }
        });

        // حماية للجوال (3 أصابع أو أكثر)
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 3) {
                this.triggerScreenshotProtection();
                this.logScreenshotAttempt('mobile_multitouch');
            }
        }, { passive: false });

        // حماية من أدوات التقاط الشاشة
        this.detectScreenshotTools();
    }

    // ===== كشف أدوات التقاط الشاشة =====
    detectScreenshotTools() {
        // كشف تغييرات الحجم التي قد تشير إلى أدوات التقاط
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const widthDiff = Math.abs(window.innerWidth - lastWidth);
            const heightDiff = Math.abs(window.innerHeight - lastHeight);
            
            if (widthDiff > 100 || heightDiff > 100) {
                this.triggerScreenshotProtection();
                this.logScreenshotAttempt('window_resize_tool');
            }
            
            lastWidth = window.innerWidth;
            lastHeight = window.innerHeight;
        });
    }

    // ===== تشغيل الحماية عند محاولة لقطة شاشة =====
    triggerScreenshotProtection() {
        this.screenshotAttempts++;
        
        const protectionLayer = document.getElementById('screenProtection');
        if (protectionLayer) {
            // تشغيل تأثير الحماية
            protectionLayer.classList.add('protection-active', 'protection-screenshot');
            
            // زيادة قوة التشويش مع كل محاولة
            const blurIntensity = Math.min(20 + (this.screenshotAttempts * 15), 80);
            const hueRotation = this.screenshotAttempts * 180;
            
            protectionLayer.style.backdropFilter = `blur(${blurIntensity}px) hue-rotate(${hueRotation}deg) contrast(0.2) saturate(0.5)`;
            protectionLayer.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
            
            // إخفاء التأثير بعد ثانية
            setTimeout(() => {
                protectionLayer.classList.remove('protection-screenshot');
            }, 1500);
        }

        this.showNotification(`🚫 تم منع محاولة لقطة شاشة (${this.screenshotAttempts}/${this.maxAttempts})`);
        
        // قفل الموقع بعد محاولات كثيرة
        if (this.screenshotAttempts >= this.maxAttempts) {
            setTimeout(() => this.lockWebsite(), 2000);
        }
    }

    // ===== قفل الموقع بعد محاولات متعددة =====
    lockWebsite() {
        const lockHTML = `
            <div id="websiteLock" style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(135deg, #ff0000, #8b0000, #000000);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2147483647;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                text-align: center;
                padding: 40px;
                backdrop-filter: blur(30px);
            ">
                <div style="background: rgba(0,0,0,0.7); padding: 40px; border-radius: 20px; border: 3px solid #ff0000;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🛡️⚡</div>
                    <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #ff6b6b;">تم حظر الوصول</h1>
                    <p style="font-size: 1.2rem; margin-bottom: 30px; line-height: 1.6;">
                        تم اكتشاف <strong>${this.screenshotAttempts} محاولات</strong> لأخذ لقطات شاشة.<br>
                        موقع <strong>Prok</strong> محمي ولا يسمح بالتقاط الصور.
                    </p>
                    <div style="
                        animation: pulse 2s infinite;
                        font-size: 3rem;
                        margin-bottom: 20px;
                    ">⚠️</div>
                    <p style="color: #ff9999; font-size: 1.1rem;">
                        للحصول على المساعدة، يرجى الاتصال بدعم Prok
                    </p>
                    <button onclick="location.reload()" style="
                        margin-top: 30px;
                        padding: 12px 30px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        cursor: pointer;
                    ">إعادة تحميل الموقع</button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = lockHTML;
        
        // منع أي تفاعل إضافي
        const events = ['keydown', 'click', 'contextmenu', 'mousedown', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
        });
    }

    // ===== منع القائمة المنبثقة =====
    enableContextMenuProtection() {
        document.addEventListener('contextmenu', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                this.showNotification('❌ القائمة المنبثقة غير مسموحة في Prok');
                return false;
            }
        });

        // منع القائمة الطويلة على الجوال
        document.addEventListener('touchhold', (e) => {
            if (this.protectionEnabled) {
                e.preventDefault();
                return false;
            }
        });
    }

    // ===== حماية أدوات المطورين =====
    enableDevToolsProtection() {
        const devToolsCallback = () => {
            if (this.protectionEnabled) {
                this.triggerScreenshotProtection();
                this.logScreenshotAttempt('dev_tools_opened');
                
                // إعادة تحميل الصفحة باستمرار
                setInterval(() => {
                    window.location.reload();
                }, 2000);
            }
        };

        this.detectDevTools(devToolsCallback);
    }

    detectDevTools(callback) {
        // الطريقة 1: كشف من خلال console.log
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                callback();
                return 'devtools_detected';
            }
        });
        console.log('%c", element);

        // الطريقة 2: كشف من خلال اختلاف الأحجام
        const widthThreshold = window.outerWidth - window.innerWidth > 200;
        const heightThreshold = window.outerHeight - window.innerHeight > 200;
        
        if (widthThreshold || heightThreshold) {
            callback();
        }

        // الطريقة 3: كشف من خلال الوقت
        const start = Date.now();
        debugger;
        const end = Date.now();
        if (end - start > 100) {
            callback();
        }
    }

    // ===== حماية لوحة المفاتيح =====
    enableKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            if (!this.protectionEnabled) return;

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

            // منع Ctrl+S
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.showNotification('❌ حفظ الصفحة غير مسموح');
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
        element.setAttribute('data-protected', 'true');
        
        const overlay = document.createElement('div');
        overlay.className = 'sensitive-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: repeating-linear-gradient(
                45deg,
                rgba(255,0,0,0.05),
                rgba(255,0,0,0.05) 5px,
                rgba(0,0,255,0.05) 5px,
                rgba(0,0,255,0.05) 10px
            );
            pointer-events: none;
            z-index: 9999;
            border-radius: inherit;
            mix-blend-mode: multiply;
        `;
        
        // إضافة نص حماية
        const protectionText = document.createElement('div');
        protectionText.style.cssText = `
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            color: rgba(255,0,0,0.3);
            font-size: 24px;
            font-weight: bold;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10000;
        `;
        protectionText.textContent = 'PROTECTED BY PROK';
        
        element.appendChild(overlay);
        element.appendChild(protectionText);
    }

    // ===== حماية الصور =====
    protectImages() {
        document.querySelectorAll('img').forEach(img => {
            // منع سحب الصور
            img.setAttribute('draggable', 'false');
            
            // إضافة حماية للصور المهمة
            if (img.src.includes('logo') || img.alt.includes('important')) {
                img.style.position = 'relative';
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.02);
                    pointer-events: none;
                `;
                img.parentNode.insertBefore(overlay, img.nextSibling);
            }
        });
    }

    // ===== حماية حركة الماوس =====
    enableMouseProtection() {
        let mouseMoveCount = 0;
        const maxMoves = 150;
        
        document.addEventListener('mousemove', (e) => {
            if (!this.protectionEnabled) return;
            
            mouseMoveCount++;
            
            // إذا تحرك الماوس بشكل مريب (كثير جداً في وقت قصير)
            if (mouseMoveCount > maxMoves) {
                this.triggerScreenshotProtection();
                this.logScreenshotAttempt('suspicious_mouse_movement');
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
        let lastResizeTime = 0;
        
        window.addEventListener('resize', () => {
            if (!this.protectionEnabled) return;
            
            const now = Date.now();
            if (now - lastResizeTime < 500) { // تغيير حجم سريع
                resizeCount++;
            } else {
                resizeCount = 1;
            }
            lastResizeTime = now;
            
            if (resizeCount > 3) {
                this.triggerScreenshotProtection();
                this.logScreenshotAttempt('rapid_window_resize');
                resizeCount = 0;
            }
        });
    }

    // ===== حماية تغيير الرؤية =====
    enableVisibilityProtection() {
        let lastHiddenTime = 0;
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.protectionEnabled) {
                lastHiddenTime = Date.now();
                setTimeout(() => {
                    this.triggerScreenshotProtection();
                    this.logScreenshotAttempt('tab_switch');
                }, 100);
            } else if (!document.hidden && lastHiddenTime > 0) {
                const hiddenDuration = Date.now() - lastHiddenTime;
                if (hiddenDuration > 2000) { // كان مخفي لأكثر من ثانيتين
                    this.triggerScreenshotProtection();
                }
            }
        });
    }

    // ===== حماية عند فقدان التركيز =====
    enableBlurProtection() {
        window.addEventListener('blur', () => {
            if (this.protectionEnabled) {
                setTimeout(() => {
                    this.triggerScreenshotProtection();
                    this.logScreenshotAttempt('window_blur');
                }, 500);
            }
        });
    }

    // ===== مراقبة المحتوى الجديد =====
    observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // عنصر
                        this.protectSensitiveElements();
                        this.applyCopyProtection(node);
                        this.protectImages();
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

    // ===== تسيح محاولات الاختراق =====
    logScreenshotAttempt(reason) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            reason: reason,
            attempts: this.screenshotAttempts,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.warn('🚫 محاولة اختراق مسجلة:', logEntry);
        
        // يمكن إرسال هذا للسيرفر في النسخة النهائية
        // this.sendToServer(logEntry);
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
            box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
            border-left: 4px solid #fff;
            font-weight: bold;
            font-size: 14px;
            animation: notificationSlideIn 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        document.body.appendChild(notification);

        // إخفاء التنبيه تلقائياً بعد 3 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease-in';
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
        console.log('🛡️ نظام الحماية معطل مؤقتاً');
        this.showNotification('⚠️ الحماية معطلة - للتطوير فقط');
    }

    enableProtection() {
        this.protectionEnabled = true;
        console.log('🛡️ نظام الحماية مفعل');
        this.showNotification('✅ الحماية مفعلة');
    }

    // ===== إحصاءات الحماية =====
    getProtectionStats() {
        return {
            enabled: this.protectionEnabled,
            screenshotAttempts: this.screenshotAttempts,
            maxAttempts: this.maxAttempts,
            protectionLevel: 'MAXIMUM'
        };
    }
}

// ===== نظام إدارة المحتوى المتقدم =====
class ProkContentManagementSystem {
    constructor() {
        this.isAdmin = false;
        this.editMode = false;
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        this.checkAdminStatus();
        this.setupEditMode();
        this.setupEventListeners();
        this.loadSavedChanges();
        
        console.log('📝 نظام إدارة محتوى Prok جاهز');
    }

    checkAdminStatus() {
        this.isAdmin = localStorage.getItem('prok_admin_loggedIn') === 'true';
        this.updateUI();
    }

    setupEditMode() {
        document.querySelectorAll('.editable').forEach(element => {
            this.makeEditable(element);
        });
    }

    makeEditable(element) {
        if (element.querySelector('.edit-icon')) return;
        
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-icon';
        editIcon.innerHTML = '✏️';
        editIcon.title = 'انقر للتحرير - Prok Editor';
        editIcon.style.cssText = `
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: 10px;
            color: #3498db;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
            background: rgba(255,255,255,0.9);
            padding: 2px 4px;
            border-radius: 3px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 100;
        `;
        
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editElement(element);
        });

        element.style.position = 'relative';
        element.appendChild(editIcon);
    }

    editElement(element) {
        if (!this.isAdmin) {
            this.showNotification('❌ تحتاج صلاحية أدمن للتحرير في Prok');
            return;
        }

        const currentContent = element.textContent.trim();
        const newContent = prompt('✏️ محرر Prok - عدل المحتوى:', currentContent);
        
        if (newContent !== null && newContent !== currentContent) {
            element.textContent = newContent;
            this.makeEditable(element);
            this.showNotification('✅ تم حفظ التعديلات في Prok');
            this.saveChanges(element);
        }
    }

    saveChanges(element) {
        const elementId = element.id || `prok_element_${Date.now()}`;
        const content = element.textContent;
        
        const changes = JSON.parse(localStorage.getItem('prok_content_changes') || '{}');
        changes[elementId] = {
            content: content,
            timestamp: new Date().toISOString(),
            element: element.tagName
        };
        localStorage.setItem('prok_content_changes', JSON.stringify(changes));
    }

    loadSavedChanges() {
        if (!this.isAdmin) return;
        
        const changes = JSON.parse(localStorage.getItem('prok_content_changes') || '{}');
        Object.entries(changes).forEach(([id, data]) => {
            const element = document.getElementById(id) || document.querySelector(`[data-prok-id="${id}"]`);
            if (element) {
                element.textContent = data.content;
                this.makeEditable(element);
            }
        });
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

        // النماذج
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });
    }

    showAdminLogin() {
        const password = prompt('🔐 أدخل كلمة مرور أدمن Prok:');
        if (password === 'ProkAdmin2024!') {
            this.isAdmin = true;
            localStorage.setItem('prok_admin_loggedIn', 'true');
            this.updateUI();
            this.loadSavedChanges();
            this.showNotification('🎉 تم تسجيل الدخول كأدمن Prok');
        } else if (password) {
            this.showNotification('❌ كلمة المرور خاطئة');
        }
    }

    updateUI() {
        const adminPanel = document.getElementById('adminPanel');
        const editIcons = document.querySelectorAll('.edit-icon');
        
        if (this.isAdmin) {
            if (adminPanel) adminPanel.style.display = 'block';
            editIcons.forEach(icon => icon.style.display = 'block');
            document.body.classList.add('admin-mode');
        } else {
            if (adminPanel) adminPanel.style.display = 'none';
            editIcons.forEach(icon => icon.style.display = 'none');
            document.body.classList.remove('admin-mode');
        }
    }

    handleFileUpload(input) {
        const file = input.files[0];
        if (file) {
            this.uploadedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                timestamp: new Date().toISOString()
            });
            
            this.showNotification(`📁 تم رفع الملف: ${file.name} (${this.formatFileSize(file.size)})`);
            this.saveUploadedFiles();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.showNotification('✅ تم إرسال النموذج بنجاح');
        // يمكن إضافة منطق الإرسال هنا
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveUploadedFiles() {
        localStorage.setItem('prok_uploaded_files', JSON.stringify(this.uploadedFiles));
    }

    showNotification(message) {
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
    window.cms = new ProkContentManagementSystem();
    
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
        @keyframes notificationSlideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes notificationSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100px); opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 Prok - جميع الأنظمة تعمل بنجاح!');
});

// منع التحميل في الإطارات
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// تصدير الأنظمة للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedProtectionSystem, ProkContentManagementSystem };
}
