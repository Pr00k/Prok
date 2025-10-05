/**
 * نظام الترجمة متعدد اللغات المتقدم لموقع Prok
 */

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('prok_language') || 'ar';
        this.translations = {};
        this.languageNames = {
            'ar': 'العربية',
            'en': 'English',
            'fr': 'Français',
            'es': 'Español',
            'de': 'Deutsch'
        };
        
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyLanguage(this.currentLang);
        this.initializeLanguageSwitcher();
        this.setupLanguageChangeListener();
    }

    async loadTranslations() {
        this.translations = {
            ar: {
                // القائمة الرئيسية
                'menu_home': 'الرئيسية',
                'menu_apps': 'التطبيقات',
                'menu_games': 'الألعاب',
                'menu_languages': 'اللغات',
                'menu_admin': 'الأدمن',

                // العناوين
                'apps_title': 'التطبيقات الشائعة',
                'apps_subtitle': 'اكتشف أفضل التطبيقات المجانية',
                'games_title': 'الألعاب المميزة',
                'games_subtitle': 'استمتع بألعاب مجانية رائعة',

                // الفلاتر والترتيب
                'filter_by': 'تصفية حسب',
                'sort_by': 'ترتيب حسب',
                'view_type': 'طريقة العرض',
                'all_categories': 'جميع الفئات',
                'newest': 'الأحدث',
                'oldest': 'الأقدم',
                'most_popular': 'الأكثر شعبية',
                'highest_rating': 'الأعلى تقييماً',
                'most_downloads': 'الأكثر تحميلاً',
                'search_apps': 'ابحث في التطبيقات...',
                'search_games': 'ابحث في الألعاب...',

                // الفئات
                'productivity': 'الإنتاجية',
                'social': 'التواصل',
                'tools': 'الأدوات',
                'entertainment': 'ترفيه',
                'action': 'أكشن',
                'adventure': 'مغامرة',
                'puzzle': 'ألغاز',
                'sports': 'رياضة',
                'racing': 'سباقات',

                // الأزرار
                'download': 'تنزيل',
                'play': 'لعب',
                'details': 'تفاصيل',
                'view_all': 'عرض الكل',
                'previous': 'السابق',
                'next': 'التالي',
                'save': 'حفظ',
                'cancel': 'إلغاء',
                'add': 'إضافة',
                'edit': 'تحرير',
                'delete': 'حذف',

                // التذييل
                'footer_desc': 'منصة التطبيقات والألعاب المجانية',
                'quick_links': 'روابط سريعة',
                'languages': 'اللغات',
                'all_rights': 'جميع الحقوق محفوظة.',

                // الإدارة
                'admin_login': 'تسجيل الدخول',
                'admin_logout': 'تسجيل خروج',
                'edit_content': 'تحرير المحتوى',
                'save_changes': 'حفظ التغييرات',
                'add_app': 'إضافة تطبيق',
                'add_game': 'إضافة لعبة',
                'manage_menu': 'إدارة القوائم',
                'site_settings': 'إعدادات الموقع',
                'quick_add': 'إضافة سريعة',

                // النماذج
                'item_name': 'اسم العنصر',
                'item_description': 'الوصف',
                'item_category': 'الفئة',
                'item_type': 'النوع',
                'item_rating': 'التقييم',
                'item_size': 'الحجم',
                'item_version': 'الإصدار',
                'download_link': 'رابط التحميل',
                'item_image': 'صورة العنصر',
                'item_animation': 'تأثير الحركة',

                // الرسائل
                'loading': 'جاري التحميل...',
                'saving': 'جاري الحفظ...',
                'success': 'تم بنجاح',
                'error': 'خطأ',
                'warning': 'تحذير',
                'info': 'معلومات'
            },
            en: {
                // Navigation
                'menu_home': 'Home',
                'menu_apps': 'Apps',
                'menu_games': 'Games',
                'menu_languages': 'Languages',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Popular Apps',
                'apps_subtitle': 'Discover the best free apps',
                'games_title': 'Featured Games',
                'games_subtitle': 'Enjoy amazing free games',

                // Filters and Sorting
                'filter_by': 'Filter by',
                'sort_by': 'Sort by',
                'view_type': 'View type',
                'all_categories': 'All categories',
                'newest': 'Newest',
                'oldest': 'Oldest',
                'most_popular': 'Most popular',
                'highest_rating': 'Highest rating',
                'most_downloads': 'Most downloads',
                'search_apps': 'Search apps...',
                'search_games': 'Search games...',

                // Categories
                'productivity': 'Productivity',
                'social': 'Social',
                'tools': 'Tools',
                'entertainment': 'Entertainment',
                'action': 'Action',
                'adventure': 'Adventure',
                'puzzle': 'Puzzle',
                'sports': 'Sports',
                'racing': 'Racing',

                // Buttons
                'download': 'Download',
                'play': 'Play',
                'details': 'Details',
                'view_all': 'View all',
                'previous': 'Previous',
                'next': 'Next',
                'save': 'Save',
                'cancel': 'Cancel',
                'add': 'Add',
                'edit': 'Edit',
                'delete': 'Delete',

                // Footer
                'footer_desc': 'Free Apps & Games Platform',
                'quick_links': 'Quick Links',
                'languages': 'Languages',
                'all_rights': 'All rights reserved.',

                // Admin
                'admin_login': 'Login',
                'admin_logout': 'Logout',
                'edit_content': 'Edit Content',
                'save_changes': 'Save Changes',
                'add_app': 'Add App',
                'add_game': 'Add Game',
                'manage_menu': 'Manage Menu',
                'site_settings': 'Site Settings',
                'quick_add': 'Quick Add',

                // Forms
                'item_name': 'Item Name',
                'item_description': 'Description',
                'item_category': 'Category',
                'item_type': 'Type',
                'item_rating': 'Rating',
                'item_size': 'Size',
                'item_version': 'Version',
                'download_link': 'Download Link',
                'item_image': 'Item Image',
                'item_animation': 'Animation Effect',

                // Messages
                'loading': 'Loading...',
                'saving': 'Saving...',
                'success': 'Success',
                'error': 'Error',
                'warning': 'Warning',
                'info': 'Info'
            },
            fr: {
                // Navigation
                'menu_home': 'Accueil',
                'menu_apps': 'Applications',
                'menu_games': 'Jeux',
                'menu_languages': 'Langues',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Applications Populaires',
                'apps_subtitle': 'Découvrez les meilleures applications gratuites',
                'games_title': 'Jeux en Vedette',
                'games_subtitle': 'Profitez de jeux gratuits incroyables',

                // Filters and Sorting
                'filter_by': 'Filtrer par',
                'sort_by': 'Trier par',
                'view_type': 'Type de vue',
                'all_categories': 'Toutes les catégories',
                'newest': 'Plus récent',
                'oldest': 'Plus ancien',
                'most_popular': 'Plus populaire',
                'highest_rating': 'Meilleure note',
                'most_downloads': 'Plus téléchargé',
                'search_apps': 'Rechercher des applications...',
                'search_games': 'Rechercher des jeux...',

                // Categories
                'productivity': 'Productivité',
                'social': 'Social',
                'tools': 'Outils',
                'entertainment': 'Divertissement',
                'action': 'Action',
                'adventure': 'Aventure',
                'puzzle': 'Puzzle',
                'sports': 'Sports',
                'racing': 'Course',

                // Buttons
                'download': 'Télécharger',
                'play': 'Jouer',
                'details': 'Détails',
                'view_all': 'Voir tout',
                'previous': 'Précédent',
                'next': 'Suivant',
                'save': 'Sauvegarder',
                'cancel': 'Annuler',
                'add': 'Ajouter',
                'edit': 'Modifier',
                'delete': 'Supprimer',

                // Footer
                'footer_desc': 'Plateforme d\'Applications et Jeux Gratuits',
                'quick_links': 'Liens Rapides',
                'languages': 'Langues',
                'all_rights': 'Tous droits réservés.',

                // Admin
                'admin_login': 'Connexion',
                'admin_logout': 'Déconnexion',
                'edit_content': 'Modifier le Contenu',
                'save_changes': 'Enregistrer les Modifications',
                'add_app': 'Ajouter une Application',
                'add_game': 'Ajouter un Jeu',
                'manage_menu': 'Gérer le Menu',
                'site_settings': 'Paramètres du Site',
                'quick_add': 'Ajout Rapide'
            },
            es: {
                // Navigation
                'menu_home': 'Inicio',
                'menu_apps': 'Aplicaciones',
                'menu_games': 'Juegos',
                'menu_languages': 'Idiomas',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Aplicaciones Populares',
                'apps_subtitle': 'Descubre las mejores aplicaciones gratuitas',
                'games_title': 'Juegos Destacados',
                'games_subtitle': 'Disfruta de juegos gratuitos increíbles',

                // Filters and Sorting
                'filter_by': 'Filtrar por',
                'sort_by': 'Ordenar por',
                'view_type': 'Tipo de vista',
                'all_categories': 'Todas las categorías',
                'newest': 'Más reciente',
                'oldest': 'Más antiguo',
                'most_popular': 'Más popular',
                'highest_rating': 'Mejor valorado',
                'most_downloads': 'Más descargado',
                'search_apps': 'Buscar aplicaciones...',
                'search_games': 'Buscar juegos...',

                // Categories
                'productivity': 'Productividad',
                'social': 'Social',
                'tools': 'Herramientas',
                'entertainment': 'Entretenimiento',
                'action': 'Acción',
                'adventure': 'Aventura',
                'puzzle': 'Rompecabezas',
                'sports': 'Deportes',
                'racing': 'Carreras',

                // Buttons
                'download': 'Descargar',
                'play': 'Jugar',
                'details': 'Detalles',
                'view_all': 'Ver todo',
                'previous': 'Anterior',
                'next': 'Siguiente',
                'save': 'Guardar',
                'cancel': 'Cancelar',
                'add': 'Agregar',
                'edit': 'Editar',
                'delete': 'Eliminar',

                // Footer
                'footer_desc': 'Plataforma de Aplicaciones y Juegos Gratuitos',
                'quick_links': 'Enlaces Rápidos',
                'languages': 'Idiomas',
                'all_rights': 'Todos los derechos reservados.',

                // Admin
                'admin_login': 'Iniciar Sesión',
                'admin_logout': 'Cerrar Sesión',
                'edit_content': 'Editar Contenido',
                'save_changes': 'Guardar Cambios',
                'add_app': 'Agregar Aplicación',
                'add_game': 'Agregar Juego',
                'manage_menu': 'Gestionar Menú',
                'site_settings': 'Configuración del Sitio',
                'quick_add': 'Agregar Rápidamente'
            },
            de: {
                // Navigation
                'menu_home': 'Startseite',
                'menu_apps': 'Apps',
                'menu_games': 'Spiele',
                'menu_languages': 'Sprachen',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Beliebte Apps',
                'apps_subtitle': 'Entdecken Sie die besten kostenlosen Apps',
                'games_title': 'Ausgewählte Spiele',
                'games_subtitle': 'Genießen Sie erstaunliche kostenlose Spiele',

                // Filters and Sorting
                'filter_by': 'Filtern nach',
                'sort_by': 'Sortieren nach',
                'view_type': 'Ansichtstyp',
                'all_categories': 'Alle Kategorien',
                'newest': 'Neueste',
                'oldest': 'Älteste',
                'most_popular': 'Beliebteste',
                'highest_rating': 'Höchste Bewertung',
                'most_downloads': 'Meist heruntergeladen',
                'search_apps': 'Apps durchsuchen...',
                'search_games': 'Spiele durchsuchen...',

                // Categories
                'productivity': 'Produktivität',
                'social': 'Sozial',
                'tools': 'Werkzeuge',
                'entertainment': 'Unterhaltung',
                'action': 'Action',
                'adventure': 'Abenteuer',
                'puzzle': 'Puzzle',
                'sports': 'Sport',
                'racing': 'Rennen',

                // Buttons
                'download': 'Herunterladen',
                'play': 'Spielen',
                'details': 'Einzelheiten',
                'view_all': 'Alle anzeigen',
                'previous': 'Zurück',
                'next': 'Weiter',
                'save': 'Speichern',
                'cancel': 'Abbrechen',
                'add': 'Hinzufügen',
                'edit': 'Bearbeiten',
                'delete': 'Löschen',

                // Footer
                'footer_desc': 'Kostenlose Apps & Spiele Plattform',
                'quick_links': 'Schnelllinks',
                'languages': 'Sprachen',
                'all_rights': 'Alle Rechte vorbehalten.',

                // Admin
                'admin_login': 'Anmelden',
                'admin_logout': 'Abmelden',
                'edit_content': 'Inhalt bearbeiten',
                'save_changes': 'Änderungen speichern',
                'add_app': 'App hinzufügen',
                'add_game': 'Spiel hinzufügen',
                'manage_menu': 'Menü verwalten',
                'site_settings': 'Website-Einstellungen',
                'quick_add': 'Schnell hinzufügen'
            }
        };
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('prok_language', lang);
        
        // تغيير اتجاه الصفحة و لغة HTML
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // تحديث النصوص
        this.updateAllTexts();
        
        // تحديث واجهة اختيار اللغة
        this.updateLanguageSelector();
        
        // إرسال حدث تغيير اللغة
        this.dispatchLanguageChangeEvent();
        
        // إشعار تغيير اللغة
        this.showLanguageChangeMessage(lang);
    }

    updateAllTexts() {
        const langData = this.translations[this.currentLang];
        if (!langData) return;

        // تحديث جميع العناصر التي تحتوي على data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langData[key]) {
                this.updateElementText(element, langData[key]);
            }
        });

        // تحديث عناصر واجهة المستخدم الديناميكية
        this.updateDynamicElements(langData);
    }

    updateElementText(element, text) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'SELECT') {
            // تحديث خيارات ال select
            Array.from(element.options).forEach(option => {
                const optionKey = option.getAttribute('data-translate');
                if (optionKey && text[optionKey]) {
                    option.textContent = text[optionKey];
                }
            });
        } else {
            element.textContent = text;
        }
    }

    updateDynamicElements(langData) {
        // تحديث أزرار الفلترة
        document.querySelectorAll('.filter-select option').forEach(option => {
            const value = option.value;
            const key = this.getFilterKey(value);
            if (key && langData[key]) {
                option.textContent = langData[key];
            }
        });

        // تحديث أزرار التطبيقات والألعاب
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            const btnText = btn.textContent.trim();
            if (btnText.includes('تنزيل') || btnText.includes('Download')) {
                btn.innerHTML = `📥 ${langData['download']}`;
            } else if (btnText.includes('لعب') || btnText.includes('Play')) {
                btn.innerHTML = `🎮 ${langData['play']}`;
            } else if (btnText.includes('تفاصيل') || btnText.includes('Details')) {
                btn.innerHTML = `ℹ️ ${langData['details']}`;
            }
        });

        // تحديث عناصر واجهة المدير
        this.updateAdminInterface(langData);
    }

    updateAdminInterface(langData) {
        // تحديث أزرار الأدمن
        document.querySelectorAll('.admin-action-btn, .toolbar-btn, .quick-add-btn').forEach(btn => {
            const action = btn.getAttribute('data-action');
            const key = this.getAdminActionKey(action);
            if (key && langData[key]) {
                const icon = btn.querySelector('.btn-icon')?.outerHTML || '';
                btn.innerHTML = `${icon} ${langData[key]}`;
            }
        });

        // تحديث عناصر القوائم المنسدلة للأدمن
        document.querySelectorAll('.admin-menu-item').forEach(item => {
            const action = item.getAttribute('data-action');
            const key = this.getAdminActionKey(action);
            if (key && langData[key]) {
                const icon = item.querySelector('.menu-icon')?.outerHTML || '';
                item.innerHTML = `${icon} ${langData[key]}`;
            }
        });
    }

    getFilterKey(value) {
        const filterMap = {
            'all': 'all_categories',
            'productivity': 'productivity',
            'social': 'social',
            'tools': 'tools',
            'entertainment': 'entertainment',
            'action': 'action',
            'adventure': 'adventure',
            'puzzle': 'puzzle',
            'sports': 'sports',
            'racing': 'racing',
            'newest': 'newest',
            'oldest': 'oldest',
            'popular': 'most_popular',
            'rating': 'highest_rating',
            'downloads': 'most_downloads'
        };
        return filterMap[value];
    }

    getAdminActionKey(action) {
        const actionMap = {
            'add-app': 'add_app',
            'add-game': 'add_game',
            'edit-content': 'edit_content',
            'manage-menu': 'manage_menu',
            'site-settings': 'site_settings',
            'quick-add': 'quick_add',
            'logout': 'admin_logout'
        };
        return actionMap[action];
    }

    initializeLanguageSwitcher() {
        // تحديث النص الحالي للغة
        this.updateLanguageSelector();

        // إضافة event listeners لأزرار تغيير اللغة
        document.querySelectorAll('.language-option, .lang-btn').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.getAttribute('data-lang');
                this.applyLanguage(lang);
            });
        });

        // إضافة event listener لزر تبديل اللغة
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('language-dropdown');
                dropdown.classList.toggle('show');
            });
        }

        // إغلاق القائمة المنسدلة عند النقر خارجها
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('language-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    }

    updateLanguageSelector() {
        const currentLanguageText = document.getElementById('current-language');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (currentLanguageText) {
            currentLanguageText.textContent = this.languageNames[this.currentLang];
        }

        // تحديث الحالة النشطة للخيارات
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    setupLanguageChangeListener() {
        // الاستماع لأحداث تغيير اللغة من المكونات الأخرى
        document.addEventListener('languageChange', (e) => {
            if (e.detail && e.detail.lang) {
                this.applyLanguage(e.detail.lang);
            }
        });
    }

    dispatchLanguageChangeEvent() {
        const event = new CustomEvent('languageChanged', {
            detail: { lang: this.currentLang }
        });
        document.dispatchEvent(event);
    }

    showLanguageChangeMessage(lang) {
        const messages = {
            'ar': 'تم تغيير اللغة إلى العربية',
            'en': 'Language changed to English',
            'fr': 'Langue changée en français',
            'es': 'Idioma cambiado a español',
            'de': 'Sprache zu Deutsch geändert'
        };

        if (window.prokApp && typeof window.prokApp.showToast === 'function') {
            window.prokApp.showToast(messages[lang] || messages['en'], 'success');
        }
    }

    translate(key, defaultValue = '') {
        return this.translations[this.currentLang]?.[key] || defaultValue || key;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // دالة مساعدة لترجمة النصوص الديناميكية
    t(key, params = {}) {
        let text = this.translations[this.currentLang]?.[key] || key;
        
        // استبدال المعاملات
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }

    // دالة لتحميل الترجمات بشكل ديناميكي
    async loadTranslationFile(lang) {
        try {
            const response = await fetch(`assets/locales/${lang}.json`);
            if (response.ok) {
                const translations = await response.json();
                this.translations[lang] = { ...this.translations[lang], ...translations };
                return true;
            }
        } catch (error) {
            console.warn(`Could not load translation file for ${lang}:`, error);
        }
        return false;
    }

    // دالة لإضافة ترجمات مخصصة
    addTranslations(lang, newTranslations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang] = { ...this.translations[lang], ...newTranslations };
        
        // إذا كانت اللغة الحالية، قم بتحديث الواجهة
        if (lang === this.currentLang) {
            this.updateAllTexts();
        }
    }
}

// Initialize Language Manager
window.languageManager = new LanguageManager();

// دالة مساعدة للترجمة السريعة
window.t = (key, params = {}) => {
    return window.languageManager?.t(key, params) || key;
};

// تصدير للاستخدام في الموديولات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
