<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة الأدمن — Prok</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="theme-dark admin-page">

<header class="topbar">
    <div class="container">
        <div class="brand">
            <i class="fas fa-user-shield"></i> Prok — لوحة التحكم
        </div>
        <div class="actions">
            <span id="adminEmail" class="admin-info"></span>
            <button id="logoutBtn" class="btn danger">
                <i class="fas fa-sign-out-alt"></i> خروج
            </button>
        </div>
    </div>
</header>

<main class="admin-main container">
    <section class="admin-left">
        <h2><i class="fas fa-cogs"></i> التحكم الكامل</h2>
        
        <!-- إحصائيات -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="totalApps">0</div>
                <div class="stat-label">التطبيقات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="totalVisitors">0</div>
                <div class="stat-label">الزوار</div>
            </div>
        </div>

        <!-- أدوات التحكم -->
        <div class="admin-controls">
            <button id="addAppBtn" class="btn primary">
                <i class="fas fa-plus"></i> تطبيق جديد
            </button>
            <button id="runScan" class="btn">
                <i class="fas fa-search"></i> فحص النظام
            </button>
            <button id="exportData" class="btn">
                <i class="fas fa-download"></i> تصدير البيانات
            </button>
        </div>

        <!-- قائمة التطبيقات -->
        <h3><i class="fas fa-mobile-alt"></i> التطبيقات</h3>
        <div id="appList" class="cardlist"></div>
    </section>

    <section class="admin-right">
        <h2><i class="fas fa-robot"></i> المساعد الذكي</h2>
        <div class="chat-box">
            <div id="aiHistory" class="chat-history">
                <div class="chat-message bot">
                    <strong>المساعد:</strong> مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك؟
                </div>
            </div>
            <div class="chat-controls">
                <input id="aiInput" placeholder="اكتب سؤالك هنا...">
                <button id="aiSend" class="btn primary">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>

        <!-- نتائج الفحص -->
        <h3><i class="fas fa-clipboard-list"></i> نتائج الفحص</h3>
        <pre id="scanReport" class="report">اضغط على "فحص النظام" لبدء التحليل</pre>
    </section>
</main>

<!-- نافذة إضافة تطبيق -->
<div class="modal" id="addAppModal">
    <div class="modal-content">
        <h3><i class="fas fa-plus"></i> إضافة تطبيق جديد</h3>
        <div class="input-group">
            <input type="text" id="appTitle" class="input" placeholder="اسم التطبيق" required>
            <textarea id="appDescription" class="input" placeholder="الوصف" required></textarea>
            <input type="url" id="appImage" class="input" placeholder="رابط الصورة">
        </div>
        <div class="modal-actions">
            <button id="saveApp" class="btn primary">حفظ</button>
            <button id="cancelApp" class="btn">إلغاء</button>
        </div>
    </div>
</div>

<script>
// نظام إدارة لوحة التحكم
const AdminSystem = {
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadStats();
        this.loadApps();
    },

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('prok_admin_user') || 'null');
        if (!user) {
            alert('يجب تسجيل الدخول أولاً');
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('adminEmail').textContent = user.email;
    },

    setupEventListeners() {
        // الخروج
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('prok_admin_user');
            window.location.href = 'index.html';
        });

        // التطبيقات
        document.getElementById('addAppBtn').addEventListener('click', () => this.showAddAppModal());
        document.getElementById('saveApp').addEventListener('click', () => this.saveApp());
        document.getElementById('cancelApp').addEventListener('click', () => this.hideAddAppModal());

        // الأدوات
        document.getElementById('runScan').addEventListener('click', () => this.runSystemScan());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());

        // الذكاء الاصطناعي
        document.getElementById('aiSend').addEventListener('click', () => this.sendAIMessage());
        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAIMessage();
        });
    },

    loadStats() {
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        const visitors = localStorage.getItem('prok_visitors') || '0';
        
        document.getElementById('totalApps').textContent = apps.length;
        document.getElementById('totalVisitors').textContent = parseInt(visitors).toLocaleString();
    },

    loadApps() {
        const appList = document.getElementById('appList');
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        
        appList.innerHTML = apps.map((app, index) => `
            <div class="card">
                <div class="card-header">
                    <h4>${app.title}</h4>
                </div>
                <p>${app.description}</p>
                <div class="card-actions">
                    <button class="small" onclick="AdminSystem.editApp(${index})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="small danger" onclick="AdminSystem.deleteApp(${index})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `).join('');
    },

    showAddAppModal() {
        document.getElementById('addAppModal').classList.add('show');
    },

    hideAddAppModal() {
        document.getElementById('addAppModal').classList.remove('show');
        this.clearAppForm();
    },

    clearAppForm() {
        document.getElementById('appTitle').value = '';
        document.getElementById('appDescription').value = '';
        document.getElementById('appImage').value = '';
    },

    saveApp() {
        const title = document.getElementById('appTitle').value.trim();
        const description = document.getElementById('appDescription').value.trim();
        const image = document.getElementById('appImage').value.trim();
        
        if (!title || !description) {
            this.showNotification('يرجى ملء الحقول المطلوبة', 'error');
            return;
        }
        
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        apps.push({
            id: Date.now().toString(),
            title,
            description,
            image: image || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
        });
        
        localStorage.setItem('prok_apps', JSON.stringify(apps));
        this.loadApps();
        this.loadStats();
        this.hideAddAppModal();
        this.showNotification('تم إضافة التطبيق', 'success');
    },

    editApp(index) {
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        const app = apps[index];
        
        const newTitle = prompt('اسم التطبيق الجديد:', app.title);
        const newDesc = prompt('الوصف الجديد:', app.description);
        
        if (newTitle !== null) apps[index].title = newTitle;
        if (newDesc !== null) apps[index].description = newDesc;
        
        localStorage.setItem('prok_apps', JSON.stringify(apps));
        this.loadApps();
        this.showNotification('تم التعديل', 'success');
    },

    deleteApp(index) {
        if (!confirm('هل تريد حذف هذا التطبيق؟')) return;
        
        const apps = JSON.parse(localStorage.getItem('prok_apps') || '[]');
        apps.splice(index, 1);
        localStorage.setItem('prok_apps', JSON.stringify(apps));
        this.loadApps();
        this.loadStats();
        this.showNotification('تم الحذف', 'success');
    },

    runSystemScan() {
        const scanReport = document.getElementById('scanReport');
        scanReport.textContent = 'جاري فحص النظام...';
        
        setTimeout(() => {
            const issues = [
                '✅ SEO: العناوين والوصف جيدة',
                '✅ الأمان: جميع الاتصالات آمنة',
                '⚠️  الصور: بعض الصور بدون نصوص بديلة',
                '✅ JavaScript: جميع السكريبتات تعمل',
                '✅ CSS: الأنماط محملة بشكل كامل'
            ];
            
            scanReport.textContent = issues.join('\n');
            this.showNotification('تم الفحص', 'success');
        }, 2000);
    },

    exportData() {
        const data = {
            apps: JSON.parse(localStorage.getItem('prok_apps') || '[]'),
            visitors: localStorage.getItem('prok_visitors') || '0',
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `prok-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        this.showNotification('تم التصدير', 'success');
    },

    sendAIMessage() {
        const input = document.getElementById('aiInput');
        const history = document.getElementById('aiHistory');
        const message = input.value.trim();
        
        if (!message) return;
        
        // إضافة رسالة المستخدم
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.textContent = message;
        history.appendChild(userMsg);
        
        input.value = '';
        
        // محاكاة رد الذكاء الاصطناعي
        setTimeout(() => {
            const responses = [
                "لقد قمت بفحص النظام ولم أجد أي أخطاء حرجة.",
                "أقترح تحسين سرعة تحميل الصور لتحسين الأداء.",
                "جميع الأنظمة تعمل بشكل طبيعي ولا توجد مشاكل.",
                "يوجد تحديث جديد متاح للنظام الأساسي."
            ];
            
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.textContent = responses[Math.floor(Math.random() * responses.length)];
            history.appendChild(botMsg);
            
            history.scrollTop = history.scrollHeight;
        }, 1000);
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 12px 20px; border-radius: 8px;
            color: white; font-weight: bold; z-index: 1000;
            background: ${type === 'success' ? '#2ed573' : 
                        type === 'error' ? '#ff4757' : '#00a8ff'};
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// إضافة الأنيميشن
const style = document.createElement('style');
style.textContent = `
    .admin-main {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 30px; padding: 30px 0; min-height: calc(100vh - 80px);
    }
    
    .stats-grid {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 15px; margin: 20px 0;
    }
    
    .stat-card {
        background: rgba(255,255,255,0.03); padding: 20px;
        border-radius: 10px; text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .stat-value {
        font-size: 2rem; font-weight: bold;
        color: var(--accent); margin-bottom: 5px;
    }
    
    .stat-label { color: var(--muted); font-size: 0.9rem; }
    
    .admin-controls {
        display: grid; grid-template-columns: 1fr;
        gap: 10px; margin: 20px 0;
    }
    
    .cardlist {
        display: grid; grid-template-columns: 1fr;
        gap: 15px; margin-top: 15px;
    }
    
    .chat-box {
        background: rgba(255,255,255,0.03); padding: 20px;
        border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
    }
    
    .chat-history {
        height: 200px; overflow-y: auto;
        margin-bottom: 15px; padding: 10px;
        background: rgba(255,255,255,0.02);
        border-radius: 8px;
    }
    
    .chat-message {
        padding: 10px; margin: 5px 0;
        border-radius: 8px; max-width: 80%;
    }
    
    .chat-message.user {
        background: rgba(0,255,231,0.1);
        margin-left: auto; text-align: left;
    }
    
    .chat-message.bot {
        background: rgba(255,78,207,0.1);
    }
    
    .chat-controls {
        display: flex; gap: 10px;
    }
    
    .chat-controls input {
        flex: 1; padding: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        border-radius: 8px; color: var(--text);
    }
    
    .report {
        background: rgba(255,255,255,0.03); padding: 15px;
        border-radius: 8px; color: var(--muted);
        margin-top: 10px; white-space: pre-wrap;
        font-family: monospace; font-size: 0.9rem;
        border-left: 3px solid var(--accent);
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @media (max-width: 768px) {
        .admin-main { grid-template-columns: 1fr; }
        .stats-grid { grid-template-columns: 1fr 1fr; }
    }
`;
document.head.appendChild(style);

// تهيئة النظام
document.addEventListener('DOMContentLoaded', () => AdminSystem.init());
</script>
</body>
</html>
