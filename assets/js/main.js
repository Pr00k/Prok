/**
 * Enhanced Main JavaScript for Prok
 * With improved performance and features
 */

class ProkApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.siteData = null;
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Initialize components
        this.initializeComponents();
        
        // Load site data
        await this.loadSiteData();
        
        // Render content
        this.renderContent();
        
        // Hide loading spinner
        this.hideLoading();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeComponents() {
        // Initialize carousel
        this.initializeCarousel();
        
        // Initialize filters
        this.initializeFilters();
        
        // Initialize animations
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
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

        // Lazy loading for images
        this.initializeLazyLoading();

        // Intersection Observer for animations
        this.initializeIntersectionObserver();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme button icon
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

    async loadSiteData() {
        try {
            if (window.firebaseManager && window.firebaseManager.isConfigured) {
                this.siteData = await window.firebaseManager.getSiteData();
            } else {
                // Use sample data if Firebase is not configured
                this.siteData = window.SAMPLE_DATA || await this.getSampleData();
            }
        } catch (error) {
            console.error('Error loading site data:', error);
            this.siteData = await this.getSampleData();
            this.showToast('جاري استخدام البيانات المحلية', 'warning');
        }
    }

    async getSampleData() {
        // Return comprehensive sample data
        return {
            banners: [
                {
                    id: 1,
                    image: 'assets/img/banner1.svg',
                    title: 'مرحباً بك في Prok',
                    description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
                    link: '#apps',
                    animation: 'fade-in'
                },
                {
                    id: 2,
                    image: 'assets/img/banner2.svg',
                    title: 'تطبيقات مذهلة',
                    description: 'مجموعة مختارة من أفضل التطبيقات',
                    link: '#apps',
                    animation: 'slide-up'
                },
                {
                    id: 3,
                    image: 'assets/img/banner3.svg',
                    title: 'ألعاب رائعة',
                    description: 'استمتع بألعاب مجانية ممتعة',
                    link: '#games',
                    animation: 'zoom-in'
                }
            ],
            apps: [
                {
                    id: 1,
                    name: 'تطبيق الإنتاجية',
                    description: 'تطبيق مميز لزيادة الإنتاجية والتنظيم اليومي',
                    image: 'assets/img/app-placeholder.svg',
                    rating: 4.5,
                    size: '15MB',
                    category: 'productivity',
                    downloadLink: '#',
                    animation: 'fade-in',
                    featured: true
                },
                {
                    id: 2,
                    name: 'تطبيق التواصل',
                    description: 'تواصل مع الأصدقاء والعائلة بسهولة وأمان',
                    image: 'assets/img/app-placeholder.svg',
                    rating: 4.2,
                    size: '25MB',
                    category: 'social',
                    downloadLink: '#',
                    animation: 'slide-up',
                    featured: false
                },
                {
                    id: 3,
                    name: 'أدوات المطور',
                    description: 'مجموعة أدوات أساسية لكل مبرمج',
                    image: 'assets/img/app-placeholder.svg',
                    rating: 4.7,
                    size: '10MB',
                    category: 'tools',
                    downloadLink: '#',
                    animation: 'zoom-in',
                    featured: true
                }
            ],
            games: [
                {
                    id: 1,
                    name: 'لعبة المغامرة',
                    description: 'انطلق في رحلة مغامرة مثيرة عبر العوالم المختلفة',
                    image: 'assets/img/game-placeholder.svg',
                    rating: 4.8,
                    size: '50MB',
                    category: 'adventure',
                    downloadLink: '#',
                    animation: 'fade-in',
                    featured: true
                },
                {
                    id: 2,
                    name: 'تحدي الألغاز',
                    description: 'اختبر ذكاءك مع ألغاز ممتعة ومثيرة',
                    image: 'assets/img/game-placeholder.svg',
                    rating: 4.4,
                    size: '30MB',
                    category: 'puzzle',
                    downloadLink: '#',
                    animation: 'slide-up',
                    featured: false
                }
            ],
            siteContent: {
                title: 'Prok - تطبيقات وألعاب مجانية',
                description: 'اكتشف أفضل التطبيقات والألعاب المجانية',
                aboutText: 'منصة Prok تقدم أفضل التطبيقات والألعاب المجانية بعالية الجودة وسهولة الاستخدام. نحن نؤمن بتقديم تجربة مستخدم استثنائية مع الحفاظ على مجانية المحتوى.',
                stats: {
                    apps: '50+',
                    games: '30+',
                    users: '10K+'
                }
            }
        };
    }

    renderContent() {
        if (!this.siteData) return;

        // Render banners
        this.renderBanners();
        
        // Render apps
        this.renderApps();
        
        // Render games
        this.renderGames();
        
        // Render about section
        this.renderAboutSection();
        
        // Update page metadata
        this.updatePageMetadata();
    }

    renderBanners() {
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselDots = document.querySelector('.carousel-dots');
        
        if (!carouselTrack || !this.siteData.banners) return;

        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';

        this.siteData.banners.forEach((banner, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${banner.animation || 'fade-in'}`;
            slide.innerHTML = `
                <img src="${banner.image}" alt="${banner.title}" loading="lazy">
                <div class="carousel-content">
                    <h2>${banner.title}</h2>
                    <p>${banner.description}</p>
                    <a href="${banner.link}" class="btn btn-primary">اكتشف المزيد</a>
                </div>
            `;
            carouselTrack.appendChild(slide);

            // Create dot
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `انتقل إلى لافتة ${index + 1}`);
            carouselDots.appendChild(dot);
        });

        // Reinitialize carousel
        this.initializeCarousel();
    }

    renderApps() {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid || !this.siteData.apps) return;

        appsGrid.innerHTML = '';

        this.siteData.apps.forEach(app => {
            const appCard = this.createAppCard(app);
            appsGrid.appendChild(appCard);
        });
    }

    renderGames() {
        const gamesGrid = document.getElementById('games-grid');
        if (!gamesGrid || !this.siteData.games) return;

        gamesGrid.innerHTML = '';

        this.siteData.games.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    }

    createAppCard(app) {
        const card = document.createElement('div');
        card.className = `app-card ${app.animation || 'fade-in'}`;
        card.setAttribute('data-category', app.category);
        
        const featuredBadge = app.featured ? '<span class="featured-badge">مميز</span>' : '';
        
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
                <div class="card-actions">
                    <a href="${app.downloadLink}" class="btn btn-primary" download>
                        📥 تنزيل
                    </a>
                    <button class="btn btn-secondary details-btn" data-app="${app.id}">
                        ℹ️ تفاصيل
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
        
        const featuredBadge = game.featured ? '<span class="featured-badge">مميز</span>' : '';
        
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
                <div class="card-actions">
                    <a href="${game.downloadLink}" class="btn btn-primary" download>
                        🎮 لعب
                    </a>
                    <button class="btn btn-secondary details-btn" data-game="${game.id}">
                        ℹ️ تفاصيل
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    renderAboutSection() {
        if (!this.siteData.siteContent) return;

        const aboutText = document.querySelector('.about-text p');
        const stats = this.siteData.siteContent.stats;

        if (aboutText && this.siteData.siteContent.aboutText) {
            aboutText.textContent = this.siteData.siteContent.aboutText;
        }

        // Update stats
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

        // Update page title
        if (this.siteData.siteContent.title) {
            document.title = this.siteData.siteContent.title;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.siteData.siteContent.description) {
            metaDescription.setAttribute('content', this.siteData.siteContent.description);
        }
    }

    initializeCarousel() {
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
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
            
            // Update ARIA attributes
            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== currentSlide);
            });
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        // Event listeners for navigation
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') prevSlide();
            if (e.key === 'ArrowLeft') nextSlide();
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Auto-play
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Pause auto-play on hover
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay);
        track.addEventListener('touchend', startAutoPlay);

        // Start auto-play
        startAutoPlay();

        // Initialize ARIA attributes
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== 0);
            slide.setAttribute('role', 'tabpanel');
        });
    }

    initializeFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const appCards = document.querySelectorAll('.app-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                // Filter cards
                appCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    initializeAnimations() {
        // Add animation classes to elements when they enter viewport
        const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .app-card, .game-card, .stat-item');
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    }

    initializeLazyLoading() {
        // Simple lazy loading implementation
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            if (!img.complete) {
                imageObserver.observe(img);
            }
        });
    }

    initializeIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
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
        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
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

        // Remove toast after delay
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

// Global function for toast
window.showToast = function(message, type = 'info') {
    if (window.prokApp) {
        window.prokApp.showToast(message, type);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.prokApp = new ProkApp();
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProkApp;
}
