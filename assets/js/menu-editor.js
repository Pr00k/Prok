/**
 * نظام محرر القوائم المتقدم
 */

class MenuEditor {
    constructor() {
        this.menus = {
            main: [],
            footer: [],
            custom: []
        };
        this.currentMenu = 'main';
        
        this.init();
    }

    async init() {
        await this.loadMenus();
        this.renderMenus();
        this.setupEventListeners();
        this.initializeDragAndDrop();
    }

    async loadMenus() {
        try {
            if (window.firebaseManager && window.firebaseManager.isConfigured) {
                const siteData = await window.firebaseManager.getSiteData();
                this.menus = siteData.menus || this.getDefaultMenus();
            } else {
                this.menus = this.getDefaultMenus();
            }
        } catch (error) {
            console.error('Error loading menus:', error);
            this.menus = this.getDefaultMenus();
        }
    }

    getDefaultMenus() {
        return {
            main: [
                { id: 'home', text: 'الرئيسية', url: '#home', icon: '🏠' },
                { id: 'apps', text: 'التطبيقات', url: '#apps', icon: '📱' },
                { id: 'games', text: 'الألعاب', url: '#games', icon: '🎮' }
            ],
            footer: [
                { id: 'home-footer', text: 'الرئيسية', url: '#home' },
                { id: 'apps-footer', text: 'التطبيقات', url: '#apps' },
                { id: 'games-footer', text: 'الألعاب', url: '#games' }
            ],
            custom: []
        };
    }

    renderMenus() {
        this.renderMainMenu();
        this.renderFooterMenu();
        this.renderMenuEditor();
    }

    renderMainMenu() {
        const navList = document.getElementById('main-nav-list');
        const footerLinks = document.getElementById('footer-links');
        
        if (!navList) return;

        navList.innerHTML = '';
        this.menus.main.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <a href="${item.url}" class="nav-link">
                    ${item.icon ? item.icon + ' ' : ''}${item.text}
                </a>
            `;
            navList.appendChild(li);
        });

        // تحديث روابط التذييل
        if (footerLinks) {
            footerLinks.innerHTML = '';
            this.menus.footer.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.url}">${item.text}</a>`;
                footerLinks.appendChild(li);
            });
        }
    }

    renderFooterMenu() {
        // تم التنفيذ في renderMainMenu
    }

    renderMenuEditor() {
        const mainMenuPane = document.getElementById('main-menu-pane');
        if (!mainMenuPane) return;

        const menuItemsList = mainMenuPane.querySelector('.menu-items-list');
        if (!menuItemsList) return;

        menuItemsList.innerHTML = '';
        this.menus[this.currentMenu].forEach((item, index) => {
            const menuItem = this.createMenuItemEditor(item, index);
            menuItemsList.appendChild(menuItem);
        });
    }

    createMenuItemEditor(item, index) {
        const div = document.createElement('div');
        div.className = 'menu-item-editor';
        div.setAttribute('data-index', index);
        div.setAttribute('draggable', 'true');
        
        div.innerHTML = `
            <div class="menu-item-handle">≡</div>
            <div class="menu-item-content">
                <div class="menu-item-text">
                    <input type="text" value="${item.text}" placeholder="نص العنصر" 
                           onchange="menuEditor.updateMenuItem(${index}, 'text', this.value)">
                </div>
                <div class="menu-item-url">
                    <input type="text" value="${item.url}" placeholder="الرابط" 
                           onchange="menuEditor.updateMenuItem(${index}, 'url', this.value)">
                </div>
                <div class="menu-item-icon">
                    <input type="text" value="${item.icon || ''}" placeholder="الأيقونة (اختياري)" 
                           onchange="menuEditor.updateMenuItem(${index}, 'icon', this.value)">
                </div>
            </div>
            <div class="menu-item-actions">
                <button class="btn btn-sm btn-danger" onclick="menuEditor.removeMenuItem(${index})">
                    🗑️
                </button>
            </div>
        `;
        
        return div;
    }

    setupEventListeners() {
        // أزرار محرر القوائم
        document.getElementById('add-menu-item')?.addEventListener('click', () => {
            this.addNewMenuItem();
        });

        document.getElementById('reset-menu')?.addEventListener('click', () => {
            this.resetMenu();
        });

        document.getElementById('create-new-menu')?.addEventListener('click', () => {
            this.createNewMenu();
        });

        // تبويبات المحرر
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchEditorTab(tabName);
            });
        });
    }

    switchEditorTab(tabName) {
        // تحديث التبويبات النشطة
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.editor-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // تفعيل التبويب والنافذة المحددة
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-pane`).classList.add('active');

        // تحديث القائمة الحالية
        this.currentMenu = tabName === 'main-menu' ? 'main' : 
                          tabName === 'footer-menu' ? 'footer' : 'custom';
        
        this.renderMenuEditor();
    }

    initializeDragAndDrop() {
        const menuItemsList = document.querySelector('.menu-items-list');
        if (!menuItemsList) return;

        let draggedItem = null;

        menuItemsList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('menu-item-editor')) {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        menuItemsList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('menu-item-editor')) {
                e.target.classList.remove('dragging');
                draggedItem = null;
            }
        });

        menuItemsList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(menuItemsList, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                if (afterElement == null) {
                    menuItemsList.appendChild(draggable);
                } else {
                    menuItemsList.insertBefore(draggable, afterElement);
                }
            }
        });

        menuItemsList.addEventListener('drop', (e) => {
            e.preventDefault();
            this.updateMenuOrder();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.menu-item-editor:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateMenuOrder() {
        const menuItems = document.querySelectorAll('.menu-item-editor');
        const newOrder = [];
        
        menuItems.forEach((item, index) => {
            const oldIndex = parseInt(item.getAttribute('data-index'));
            newOrder.push(this.menus[this.currentMenu][oldIndex]);
        });

        this.menus[this.currentMenu] = newOrder;
        this.saveMenus();
        this.renderMenuEditor(); // إعادة الترقيم
    }

    addNewMenuItem() {
        const newItem = {
            id: 'item-' + Date.now(),
            text: 'عنصر جديد',
            url: '#',
            icon: ''
        };
        
        this.menus[this.currentMenu].push(newItem);
        this.saveMenus();
        this.renderMenuEditor();
        
        this.showToast('تم إضافة عنصر جديد', 'success');
    }

    removeMenuItem(index) {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            this.menus[this.currentMenu].splice(index, 1);
            this.saveMenus();
            this.renderMenuEditor();
            this.renderMainMenu();
            
            this.showToast('تم حذف العنصر', 'success');
        }
    }

    updateMenuItem(index, field, value) {
        if (this.menus[this.currentMenu][index]) {
            this.menus[this.currentMenu][index][field] = value;
            this.saveMenus();
            this.renderMainMenu();
        }
    }

    resetMenu() {
        if (confirm('هل أنت متأكد من إعادة تعيين القائمة إلى الإعدادات الافتراضية؟')) {
            const defaultMenus = this.getDefaultMenus();
            this.menus[this.currentMenu] = [...defaultMenus[this.currentMenu]];
            this.saveMenus();
            this.renderMenuEditor();
            this.renderMainMenu();
            
            this.showToast('تم إعادة تعيين القائمة', 'success');
        }
    }

    createNewMenu() {
        const menuName = document.getElementById('new-menu-name').value;
        const menuLocation = document.getElementById('new-menu-location').value;
        
        if (!menuName.trim()) {
            this.showToast('يرجى إدخال اسم للقائمة الجديدة', 'error');
            return;
        }

        const newMenu = {
            id: 'custom-' + Date.now(),
            name: menuName,
            location: menuLocation,
            items: []
        };

        this.menus.custom.push(newMenu);
        this.saveMenus();
        
        // إعادة تعيين الحقول
        document.getElementById('new-menu-name').value = '';
        
        this.showToast('تم إنشاء القائمة الجديدة', 'success');
    }

    async saveMenus() {
        try {
            if (window.firebaseManager && window.firebaseManager.isAdmin) {
                const currentData = await window.firebaseManager.getSiteData();
                currentData.menus = this.menus;
                await window.firebaseManager.updateSiteData(currentData);
            } else {
                localStorage.setItem('prok_menus', JSON.stringify(this.menus));
            }
        } catch (error) {
            console.error('Error saving menus:', error);
        }
    }

    showToast(message, type = 'info') {
        if (window.prokApp && typeof window.prokApp.showToast === 'function') {
            window.prokApp.showToast(message, type);
        }
    }
}

// Initialize Menu Editor
window.menuEditor = new MenuEditor();
