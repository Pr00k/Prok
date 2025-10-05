/**
 * تكوين Firebase المحدث مع دعم الميزات الجديدة
 */

// بيانات نموذجية موسعة
const SAMPLE_DATA = {
    banners: [
        {
            id: 1,
            image: 'assets/img/banner1.svg',
            title: 'مرحباً بك في Prok',
            description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
            link: '#apps',
            animation: 'fade-in'
        }
    ],
    apps: [],
    games: [],
    siteContent: {
        title: 'Prok - تطبيقات وألعاب مجانية',
        description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
        aboutText: 'منصة Prok تقدم أفضل التطبيقات والألعاب المجانية.',
        stats: {
            apps: '50+',
            games: '30+',
            users: '10K+'
        }
    },
    menus: {
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
    },
    settings: {
        theme: 'light',
        language: 'ar',
        itemsPerPage: 9,
        animations: true
    }
};

class FirebaseManager {
    constructor() {
        this.isConfigured = false;
        this.isInitialized = false;
        this.currentUser = null;
        this.isAdmin = false;
        this.adminEmail = 'aaaab9957@gmail.com';
        
        this.init();
    }

    init() {
        try {
            if (typeof firebase === 'undefined' || !firebase.app) {
                throw new Error('Firebase SDK not loaded');
            }

            const firebaseConfig = {
                apiKey: "AIzaSyDfy48kwyj8iAu20hx3uJtzcbRGcfcKKn0",
                authDomain: "prok-58f05.firebaseapp.com",
                projectId: "prok-58f05",
                storageBucket: "prok-58f05.appspot.com",
                messagingSenderId: "978563434886",
                appId: "1:978563434886:web:d16c70551240a05c81c407",
                measurementId: "G-PWTGTT2VJT"
            };

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.isConfigured = true;
            this.isInitialized = true;
            
            this.auth = firebase.auth();
            this.firestore = firebase.firestore();
            this.storage = firebase.storage();
            
            this.setupAuthListener();
            this.showToast('تم تهيئة النظام بنجاح', 'success');
            
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.isConfigured = false;
            this.showToast('وضع العرض: استخدام البيانات المحلية', 'warning');
        }
    }

    // ... باقي الدوال تبقى كما هي مع بعض التحسينات الطفيفة
    // [يتم الحفاظ على الكود السابق مع إضافة دعم للميزات الجديدة]

    async getSiteData() {
        if (!this.isConfigured || !this.isAdmin) {
            return this.getEnhancedSampleData();
        }

        try {
            const doc = await this.firestore.collection('site').doc('content').get();
            if (doc.exists) {
                const data = doc.data();
                return this.mergeWithDefaults(data);
            } else {
                await this.firestore.collection('site').doc('content').set(this.getEnhancedSampleData());
                return this.getEnhancedSampleData();
            }
        } catch (error) {
            console.error('Error getting site data:', error);
            this.showToast('جاري استخدام البيانات المحلية', 'warning');
            return this.getEnhancedSampleData();
        }
    }

    getEnhancedSampleData() {
        // توليد بيانات نموذجية ديناميكية
        const sampleData = JSON.parse(JSON.stringify(SAMPLE_DATA));
        
        // توليد تطبيقات وألعاب عشوائية
        sampleData.apps = this.generateSampleItems('app', 25);
        sampleData.games = this.generateSampleItems('game', 20);
        
        return sampleData;
    }

    generateSampleItems(type, count) {
        const items = [];
        const categories = type === 'app' 
            ? ['productivity', 'social', 'tools', 'entertainment']
            : ['action', 'adventure', 'puzzle', 'sports', 'racing'];
        
        const names = {
            app: {
                ar: ['تطبيق الإنتاجية', 'تطبيق التواصل', 'أدوات المطور', 'تطبيق الترفيه'],
                en: ['Productivity App', 'Social App', 'Developer Tools', 'Entertainment App']
            },
            game: {
                ar: ['لعبة الأكشن', 'مغامرة مثيرة', 'تحدي الألغاز', 'رياضة افتراضية', 'سباق السيارات'],
                en: ['Action Game', 'Exciting Adventure', 'Puzzle Challenge', 'Virtual Sports', 'Car Racing']
            }
        };

        for (let i = 1; i <= count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const lang = localStorage.getItem('prok_language') || 'ar';
            
            items.push({
                id: type === 'app' ? i : i + 100,
                name: `${names[type][lang]?.[categories.indexOf(category)] || type === 'app' ? 'تطبيق' : 'لعبة'} ${i}`,
                description: `${type === 'app' ? 'وصف تطبيق مميز' : 'وصف لعبة رائعة'} ${i}`,
                image: `assets/img/${type}-placeholder.svg`,
                rating: (Math.random() * 1 + 4).toFixed(1),
                size: `${Math.floor(Math.random() * (type === 'app' ? 50 : 100)) + (type === 'app' ? 10 : 50)}MB`,
                category: category,
                downloadLink: '#',
                animation: 'fade-in',
                featured: i <= 5,
                views: Math.floor(Math.random() * (type === 'app' ? 1000 : 2000)),
                downloads: Math.floor(Math.random() * (type === 'app' ? 500 : 800)),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return items;
    }

    mergeWithDefaults(data) {
        const merged = { ...this.getEnhancedSampleData(), ...data };
        
        // دمج المصفوفات بشكل صحيح
        if (data?.apps) {
            merged.apps = data.apps;
        }
        if (data?.games) {
            merged.games = data.games;
        }
        if (data?.menus) {
            merged.menus = { ...this.getEnhancedSampleData().menus, ...data.menus };
        }
        
        return merged;
    }
}

// Initialize Firebase Manager
const firebaseManager = new FirebaseManager();
window.firebaseManager = firebaseManager;

// ... باقي الكود يبقى كما هو
