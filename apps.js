class App {
    constructor() {
        this.init();
    }

    init() {
        this.renderNavbar();
        this.renderHero();
        this.setupEventListeners();
        
        authManager.checkAuthState();
        productManager.loadProducts();
        languageManager.applyLanguage();
    }

    renderNavbar() {
        document.getElementById('navbar').innerHTML = `
            <div class="nav-brand">ProK</div>
            <div class="nav-links">
                <a href="#home" data-i18n="home">الرئيسية</a>
                <a href="#products" data-i18n="products">المنتجات</a>
                <a href="#categories" data-i18n="categories">الفئات</a>
                <button onclick="languageManager.toggleLanguage()">EN/AR</button>
                <button onclick="this.showLoginModal()" data-i18n="adminLogin">تسجيل المسؤول</button>
            </div>
        `;
    }

    renderHero() {
        document.getElementById('hero').innerHTML = `
            <div class="hero-content">
                <h1 data-i18n="heroTitle">عروض حصرية</h1>
                <p data-i18n="heroSubtitle">خصومات مميزة على جميع المنتجات</p>
                <button class="btn btn-accent" data-i18n="viewProducts">عرض المنتجات</button>
            </div>
        `;
    }

    showLoginModal() {
        document.getElementById('loginModal').innerHTML = `
            <div class="modal-content">
                <h2 data-i18n="adminLogin">تسجيل الدخول</h2>
                <form onsubmit="this.handleLogin(event)">
                    <input type="email" id="loginEmail" placeholder="البريد الإلكتروني" required>
                    <input type="password" id="loginPassword" placeholder="كلمة المرور" required>
                    <button type="submit" class="btn btn-primary">دخول</button>
                </form>
                <button onclick="this.closeLoginModal()">إلغاء</button>
            </div>
        `;
        document.getElementById('loginModal').classList.remove('hidden');
    }

    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await authManager.login(email, password);
            this.closeLoginModal();
        } catch (error) {
            alert(error.message);
        }
    }

    closeLoginModal() {
        document.getElementById('loginModal').classList.add('hidden');
    }

    setupEventListeners() {
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeLoginModal();
        });
    }
}

// بدء التطبيق
new App();
