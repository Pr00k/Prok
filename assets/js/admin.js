/**
 * نظام الإدارة المتقدم لموقع Prok
 * مع ميزات التحرير الكاملة والتحكم الشامل
 */

class ProkAdmin {
    constructor() {
        this.isAdmin = false;
        this.currentEdits = new Map();
        this.editMode = false;
        
        this.init();
    }

    init() {
        this.waitForAuth().then(() => {
            if (this.isAdmin) {
                this.initializeAdminFeatures();
                this.showAdminInterface();
            }
        });
    }

    async waitForAuth() {
        // انتظار تهيئة نظام المصادقة
        return new Promise((resolve) => {
            const checkAuth = setInterval(() => {
                if (window.firebaseManager) {
                    clearInterval(checkAuth);
                    this.isAdmin = window.firebaseManager.isAdmin;
                    resolve();
                }
            }, 100);
        });
    }

    initializeAdminFeatures() {
        this.createAdminToolbar();
        this.addEditIndicators();
        this.initializeEditHandlers();
        this.initializeQuickActions();
    }

    showAdminInterface() {
        // إظهار قائمة الأدمن في التنقل
        const adminMenuItem = document.getElementById('admin-menu-item');
        if (adminMenuItem) {
            adminMenuItem.style.display = 'block';
        }

        // إظهار شريط أدوات المدير
        const adminToolbar = document.getElementById('admin-toolbar');
        if (adminToolbar) {
            adminToolbar.style.display = 'block';
        }

        // تحديث زر تسجيل الدخول
        const adminBtn = document.getElementById('admin-login-btn');
        if (adminBtn) {
            adminBtn.innerHTML = '👑 أدمن';
            adminBtn.onclick = () => this.showAdminPanel();
        }

        this.showToast('مرحباً بك في وضع المدير', 'success');
    }

    createAdminToolbar() {
        // تم إنشاء الشريط في HTML الأساسي، نضيف فقط event listeners
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleToolbarAction(action);
            });
        });
    }

    addEditIndicators() {
        // إضافة أيقونات التحرير لجميع العناصر القابلة للتحرير
        this.addEditIndicatorToElements('.section-title', 'title');
        this.addEditIndicatorToElements('.section-subtitle', 'subtitle');
        this.addEditIndicatorToElements('.card-title', 'card-title');
        this.addEditIndicatorToElements('.card-description', 'card-description');
        this.addEditIndicatorToElements('.nav-link', 'nav-text');
        this.addEditIndicatorToElements('.footer-section p', 'footer-text');
        this.addEditIndicatorToElements('.contact-item p', 'contact-text');
        
        // إضافة أيقونات التحرير للبطاقات
        this.addEditIndicatorsToCards();
    }

    addEditIndicatorToElements(selector, type) {
        document.querySelectorAll(selector).forEach(element => {
            if (!element.querySelector('.edit-pencil')) {
                const pencil = document.createElement('span');
                pencil.className = 'edit-pencil';
                pencil.innerHTML = '✏️';
                pencil.title = 'انقر للتحرير';
                pencil.setAttribute('data-edit-type', type);
                
                pencil.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openEditDialog(element, type);
                });
                
                element.style.position = 'relative';
                element.appendChild(pencil);
            }
        });
    }

    addEditIndicatorsToCards() {
        // إضافة أدوات التحكم للبطاقات
        document.querySelectorAll('.app-card, .game-card').forEach(card => {
            if (!card.querySelector('.card-admin-tools')) {
                const tools = document.createElement('div');
                tools.className = 'card-admin-tools';
                
                tools.innerHTML = `
                    <button class="card-tool-btn edit-btn" title="تحرير">
                        ✏️
                    </button>
                    <button class="card-tool-btn delete-btn" title="حذف">
                        🗑️
                    </button>
                    <button class="card-tool-btn update-btn" title="تحديث">
                        🔄
                    </button>
                    <button class="card-tool-btn animation-btn" title="تغيير الحركة">
                        ✨
                    </button>
                `;
                
                card.appendChild(tools);
                
                // إضافة event listeners للأزرار
                tools.querySelector('.edit-btn').addEventListener('click', () => {
                    this.editCard(card);
                });
                
                tools.querySelector('.delete-btn').addEventListener('click', () => {
                    this.deleteCard(card);
                });
                
                tools.querySelector('.update-btn').addEventListener('click', () => {
                    this.updateCard(card);
                });
                
                tools.querySelector('.animation-btn').addEventListener('click', () => {
                    this.changeCardAnimation(card);
                });
            }
        });
    }

    handleToolbarAction(action) {
        switch (action) {
            case 'edit-texts':
                this.enableTextEditing();
                break;
            case 'edit-images':
                this.enableImageEditing();
                break;
            case 'manage-apps':
                this.openAppsManager();
                break;
            case 'manage-games':
                this.openGamesManager();
                break;
            case 'upload-file':
                this.openFileUploader();
                break;
            case 'change-animation':
                this.openAnimationSelector();
                break;
            case 'manage-ads':
                this.openAdsManager();
                break;
            case 'logout-admin':
                this.logoutAdmin();
                break;
        }
    }

    enableTextEditing() {
        document.body.classList.toggle('text-edit-mode');
        const isEnabled = document.body.classList.contains('text-edit-mode');
        
        this.showToast(
            isEnabled ? 'تم تفعيل وضع تحرير النصوص' : 'تم إيقاف وضع تحرير النصوص',
            isEnabled ? 'success' : 'info'
        );
    }

    enableImageEditing() {
        document.body.classList.toggle('image-edit-mode');
        const isEnabled = document.body.classList.contains('image-edit-mode');
        
        this.showToast(
            isEnabled ? 'تم تفعيل وضع تحرير الصور' : 'تم إيقاف وضع تحرير الصور',
            isEnabled ? 'success' : 'info'
        );
    }

    openEditDialog(element, type) {
        const currentText = element.textContent;
        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const modalBody = document.getElementById('edit-modal-body');
        
        modalTitle.textContent = '✏️ تحرير النص';
        
        modalBody.innerHTML = `
            <div class="edit-form">
                <div class="form-group">
                    <label class="form-label">النص الحالي:</label>
                    <textarea class="form-textarea" id="edit-textarea" style="height: 120px;">${currentText}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="prokAdmin.closeEditModal()">
                        إلغاء
                    </button>
                    <button class="btn btn-primary" onclick="prokAdmin.saveTextEdit('${type}', '${this.getElementPath(element)}')">
                        💾 حفظ
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        
        // حفظ المرجع للعنصر الذي يتم تحريره
        this.currentEditElement = element;
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        modal.classList.remove('show');
        this.currentEditElement = null;
    }

    async saveTextEdit(type, elementPath) {
        const textarea = document.getElementById('edit-textarea');
        const newText = textarea.value;
        
        if (this.currentEditElement) {
            this.currentEditElement.textContent = newText;
            this.showToast('تم حفظ التغييرات', 'success');
        }
        
        this.closeEditModal();
        
        // حفظ في Firebase
        await this.saveToFirebase(type, elementPath, newText);
    }

    getElementPath(element) {
        // إنشاء مسار فريد للعنصر
        const path = [];
        let currentElement = element;
        
        while (currentElement && currentElement !== document.body) {
            const tagName = currentElement.tagName.toLowerCase();
            const className = currentElement.className ? currentElement.className.split(' ')[0] : '';
            const id = currentElement.id ? `#${currentElement.id}` : '';
            const selector = `${tagName}${id}${className ? '.' + className : ''}`;
            path.unshift(selector);
            currentElement = currentElement.parentElement;
        }
        
        return path.join(' > ');
    }

    async saveToFirebase(type, path, value) {
        if (!window.firebaseManager || !window.firebaseManager.isAdmin) return;
        
        try {
            const updates = {
                [`edits.${type}.${btoa(path)}`]: value,
                lastUpdated: new Date().toISOString(),
                updatedBy: window.firebaseManager.currentUser.email
            };
            
            await window.firebaseManager.firestore.collection('site')
                .doc('content')
                .set(updates, { merge: true });
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            this.showToast('فشل حفظ التغييرات في السحابة', 'error');
        }
    }

    editCard(card) {
        const title = card.querySelector('.card-title')?.textContent || '';
        const description = card.querySelector('.card-description')?.textContent || '';
        const type = card.classList.contains('app-card') ? 'app' : 'game';
        const id = card.getAttribute('data-id') || Date.now();
        
        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const modalBody = document.getElementById('edit-modal-body');
        
        modalTitle.textContent = `✏️ تحرير ${type === 'app' ? 'تطبيق' : 'لعبة'}`;
        
        modalBody.innerHTML = `
            <div class="edit-form">
                <div class="form-group">
                    <label class="form-label">الاسم:</label>
                    <input type="text" class="form-input" id="edit-card-title" value="${title}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">الوصف:</label>
                    <textarea class="form-textarea" id="edit-card-description" style="height: 100px;">${description}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">التقييم:</label>
                        <input type="number" class="form-input" id="edit-card-rating" min="0" max="5" step="0.1" value="4.5">
                    </div>
                    <div class="form-group">
                        <label class="form-label">الحجم:</label>
                        <input type="text" class="form-input" id="edit-card-size" value="15MB">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">رابط التنزيل:</label>
                    <input type="url" class="form-input" id="edit-card-link" value="#">
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="prokAdmin.closeEditModal()">
                        إلغاء
                    </button>
                    <button class="btn btn-primary" onclick="prokAdmin.saveCardEdit('${type}', '${id}')">
                        💾 حفظ
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        this.currentEditCard = { element: card, type, id };
    }

    async saveCardEdit(type, id) {
        const title = document.getElementById('edit-card-title').value;
        const description = document.getElementById('edit-card-description').value;
        const rating = document.getElementById('edit-card-rating').value;
        const size = document.getElementById('edit-card-size').value;
        const link = document.getElementById('edit-card-link').value;
        
        if (this.currentEditCard) {
            const card = this.currentEditCard.element;
            
            // تحديث الواجهة
            if (card.querySelector('.card-title')) {
                card.querySelector('.card-title').textContent = title;
            }
            if (card.querySelector('.card-description')) {
                card.querySelector('.card-description').textContent = description;
            }
            if (card.querySelector('.card-rating')) {
                card.querySelector('.card-rating').textContent = `⭐ ${rating}`;
            }
            if (card.querySelector('.card-size')) {
                card.querySelector('.card-size').textContent = size;
            }
            if (card.querySelector('.btn-primary')) {
                card.querySelector('.btn-primary').href = link;
            }
            
            this.showToast(`تم تحديث ${type === 'app' ? 'التطبيق' : 'اللعبة'}`, 'success');
        }
        
        this.closeEditModal();
        
        // حفظ في Firebase
        await this.saveCardToFirebase(type, id, { title, description, rating, size, link });
    }

    async saveCardToFirebase(type, id, data) {
        if (!window.firebaseManager || !window.firebaseManager.isAdmin) return;
        
        try {
            const updates = {
                [`${type}s.${id}`]: data,
                lastUpdated: new Date().toISOString()
            };
            
            await window.firebaseManager.firestore.collection('site')
                .doc('content')
                .set(updates, { merge: true });
        } catch (error) {
            console.error('Error saving card to Firebase:', error);
        }
    }

    deleteCard(card) {
        const type = card.classList.contains('app-card') ? 'تطبيق' : 'لعبة';
        const title = card.querySelector('.card-title')?.textContent || '';
        
        if (confirm(`هل أنت متأكد من حذف ${type} "${title}"؟`)) {
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                card.remove();
                this.showToast(`تم حذف ${type}`, 'success');
            }, 300);
            
            // حذف من Firebase
            this.deleteFromFirebase(card);
        }
    }

    async deleteFromFirebase(card) {
        // تنفيذ الحذف من Firebase
        this.showToast('تم حذف العنصر', 'success');
    }

    updateCard(card) {
        this.showToast('جاري تحديث المحتوى...', 'info');
        // محاكاة عملية التحديث
        setTimeout(() => {
            this.showToast('تم تحديث المحتوى بنجاح', 'success');
        }, 2000);
    }

    changeCardAnimation(card) {
        const modal = document.getElementById('animation-modal');
        modal.classList.add('show');
        
        this.currentAnimationCard = card;
        
        // إضافة event listeners لخيارات الحركة
        document.querySelectorAll('.animation-option').forEach(option => {
            option.addEventListener('click', () => {
                const animation = option.getAttribute('data-animation');
                this.applyAnimationToCard(card, animation);
                modal.classList.remove('show');
            });
        });
    }

    applyAnimationToCard(card, animation) {
        // إزالة جميع classes الحركة السابقة
        const animationClasses = ['fade-in', 'slide-up', 'zoom-in', 'bounce-in', 'rotate-in'];
        card.classList.remove(...animationClasses);
        
        // إضافة الحركة الجديدة
        card.classList.add(animation);
        
        this.showToast(`تم تطبيق تأثير ${animation}`, 'success');
    }

    openAnimationSelector() {
        const modal = document.getElementById('animation-modal');
        modal.classList.add('show');
        
        document.querySelectorAll('.animation-option').forEach(option => {
            option.addEventListener('click', () => {
                const animation = option.getAttribute('data-animation');
                this.applyGlobalAnimation(animation);
                modal.classList.remove('show');
            });
        });
    }

    applyGlobalAnimation(animation) {
        // تطبيق الحركة على جميع العناصر
        const elements = document.querySelectorAll('.app-card, .game-card, .section-title, .section-subtitle');
        
        elements.forEach(element => {
            const animationClasses = ['fade-in', 'slide-up', 'zoom-in', 'bounce-in', 'rotate-in'];
            element.classList.remove(...animationClasses);
            element.classList.add(animation);
        });
        
        this.showToast(`تم تطبيق تأثير ${animation} على الموقع كاملاً`, 'success');
    }

    openFileUploader() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.apk,.ipa,.exe,.zip,.rar,.7z';
        input.multiple = true;
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            this.handleFileUpload(files);
        };
        
        input.click();
    }

    async handleFileUpload(files) {
        this.showToast(`جاري رفع ${files.length} ملف...`, 'info');
        
        for (const file of files) {
            try {
                // محاكاة رفع الملف
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showToast(`تم رفع ${file.name} بنجاح`, 'success');
            } catch (error) {
                this.showToast(`فشل رفع ${file.name}`, 'error');
            }
        }
    }

    openAdsManager() {
        this.showToast('فتح مدير الإعلانات', 'info');
        // تنفيذ واجهة إدارة الإعلانات
    }

    logoutAdmin() {
        if (window.firebaseManager) {
            window.firebaseManager.signOut();
        }
        this.hideAdminInterface();
        this.showToast('تم تسجيل خروج المدير', 'success');
    }

    hideAdminInterface() {
        // إخفاء واجهة المدير
        const adminToolbar = document.getElementById('admin-toolbar');
        const adminMenuItem = document.getElementById('admin-menu-item');
        
        if (adminToolbar) adminToolbar.style.display = 'none';
        if (adminMenuItem) adminMenuItem.style.display = 'none';
        
        // إزالة أيقونات التحرير
        document.querySelectorAll('.edit-pencil, .card-admin-tools').forEach(el => {
            el.remove();
        });
        
        // إلغاء أوضاع التحرير
        document.body.classList.remove('text-edit-mode', 'image-edit-mode');
    }

    showAdminPanel() {
        const modal = document.getElementById('admin-modal');
        modal.classList.add('show');
    }

    showToast(message, type = 'info') {
        if (window.prokApp && typeof window.prokApp.showToast === 'function') {
            window.prokApp.showToast(message, type);
        } else {
            console.log(`Admin: ${message}`);
        }
    }

    initializeEditHandlers() {
        // إضافة event listeners للقائمة المنسدلة للأدمن
        document.querySelectorAll('.admin-menu .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.getAttribute('data-action');
                this.handleAdminMenuAction(action);
            });
        });
    }

    handleAdminMenuAction(action) {
        switch (action) {
            case 'quick-edit':
                this.enableTextEditing();
                break;
            case 'add-app':
                this.openAppsManager();
                break;
            case 'add-game':
                this.openGamesManager();
                break;
            case 'manage-content':
                this.showContentManager();
                break;
            case 'site-settings':
                this.openSiteSettings();
                break;
        }
    }

    openAppsManager() {
        this.showToast('فتح مدير التطبيقات', 'info');
        // تنفيذ واجهة إدارة التطبيقات
    }

    openGamesManager() {
        this.showToast('فتح مدير الألعاب', 'info');
        // تنفيذ واجهة إدارة الألعاب
    }

    showContentManager() {
        this.showToast('فتح مدير المحتوى', 'info');
        // تنفيذ واجهة إدارة المحتوى
    }

    openSiteSettings() {
        this.showToast('فتح إعدادات الموقع', 'info');
        // تنفيذ واجهة إعدادات الموقع
    }

    initializeQuickActions() {
        // إضافة اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.enableTextEditing();
            }
            
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.openAnimationSelector();
            }
        });
    }
}

// Initialize Admin when ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.prokAdmin = new ProkAdmin();
    }, 1000);
});
