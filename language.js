class LanguageManager {
    constructor() {
        this.currentLang = 'ar';
        this.translations = {
            ar: {
                home: "الرئيسية",
                products: "المنتجات", 
                categories: "الفئات",
                adminLogin: "تسجيل المسؤول",
                heroTitle: "عروض حصرية",
                heroSubtitle: "خصومات مميزة على جميع المنتجات"
            },
            en: {
                home: "Home",
                products: "Products",
                categories: "Categories", 
                adminLogin: "Admin Login",
                heroTitle: "Exclusive Offers",
                heroSubtitle: "Special discounts on all products"
            }
        };
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.applyLanguage();
    }

    applyLanguage() {
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translations[this.currentLang][key];
        });
    }
}

const languageManager = new LanguageManager();
