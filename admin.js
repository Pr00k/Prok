class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.renderAdminPanel();
        this.setupEventListeners();
    }

    renderAdminPanel() {
        document.getElementById('adminPanel').innerHTML = `
            <div class="admin-header">
                <h3>لوحة التحكم</h3>
                <button onclick="authManager.logout()" class="btn">تسجيل خروج</button>
            </div>
            <div class="admin-actions">
                <button onclick="this.showAddProductForm()" class="btn btn-primary">إضافة منتج</button>
                <button onclick="this.manageCategories()" class="btn">إدارة الفئات</button>
            </div>
        `;
    }

    showAddProductForm() {
        const name = prompt('اسم المنتج:');
        const price = prompt('السعر:');
        const description = prompt('الوصف:');
        
        if (name && price) {
            productManager.addProduct({ name, price, description });
        }
    }

    manageCategories() {
        // إدارة الفئات
    }

    setupEventListeners() {
        // إعداد الأحداث
    }
}

const adminPanel = new AdminPanel();
