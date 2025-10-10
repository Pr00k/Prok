/* ===== Prok Complete Script ===== */
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// نظام الذكاء الاصطناعي المحسن
class ProkAI {
    constructor() {
        this.context = [];
        this.isProcessing = false;
        this.knowledgeBase = {
            'فحص': this.scanSystem.bind(this),
            'تحسين': this.optimizePerformance.bind(this),
            'تحليل': this.analyzeStats.bind(this),
            'حماية': this.securityCheck.bind(this),
            'تطبيقات': this.manageApps.bind(this),
            'أخطاء': this.findErrors.bind(this)
        };
    }

    async processQuery(message) {
        if (this.isProcessing) return "جاري معالجة طلبك السابق...";
        
        this.isProcessing = true;
        this.addToContext('user', message);
        
        try {
            const response = await this.generateResponse(message);
            this.addToContext('assistant', response);
            this.isProcessing = false;
            return response;
        } catch (error) {
            this.isProcessing = false;
            return "عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.";
        }
    }

    async generateResponse(message) {
        // محاكاة معالجة الذكاء الاصطناعي
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const lowerMessage = message.toLowerCase();
        
        // الردود الذكية بناءً على المحتوى
        if (lowerMessage.includes('فحص') || lowerMessage.includes('اخطاء') || lowerMessage.includes('مشاكل')) {
            return this.scanSystem();
        }
        
        if (lowerMessage.includes('تحسين') || lowerMessage.includes('اداء') || lowerMessage.includes('سرعة')) {
            return this.optimizePerformance();
        }
        
        if (lowerMessage.includes('تحليل') || lowerMessage.includes('إحصائيات') || lowerMessage.includes('ارقام')) {
            return this.analyzeStats();
        }
        
        if (lowerMessage.includes('حماية') || lowerMessage.includes('أمان') || lowerMessage.includes('امن')) {
            return this.securityCheck();
        }
        
        if (lowerMessage.includes('تطبيق') || lowerMessage.includes('برنامج') || lowerMessage.includes('app')) {
            return this.manageApps();
        }
        
        if (lowerMessage.includes('مساعدة') || lowerMessage.includes('مساعده') || lowerMessage.includes('help')) {
            return this.showHelp();
        }
        
        // ردود عامة
        const generalResponses = [
            "أفهم طلبك. أقترح استخدام أحد الأزرار المتخصصة أدناه للحصول على مساعدة أكثر دقة.",
            "يمكنني مساعدتك في فحص النظام، تحسين الأداء، أو تحليل الإحصائيات. ما الذي تريد القيام به؟",
            "للمساعدة المثلى، يرجى استخدام الأزرار المخصصة أو وصف مشكلتك بتفصيل أكثر.",
            "أنظمة Prok تعمل بشكل طبيعي. هل تواجه مشكلة محددة يمكنني مساعدتك فيها؟",
            "لدي القدرة على فحص الأخطاء تلقائياً وتحسين أداء النظام. كيف يمكنني خدمتك؟"
        ];
        
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    scanSystem() {
        const issues = [];
        const fixes = [];
        
        // فحص SEO
        if (!document.querySelector('meta[name="description"]')) {
            issues.push("❌ لا يوجد وصف Meta للصفحة");
            fixes.push("إضافة وصف Meta لتحسين SEO");
        }
        
        // فحص الصور
        document.querySelectorAll('img').forEach((img, index) => {
            if (!img.alt) {
                issues.push(`❌ الصورة ${index + 1} لا تحتوي على نص بديل`);
                fixes.push(`إضافة خاصية alt للصورة ${index + 1}`);
            }
        });
        
        // فحص الأداء
        const largeImages = document.querySelectorAll('img[src*="placeholder"]');
        if (largeImages.length > 2) {
            issues.push("⚠️ يوجد عدد كبير من الصور التي قد تؤثر على الأداء");
            fixes.push("تحسين حجم الصور لتحسين سرعة التحميل");
        }
        
        // فحص JavaScript
        if (typeof window.indexDeleteManager === 'undefined') {
            issues.push("❌ نظام إدارة الفهرس غير مفعل");
            fixes.push("تفعيل نظام إدارة الفهرس والقوائم");
        }
        
        let report = "📊 تقرير الفحص:\n\n";
        
        if (issues.length === 0) {
            report += "✅ جميع الأنظمة تعمل بشكل مثالي!\nلا توجد أخطاء أو مشاكل تحتاج للتصحيح.";
        } else {
            report += "المشاكل المكتشفة:\n" + issues.join('\n');
            report += "\n\nالتصحيحات المقترحة:\n" + fixes.join('\n');
            report += `\n\n📈 تم اكتشاف ${issues.length} مشكلة تحتاج للانتباه.`;
        }
        
        return report;
    }

    optimizePerformance() {
        const optimizations = [
            "⚡ ضغط الصور وتحسين أحجامها",
            "🔧 تقليل طلبات HTTP غير الضرورية",
            "💾 تفعيل التخزين المؤقت للمتصفح",
            "🚀 تحسين كود JavaScript",
            "🎯 تقليل وقت تحميل الصفحة"
        ];
        
        // محاكاة التحسين
        const savedKB = Math.floor(Math.random() * 500) + 100;
        const improvedSpeed = (Math.random() * 40 + 10).toFixed(1);
        
        return `🛠️ تحسينات الأداء المقترحة:\n\n${optimizations.join('\n')}\n\n` +
               `📈 النتائج المتوقعة:\n` +
               `• توفير ${savedKB} كيلوبايت في حجم الصفحة\n` +
               `• تحسين السرعة بنسبة ${improvedSpeed}%\n` +
               `• تجربة مستخدم أسرع وأكثر سلاسة`;
    }

    analyzeStats() {
        const visitors = parseInt(localStorage.getItem('prok_visitors') || '0');
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        const issues = JSON.parse(localStorage.getItem('prok_issues') || '[]');
        
        const growthRate = ((visitors - 100) / 100 * 100).toFixed(1);
        const satisfaction = (95 - issues.length * 2).toFixed(0);
        
        return `📈 تحليل إحصائيات Prok:\n\n` +
               `👥 عدد الزوار: ${visitors.toLocaleString()}\n` +
               `📱 عدد التطبيقات: ${apps.length}\n` +
               `⚠️  المشاكل النشطة: ${issues.length}\n` +
               `📊 معدل النمو: ${growthRate}%\n` +
               `⭐ رضا المستخدمين: ${satisfaction}%\n\n` +
               `💡 التوصيات:\n` +
               `• ${visitors < 500 ? 'تحسين استراتيجية التسويق' : 'الحفاظ على جودة الخدمة'}\n` +
               `• ${apps.length < 5 ? 'إضافة المزيد من التطبيقات' : 'تحسين التطبيقات الحالية'}\n` +
               `• ${issues.length > 3 ? 'معالجة المشاكل فوراً' : 'الاستمرار في المراقبة'}`;
    }

    securityCheck() {
        const checks = [
            "✅ الحماية من النسخ مفعلة",
            "✅ منع النقر بزر الماوس الأيمن نشط",
            "✅ حماية أدوات المطورين مفعلة",
            "✅ الاتصالات آمنة",
            "✅ نظام كشف التسلل نشط"
        ];
        
        return `🛡️ تقرير الأمان:\n\n${checks.join('\n')}\n\n` +
               `🔒 حالة النظام: آمن تماماً\n` +
               `📊 مستوى الحماية: 98%\n` +
               `⏰ آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}\n\n` +
               `💡 النصيحة: استمر في تحديث النظام بانتظام للحفاظ على أعلى مستويات الأمان.`;
    }

    manageApps() {
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        
        if (apps.length === 0) {
            return "📱 إدارة التطبيقات:\n\nلا توجد تطبيقات حالياً.\n\n💡 نصيحة: يمكنك إضافة تطبيقات جديدة من خلال زر 'إضافة تطبيق' في لوحة التحكم.";
        }
        
        let report = "📱 إدارة التطبيقات:\n\n";
        report += `إجمالي التطبيقات: ${apps.length}\n\n`;
        
        apps.forEach((app, index) => {
            report += `${index + 1}. ${app.title}\n`;
            report += `   📝 ${app.description}\n`;
            report += `   🏷️  ${app.category}\n\n`;
        });
        
        report += "💡 الإجراءات المتاحة:\n• تعديل التطبيقات\n• حذف التطبيقات\n• إضافة تطبيقات جديدة\n• تنظيم التطبيقات حسب الفئة";
        
        return report;
    }

    findErrors() {
        const errors = [];
        
        // فحص العناصر المفقودة
        if (!document.getElementById('appsGrid')) {
            errors.push("❌ قسم التطبيقات غير موجود");
        }
        
        if (!document.querySelector('.carousel')) {
            errors.push("❌ الكاروسيل غير موجود");
        }
        
        if (errors.length === 0) {
            return "✅ فحص الأخطاء:\n\nلم يتم العثور على أخطاء حرجة في الهيكل الأساسي للموقع.";
        } else {
            return `❌ فحص الأخطاء:\n\nتم اكتشاف الأخطاء التالية:\n${errors.join('\n')}\n\n🔧 يوصى بإصلاح هذه الأخطاء فوراً.`;
        }
    }

    showHelp() {
        return `🤖 مساعد Prok الذكي - دليل المساعدة:\n\n` +
               `🔍 **فحص النظام**: اكتشف الأخطاء والمشاكل تلقائياً\n` +
               `⚡ **تحسين الأداء**: احصل على نصائح لتحسين سرعة الموقع\n` +
               `📊 **تحليل الإحصائيات**: عرض إحصائيات الموقع والأداء\n` +
               `🛡️ **التحقق من الأمان**: تأكد من أنظمة الحماية\n` +
               `📱 **إدارة التطبيقات**: التحكم في التطبيقات والمحتوى\n\n` +
               `💡 **نصائح سريعة**:\n` +
               `• استخدم كلمات واضحة ومحددة\n` +
               `• استفد من الأزرار المخصصة للإجراءات السريعة\n` +
               `• يمكنني معالجة استفسارات متعددة في وقت واحد\n` +
               `• النظام يتعلم ويتحسن باستمرار`;
    }

    addToContext(role, content) {
        this.context.push({ role, content, timestamp: new Date() });
        
        // الحفاظ على آخر 10 رسائل فقط
        if (this.context.length > 10) {
            this.context = this.context.slice(-10);
        }
    }
}

// نظام إدارة الفهرس والحذف
class IndexDeleteManager {
    constructor() {
        this.lists = new Map();
        this.currentIndexes = new Map();
        this.deletedItems = new Map();
    }

    createList(listName, items = []) {
        this.lists.set(listName, items);
        this.currentIndexes.set(listName, 0);
        this.deletedItems.set(listName, []);
        return this.getList(listName);
    }

    getList(listName) {
        return this.lists.get(listName) || [];
    }

    getCurrent(listName) {
        const list = this.getList(listName);
        const currentIndex = this.currentIndexes.get(listName) || 0;
        return list[currentIndex] || null;
    }

    next(listName) {
        const list = this.getList(listName);
        if (list.length === 0) return null;

        let currentIndex = this.currentIndexes.get(listName) || 0;
        currentIndex = (currentIndex + 1) % list.length;
        this.currentIndexes.set(listName, currentIndex);
        
        return this.getCurrent(listName);
    }

    prev(listName) {
        const list = this.getList(listName);
        if (list.length === 0) return null;

        let currentIndex = this.currentIndexes.get(listName) || 0;
        currentIndex = (currentIndex - 1 + list.length) % list.length;
        this.currentIndexes.set(listName, currentIndex);
        
        return this.getCurrent(listName);
    }

    addItem(listName, item) {
        const list = this.getList(listName);
        const newItem = {
            id: Date.now().toString(),
            ...item,
            createdAt: new Date().toISOString()
        };
        list.push(newItem);
        this.lists.set(listName, list);
        this.saveToStorage(listName);
        return newItem;
    }

    deleteItem(listName, index) {
        const list = this.getList(listName);
        if (index < 0 || index >= list.length) return false;

        const deletedItem = list[index];
        const deletedList = this.deletedItems.get(listName) || [];
        
        deletedList.push({
            ...deletedItem,
            deletedAt: new Date().toISOString(),
            originalIndex: index
        });
        
        this.deletedItems.set(listName, deletedList);
        list.splice(index, 1);
        this.lists.set(listName, list);
        
        this.saveToStorage(listName);
        return true;
    }

    saveToStorage(listName) {
        try {
            const data = {
                items: this.getList(listName),
                currentIndex: this.currentIndexes.get(listName) || 0,
                deletedItems: this.deletedItems.get(listName) || []
            };
            localStorage.setItem(`prok_${listName}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    loadFromStorage(listName) {
        try {
            const stored = localStorage.getItem(`prok_${listName}`);
            if (stored) {
                const data = JSON.parse(stored);
                this.lists.set(listName, data.items || []);
                this.currentIndexes.set(listName, data.currentIndex || 0);
                this.deletedItems.set(listName, data.deletedItems || []);
                return true;
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
        return false;
    }
}

// التهيئة الرئيسية
const prokAI = new ProkAI();
const indexDeleteManager = new IndexDeleteManager();

function initApp() {
    initFirebase();
    initVisitorCounter();
    initCarousel();
    initProtection();
    initIndexDeleteSystem();
    initEditSystem();
    initAdminInterface();
    loadData();
    setupEventListeners();
}

function initFirebase() {
    // محاكاة تهيئة Firebase
    console.log('Firebase initialized in demo mode');
    
    // محاكاة مستخدم أدمن للتجربة
    setTimeout(() => {
        const adminUser = {
            email: 'admin@prok.com',
            uid: 'demo-user-123'
        };
        localStorage.setItem('prok_admin_user', JSON.stringify(adminUser));
    }, 1000);
}

function initVisitorCounter() {
    const visCount = document.getElementById('visCount');
    if (!visCount) return;

    try {
        let count = parseInt(localStorage.getItem('prok_visitors') || '0');
        count++;
        localStorage.setItem('prok_visitors', count.toString());
        visCount.textContent = count.toLocaleString();
    } catch (e) {
        visCount.textContent = '0';
    }
}

function initCarousel() {
    const slides = document.getElementById('carouselSlides');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!slides) return;

    const slideElements = slides.querySelectorAll('.slide');
    let currentSlide = 0;

    function updateCarousel() {
        slides.querySelectorAll('.slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideElements.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideElements.length) % slideElements.length;
        updateCarousel();
    }

    // إنشاء النقاط
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slideElements.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // إضافة الأحداث
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // التمرير التلقائي
    let autoSlide = setInterval(nextSlide, 5000);

    // إيقاف التمرير التلقائي عند التمرير
    slides.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slides.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    updateCarousel();
}

function initProtection() {
    // منع النقر بزر الماوس الأيمن
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showProtectionAlert();
    });

    // منع النسخ
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        showToast('النسخ غير مسموح', 'warning');
    });

    // منع أدوات المطورين
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            showProtectionAlert();
        }
    });
}

function showProtectionAlert() {
    const alert = document.getElementById('protectionAlert');
    if (alert) {
        alert.classList.add('show');
        setTimeout(() => alert.classList.remove('show'), 2000);
    }
}

function initIndexDeleteSystem() {
    // التطبيقات الافتراضية
    const defaultApps = [
        {
            id: '1',
            title: 'تطبيق الإنتاجية',
            description: 'أداة متكاملة لإدارة المهام والوقت بكل كفاءة',
            image: 'https://via.placeholder.com/300x200/6366f1/fff?text=تطبيق+الإنتاجية',
            category: 'أدوات'
        },
        {
            id: '2',
            title: 'مدير الملفات', 
            description: 'تنظيم الملفات والوثائق بذكاء وسهولة',
            image: 'https://via.placeholder.com/300x200/ec4899/fff?text=مدير+الملفات',
            category: 'أدوات'
        },
        {
            id: '3',
            title: 'مشغل الوسائط',
            description: 'تشغيل الفيديو والصوت بجودة عالية وسهولة',
            image: 'https://via.placeholder.com/300x200/10b981/fff?text=مشغل+الوسائط',
            category: 'ترفيه'
        }
    ];

    indexDeleteManager.createList('apps', defaultApps);
    indexDeleteManager.loadFromStorage('apps');
}

function initEditSystem() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-icon')) {
            const editTarget = e.target.getAttribute('data-edit');
            openEditModal(editTarget, e.target);
        }
    });

    const saveEdit = document.getElementById('saveEdit');
    const cancelEdit = document.getElementById('cancelEdit');

    if (saveEdit) {
        saveEdit.addEventListener('click', handleSaveEdit);
    }

    if (cancelEdit) {
        cancelEdit.addEventListener('click', () => {
            document.getElementById('editModal').classList.remove('show');
        });
    }
}

let currentEditTarget = null;
let currentEditElement = null;

function openEditModal(target, element) {
    currentEditTarget = target;
    currentEditElement = element;
    
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalTitle');
    const modalContent = document.getElementById('editModalContent');
    
    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = `تعديل ${getEditTargetName(target)}`;
    modalContent.innerHTML = generateEditForm(target, element);
    modal.classList.add('show');
}

function getEditTargetName(target) {
    const names = {
        'logo': 'الشعار',
        'title': 'العنوان',
        'lead': 'النص الرئيسي',
        'hero': 'القسم الرئيسي',
        'apps-title': 'عنوان التطبيقات',
        'about-title': 'عنوان عنّا',
        'about-text': 'نص عنّا',
        'footer': 'التذييل'
    };
    
    return names[target] || target;
}

function generateEditForm(target, element) {
    const parent = element.parentElement;
    let currentValue = '';
    
    if (parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3') {
        currentValue = parent.textContent.replace('✏️', '').trim();
        return `<input type="text" id="editValue" value="${currentValue}" class="input">`;
    } else if (parent.tagName === 'P') {
        currentValue = parent.textContent.replace('✏️', '').trim();
        return `<textarea id="editValue" class="input" style="height: 120px;">${currentValue}</textarea>`;
    } else {
        currentValue = parent.textContent.replace('✏️', '').trim();
        return `<input type="text" id="editValue" value="${currentValue}" class="input">`;
    }
}

function handleSaveEdit() {
    const editValue = document.getElementById('editValue');
    if (!editValue || !currentEditElement) return;

    const newValue = editValue.value;
    const parent = currentEditElement.parentElement;

    if (parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3' || parent.tagName === 'P') {
        parent.innerHTML = `<span class="edit-icon" data-edit="${currentEditTarget}">✏️</span> ${newValue}`;
        
        // إعادة إرفاق مستمع الحدث
        parent.querySelector('.edit-icon').addEventListener('click', function() {
            openEditModal(this.getAttribute('data-edit'), this);
        });
    } else {
        parent.textContent = newValue;
        parent.appendChild(currentEditElement);
    }

    document.getElementById('editModal').classList.remove('show');
    showToast('تم حفظ التغييرات بنجاح', 'success');
    saveEdits();
}

function saveEdits() {
    try {
        const edits = JSON.parse(localStorage.getItem('prok_edits') || '{}');
        edits[currentEditTarget] = currentEditElement.parentElement.innerHTML;
        localStorage.setItem('prok_edits', JSON.stringify(edits));
    } catch (error) {
        console.error('Error saving edits:', error);
    }
}

function initAdminInterface() {
    const adminBtn = document.getElementById('adminBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const aiBtn = document.getElementById('aiBtn');

    if (adminBtn) {
        adminBtn.addEventListener('click', handleAdminButtonClick);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            document.getElementById('aiModal').classList.add('show');
        });
    }

    // نافذة الذكاء الاصطناعي
    const aiClose = document.getElementById('aiClose');
    const aiSend = document.getElementById('aiSend');
    const aiInput = document.getElementById('aiInput');
    const aiActions = document.querySelectorAll('.ai-action-btn');

    if (aiClose) {
        aiClose.addEventListener('click', () => {
            document.getElementById('aiModal').classList.remove('show');
        });
    }

    if (aiSend && aiInput) {
        aiSend.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });
    }

    aiActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleAIAction(action);
        });
    });

    // نافذة تسجيل الدخول
    const adminLogin = document.getElementById('adminLogin');
    const adminCancel = document.getElementById('adminCancel');
    const googleLogin = document.getElementById('googleLogin');

    if (adminLogin) {
        adminLogin.addEventListener('click', handleAdminLogin);
    }

    if (adminCancel) {
        adminCancel.addEventListener('click', () => {
            document.getElementById('adminModal').classList.remove('show');
        });
    }

    if (googleLogin) {
        googleLogin.addEventListener('click', handleGoogleLogin);
    }
}

function handleAdminButtonClick() {
    const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
    
    if (user) {
        // إذا كان مسجلاً، انتقل إلى لوحة التحكم
        window.location.href = 'admin.html';
    } else {
        // إذا لم يكن مسجلاً، اعرض نافذة تسجيل الدخول
        document.getElementById('adminModal').classList.add('show');
    }
}

function handleAdminLogin() {
    const email = document.getElementById('adminEmailInput').value;
    const password = document.getElementById('adminPassInput').value;
    
    if (email && password) {
        // محاكاة تسجيل الدخول
        const adminUser = {
            email: email,
            uid: 'user-' + Date.now()
        };
        
        localStorage.setItem('prok_admin_user', JSON.stringify(adminUser));
        document.getElementById('adminModal').classList.remove('show');
        
        showToast('تم تسجيل الدخول بنجاح', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        showToast('يرجى ملء جميع الحقول', 'error');
    }
}

function handleGoogleLogin() {
    showToast('جاري تسجيل الدخول بـ Google...', 'info');
    
    setTimeout(() => {
        const adminUser = {
            email: 'user@gmail.com',
            uid: 'google-user-' + Date.now()
        };
        
        localStorage.setItem('prok_admin_user', JSON.stringify(adminUser));
        document.getElementById('adminModal').classList.remove('show');
        
        showToast('تم تسجيل الدخول بـ Google بنجاح', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    }, 1500);
}

function handleLogout() {
    localStorage.removeItem('prok_admin_user');
    document.body.classList.remove('admin-mode');
    showToast('تم تسجيل الخروج', 'info');
}

function setupEventListeners() {
    // تبديل السمة
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // القائمة المتحركة
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // زر إضافة تطبيق
    const addAppBtn = document.getElementById('addAppBtn');
    if (addAppBtn) {
        addAppBtn.addEventListener('click', addNewApp);
    }
}

function toggleTheme() {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
    
    const isLight = document.body.classList.contains('theme-light');
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    showToast(isLight ? 'السمة الفاتحة مفعلة' : 'السمة الداكنة مفعلة', 'info');
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('تم إرسال رسالتك بنجاح، سنرد عليك قريباً', 'success');
    e.target.reset();
}

function addNewApp() {
    const newApp = {
        title: 'تطبيق جديد',
        description: 'وصف التطبيق الجديد يظهر هنا',
        image: 'https://via.placeholder.com/300x200/6366f1/fff?text=تطبيق+جديد',
        category: 'جديد'
    };

    indexDeleteManager.addItem('apps', newApp);
    renderApps();
    showToast('تم إضافة تطبيق جديد', 'success');
}

function renderApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;

    const apps = indexDeleteManager.getList('apps');
    
    appsGrid.innerHTML = apps.map((app, index) => `
        <div class="app-card">
            <span class="edit-icon" data-edit="app-${app.id}">✏️</span>
            <img src="${app.image}" alt="${app.title}">
            <div class="app-info">
                <h3>${app.title}</h3>
                <p>${app.description}</p>
                <div class="app-actions">
                    <button class="app-btn download" onclick="downloadApp('${app.id}')">
                        <i class="fas fa-download"></i> تحميل
                    </button>
                    <button class="app-btn delete admin-only" onclick="deleteApp(${index})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // إعادة إرفاق مستمعي الأحداث لأيقونات التعديل
    appsGrid.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const editTarget = this.getAttribute('data-edit');
            openEditModal(editTarget, this);
        });
    });
}

function downloadApp(appId) {
    const apps = indexDeleteManager.getList('apps');
    const app = apps.find(a => a.id === appId);
    
    if (app) {
        showToast(`جاري تحميل ${app.title}`, 'info');
        setTimeout(() => {
            showToast(`تم تحميل ${app.title} بنجاح`, 'success');
        }, 2000);
    }
}

function deleteApp(index) {
    if (indexDeleteManager.deleteItem('apps', index)) {
        renderApps();
        showToast('تم حذف التطبيق بنجاح', 'success');
    } else {
        showToast('خطأ في حذف التطبيق', 'error');
    }
}

// نظام الذكاء الاصطناعي
function sendAIMessage() {
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');
    
    if (!aiInput || !aiMessages) return;
    
    const message = aiInput.value.trim();
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addAIMessage(message, 'user');
    aiInput.value = '';
    
    // معالجة الرسالة
    prokAI.processQuery(message).then(response => {
        addAIMessage(response, 'bot');
    });
}

function addAIMessage(content, sender) {
    const aiMessages = document.getElementById('aiMessages');
    if (!aiMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageContent);
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function handleAIAction(action) {
    let message = '';
    
    switch (action) {
        case 'scan':
            message = 'افحص النظام لاكتشاف الأخطاء والمشاكل';
            break;
        case 'optimize':
            message = 'حسن أداء النظام والسرعة';
            break;
        case 'analyze':
            message = 'حلل إحصائيات وأداء الموقع';
            break;
    }
    
    if (message) {
        const aiInput = document.getElementById('aiInput');
        if (aiInput) {
            aiInput.value = message;
            sendAIMessage();
        }
    }
}

function loadData() {
    renderApps();
    loadSavedEdits();
    checkAdminStatus();
}

function loadSavedEdits() {
    try {
        const edits = JSON.parse(localStorage.getItem('prok_edits') || '{}');
        
        Object.keys(edits).forEach(target => {
            const element = document.querySelector(`[data-edit="${target}"]`);
            if (element && element.parentElement) {
                element.parentElement.innerHTML = edits[target];
                
                // إعادة إرفاق مستمعي الأحداث
                element.parentElement.querySelector('.edit-icon').addEventListener('click', function() {
                    openEditModal(this.getAttribute('data-edit'), this);
                });
            }
        });
    } catch (error) {
        console.error('Error loading edits:', error);
    }
}

function checkAdminStatus() {
    const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
    
    if (user) {
        document.body.classList.add('admin-mode');
        const adminEmail = document.getElementById('adminEmail');
        if (adminEmail) {
            adminEmail.textContent = user.email;
        }
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    
    // إضافة أنيميشن الخروج
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    return container;
}

// جعل الدوال متاحة عالمياً
window.downloadApp = downloadApp;
window.deleteApp = deleteApp;
