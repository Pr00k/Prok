/**
 * نظام الترجمة متعدد اللغات لموقع Prok
 */

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('prok_language') || 'ar';
        this.translations = {};
        
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyLanguage(this.currentLang);
        this.initializeLanguageSwitcher();
    }

    async loadTranslations() {
        this.translations = {
            ar: {
                // القائمة الرئيسية
                'menu_home': 'الرئيسية',
                'menu_apps': 'التطبيقات',
                'menu_games': 'الألعاب',
                'menu_contact': 'اتصل بنا',
                'menu_languages': 'اللغات',
                'menu_admin': 'أدمن',

                // العناوين
                'apps_title': 'التطبيقات الشائعة',
                'apps_subtitle': 'اكتشف أفضل التطبيقات المجانية',
                'games_title': 'الألعاب المميزة',
                'games_subtitle': 'استمتع بألعاب مجانية رائعة',
                'contact_title': 'اتصل بنا',
                'contact_subtitle': 'نحن هنا لمساعدتك',

                // الفلاتر
                'filter_all': 'الكل',
                'filter_productivity': 'الإنتاجية',
                'filter_social': 'التواصل',
                'filter_tools': 'الأدوات',

                // الأزرار
                'download': 'تنزيل',
                'play': 'لعب',
                'details': 'تفاصيل',
                'view_all': 'عرض الكل',

                // التذييل
                'footer_desc': 'منصة التطبيقات والألعاب المجانية',
                'quick_links': 'روابط سريعة',
                'contact_us': 'التواصل',
                'all_rights': 'جميع الحقوق محفوظة.',

                // الاتصال
                'contact_email': 'البريد الإلكتروني',
                'contact_support': 'الدعم الفني',
                'support_available': 'متاح 24/7',

                // الإدارة
                'admin_login': 'تسجيل الدخول',
                'admin_logout': 'تسجيل خروج',
                'edit_content': 'تحرير المحتوى',
                'save_changes': 'حفظ التغييرات',
                'cancel': 'إلغاء'
            },
            en: {
                // Navigation
                'menu_home': 'Home',
                'menu_apps': 'Apps',
                'menu_games': 'Games',
                'menu_contact': 'Contact',
                'menu_languages': 'Languages',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Popular Apps',
                'apps_subtitle': 'Discover the best free apps',
                'games_title': 'Featured Games',
                'games_subtitle': 'Enjoy amazing free games',
                'contact_title': 'Contact Us',
                'contact_subtitle': 'We are here to help you',

                // Filters
                'filter_all': 'All',
                'filter_productivity': 'Productivity',
                'filter_social': 'Social',
                'filter_tools': 'Tools',

                // Buttons
                'download': 'Download',
                'play': 'Play',
                'details': 'Details',
                'view_all': 'View All',

                // Footer
                'footer_desc': 'Free Apps & Games Platform',
                'quick_links': 'Quick Links',
                'contact_us': 'Contact',
                'all_rights': 'All rights reserved.',

                // Contact
                'contact_email': 'Email',
                'contact_support': 'Technical Support',
                'support_available': 'Available 24/7',

                // Admin
                'admin_login': 'Login',
                'admin_logout': 'Logout',
                'edit_content': 'Edit Content',
                'save_changes': 'Save Changes',
                'cancel': 'Cancel'
            },
            fr: {
                // Navigation
                'menu_home': 'Accueil',
                'menu_apps': 'Applications',
                'menu_games': 'Jeux',
                'menu_contact': 'Contact',
                'menu_languages': 'Langues',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Applications Populaires',
                'apps_subtitle': 'Découvrez les meilleures applications gratuites',
                'games_title': 'Jeux en Vedette',
                'games_subtitle': 'Profitez de jeux gratuits incroyables',
                'contact_title': 'Contactez-Nous',
                'contact_subtitle': 'Nous sommes là pour vous aider',

                // Filters
                'filter_all': 'Tous',
                'filter_productivity': 'Productivité',
                'filter_social': 'Social',
                'filter_tools': 'Outils',

                // Buttons
                'download': 'Télécharger',
                'play': 'Jouer',
                'details': 'Détails',
                'view_all': 'Voir Tout',

                // Footer
                'footer_desc': 'Plateforme d\'Applications et Jeux Gratuits',
                'quick_links': 'Liens Rapides',
                'contact_us': 'Contact',
                'all_rights': 'Tous droits réservés.',

                // Contact
                'contact_email': 'E-mail',
                'contact_support': 'Support Technique',
                'support_available': 'Disponible 24/7'
            },
            es: {
                // Navigation
                'menu_home': 'Inicio',
                'menu_apps': 'Aplicaciones',
                'menu_games': 'Juegos',
                'menu_contact': 'Contacto',
                'menu_languages': 'Idiomas',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Aplicaciones Populares',
                'apps_subtitle': 'Descubre las mejores aplicaciones gratuitas',
                'games_title': 'Juegos Destacados',
                'games_subtitle': 'Disfruta de juegos gratuitos increíbles',
                'contact_title': 'Contáctenos',
                'contact_subtitle': 'Estamos aquí para ayudarte',

                // Filters
                'filter_all': 'Todos',
                'filter_productivity': 'Productividad',
                'filter_social': 'Social',
                'filter_tools': 'Herramientas',

                // Buttons
                'download': 'Descargar',
                'play': 'Jugar',
                'details': 'Detalles',
                'view_all': 'Ver Todo',

                // Footer
                'footer_desc': 'Plataforma de Aplicaciones y Juegos Gratuitos',
                'quick_links': 'Enlaces Rápidos',
                'contact_us': 'Contacto',
                'all_rights': 'Todos los derechos reservados.',

                // Contact
                'contact_email': 'Correo Electrónico',
                'contact_support': 'Soporte Técnico',
                'support_available': 'Disponible 24/7'
            },
            de: {
                // Navigation
                'menu_home': 'Startseite',
                'menu_apps': 'Apps',
                'menu_games': 'Spiele',
                'menu_contact': 'Kontakt',
                'menu_languages': 'Sprachen',
                'menu_admin': 'Admin',

                // Titles
                'apps_title': 'Beliebte Apps',
                'apps_subtitle': 'Entdecken Sie die besten kostenlosen Apps',
                'games_title': 'Ausgewählte Spiele',
                'games_subtitle': 'Genießen Sie erstaunliche kostenlose Spiele',
                'contact_title': 'Kontaktieren Sie Uns',
                'contact_subtitle': 'Wir sind hier, um Ihnen zu helfen',

                // Filters
                'filter_all': 'Alle',
                'filter_productivity': 'Produktivität',
                'filter_social': 'Sozial',
                'filter_tools': 'Werkzeuge',

                // Buttons
                'download': 'Herunterladen',
                'play': 'Spielen',
                'details': 'Einzelheiten',
                'view_all': 'Alle Anzeigen',

                // Footer
                'footer_desc': 'Kostenlose Apps & Spiele Plattform',
                'quick_links': 'Schnelllinks',
                'contact_us': 'Kontakt',
                'all_rights': 'Alle Rechte vorbehalten.',

                // Contact
                'contact_email': 'E-Mail',
                'contact_support': 'Technischer Support',
                'support_available': '24/7 Verfügbar'
            }
        };
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('prok_language', lang);
        
        // تغيير اتجاه الصفحة
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // تطبيق الترجمات
        this.updateAllTexts();
        
        // إشعار تغيير اللغة
        if (window.prokApp) {
            window.prokApp.showToast(
                lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 
                lang === 'en' ? 'Language changed to English' :
                lang === 'fr' ? 'Langue changée en français' :
                lang === 'es' ? 'Idioma cambiado a español' :
                'Sprache zu Deutsch geändert',
                'success'
            );
        }
    }

    updateAllTexts() {
        const langData = this.translations[this.currentLang];
        if (!langData) return;

        // تحديث جميع العناصر التي تحتوي على data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langData[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = langData[key];
                } else {
                    element.textContent = langData[key];
                }
            }
        });

        // تحديث أزرار الفلترة
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const key = `filter_${filter}`;
            if (langData[key]) {
                btn.textContent = langData[key];
            }
        });

        // تحديث أزرار التطبيقات والألعاب
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('تنزيل') || btn.textContent.includes('Download')) {
                btn.innerHTML = `📥 ${langData['download']}`;
            } else if (btn.textContent.includes('لعب') || btn.textContent.includes('Play')) {
                btn.innerHTML = `🎮 ${langData['play']}`;
            }
        });

        document.querySelectorAll('.btn-secondary').forEach(btn => {
            if (btn.textContent.includes('تفاصيل') || btn.textContent.includes('Details')) {
                btn.innerHTML = `ℹ️ ${langData['details']}`;
            }
        });
    }

    initializeLanguageSwitcher() {
        // إضافة event listeners لأزرار تغيير اللغة
        document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.getAttribute('data-lang');
                this.applyLanguage(lang);
            });
        });
    }

    translate(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialize Language Manager
window.languageManager = new LanguageManager();
