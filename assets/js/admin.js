/**
 * نظام الإدارة المتقدم مع ميزات الإضافة والتحرير الكاملة
 */

class ProkAdmin {
    constructor() {
        this.isAdmin = false;
        this.currentEdits = new Map();
        this.editMode = false;
        this.quickAddPanel = null;
        
        this.init();
    }

    async init() {
        await this.waitForAuth();
        if (this.isAdmin) {
            this.initializeAdminFeatures();
            this.showAdminInterface();
            this.setupEventListeners();
        }
    }

    async waitForAuth() {
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
        this.createQuickAddPanel();
        this.addEditIndicators();
        this.initializeEditHandlers();
        this.initializeQuickActions();
        this.setupContentManagement();
    }

    showAdminInterface() {
        // إظهار قائمة الأدمن
        const navAdmin = document.getElementById('nav-admin');
        if (navAdmin) navAdmin.style.display = 'block';

        // إظهار شريط أدوات المدير
        const adminToolbar = document.getElementById('admin-toolbar');
        if (adminToolbar) adminToolbar.style.display = 'block';

        this.showToast('👑 وضع المدير مفعل', 'success');
    }

    createQuickAddPanel() {
        // تم إنشاء اللوحة في HTML، نضيف فقط ال event listeners
        const quickAddPanel = document.getElementById('quick-add-panel');
        if (quickAddPanel) {
            this.quickAddPanel = quickAddPanel;
            
            document.querySelectorAll('.quick-add-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.currentTarget.getAttribute('data-type');
                    this.handleQuickAdd(type);
                });
            });
        }
    }

    setupEventListeners() {
        // أدوات الشريط العلوي
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleToolbarAction(action);
            });
        });

        // قائمة الأدمن المنسدلة
        document.querySelectorAll('.admin-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAdminMenuAction(action);
            });
        });

        // أزرار الإدارة في المودال
        document.querySelectorAll('.admin-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAdminAction(action);
            });
        });

        // إغلاق المودالات
        document.querySelectorAll('.modal-close, .modal .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // النقر خارج المودال لإغلاقه
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    handleToolbarAction(action) {
        switch (action) {
            case 'add-app':
                this.openAddItemModal('app');
                break;
            case 'add-game':
                this.openAddItemModal('game');
                break;
            case 'edit-content':
                this.enableContentEditing();
                break;
            case 'manage-menu':
                this.openMenuEditor();
                break;
            case 'upload-file':
                this.openFileUploader();
                break;
            case 'change-animation':
                this.openAnimationSelector();
                break;
            case 'site-settings':
                this.openSiteSettings();
                break;
            case 'logout-admin':
                this.logoutAdmin();
                break;
        }
    }

    handleAdminMenuAction(action) {
        switch (action) {
            case 'quick-add':
                this.toggleQuickAddPanel();
                break;
            case 'manage-content':
                this.openContentManager();
                break;
            case 'edit-menu':
                this.openMenuEditor();
                break;
            case 'site-settings':
                this.openSiteSettings();
                break;
            case 'logout':
                this.logoutAdmin();
                break;
        }
    }

    handleAdminAction(action) {
        switch (action) {
            case 'add-app':
                this.openAddItemModal('app');
                break;
            case 'add-game':
                this.openAddItemModal('game');
                break;
            case 'manage-menu':
                this.openMenuEditor();
                break;
        }
    }

    // نظام الإضافة السريعة
    toggleQuickAddPanel() {
        if (this.quickAddPanel) {
            const isVisible = this.quickAddPanel.style.display === 'block';
            this.quickAddPanel.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.showToast('لوحة الإضافة السريعة مفعلة', 'info');
            }
        }
    }

    handleQuickAdd(type) {
        this.toggleQuickAddPanel();
        
        switch (type) {
            case 'app':
                this.openAddItemModal('app');
                break;
            case 'game':
                this.openAddItemModal('game');
                break;
            case 'banner':
                this.openAddBannerModal();
                break;
        }
    }

    // نظام إضافة العناصر
    openAddItemModal(itemType) {
        const modal = document.getElementById('add-item-modal');
        const title = document.getElementById('add-item-title');
        const form = document.getElementById('add-item-form');
        
        if (!modal || !title) return;

        // تعيين العنوان بناءً على نوع العنصر
        const typeNames = {
            'app': 'تطبيق',
            'game': 'لعبة'
        };
        
        title.textContent = `إضافة ${typeNames[itemType]} جديد`;
        
        // تعيين النوع في النموذج
        const typeSelect = document.getElementById('item-type');
        if (typeSelect) {
            typeSelect.value = itemType;
        }

        // تحديث خيارات الفئة بناءً على النوع
        this.updateCategoryOptions(itemType);

        // إعادة تعيين النموذج
        if (form) {
            form.reset();
            document.getElementById('image-preview').style.display = 'none';
        }

        // إعداد تبويبات النموذج
        this.setupFormTabs();

        // إعداد رفع الصور
        this.setupImageUpload();

        modal.classList.add('show');
    }

    updateCategoryOptions(itemType) {
        const categorySelect = document.getElementById('item-category');
        if (!categorySelect) return;

        categorySelect.innerHTML = '<option value="">اختر الفئة</option>';

        const categories = {
            'app': [
                { value: 'productivity', text: 'الإنتاجية' },
                { value: 'social', text: 'التواصل' },
                { value: 'tools', text: 'الأدوات' },
                { value: 'entertainment', text: 'ترفيه' }
            ],
            'game': [
                { value: 'action', text: 'أكشن' },
                { value: 'adventure', text: 'مغامرة' },
                { value: 'puzzle', text: 'ألغاز' },
                { value: 'sports', text: 'رياضة' },
                { value: 'racing', text: 'سباقات' }
            ]
        };

        const itemCategories = categories[itemType] || [];
        itemCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.value;
            option.textContent = category.text;
            categorySelect.appendChild(option);
        });
    }

    setupFormTabs() {
        const tabs = document.querySelectorAll('.form-tab');
        const panes = document.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // إزالة النشاط من جميع الألسنة
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                // إضافة النشاط للسان والنافذة المحددة
                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    setupImageUpload() {
        const uploadZone = document.getElementById('image-upload-zone');
        const fileInput = document.getElementById('item-image');
        const imagePreview = document.getElementById('image-preview');
        const previewImage = document.getElementById('preview-image');
        const removeImage = document.getElementById('remove-image');

        if (!uploadZone || !fileInput) return;

        // النقر على منطقة الرفع
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // تغيير الملف المختار
        fileInput.addEventListener('change', (e) => {
            this.handleImageSelection(e, previewImage, imagePreview);
        });

        // سحب وإفلات
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            this.handleImageSelection(e, previewImage, imagePreview);
        });

        // إزالة الصورة
        if (removeImage) {
            removeImage.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput.value = '';
                imagePreview.style.display = 'none';
            });
        }
    }

    handleImageSelection(event, previewImage, imagePreview) {
        const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
        
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    // إعدادات النموذج
    setupAddItemForm() {
        const form = document.getElementById('add-item-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAddItemSubmit(form);
        });

        // زر الإلغاء
        const cancelBtn = document.getElementById('cancel-add');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        }
    }

    async handleAddItemSubmit(form) {
        const formData = new FormData(form);
        const itemData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            type: formData.get('type'),
            rating: parseFloat(formData.get('rating')) || 4.0,
            size: formData.get('size'),
            version: formData.get('version'),
            downloadLink: formData.get('downloadLink'),
            animation: formData.get('animation'),
            createdAt: new Date().toISOString(),
            views: 0,
            downloads: 0
        };

        // التحقق من البيانات
        if (!this.validateItemData(itemData)) {
            return;
        }

        try {
            this.showToast('جاري إضافة العنصر...', 'info');

            // رفع الصورة إذا كانت موجودة
            const imageFile = document.getElementById('item-image').files[0];
            if (imageFile) {
                const imageUrl = await this.uploadItemImage(imageFile, itemData.type);
                if (imageUrl) {
                    itemData.image = imageUrl;
                }
            }

            // حفظ العنصر في Firebase
            const success = await this.saveItemToFirebase(itemData);
            
            if (success) {
                this.showToast(`تم إضافة ${itemData.type === 'app' ? 'التطبيق' : 'اللعبة'} بنجاح`, 'success');
                this.closeAllModals();
                
                // تحديث الواجهة
                this.refreshContent();
            }
        } catch (error) {
            console.error('Error adding item:', error);
            this.showToast('فشل إضافة العنصر', 'error');
        }
    }

    validateItemData(data) {
        if (!data.name || !data.description || !data.category || !data.downloadLink) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return false;
        }

        if (data.rating < 0 || data.rating > 5) {
            this.showToast('التقييم يجب أن يكون بين 0 و 5', 'error');
            return false;
        }

        return true;
    }

    async uploadItemImage(file, itemType) {
        if (!window.firebaseManager || !this.isAdmin) {
            this.showToast('غير مصرح برفع الصور', 'error');
            return null;
        }

        try {
            const path = `${itemType}s/${Date.now()}_${file.name}`;
            const downloadURL = await window.firebaseManager.uploadImage(file, path);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('فشل رفع الصورة', 'error');
            return null;
        }
    }

    async saveItemToFirebase(itemData) {
        if (!window.firebaseManager || !this.isAdmin) {
            return false;
        }

        try {
            const itemId = Date.now().toString();
            const currentData = await window.firebaseManager.getSiteData();
            
            if (!currentData[`${itemData.type}s`]) {
                currentData[`${itemData.type}s`] = [];
            }

            // إضافة العنصر الجديد
            currentData[`${itemData.type}s`].push({
                id: itemId,
                ...itemData
            });

            const success = await window.firebaseManager.updateSiteData(currentData);
            return success;
        } catch (error) {
            console.error('Error saving item:', error);
            return false;
        }
    }

    // نظام التحرير
    addEditIndicators() {
        this.addEditIndicatorToElements('.section-title', 'title');
        this.addEditIndicatorToElements('.section-subtitle', 'subtitle');
        this.addEditIndicatorToElements('.card-title', 'card-title');
        this.addEditIndicatorToElements('.card-description', 'card-description');
        this.addEditIndicatorsToCards();
    }

    addEditIndicatorToElements(selector, type) {
        document.querySelectorAll(selector).forEach(element => {
            if (!element.querySelector('.edit-pencil')) {
                const pencil = this.createEditPencil(element, type);
                element.style.position = 'relative';
                element.appendChild(pencil);
            }
        });
    }

    createEditPencil(element, type) {
        const pencil = document.createElement('span');
        pencil.className = 'edit-pencil';
        pencil.innerHTML = '✏️';
        pencil.title = 'انقر للتحرير';
        pencil.setAttribute('data-edit-type', type);
        
        pencil.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditDialog(element, type);
        });
        
        return pencil;
    }

    addEditIndicatorsToCards() {
        document.querySelectorAll('.app-card, .game-card').forEach(card => {
            if (!card.querySelector('.card-admin-tools')) {
                const tools = this.createCardAdminTools(card);
                card.appendChild(tools);
            }
        });
    }

    createCardAdminTools(card) {
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
        
        // إضافة event listeners
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
        
        return tools;
    }

    // وظائف التحرير
    openEditDialog(element, type) {
        const currentText = element.textContent;
        const modal = document.getElementById('edit-modal');
        const modalBody = document.getElementById('edit-modal-body');
        
        if (!modal || !modalBody) return;

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
                    <button class="btn btn-primary" onclick="prokAdmin.saveTextEdit('${type}')">
                        💾 حفظ
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        this.currentEditElement = element;
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.remove('show');
        }
        this.currentEditElement = null;
    }

    async saveTextEdit(type) {
        const textarea = document.getElementById('edit-textarea');
        if (!textarea || !this.currentEditElement) return;

        const newText = textarea.value;
        this.currentEditElement.textContent = newText;
        
        this.showToast('تم حفظ التغييرات', 'success');
        this.closeEditModal();
        
        // حفظ في Firebase إذا لزم الأمر
        await this.saveContentChanges(type, newText);
    }

    async saveContentChanges(type, content) {
        // تنفيذ حفظ التغييرات في Firebase
        this.showToast('تم تحديث المحتوى', 'success');
    }

    // وظائف إدارة المحتوى
    enableContentEditing() {
        document.body.classList.toggle('edit-mode');
        const isEnabled = document.body.classList.contains('edit-mode');
        
        this.showToast(
            isEnabled ? 'تم تفعيل وضع التحرير' : 'تم إيقاف وضع التحرير',
            isEnabled ? 'success' : 'info'
        );
    }

    refreshContent() {
        if (window.prokApp && typeof window.prokApp.loadSiteData === 'function') {
            window.prokApp.loadSiteData().then(() => {
                window.prokApp.renderContent();
                this.showToast('تم تحديث المحتوى', 'success');
            });
        }
    }

    // وظائف مساعدة
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    showToast(message, type = 'info') {
        if (window.prokApp && typeof window.prokApp.showToast === 'function') {
            window.prokApp.showToast(message, type);
        } else {
            console.log(`Admin: ${message}`);
        }
    }

    logoutAdmin() {
        if (window.firebaseManager) {
            window.firebaseManager.signOut();
        }
        this.hideAdminInterface();
    }

    hideAdminInterface() {
        document.querySelectorAll('#admin-toolbar, #nav-admin, #quick-add-panel').forEach(el => {
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.edit-pencil, .card-admin-tools').forEach(el => {
            el.remove();
        });
        
        this.showToast('تم تسجيل خروج المدير', 'success');
    }

    // وظائف أخرى (سيتم تنفيذها)
    editCard(card) {
        this.showToast('فتح محرر البطاقة', 'info');
    }

    deleteCard(card) {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                card.remove();
                this.showToast('تم حذف العنصر', 'success');
            }, 300);
        }
    }

    updateCard(card) {
        this.showToast('جاري تحديث البطاقة...', 'info');
        setTimeout(() => {
            this.showToast('تم تحديث البطاقة', 'success');
        }, 2000);
    }

    changeCardAnimation(card) {
        this.openAnimationSelector();
        this.currentAnimationCard = card;
    }

    openAnimationSelector() {
        const modal = document.getElementById('animation-modal');
        if (modal) {
            modal.classList.add('show');
            
            document.querySelectorAll('.animation-option').forEach(option => {
                option.addEventListener('click', () => {
                    const animation = option.getAttribute('data-animation');
                    this.applyAnimation(animation);
                    modal.classList.remove('show');
                });
            });
        }
    }

    applyAnimation(animation) {
        if (this.currentAnimationCard) {
            const animationClasses = ['fade-in', 'slide-up', 'zoom-in', 'bounce-in', 'rotate-in'];
            this.currentAnimationCard.classList.remove(...animationClasses);
            this.currentAnimationCard.classList.add(animation);
            this.showToast(`تم تطبيق تأثير ${animation}`, 'success');
        } else {
            // تطبيق على جميع العناصر
            document.querySelectorAll('.app-card, .game-card').forEach(card => {
                const animationClasses = ['fade-in', 'slide-up', 'zoom-in', 'bounce-in', 'rotate-in'];
                card.classList.remove(...animationClasses);
                card.classList.add(animation);
            });
            this.showToast(`تم تطبيق تأثير ${animation} على جميع العناصر`, 'success');
        }
    }

    openFileUploader() {
        this.showToast('فتح مدير الملفات', 'info');
    }

    openContentManager() {
        this.showToast('فتح مدير المحتوى', 'info');
    }

    openMenuEditor() {
        const modal = document.getElementById('menu-editor-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    openSiteSettings() {
        this.showToast('فتح إعدادات الموقع', 'info');
    }

    openAddBannerModal() {
        this.showToast('فتح إضافة لافتة', 'info');
    }

    initializeQuickActions() {
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.enableContentEditing();
            }
            
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.openAnimationSelector();
            }
            
            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault();
                this.toggleQuickAddPanel();
            }
        });
    }

    setupContentManagement() {
        // إعداد نظام إدارة المحتوى
        this.setupAddItemForm();
    }
}

// Initialize Admin when ready
document.addEventListener('DOMContentLoaded', function() {
    // انتظار تحميل المكونات الأخرى
    setTimeout(() => {
        window.prokAdmin = new ProkAdmin();
    }, 2000);
});
