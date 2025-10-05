/**
 * النظام الرئيسي المحسن مع التصفية والترقيم
 */

class ProkApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.siteData = null;
        this.isLoading = true;
        this.currentPage = {
            apps: 1,
            games: 1
        };
        this.itemsPerPage = 9;
        this.filters = {
            apps: {
                category: 'all',
                sort: 'newest',
                search: '',
                view: 'grid'
            },
            games: {
                category: 'all',
                sort: 'newest',
                search: '',
                view: 'grid'
            }
        };
        
        this.init();
    }

    async init() {
        this.setTheme(this.currentTheme);
        this.initializeComponents();
        await this.loadSiteData();
        this.renderContent();
        this.hideLoading();
        this.initializeEventListeners();
        this.initializeFilters();
    }

    initializeComponents() {
        this.initializeCarousel();
        this.initializeViewToggle();
    }

    initializeEventListeners() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupLanguageChangeListener();
    }

    setupLanguageChangeListener() {
        document.addEventListener('languageChanged', (e) => {
            this.renderContent();
        });
    }

    initializeFilters() {
        this.setupAppFilters();
        this.setupGameFilters();
        this.setupSearch();
        this.setupPagination();
    }

    setupAppFilters() {
        const categoryFilter = document.getElementById('app-category-filter');
        const sortFilter = document.getElementById('app-sort-filter');
        const searchInput = document.getElementById('app-search');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.apps.category = e.target.value;
                this.filterAndRenderApps();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.apps.sort = e.target.value;
                this.filterAndRenderApps();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filters.apps.search = e.target.value.toLowerCase();
                this.filterAndRenderApps();
            }, 300));
        }
    }

    setupGameFilters() {
        const categoryFilter = document.getElementById('game-category-filter');
        const sortFilter = document.getElementById('game-sort-filter');
        const searchInput = document.getElementById('game-search');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.games.category = e.target.value;
                this.filterAndRenderGames();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.games.sort = e.target.value;
                this.filterAndRenderGames();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filters.games.search = e.target.value.toLowerCase();
                this.filterAndRenderGames();
            }, 300));
        }
    }

    setupSearch() {
        // تم التنفيذ في setupAppFilters و setupGameFilters
    }

    setupPagination() {
        // سيكون التنفيذ في renderContent
    }

    initializeViewToggle() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                const section = e.currentTarget.closest('.section').id;
                
                this.setView(section, view);
            });
        });
    }

    setView(section, view) {
        const isApps = section === 'apps';
        const grid = isApps ? document.getElementById('apps-grid') : document.getElementById('games-grid');
        const buttons = document.querySelectorAll(`#${section} .view-btn`);
        
        if (!grid) return;

        // تحديث الأزرار
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });

        // تحديث الشبكة
        grid.className = isApps ? 'apps-grid' : 'games-grid';
        if (view === 'list') {
            grid.classList.add('list-view');
        }

        // حفظ التفضيل
        if (isApps) {
            this.filters.apps.view = view;
        } else {
            this.filters.games.view = view;
        }
    }

    async loadSiteData() {
        try {
            if (window.firebaseManager && window.firebaseManager.isConfigured) {
                this.siteData = await window.firebaseManager.getSiteData();
            } else {
                this.siteData = await this.getSampleData();
            }
        } catch (error) {
            console.error('Error loading site data:', error);
            this.siteData = await this.getSampleData();
            this.showToast('جاري استخدام البيانات المحلية', 'warning');
        }
    }

    async getSampleData() {
        // بيانات نموذجية شاملة
        return {
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
            apps: this.generateSampleApps(),
            games: this.generateSampleGames(),
            siteContent: {
                title: 'Prok - تطبيقات وألعاب مجانية',
                description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
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
                ]
            }
        };
    }

    generateSampleApps() {
        const apps = [];
        const categories = ['productivity', 'social', 'tools', 'entertainment'];
        const names = {
            ar: ['تطبيق الإنتاجية', 'تطبيق التواصل', 'أدوات المطور', 'تطبيق الترفيه'],
            en: ['Productivity App', 'Social App', 'Developer Tools', 'Entertainment App']
        };

        for (let i = 1; i <= 25; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const lang = window.languageManager?.getCurrentLanguage() || 'ar';
            
            apps.push({
                id: i,
                name: `${names[lang]?.[categories.indexOf(category)] || 'تطبيق'} ${i}`,
                description: `وصف تطبيق مثالي للإنتاجية والاستخدام اليومي. ${i}`,
                image: 'assets/img/app-placeholder.svg',
                rating: (Math.random() * 1 + 4).toFixed(1),
                size: `${Math.floor(Math.random() * 50) + 10}MB`,
                category: category,
                downloadLink: '#',
                animation: 'fade-in',
                featured: i <= 5,
                views: Math.floor(Math.random() * 1000),
                downloads: Math.floor(Math.random() * 500),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return apps;
    }

    generateSampleGames() {
        const games = [];
        const categories = ['action', 'adventure', 'puzzle', 'sports', 'racing'];
        const names = {
            ar: ['لعبة الأكشن', 'مغامرة مثيرة', 'تحدي الألغاز', 'رياضة افتراضية', 'سباق السيارات'],
            en: ['Action Game', 'Exciting Adventure', 'Puzzle Challenge', 'Virtual Sports', 'Car Racing']
        };

        for (let i = 1; i <= 20; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const lang = window.languageManager?.getCurrentLanguage() || 'ar';
            
            games.push({
                id: i + 100,
                name: `${names[lang]?.[categories.indexOf(category)] || 'لعبة'} ${i}`,
                description: `وصف لعبة ممتعة وتفاعلية لتجربة رائعة. ${i}`,
                image: 'assets/img/game-placeholder.svg',
                rating: (Math.random() * 1 + 4).toFixed(1),
                size: `${Math.floor(Math.random() * 100) + 50}MB`,
                category: category,
                downloadLink: '#',
                animation: 'fade-in',
                featured: i <= 5,
                views: Math.floor(Math.random() * 2000),
                downloads: Math.floor(Math.random() * 800),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return games;
    }

    renderContent() {
        if (!this.siteData) return;

        this.renderBanners();
        this.filterAndRenderApps();
        this.filterAndRenderGames();
        this.renderAboutSection();
        this.updatePageMetadata();
    }

    filterAndRenderApps() {
        if (!this.siteData?.apps) return;

        let filteredApps = [...this.siteData.apps];

        // التصفية حسب الفئة
        if (this.filters.apps.category !== 'all') {
            filteredApps = filteredApps.filter(app => app.category === this.filters.apps.category);
        }

        // البحث
        if (this.filters.apps.search) {
            filteredApps = filteredApps.filter(app => 
                app.name.toLowerCase().includes(this.filters.apps.search) ||
                app.description.toLowerCase().includes(this.filters.apps.search)
            );
        }

        // الترتيب
        filteredApps = this.sortItems(filteredApps, this.filters.apps.sort);

        // الترقيم
        const totalPages = Math.ceil(filteredApps.length / this.itemsPerPage);
        const startIndex = (this.currentPage.apps - 1) * this.itemsPerPage;
        const paginatedApps = filteredApps.slice(startIndex, startIndex + this.itemsPerPage);

        this.renderAppsGrid(paginatedApps);
        this.renderAppsPagination(filteredApps.length, totalPages);
    }

    filterAndRenderGames() {
        if (!this.siteData?.games) return;

        let filteredGames = [...this.siteData.games];

        // التصفية حسب الفئة
        if (this.filters.games.category !== 'all') {
            filteredGames = filteredGames.filter(game => game.category === this.filters.games.category);
        }

        // البحث
        if (this.filters.games.search) {
            filteredGames = filteredGames.filter(game => 
                game.name.toLowerCase().includes(this.filters.games.search) ||
                game.description.toLowerCase().includes(this.filters.games.search)
            );
        }

        // الترتيب
        filteredGames = this.sortItems(filteredGames, this.filters.games.sort);

        // الترقيم
        const totalPages = Math.ceil(filteredGames.length / this.itemsPerPage);
        const startIndex = (this.currentPage.games - 1) * this.itemsPerPage;
        const paginatedGames = filteredGames.slice(startIndex, startIndex + this.itemsPerPage);

        this.renderGamesGrid(paginatedGames);
        this.renderGamesPagination(filteredGames.length, totalPages);
    }

    sortItems(items, sortBy) {
        const sorted = [...items];
        
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'popular':
                return sorted.sort((a, b) => b.views - a.views);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'downloads':
                return sorted.sort((a, b) => b.downloads - a.downloads);
            default:
                return sorted;
        }
    }

    renderAppsGrid(apps) {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;

        appsGrid.innerHTML = '';

        if (apps.length === 0) {
            appsGrid.innerHTML = `
                <div class="no-results">
                    <h3>لا توجد تطبيقات</h3>
                    <p>لم يتم العثور على تطبيقات تطابق معايير البحث.</p>
                </div>
            `;
            return;
        }

        apps.forEach(app => {
            const appCard = this.createAppCard(app);
            appsGrid.appendChild(appCard);
        });

        // تطبيق طريقة العرض
        if (this.filters.apps.view === 'list') {
            appsGrid.classList.add('list-view');
        } else {
            appsGrid.classList.remove('list-view');
        }
    }

    renderGamesGrid(games) {
        const gamesGrid = document.getElementById('games-grid');
        if (!gamesGrid) return;

        gamesGrid.innerHTML = '';

        if (games.length === 0) {
            gamesGrid.innerHTML = `
                <div class="no-results">
                    <h3>لا توجد ألعاب</h3>
                    <p>لم يتم العثور على ألعاب تطابق معايير البحث.</p>
                </div>
            `;
            return;
        }

        games.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });

        // تطبيق طريقة العرض
        if (this.filters.games.view === 'list') {
            gamesGrid.classList.add('list-view');
        } else {
            gamesGrid.classList.remove('list-view');
        }
    }

    renderAppsPagination(totalItems, totalPages) {
        const pagination = document.getElementById('apps-pagination');
        const numbersContainer = document.getElementById('apps-pagination-numbers');
        
        if (!pagination || !numbersContainer) return;

        this.renderPagination(pagination, numbersContainer, totalItems, totalPages, 'apps');
    }

    renderGamesPagination(totalItems, totalPages) {
        const pagination = document.getElementById('games-pagination');
        const numbersContainer = document.getElementById('games-pagination-numbers');
        
        if (!pagination || !numbersContainer) return;

        this.renderPagination(pagination, numbersContainer, totalItems, totalPages, 'games');
    }

    renderPagination(pagination, numbersContainer, totalItems, totalPages, type) {
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        // تحديث أزرار السابق والتالي
        const prevBtn = pagination.querySelector('.prev');
        const nextBtn = pagination.querySelector('.next');
        
        prevBtn.disabled = this.currentPage[type] === 1;
        nextBtn.disabled = this.currentPage[type] === totalPages;

        // إضافة event listeners
        prevBtn.onclick = () => this.changePage(type, this.currentPage[type] - 1);
        nextBtn.onclick = () => this.changePage(type, this.currentPage[type] + 1);

        // إنشاء أرقام الصفحات
        numbersContainer.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage[type] - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // زر الصفحة الأولى
        if (startPage > 1) {
            const firstPage = this.createPageNumber(1, type);
            numbersContainer.appendChild(firstPage);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                numbersContainer.appendChild(ellipsis);
            }
        }

        // أرقام الصفحات
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = this.createPageNumber(i, type);
            numbersContainer.appendChild(pageNumber);
        }

        // زر الصفحة الأخيرة
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                numbersContainer.appendChild(ellipsis);
            }
            const lastPage = this.createPageNumber(totalPages, type);
            numbersContainer.appendChild(lastPage);
        }

        // معلومات النتائج
        const startItem = (this.currentPage[type] - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage[type] * this.itemsPerPage, totalItems);
        
        const infoText = `عرض ${startItem}-${endItem} من ${totalItems} نتيجة`;
        let infoElement = pagination.querySelector('.pagination-info');
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.className = 'pagination-info';
            pagination.appendChild(infoElement);
        }
        infoElement.textContent = infoText;
    }

    createPageNumber(page, type) {
        const pageElement = document.createElement('button');
        pageElement.className = `pagination-number ${page === this.currentPage[type] ? 'active' : ''}`;
        pageElement.textContent = page;
        pageElement.onclick = () => this.changePage(type, page);
        return pageElement;
    }

    changePage(type, newPage) {
        this.currentPage[type] = newPage;
        
        if (type === 'apps') {
            this.filterAndRenderApps();
        } else {
            this.filterAndRenderGames();
        }

        // التمرير إلى أعلى القسم
        const section = document.getElementById(type);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    createAppCard(app) {
        const card = document.createElement('div');
        card.className = `app-card ${app.animation || 'fade-in'}`;
        card.setAttribute('data-category', app.category);
        card.setAttribute('data-id', app.id);
        
        const featuredBadge = app.featured ? '<span class="featured-badge">مميز</span>' : '';
        const statsInfo = `
            <div class="card-stats">
                <span class="stat-view">👁️ ${app.views}</span>
                <span class="stat-download">📥 ${app.downloads}</span>
            </div>
        `;
        
        card.innerHTML = `
            ${featuredBadge}
            <img src="${app.image}" alt="${app.name}" class="card-image" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${app.name}</h3>
                <p class="card-description">${app.description}</p>
                <div class="card-meta">
                    <div class="card-rating">
                        ⭐ ${app.rating}
                    </div>
                    <div class="card-size">
                        ${app.size}
                    </div>
                </div>
                ${statsInfo}
                <div class="card-actions">
                    <a href="${app.downloadLink}" class="btn btn-primary" download>
                        📥 ${window.languageManager?.translate('download') || 'تنزيل'}
                    </a>
                    <button class="btn btn-secondary details-btn" data-app="${app.id}">
                        ℹ️ ${window.languageManager?.translate('details') || 'تفاصيل'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    createGameCard(game) {
        const card = document.createElement('div');
        card.className = `game-card ${game.animation || 'fade-in'}`;
        card.setAttribute('data-category', game.category);
        card.setAttribute('data-id', game.id);
        
        const featuredBadge = game.featured ? '<span class="featured-badge">مميز</span>' : '';
        const statsInfo = `
            <div class="card-stats">
                <span class="stat-view">👁️ ${game.views}</span>
                <span class="stat-download">🎮 ${game.downloads}</span>
            </div>
        `;
        
        card.innerHTML = `
            ${featuredBadge}
            <img src="${game.image}" alt="${game.name}" class="card-image" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${game.name}</h3>
                <p class="card-description">${game.description}</p>
                <div class="card-meta">
                    <div class="card-rating">
                        ⭐ ${game.rating}
                    </div>
                    <div class="card-size">
                        ${game.size}
                    </div>
                </div>
                ${statsInfo}
                <div class="card-actions">
                    <a href="${game.downloadLink}" class="btn btn-primary" download>
                        🎮 ${window.languageManager?.translate('play') || 'لعب'}
                    </a>
                    <button class="btn btn-secondary details-btn" data-game="${game.id}">
                        ℹ️ ${window.languageManager?.translate('details') || 'تفاصيل'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // الدوال المساعدة
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // الدوال الأساسية المتبقية
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`تم التبديل إلى الوضع ${newTheme === 'dark' ? 'المظلم' : 'الفاتح'}`, 'success');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    renderBanners() {
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselDots = document.querySelector('.carousel-dots');
        
        if (!carouselTrack || !this.siteData.banners) return;

        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';

        this.siteData.banners.forEach((banner, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${banner.animation || 'fade-in'}`;
            slide.innerHTML = `
                <img src="${banner.image}" alt="${banner.title}" loading="lazy">
                <div class="carousel-content">
                    <h2>${banner.title}</h2>
                    <p>${banner.description}</p>
                    <a href="${banner.link}" class="btn btn-primary">${window.languageManager?.translate('view_all') || 'عرض الكل'}</a>
                </div>
            `;
            carouselTrack.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `انتقل إلى لافتة ${index + 1}`);
            carouselDots.appendChild(dot);
        });

        this.initializeCarousel();
    }

    initializeCarousel() {
        // تنفيذ الكاروسيل
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (!track || slides.length === 0) return;

        let currentSlide = 0;
        const slideCount = slides.length;
        let autoPlayInterval;

        const goToSlide = (index) => {
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;
            
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
            
            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== currentSlide);
            });
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') prevSlide();
            if (e.key === 'ArrowLeft') nextSlide();
        });

        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay);
        track.addEventListener('touchend', startAutoPlay);

        startAutoPlay();
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== 0);
            slide.setAttribute('role', 'tabpanel');
        });
    }

    renderAboutSection() {
        if (!this.siteData.siteContent) return;

        const aboutText = document.querySelector('.about-text p');
        const stats = this.siteData.siteContent.stats;

        if (aboutText && this.siteData.siteContent.aboutText) {
            aboutText.textContent = this.siteData.siteContent.aboutText;
        }

        if (stats) {
            const statItems = document.querySelectorAll('.stat-item h3');
            if (statItems.length >= 3) {
                statItems[0].textContent = stats.apps;
                statItems[1].textContent = stats.games;
                statItems[2].textContent = stats.users;
            }
        }
    }

    updatePageMetadata() {
        if (!this.siteData.siteContent) return;

        if (this.siteData.siteContent.title) {
            document.title = this.siteData.siteContent.title;
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.siteData.siteContent.description) {
            metaDescription.setAttribute('content', this.siteData.siteContent.description);
        }
    }

    hideLoading() {
        const loadingSpinner = document.getElementById('loading');
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
            setTimeout(() => {
                loadingSpinner.remove();
            }, 300);
        }
        this.isLoading = false;
    }

    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    window.prokApp = new ProkApp();
});

// Global function for toast
window.showToast = function(message, type = 'info') {
    if (window.prokApp) {
        window.prokApp.showToast(message, type);
    }
};
