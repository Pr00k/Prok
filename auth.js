class AuthManager {
    constructor() {
        this.currentUser = null;
    }

    async login(email, password) {
        try {
            const user = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = user;
            this.showAdminPanel();
            return user;
        } catch (error) {
            throw new Error('فشل تسجيل الدخول: ' + error.message);
        }
    }

    async logout() {
        await auth.signOut();
        this.currentUser = null;
        this.hideAdminPanel();
    }

    showAdminPanel() {
        document.getElementById('adminPanel').classList.remove('hidden');
    }

    hideAdminPanel() {
        document.getElementById('adminPanel').classList.add('hidden');
    }

    checkAuthState() {
        auth.onAuthStateChanged(user => {
            this.currentUser = user;
            if (user) this.showAdminPanel();
        });
    }
}

const authManager = new AuthManager();
