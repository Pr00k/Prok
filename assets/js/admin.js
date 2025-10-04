let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!firebaseInitialized) {
        console.warn('Admin features disabled (Firebase not initialized)');
        return;
    }
    
    initAuth();
    initAdminListeners();
});

function initAuth() {
    auth.onAuthStateChanged(user => {
        currentUser = user;
        if (user && user.email === ADMIN_EMAIL) {
            enableAdminMode();
        } else {
            disableAdminMode();
        }
    });
}

function enableAdminMode() {
    document.body.classList.add('admin-mode');
    document.getElementById('admin-email').textContent = currentUser.email;
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-logout').classList.remove('hidden');
    showToast('مرحباً بك في وضع الإدارة', 'success');
}

function disableAdminMode() {
    document.body.classList.remove('admin-mode');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-logout').classList.add('hidden');
}

function initAdminListeners() {
    document.getElementById('admin-login')?.addEventListener('click', adminLogin);
    document.getElementById('admin-logout')?.addEventListener('click', adminLogout);
    
    document.querySelector('[data-edit="title"]')?.addEventListener('click', editTitle);
    
    document.getElementById('add-app-btn')?.addEventListener('click', addApp);
    
    document.getElementById('apps-grid')?.addEventListener('click', e => {
        if (e.target.classList.contains('btn-edit-app')) {
            editApp(e.target.dataset.id);
        } else if (e.target.classList.contains('btn-delete-app')) {
            deleteApp(e.target.dataset.id);
        }
    });
}

async function adminLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Login error:', error);
        showToast('فشل تسجيل الدخول', 'error');
    }
}

async function adminLogout() {
    try {
        await auth.signOut();
        showToast('تم تسجيل الخروج', 'info');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function editTitle() {
    const currentTitle = window.siteContent?.title || 'مقترحات اليوم';
    const newTitle = prompt('أدخل العنوان الجديد:', currentTitle);
    
    if (newTitle && newTitle !== currentTitle) {
        updateContent({ title: newTitle });
    }
}

function addApp() {
    const modal = createEditModal('إضافة تطبيق جديد', {
        name: '',
        description: '',
        icon: '',
        rating: 4.5,
        downloadUrl: ''
    }, async (data) => {
        const newApp = {
            id: Date.now().toString(),
            ...data,
            rating: parseFloat(data.rating),
            animation: 'fade'
        };
        
        const apps = [...(window.siteContent?.apps || []), newApp];
        await updateContent({ apps });
        closeModal(modal);
    });
    
    document.body.appendChild(modal);
}

function editApp(appId) {
    const app = window.siteContent?.apps?.find(a => a.id === appId);
    if (!app) return;
    
    const modal = createEditModal('تعديل التطبيق', app, async (data) => {
        const apps = window.siteContent.apps.map(a => 
            a.id === appId ? { ...a, ...data, rating: parseFloat(data.rating) } : a
        );
        await updateContent({ apps });
        closeModal(modal);
    });
    
    document.body.appendChild(modal);
}

async function deleteApp(appId) {
    if (!confirm('هل أنت متأكد من حذف هذا التطبيق؟')) return;
    
    const apps = window.siteContent.apps.filter(a => a.id !== appId);
    await updateContent({ apps });
}

function createEditModal(title, data, onSave) {
    const overlay = document.createElement('div');
    overlay.className = 'edit-overlay';
    
    overlay.innerHTML = `
        <div class="edit-modal">
            <h3>${title}</h3>
            <input type="text" id="edit-name" placeholder="اسم التطبيق" value="${data.name || ''}">
            <textarea id="edit-description" placeholder="الوصف">${data.description || ''}</textarea>
            <input type="text" id="edit-icon" placeholder="رابط الأيقونة" value="${data.icon || ''}">
            <input type="number" id="edit-rating" placeholder="التقييم" value="${data.rating || 4.5}" step="0.1" min="0" max="5">
            <input type="text" id="edit-url" placeholder="رابط التحميل" value="${data.downloadUrl || ''}">
            <div class="edit-actions">
                <button class="btn-cancel">إلغاء</button>
                <button class="btn-save">حفظ</button>
            </div>
        </div>
    `;
    
    overlay.querySelector('.btn-cancel').addEventListener('click', () => closeModal(overlay));
    overlay.querySelector('.btn-save').addEventListener('click', () => {
        const formData = {
            name: overlay.querySelector('#edit-name').value,
            description: overlay.querySelector('#edit-description').value,
            icon: overlay.querySelector('#edit-icon').value,
            rating: overlay.querySelector('#edit-rating').value,
            downloadUrl: overlay.querySelector('#edit-url').value
        };
        onSave(formData);
    });
    
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay);
    });
    
    return overlay;
}

function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 300);
}

async function updateContent(updates) {
    try {
        window.siteContent = { ...window.siteContent, ...updates };
        await db.collection('site').doc('content').set(window.siteContent);
        window.renderContent();
        window.showToast('تم الحفظ بنجاح', 'success');
    } catch (error) {
        console.error('Update error:', error);
        window.showToast('فشل الحفظ', 'error');
    }
}
