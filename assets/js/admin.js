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
            this.showToast('فشل حفظ
