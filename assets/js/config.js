// إعدادات التهيئة
const siteConfig = {
    name: "Prok",
    version: "2.0.0",
    protection: {
        enabled: true,
        maxScreenshotAttempts: 3,
        autoLock: true,
        sensitiveElements: [
            '.password-field',
            '.sensitive-content',
            '[data-sensitive="true"]',
            '.api-key',
            '.secret-info'
        ]
    },
    admin: {
        loginEnabled: true,
        defaultPassword: "admin123", // تغيير هذا في الإنتاج
        features: [
            "content_edit",
            "file_upload",
            "settings_manage",
            "protection_control"
        ]
    },
    upload: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/vnd.android.package-archive',
            'application/octet-stream'
        ]
    }
};

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}
