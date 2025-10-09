/* ===== Prok Enhanced Script ===== */
/* نظام متكامل مع Firebase، الذكاء الاصطناعي، نظام الفهرس والحذف */

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

/* ---------- تهيئة التطبيق الرئيسية ---------- */
function initApp() {
    // تهيئة Firebase
    initFirebase();
    
    // تهيئة العداد
    initVisitorCounter();
    
    // تهيئة الكاروسيل
    initCarousel();
    
    // تهيئة نظام الحماية
    initProtection();
    
    // تهيئة نظام الفهرس والحذف
    initIndexDeleteSystem();
    
    // تهيئة نظام التعديل
    initEditSystem();
    
    // تهيئة واجهة الأدمن
    initAdminInterface();
    
    // تحميل البيانات
    loadData();
}

/* ---------- نظام الفهرس والحذف ---------- */
class IndexDeleteManager {
    constructor() {
        this.lists = new Map();
        this.currentIndexes = new Map();
        this.deletedItems = new Map();
        this.history = [];
    }

    // إنشاء قائمة جديدة
    createList(listName, items = []) {
        this.lists.set(listName, items);
        this.currentIndexes.set(listName, 0);
        this.deletedItems.set(listName, []);
        return this.getList(listName);
    }

    // الحصول على القائمة
    getList(listName) {
        return this.lists.get(listName) || [];
    }

    // الحصول على العنصر الحالي
    getCurrent(listName) {
        const list = this.getList(listName);
        const currentIndex = this.currentIndexes.get(listName) || 0;
        return list[currentIndex] || null;
    }

    // الانتقال للعنصر التالي
    next(listName) {
        const list = this.getList(listName);
        if (list.length === 0) return null;

        let currentIndex = this.currentIndexes.get(listName) || 0;
        currentIndex = (currentIndex + 1) % list.length;
        this.currentIndexes.set(listName, currentIndex);
        
        this.addToHistory('NEXT', { listName, newIndex: currentIndex });
        return this.getCurrent(listName);
    }

    // الانتقال للعنصر السابق
    prev(listName) {
        const list = this.getList(listName);
        if (list.length === 0) return null;

        let currentIndex = this.currentIndexes.get(listName) || 0;
        currentIndex = (currentIndex - 1 + list.length) % list.length;
        this.currentIndexes.set(listName, currentIndex);
        
        this.addToHistory('PREV', { listName, newIndex: currentIndex });
        return this.getCurrent(listName);
    }

    // الانتقال إلى index محدد
    goTo(listName, index) {
        const list = this.getList(listName);
        if (index < 0 || index >= list.length) return null;

        this.currentIndexes.set(listName, index);
        this.addToHistory('GOTO', { listName, newIndex: index });
        return this.getCurrent(listName);
    }

    // الحصول على الفهرس الحالي
    getCurrentIndex(listName) {
        return this.currentIndexes.get(listName) || 0;
    }

    // الحصول على طول القائمة
    getLength(listName) {
        return this.getList(listName).length;
    }

    // إضافة عنصر جديد
    addItem(listName, item) {
        const list = this.getList(listName);
        list.push({
            id: this.generateId(),
            ...item,
            createdAt: new Date().toISOString()
        });
        this.lists.set(listName, list);
        
        this.addToHistory('ADD', { listName, item });
        this.saveToStorage(listName);
        return list;
    }

    // حذف عنصر
    deleteItem(listName, index) {
        const list = this.getList(listName);
        if (index < 0 || index >= list.length) return false;

        const deletedItem = list[index];
        
        // حفظ العنصر المحذوف
        const deletedList = this.deletedItems.get(listName) || [];
        deletedList.push({
            ...deletedItem,
            deletedAt: new Date().toISOString(),
            originalIndex: index
        });
        this.deletedItems.set(listName, deletedList);

        // الحذف الفعلي
        list.splice(index, 1);
        this.lists.set(listName, list);

        // تعديل الفهرس الحالي إذا لزم الأمر
        const currentIndex = this.currentIndexes.get(listName) || 0;
        if (currentIndex >= list.length) {
            this.currentIndexes.set(listName, Math.max(0, list.length - 1));
        }

        this.addToHistory('DELETE', { listName, index, deletedItem });
        this.saveToStorage(listName);
        return true;
    }

    // استعادة العنصر المحذوف
    restoreItem(listName, itemId) {
        const deletedList = this.deletedItems.get(listName) || [];
        const itemIndex = deletedList.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return false;

        const itemToRestore = deletedList[itemIndex];
        const list = this.getList(listName);
        
        // إعادة الإضافة في الموضع الأصلي إن أمكن
        const insertIndex = Math.min(itemToRestore.originalIndex, list.length);
        list.splice(insertIndex, 0, itemToRestore);
        
        // إزالة من قائمة المحذوفات
        deletedList.splice(itemIndex, 1);
        
        this.lists.set(listName, list);
        this.deletedItems.set(listName, deletedList);
        
        this.addToHistory('RESTORE', { listName, item: itemToRestore });
        this.saveToStorage(listName);
        return true;
    }

    // البحث في القائمة
    search(listName, query, fields = ['title', 'description']) {
        const list = this.getList(listName);
        const lowerQuery = query.toLowerCase();
        
        return list.filter(item => 
            fields.some(field => 
                item[field] && item[field].toLowerCase().includes(lowerQuery)
            )
        );
    }

    // ترتيب القائمة
    sort(listName, field, ascending = true) {
        const list = this.getList(listName);
        list.sort((a, b) => {
            const aVal = a[field] || '';
            const bVal = b[field] || '';
            
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
        
        this.lists.set(listName, list);
        this.addToHistory('SORT', { listName, field, ascending });
        this.saveToStorage(listName);
        return list;
    }

    // توليد معرف فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // إضافة إلى السجل
    addToHistory(action, data) {
        this.history.push({
            action,
            data,
            timestamp: new Date().toISOString()
        });
        
        // الحفاظ على آخر 100 إجراء فقط
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
        }
    }

    // الحفظ في التخزين المحلي
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

    // التحميل من التخزين المحلي
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

// إنشاء مدير الفهرس والحذف العالمي
const indexDeleteManager = new IndexDeleteManager();

/* ---------- تهيئة نظام الفهرس والحذف ---------- */
function initIndexDeleteSystem() {
    // تهيئة القوائم الافتراضية
    const defaultApps = [
        {
            id: '1',
            title: 'تطبيق الإنتاجية',
            description: 'أداة متكاملة لإدارة المهام والوقت',
            image: 'https://via.placeholder.com/280x180/6366f1/fff?text=تطبيق+الإنتاجية',
            category: 'أدوات',
            rating: 4.5
        },
        {
            id: '2',
            title: 'مدير الملفات',
            description: 'تنظيم الملفات والوثائق بذكاء',
            image: 'https://via.placeholder.com/280x180/ec4899/fff?text=مدير+الملفات',
            category: 'أدوات',
            rating: 4.2
        },
        {
            id: '3',
            title: 'مشغل الوسائط',
            description: 'تشغيل الفيديو والصوت بجودة عالية',
            image: 'https://via.placeholder.com/280x180/10b981/fff?text=مشغل+الوسائط',
            category: 'ترفيه',
            rating: 4.7
        }
    ];

    indexDeleteManager.createList('apps', defaultApps);
    indexDeleteManager.createList('carousel', [0, 1, 2]);
    
    // تحميل البيانات المحفوظة
    indexDeleteManager.loadFromStorage('apps');
}

/* ---------- Firebase Authentication ---------- */
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase not loaded');
        return;
    }

    try {
        firebase.initializeApp({
            apiKey: "AIzaSyDummyKeyForDemoPurposesOnly123",
            authDomain: "prok-demo.firebaseapp.com",
            projectId: "prok-demo",
            storageBucket: "prok-demo.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:123456789:web:abcdef123456"
        });

        // مراقبة حالة المصادقة
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                handleAdminLogin(user);
            } else {
                handleAdminLogout();
            }
        });
    } catch (error) {
        console.warn('Firebase initialization error:', error);
    }
}

/* ---------- معالجة تسجيل دخول الأدمن ---------- */
function handleAdminLogin(user) {
    document.body.classList.add('admin-mode');
    
    // تحديث واجهة المستخدم
    const adminBtn = document.getElementById('adminBtn');
    const adminEmail = document.getElementById('adminEmail');
    
    if (adminBtn) adminBtn.textContent = 'لوحة التحكم';
    if (adminEmail) adminEmail.textContent = user.email;
    
    // إظهار عناصر الأدمن
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'flex';
    });
    
    showToast(`مرحباً ${user.email}`, 'success');
}

/* ---------- معالجة تسجيل خروج الأدمن ---------- */
function handleAdminLogout() {
    document.body.classList.remove('admin-mode');
    
    // تحديث واجهة المستخدم
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.textContent = 'تسجيل الدخول';
    
    // إخفاء عناصر الأدمن
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'none';
    });
}

/* ---------- عداد الزوار ---------- */
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

/* ---------- نظام الكاروسيل ---------- */
function initCarousel() {
    const track = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideWidth = slides[0].clientWidth;
    const totalSlides = slides.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // إضافة النقاط إذا لم تكن موجودة
    if (!document.querySelector('.carousel-dots')) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
        
        track.parentNode.appendChild(dotsContainer);
    }

    // إضافة الأحداث
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // التمرير التلقائي
    let autoSlide = setInterval(nextSlide, 5000);

    // إيقاف التمرير التلقائي عند التمرير
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // تحديث عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        currentSlideWidth = slides[0].clientWidth;
        updateCarousel();
    });
}

/* ---------- نظام الحماية ---------- */
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
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            showProtectionAlert();
        }
    });

    // حماية عند تبديل النوافذ
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
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

/* ---------- نظام التعديل ---------- */
function initEditSystem() {
    // إضافة مستمعي الأحداث لأيقونات التعديل
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-icon')) {
            const editTarget = e.target.getAttribute('data-edit');
            openEditModal(editTarget, e.target);
        }
    });

    // نافذة التعديل
    const editModal = document.getElementById('editModal');
    const saveEdit = document.getElementById('saveEdit');
    const cancelEdit = document.getElementById('cancelEdit');

    if (saveEdit) {
        saveEdit.addEventListener('click', handleSaveEdit);
    }

    if (cancelEdit) {
        cancelEdit.addEventListener('click', () => {
            if (editModal) editModal.classList.remove('show');
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

    // إغلاق النافذة
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('show');
    
    showToast('تم حفظ التغييرات بنجاح', 'success');
    
    // حفظ في التخزين المحلي
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

/* ---------- واجهة الأدمن ---------- */
function initAdminInterface() {
    // زر إضافة تطبيق
    const addAppBtn = document.getElementById('addAppBtn');
    if (addAppBtn) {
        addAppBtn.addEventListener('click', addNewApp);
    }

    // زر تسجيل الدخول
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', handleAdminButtonClick);
    }

    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleAdminButtonClick() {
    if (document.body.classList.contains('admin-mode')) {
        // إذا كان في وضع الأدمن، انتقل إلى لوحة التحكم
        window.location.href = 'admin.html';
    } else {
        // إذا لم يكن مسجلاً، اعرض نافذة تسجيل الدخول
        showAdminLoginModal();
    }
}

function showAdminLoginModal() {
    // يمكن تنفيذ نافذة تسجيل الدخول المخصصة هنا
    // أو استخدام Firebase UI
    if (typeof firebase !== 'undefined') {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                showToast('تم تسجيل الدخول بنجاح', 'success');
            })
            .catch((error) => {
                showToast('فشل تسجيل الدخول', 'error');
            });
    }
}

function handleLogout() {
    if (typeof firebase !== 'undefined') {
        firebase.auth().signOut()
            .then(() => {
                showToast('تم تسجيل الخروج', 'info');
            })
            .catch((error) => {
                showToast('خطأ في تسجيل الخروج', 'error');
            });
    }
}

function addNewApp() {
    const newApp = {
        title: 'تطبيق جديد',
        description: 'وصف التطبيق الجديد',
        image: 'https://via.placeholder.com/280x180/6366f1/fff?text=تطبيق+جديد',
        category: 'جديد',
        rating: 0
    };

    indexDeleteManager.addItem('apps', newApp);
    renderApps();
    showToast('تم إضافة تطبيق جديد', 'success');
}

/* ---------- عرض التطبيقات ---------- */
function renderApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;

    const apps = indexDeleteManager.getList('apps');
    
    appsGrid.innerHTML = apps.map((app, index) => `
        <div class="card">
            <span class="edit-icon" data-edit="app-${app.id}">✏️</span>
            <img src="${app.image}" alt="${app.title}">
            <div class="app-info">
                <h3>${app.title}</h3>
                <p>${app.description}</p>
                <div class="app-actions">
                    <button class="app-btn download" data-id="${app.id}">
                        تحميل
                    </button>
                    <button class="app-btn delete admin-only" data-index="${index}">
                        حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // إضافة مستمعي الأحداث
    appsGrid.querySelectorAll('.app-btn.download').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            downloadApp(appId);
        });
    });

    appsGrid.querySelectorAll('.app-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const appIndex = parseInt(this.getAttribute('data-index'));
            deleteApp(appIndex);
        });
    });
}

function downloadApp(appId) {
    const apps = indexDeleteManager.getList('apps');
    const app = apps.find(a => a.id === appId);
    
    if (app) {
        showToast(`جاري تحميل ${app.title}`, 'info');
        // محاكاة التحميل
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

/* ---------- نظام الإشعارات ---------- */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // إزالة تلقائية بعد 3 ثوان
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    return container;
}

/* ---------- تحميل البيانات ---------- */
function loadData() {
    // تحميل التطبيقات
    renderApps();
    
    // تحميل التعديلات المحفوظة
    loadSavedEdits();
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

/* ---------- AutoFix Scanner ---------- */
window.ProkAutoFix = {
    scan: function() {
        const issues = [];
        
        // فحص SEO
        if (!document.querySelector('h1')) {
            issues.push({ kind: 'seo', desc: 'لا يوجد عنوان H1', priority: 'high' });
        }
        
        if (!document.querySelector('meta[name="description"]')) {
            issues.push({ kind: 'seo', desc: 'لا يوجد وصف meta', priority: 'medium' });
        }
        
        // فحص إمكانية الوصول
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt || img.alt.trim() === '') {
                issues.push({ 
                    kind: 'a11y', 
                    desc: 'صورة بدون نص بديل', 
                    selector: getSelector(img),
                    priority: 'medium'
                });
            }
        });
        
        // فحص الأداء
        const largeImages = document.querySelectorAll('img[src*="placeholder"]');
        if (largeImages.length > 3) {
            issues.push({ 
                kind: 'performance', 
                desc: 'عدد كبير من الصور الكبيرة', 
                priority: 'low'
            });
        }
        
        return issues;
    },
    
    fix: function(issues) {
        const fixes = [];
        
        issues.forEach(issue => {
            if (issue.kind === 'seo' && issue.desc.includes('H1')) {
                const h1 = document.createElement('h1');
                h1.textContent = 'عنوان الصفحة الرئيسي';
                document.querySelector('main').prepend(h1);
                fixes.push('تم إضافة عنوان H1');
            }
        });
        
        return fixes;
    }
};

// دالة مساعدة للحصول على محدد العنصر
function getSelector(el) {
    if (el.id) return '#' + el.id;
    
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.className) {
            selector += '.' + el.className.split(' ')[0];
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
}

// إضافة أنماط CSS للإشعارات
const toastStyles = `
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.toast {
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    color: white;
    font-weight: 600;
    animation: slideIn 0.3s ease;
}

.toast.success { background: #2ed573; }
.toast.error { background: #ff4757; }
.toast.warning { background: #ffa502; }
.toast.info { background: #00ffe7; color: #012; }

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// إضافة الأنماط إلى المستند
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// تصدير المدير للاستخدام العالمي
window.indexDeleteManager = indexDeleteManager;
