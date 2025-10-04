let currentSlide = 0;
let slideInterval;
let siteContent = null;
let isAdmin = false;

const sampleContent = {
    title: "مقترحات اليوم",
    banners: [
        { url: "assets/img/banner1.svg", animation: "fade" },
        { url: "assets/img/banner2.svg", animation: "slide" },
        { url: "assets/img/banner3.svg", animation: "fade" }
    ],
    apps: [
        {
            id: "1",
            name: "تطبيق رائع",
            description: "تطبيق مميز يساعدك في إنجاز مهامك اليومية بسهولة وفعالية",
            icon: "assets/img/app-icon.svg",
            rating: 4.5,
            downloadUrl: "#",
            animation: "fade"
        },
        {
            id: "2",
            name: "لعبة مسلية",
            description: "لعبة ممتعة ومثيرة للتحدي مع رسومات عالية الجودة",
            icon: "assets/img/game-icon.svg",
            rating: 4.8,
            downloadUrl: "#",
            animation: "slide"
        }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    await loadContent();
    initCarousel();
    initEventListeners();
    hideLoader();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

async function loadContent() {
    if (!firebaseInitialized) {
        console.warn('Using sample content (Firebase not initialized)');
        siteContent = sampleContent;
        renderContent();
        return;
    }

    try {
        const docRef = db.collection('site').doc('content');
        const doc = await docRef.get();
        
        if (doc.exists) {
            siteContent = doc.data();
            console.log('✅ Content loaded from Firestore');
        } else {
            siteContent = sampleContent;
            await docRef.set(sampleContent);
            console.log('✅ Initial content created');
        }
    } catch (error) {
        console.error('Error loading content:', error);
        siteContent = sampleContent;
        showToast('تم تحميل المحتوى التجريبي', 'warning');
    }
    
    renderContent();
}

function renderContent() {
    if (!siteContent) return;
    
    const titleEl = document.getElementById('section-title');
    if (titleEl) titleEl.textContent = siteContent.title || 'مقترحات اليوم';
    
    renderBanners();
    renderApps();
}

function renderBanners() {
    const wrapper = document.getElementById('carousel-wrapper');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!wrapper || !dotsContainer) return;
    
    wrapper.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    const banners = siteContent.banners || sampleContent.banners;
    
    banners.forEach((banner, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${banner.url}" alt="Banner ${index + 1}" loading="lazy">`;
        wrapper.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function renderApps() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const apps = siteContent.apps || sampleContent.apps;
    
    apps.forEach(app => {
        const card = createAppCard(app);
        grid.appendChild(card);
    });
}

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card slide-up';
    card.innerHTML = `
        <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
        <h3 class="app-title">${app.name}</h3>
        <p class="app-description">${app.description}</p>
        <div class="app-rating">
            <span class="stars">${getStars(app.rating)}</span>
            <span class="rating-text">${app.rating.toFixed(1)}</span>
        </div>
        <a href="${app.downloadUrl}" class="app-download" target="_blank">تحميل</a>
        <div class="app-card-actions admin-only hidden">
            <button class="btn-edit-app" data-id="${app.id}">تعديل</button>
            <button class="btn-delete-app" data-id="${app.id}">حذف</button>
        </div>
    `;
    
    return card;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (halfStar) stars += '⭐';
    return stars;
}

function initCarousel() {
    const banners = siteContent?.banners || sampleContent.banners;
    if (banners.length <= 1) return;
    
    startAutoPlay();
    
    document.getElementById('carousel-prev')?.addEventListener('click', prevSlide);
    document.getElementById('carousel-next')?.addEventListener('click', nextSlide);
}

function goToSlide(index) {
    const banners = siteContent?.banners || sampleContent.banners;
    currentSlide = index;
    const wrapper = document.getElementById('carousel-wrapper');
    if (wrapper) {
        wrapper.style.transform = `translateX(${currentSlide * -100}%)`;
    }
    updateDots();
    resetAutoPlay();
}

function nextSlide() {
    const banners = siteContent?.banners || sampleContent.banners;
    currentSlide = (currentSlide + 1) % banners.length;
    goToSlide(currentSlide);
}

function prevSlide() {
    const banners = siteContent?.banners || sampleContent.banners;
    currentSlide = (currentSlide - 1 + banners.length) % banners.length;
    goToSlide(currentSlide);
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

function initEventListeners() {
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

window.siteContent = siteContent;
window.renderContent = renderContent;
window.showToast = showToast;
