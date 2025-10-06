// تطبيق Prok الرئيسي
class ProkApp {
    constructor() {
        this.init();
    }

    init() {
        this.hideLoading();
        this.loadSampleData();
        this.setupEventListeners();
    }

    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        }, 1000);
    }

    loadSampleData() {
        const sampleApps = [
            {
                id: 1,
                name: 'تطبيق الإنتاجية',
                description: 'تطبيق مميز لزيادة الإنتاجية والتنظيم اليومي',
                image: 'assets/img/banner1.svg',
                rating: 4.5,
                size: '15MB',
                category: 'productivity'
            },
            {
                id: 2,
                name: 'تطبيق التواصل',
                description: 'تواصل مع الأصدقاء والعائلة بسهولة وأمان',
                image: 'assets/img/banner2.svg',
                rating: 4.2,
                size: '25MB',
                category: 'social'
            }
        ];

        const sampleGames = [
            {
                id: 1,
                name: 'لعبة المغامرة',
                description: 'انطلق في رحلة مغامرة مثيرة عبر العوالم المختلفة',
                image: 'assets/img/banner3.svg',
                rating: 4.8,
                size: '50MB',
                category: 'adventure'
            }
        ];

        this.renderApps(sampleApps);
        this.renderGames(sampleGames);
    }

    renderApps(apps) {
        const grid = document.getElementById('appsGrid');
        if (!grid) return;

        grid.innerHTML = apps.map(app => `
            <div class="app-card fade-in">
                <img src="${app.image}" alt="${app.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${app.name}</h3>
                    <p class="card-description">${app.description}</p>
                    <div class="card-meta">
                        <div class="card-rating">⭐ ${app.rating}</div>
                        <div class="card-size">${app.size}</div>
                    </div>
                    <div class="card-actions">
                        <a href="#" class="btn btn-primary">📥 تنزيل</a>
                        <button class="btn btn-secondary">ℹ️ تفاصيل</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderGames(games) {
        const grid = document.getElementById('gamesGrid');
        if (!grid) return;

        grid.innerHTML = games.map(game => `
            <div class="game-card fade-in">
                <img src="${game.image}" alt="${game.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${game.name}</h3>
                    <p class="card-description">${game.description}</p>
                    <div class="card-meta">
                        <div class="card-rating">⭐ ${game.rating}</div>
                        <div class="card-size">${game.size}</div>
                    </div>
                    <div class="card-actions">
                        <a href="#" class="btn btn-primary">🎮 لعب</a>
                        <button class="btn btn-secondary">ℹ️ تفاصيل</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // زر الأدمن
        const adminBtn = document.getElementById('adminLogin');
        const adminModal = document.getElementById('adminModal');
        const closeModal = document.getElementById('closeModal');

        if (adminBtn && adminModal) {
            adminBtn.addEventListener('click', () => {
                adminModal.style.display = 'flex';
            });
        }

        if (closeModal && adminModal) {
            closeModal.addEventListener('click', () => {
                adminModal.style.display = 'none';
            });
        }

        // زر الثيم
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                document.body.style.backgroundColor = document.body.style.backgroundColor === 'rgb(31, 41, 55)' ? '#ffffff' : '#1f2937';
                document.body.style.color = document.body.style.color === 'white' ? '#1f2937' : 'white';
            });
        }
    }
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', () => {
    new ProkApp();
});
