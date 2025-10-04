/**
 * Enhanced Admin JavaScript for Prok
 * Advanced admin panel with comprehensive editing capabilities
 */

class ProkAdmin {
    constructor() {
        this.currentEdits = new Map();
        this.uploadQueue = [];
        this.isUploading = false;
        
        this.init();
    }

    init() {
        this.initializeAdminUI();
        this.initializeEventListeners();
        this.initializeEditHandlers();
    }

    initializeAdminUI() {
        // Create admin overlay
        this.createAdminOverlay();
        
        // Initialize modals
        this.initializeModals();
        
        // Setup real-time updates
        this.setupRealTimeUpdates();
    }

    initializeEventListeners() {
        // Admin toolbar actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tool-btn')) {
                const action = e.target.getAttribute('data-action');
                this.handleAdminAction(action);
            }
        });

        // Save changes on Ctrl+S
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveAllChanges();
            }
        });

        // Auto-save every 2 minutes
        setInterval(() => {
            if (this.currentEdits.size > 0) {
                this.autoSave();
            }
        }, 120000);
    }

    initializeEditHandlers() {
        // Text editing
        this.initializeTextEditing();
        
        // Image editing
        this.initializeImageEditing();
        
        // Sortable lists
        this.initializeSortableLists();
        
        // Bulk operations
        this.initializeBulkOperations();
    }

    createAdminOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'admin-overlay';
        overlay.innerHTML = `
            <div class="admin-status-bar">
                <div class="status-info">
                    <span class="status-indicator"></span>
                    <span class="status-text">وضع التحرير نشط</span>
                </div>
                <div class="status-actions">
                    <button class="btn btn-sm btn-primary" id="admin-save-all">
                        💾 حفظ الكل
                    </button>
                    <button class="btn btn-sm btn-secondary" id="admin-preview">
                        👁️ معاينة
                    </button>
                    <button class="btn btn-sm btn-danger" id="admin-exit">
                        🚪 خروج
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    initializeModals() {
        // Create modal containers for different edit types
        this.createEditModal('banners', 'تحرير اللافتات');
        this.createEditModal('apps', 'تحرير التطبيقات');
        this.createEditModal('games', 'تحرير الألعاب');
        this.createEditModal('content', 'تحرير المحتوى العام');
    }

    createEditModal(type, title) {
        const modal = document.createElement('div');
        modal.id = `edit-${type}-modal`;
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-modal-content">
                <div class="edit-modal-header">
                    <h3 class="edit-modal-title">${title}</h3>
                    <button class="edit-modal-close">&times;</button>
                </div>
                <div class="edit-modal-body" id="${type}-edit-content">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal event
        modal.querySelector('.edit-modal-close').addEventListener('click', () => {
            this.closeModal(type);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(type);
            }
        });
    }

    handleAdminAction(action) {
        switch (action) {
            case 'edit-banners':
                this.openBannersEditor();
                break;
            case 'edit-apps':
                this.openAppsEditor();
                break;
            case 'edit-games':
                this.openGamesEditor();
                break;
            case 'edit-content':
                this.openContentEditor();
                break;
            case 'save-changes':
                this.saveAllChanges();
                break;
            case 'import-data':
                this.importData();
                break;
            case 'export-data':
                this.exportData();
                break;
        }
    }

    async openBannersEditor() {
        const modal = document.getElementById('edit-banners-modal');
        const content = document.getElementById('banners-edit-content');
        
        if (!modal || !content) return;

        const banners = await this.getBannersData();
        
        content.innerHTML = `
            <div class="edit-form">
                <div class="form-header">
                    <h4>إدارة اللافتات</h4>
                    <button class="btn btn-primary" id="add-banner-btn">
                        ➕ إضافة لافتة
                    </button>
                </div>
                
                <div class="sortable-list" id="banners-list">
                    ${banners.map((banner, index) => this.createBannerEditItem(banner, index)).join('')}
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="prokAdmin.closeModal('banners')">
                        إلغاء
                    </button>
                    <button class="btn btn-primary" onclick="prokAdmin.saveBanners()">
                        💾 حفظ اللافتات
                    </button>
                </div>
            </div>
        `;

        this.initializeBannerSortable();
        this.initializeBannerEventListeners();
        modal.classList.add('show');
    }

    createBannerEditItem(banner, index) {
        return `
            <div class="sortable-item" data-index="${index}">
                <div class="sortable-handle">≡</div>
                <div class="sortable-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">العنوان</label>
                            <input type="text" class="form-input" value="${banner.title}" 
                                   data-field="title" data-index="${index}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">الصورة</label>
                            <div class="image-upload-container">
                                <div class="image-preview ${banner.image ? 'show' : ''}">
                                    <img src="${banner.image}" alt="Preview" class="image-preview-img">
                                </div>
                                <input type="file" class="image-upload-input" 
                                       accept="image/*" data-index="${index}">
                                <button class="btn btn-sm btn-secondary upload-btn" data-index="${index}">
                                    📁 رفع صورة
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الوصف</label>
                        <textarea class="form-textarea" data-field="description" 
                                  data-index="${index}">${banner.description}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">الرابط</label>
                            <input type="text" class="form-input" value="${banner.link}" 
                                   data-field="link" data-index="${index}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">نوع الحركة</label>
                            <select class="form-select" data-field="animation" data-index="${index}">
                                <option value="fade-in" ${banner.animation === 'fade-in' ? 'selected' : ''}>تدرج</option>
                                <option value="slide-up" ${banner.animation === 'slide-up' ? 'selected' : ''}>انزلاق</option>
                                <option value="zoom-in" ${banner.animation === 'zoom-in' ? 'selected' : ''}>تكبير</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="sortable-actions">
                    <button class="btn btn-sm btn-danger" onclick="prokAdmin.removeBanner(${index})">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    initializeBannerSortable() {
        const list = document.getElementById('banners-list');
        if (!list) return;

        new Sortable(list, {
            handle: '.sortable-handle',
            animation: 150,
            onEnd: (evt) => {
                this.updateBannersOrder();
            }
        });
    }

    initializeBannerEventListeners() {
        // Add banner button
        document.getElementById('add-banner-btn')?.addEventListener('click', () => {
            this.addNewBanner();
        });

        // Image upload handlers
        document.querySelectorAll('.image-upload-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleBannerImageUpload(e);
            });
        });

        // Real-time input updates
        document.querySelectorAll('#banners-edit-content input, #banners-edit-content textarea, #banners-edit-content select').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateBannerField(e);
            });
        });
    }

    async updateBannerField(event) {
        const target = event.target;
        const index = target.getAttribute('data-index');
        const field = target.getAttribute('data-field');
        const value = target.value;

        await this.updateBannerData(index, field, value);
    }

    async handleBannerImageUpload(event) {
        const file = event.target.files[0];
        const index = event.target.getAttribute('data-index');
        
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast('الملف يجب أن يكون صورة', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showToast('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
            return;
        }

        try {
            this.showToast('جاري رفع الصورة...', 'info');
            
            const downloadURL = await window.firebaseManager.uploadImage(file, 'banners');
            if (downloadURL) {
                await this.updateBannerData(index, 'image', downloadURL);
                
                // Update preview
                const preview = document.querySelector(`[data-index="${index}"] .image-preview`);
                if (preview) {
                    preview.classList.add('show');
                    preview.querySelector('.image-preview-img').src = downloadURL;
                }
                
                this.showToast('تم رفع الصورة بنجاح', 'success');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            this.showToast('فشل رفع الصورة', 'error');
        }
    }

    async openAppsEditor() {
        const modal = document.getElementById('edit-apps-modal');
        const content = document.getElementById('apps-edit-content');
        
        if (!modal || !content) return;

        const apps = await this.getAppsData();
        
        content.innerHTML = `
            <div class="edit-form">
                <div class="form-header">
                    <h4>إدارة التطبيقات</h4>
                    <button class="btn btn-primary" id="add-app-btn">
                        ➕ إضافة تطبيق
                    </button>
                </div>
                
                <div class="apps-edit-grid">
                    ${apps.map((app, index) => this.createAppEditItem(app, index)).join('')}
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="prokAdmin.closeModal('apps')">
                        إلغاء
                    </button>
                    <button class="btn btn-primary" onclick="prokAdmin.saveApps()">
                        💾 حفظ التطبيقات
                    </button>
                </div>
            </div>
        `;

        this.initializeAppsEventListeners();
        modal.classList.add('show');
    }

    createAppEditItem(app, index) {
        return `
            <div class="app-edit-card" data-index="${index}">
                <div class="card-header">
                    <h5>${app.name || 'تطبيق جديد'}</h5>
                    <div class="card-actions">
                        <label class="toggle-label">
                            <input type="checkbox" class="toggle-input" ${app.featured ? 'checked' : ''} 
                                   data-field="featured" data-index="${index}">
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">مميز</span>
                        </label>
                        <button class="btn btn-sm btn-danger" onclick="prokAdmin.removeApp(${index})">
                            🗑️ حذف
                        </button>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">اسم التطبيق</label>
                            <input type="text" class="form-input" value="${app.name}" 
                                   data-field="name" data-index="${index}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">التقييم</label>
                            <input type="number" class="form-input" min="0" max="5" step="0.1" 
                                   value="${app.rating}" data-field="rating" data-index="${index}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الوصف</label>
                        <textarea class="form-textarea" data-field="description" 
                                  data-index="${index}">${app.description}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">الحجم</label>
                            <input type="text" class="form-input" value="${app.size}" 
                                   data-field="size" data-index="${index}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">الفئة</label>
                            <select class="form-select" data-field="category" data-index="${index}">
                                <option value="productivity" ${app.category === 'productivity' ? 'selected' : ''}>إنتاجية</option>
                                <option value="social" ${app.category === 'social' ? 'selected' : ''}>تواصل</option>
                                <option value="tools" ${app.category === 'tools' ? 'selected' : ''}>أدوات</option>
                                <option value="entertainment" ${app.category === 'entertainment' ? 'selected' : ''}>ترفيه</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">رابط التنزيل</label>
                        <input type="url" class="form-input" value="${app.downloadLink}" 
                               data-field="downloadLink" data-index="${index}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">صورة التطبيق</label>
                        <div class="image-upload-container">
                            <div class="image-preview ${app.image ? 'show' : ''}">
                                <img src="${app.image}" alt="Preview" class="image-preview-img">
                            </div>
                            <input type="file" class="image-upload-input" 
                                   accept="image/*" data-index="${index}">
                            <button class="btn btn-sm btn-secondary upload-btn" data-index="${index}">
                                📁 رفع صورة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeAppsEventListeners() {
        // Add app button
        document.getElementById('add-app-btn')?.addEventListener('click', () => {
            this.addNewApp();
        });

        // Real-time updates for apps
        document.querySelectorAll('#apps-edit-content input, #apps-edit-content textarea, #apps-edit-content select').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateAppField(e);
            });
        });

        // Toggle switches
        document.querySelectorAll('.toggle-input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateAppField(e);
            });
        });
    }

    async openContentEditor() {
        const modal = document.getElementById('edit-content-modal');
        const content = document.getElementById('content-edit-content');
        
        if (!modal || !content) return;

        const siteContent = await this.getSiteContent();
        
        content.innerHTML = `
            <div class="edit-form">
                <h4>المحتوى العام للموقع</h4>
                
                <div class="form-group">
                    <label class="form-label">عنوان الموقع</label>
                    <input type="text" class="form-input" value="${siteContent.title}" 
                           data-field="title">
                </div>
                
                <div class="form-group">
                    <label class="form-label">وصف الموقع</label>
                    <textarea class="form-textarea" data-field="description">${siteContent.description}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">نص قسم عنا</label>
                    <textarea class="form-textarea" data-field="aboutText" 
                              style="min-height: 150px;">${siteContent.aboutText}</textarea>
                </div>
                
                <h5>الإحصائيات</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">عدد التطبيقات</label>
                        <input type="text" class="form-input" value="${siteContent.stats?.apps}" 
                               data-field="apps" data-stats="true">
                    </div>
                    <div class="form-group">
                        <label class="form-label">عدد الألعاب</label>
                        <input type="text" class="form-input" value="${siteContent.stats?.games}" 
                               data-field="games" data-stats="true">
                    </div>
                    <div class="form-group">
                        <label class="form-label">عدد المستخدمين</label>
                        <input type="text" class="form-input" value="${siteContent.stats?.users}" 
                               data-field="users" data-stats="true">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="prokAdmin.closeModal('content')">
                        إلغاء
                    </button>
                    <button class="btn btn-primary" onclick="prokAdmin.saveSiteContent()">
                        💾 حفظ المحتوى
                    </button>
                </div>
            </div>
        `;

        // Real-time updates for content
        content.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateSiteContentField(e);
            });
        });

        modal.classList.add('show');
    }

    // Data Management Methods
    async getBannersData() {
        const siteData = await window.firebaseManager.getSiteData();
        return siteData.banners || [];
    }

    async getAppsData() {
        const siteData = await window.firebaseManager.getSiteData();
        return siteData.apps || [];
    }

    async getGamesData() {
        const siteData = await window.firebaseManager.getSiteData();
        return siteData.games || [];
    }

    async getSiteContent() {
        const siteData = await window.firebaseManager.getSiteData();
        return siteData.siteContent || {};
    }

    async updateBannerData(index, field, value) {
        const banners = await this.getBannersData();
        if (banners[index]) {
            banners[index][field] = value;
            this.currentEdits.set('banners', banners);
            this.showToast('تم تحديث اللافتة', 'success');
        }
    }

    async updateAppData(index, field, value) {
        const apps = await this.getAppsData();
        if (apps[index]) {
            apps[index][field] = value;
            this.currentEdits.set('apps', apps);
            this.showToast('تم تحديث التطبيق', 'success');
        }
    }

    async updateSiteContentField(event) {
        const target = event.target;
        const field = target.getAttribute('data-field');
        const isStats = target.hasAttribute('data-stats');
        
        let siteContent = await this.getSiteContent();
        
        if (isStats) {
            if (!siteContent.stats) siteContent.stats = {};
            siteContent.stats[field] = target.value;
        } else {
            siteContent[field] = target.value;
        }
        
        this.currentEdits.set('siteContent', siteContent);
    }

    // Save Methods
    async saveAllChanges() {
        if (this.currentEdits.size === 0) {
            this.showToast('لا توجد تغييرات لحفظها', 'info');
            return;
        }

        try {
            this.showToast('جاري حفظ جميع التغييرات...', 'info');
            
            const currentData = await window.firebaseManager.getSiteData();
            
            for (const [key, value] of this.currentEdits) {
                currentData[key] = value;
            }
            
            const success = await window.firebaseManager.updateSiteData(currentData);
            if (success) {
                this.currentEdits.clear();
                this.showToast('تم حفظ جميع التغييرات بنجاح', 'success');
                
                // Refresh the page to show changes
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Error saving all changes:', error);
            this.showToast('فشل حفظ التغييرات', 'error');
        }
    }

    async saveBanners() {
        const banners = this.currentEdits.get('banners') || await this.getBannersData();
        await this.saveSectionData('banners', banners);
    }

    async saveApps() {
        const apps = this.currentEdits.get('apps') || await this.getAppsData();
        await this.saveSectionData('apps', apps);
    }

    async saveSiteContent() {
        const siteContent = this.currentEdits.get('siteContent') || await this.getSiteContent();
        await this.saveSectionData('siteContent', siteContent);
    }

    async saveSectionData(section, data) {
        try {
            const currentData = await window.firebaseManager.getSiteData();
            currentData[section] = data;
            
            const success = await window.firebaseManager.updateSiteData(currentData);
            if (success) {
                this.currentEdits.delete(section);
                this.showToast(`تم حفظ ${section} بنجاح`, 'success');
                this.closeModal(section);
            }
        } catch (error) {
            console.error(`Error saving ${section}:`, error);
            this.showToast(`فشل حفظ ${section}`, 'error');
        }
    }

    // Utility Methods
    closeModal(type) {
        const modal = document.getElementById(`edit-${type}-modal`);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    showToast(message, type = 'info') {
        if (window.prokApp && typeof window.prokApp.showToast === 'function') {
            window.prokApp.showToast(message, type);
        } else {
            console.log(`Admin Toast (${type}): ${message}`);
        }
    }

    async addNewBanner() {
        const banners = await this.getBannersData();
        const newBanner = {
            id: Date.now(),
            image: '',
            title: 'لافتة جديدة',
            description: 'وصف اللافتة الجديدة',
            link: '#',
            animation: 'fade-in'
        };
        
        banners.push(newBanner);
        this.currentEdits.set('banners', banners);
        await this.openBannersEditor(); // Refresh the editor
        this.showToast('تم إضافة لافتة جديدة', 'success');
    }

    async addNewApp() {
        const apps = await this.getAppsData();
        const newApp = {
            id: Date.now(),
            name: 'تطبيق جديد',
            description: 'وصف التطبيق الجديد',
            image: '',
            rating: 4.0,
            size: '0MB',
            category: 'productivity',
            downloadLink: '#',
            animation: 'fade-in',
            featured: false
        };
        
        apps.push(newApp);
        this.currentEdits.set('apps', apps);
        await this.openAppsEditor(); // Refresh the editor
        this.showToast('تم إضافة تطبيق جديد', 'success');
    }

    async removeBanner(index) {
        if (confirm('هل أنت متأكد من حذف هذه اللافتة؟')) {
            const banners = await this.getBannersData();
            banners.splice(index, 1);
            this.currentEdits.set('banners', banners);
            await this.openBannersEditor(); // Refresh the editor
            this.showToast('تم حذف اللافتة', 'success');
        }
    }

    async removeApp(index) {
        if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
            const apps = await this.getAppsData();
            apps.splice(index, 1);
            this.currentEdits.set('apps', apps);
            await this.openAppsEditor(); // Refresh the editor
            this.showToast('تم حذف التطبيق', 'success');
        }
    }

    async autoSave() {
        if (this.currentEdits.size > 0) {
            console.log('Auto-saving changes...');
            await this.saveAllChanges();
        }
    }

    async importData() {
        // Implementation for data import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        this.handleImportedData(data);
                    } catch (error) {
                        this.showToast('ملف غير صالح', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    async exportData() {
        const data = await window.firebaseManager.getSiteData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prok-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('تم تصدير البيانات', 'success');
    }

    async handleImportedData(data) {
        if (confirm('هل تريد استبدال جميع البيانات الحالية؟')) {
            try {
                await window.firebaseManager.updateSiteData(data);
                this.showToast('تم استيراد البيانات بنجاح', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                this.showToast('فشل استيراد البيانات', 'error');
            }
        }
    }

    setupRealTimeUpdates() {
        // Setup real-time listeners for collaborative editing
        if (window.firebaseManager && window.firebaseManager.isConfigured) {
            window.firebaseManager.firestore.collection('site').doc('content')
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.handleRemoteUpdate(data);
                    }
                }, (error) => {
                    console.error('Real-time update error:', error);
                });
        }
    }

    handleRemoteUpdate(data) {
        // Handle real-time updates from other admin users
        if (this.currentEdits.size === 0) { // Only update if no local edits
            this.showToast('تم تحديث البيانات من مدير آخر', 'info');
            // You might want to refresh the UI here
        }
    }
}

// Initialize admin when DOM is loaded and user is admin
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase manager to initialize
    const checkAdmin = setInterval(() => {
        if (window.firebaseManager && window.firebaseManager.isAdmin) {
            clearInterval(checkAdmin);
            window.prokAdmin = new ProkAdmin();
            console.log('Prok Admin initialized');
        }
    }, 100);
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProkAdmin;
}
