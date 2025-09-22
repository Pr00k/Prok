<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام مصادقة Prok - JavaScript النقي</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #2c3e50;
            --primary-dark: #1a2530;
            --secondary: #3498db;
            --secondary-dark: #217dbb;
            --success: #27ae60;
            --danger: #e74c3c;
            --warning: #f39c12;
            --light: #f8f9fa;
            --dark: #2c3e50;
            --gray: #95a5a6;
            --border-radius: 12px;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            --transition: all 0.3s ease;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #1a2a6c, #2b5876, #4e4376);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: var(--dark);
        }

        .auth-container {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            width: 100%;
            max-width: 480px;
            overflow: hidden;
            animation: fadeIn 0.6s ease-out;
            position: relative;
        }

        .auth-header {
            background: var(--primary);
            color: white;
            padding: 35px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .auth-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shimmer 8s infinite linear;
        }

        .auth-header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            position: relative;
        }

        .auth-header p {
            opacity: 0.9;
            font-size: 16px;
            position: relative;
        }

        .auth-tabs {
            display: flex;
            background: var(--light);
            border-bottom: 1px solid #ddd;
        }

        .auth-tab {
            flex: 1;
            padding: 18px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            font-weight: 600;
            color: var(--dark);
            position: relative;
        }

        .auth-tab.active {
            background: white;
            color: var(--secondary);
        }

        .auth-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--secondary);
        }

        .auth-form {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 25px;
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--dark);
            font-size: 15px;
        }

        .input-icon {
            position: relative;
        }

        .input-icon i {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
            font-size: 18px;
        }

        .input-icon input {
            width: 100%;
            padding: 16px 50px 16px 18px;
            border: 2px solid #e1e5eb;
            border-radius: 10px;
            font-size: 16px;
            transition: var(--transition);
            background: var(--light);
        }

        .input-icon input:focus {
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            outline: none;
            background: white;
        }

        .password-toggle {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: var(--gray);
            font-size: 18px;
        }

        .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .remember {
            display: flex;
            align-items: center;
        }

        .remember input {
            margin-left: 8px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .remember label {
            cursor: pointer;
            font-weight: 500;
        }

        .forgot-password {
            color: var(--secondary);
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            transition: var(--transition);
        }

        .forgot-password:hover {
            color: var(--secondary-dark);
            text-decoration: underline;
        }

        .btn {
            display: block;
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 10px;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
        }

        .btn-primary {
            background: var(--secondary);
            color: white;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-primary:hover {
            background: var(--secondary-dark);
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(52, 152, 219, 0.4);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .auth-footer {
            text-align: center;
            padding: 25px;
            background: var(--light);
            color: var(--dark);
            font-size: 14px;
            border-top: 1px solid #e1e5eb;
        }

        .message {
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            animation: slideIn 0.4s ease-out;
        }

        .message i {
            margin-left: 10px;
            font-size: 20px;
        }

        .message.error {
            background: #ffebee;
            color: var(--danger);
            border: 1px solid #ffcdd2;
        }

        .message.success {
            background: #e8f5e9;
            color: var(--success);
            border: 1px solid #c8e6c9;
        }

        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            margin-left: 10px;
        }

        .security-indicator {
            margin-top: 15px;
            height: 6px;
            border-radius: 3px;
            background: #eee;
            overflow: hidden;
        }

        .security-strength {
            height: 100%;
            width: 0;
            transition: var(--transition);
            border-radius: 3px;
        }

        .security-text {
            font-size: 13px;
            margin-top: 5px;
            color: var(--gray);
            text-align: left;
        }

        .attempts-warning {
            display: flex;
            align-items: center;
            margin-top: 15px;
            color: var(--warning);
            font-size: 14px;
            display: none;
        }

        .attempts-warning i {
            margin-left: 8px;
        }

        .two-factor {
            margin-top: 20px;
            padding: 20px;
            background: #f5f9ff;
            border-radius: 10px;
            border: 1px solid #dde9f8;
            display: none;
        }

        .two-factor h3 {
            margin-bottom: 15px;
            color: var(--primary);
            display: flex;
            align-items: center;
        }

        .two-factor h3 i {
            margin-left: 10px;
            color: var(--secondary);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }

        @media (max-width: 500px) {
            .auth-container {
                border-radius: 10px;
            }
            
            .auth-header {
                padding: 25px 20px;
            }
            
            .auth-form {
                padding: 20px;
            }
            
            .remember-forgot {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .forgot-password {
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="auth-header">
            <h1>نظام إدارة Prok</h1>
            <p>تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <div class="auth-tabs">
            <div class="auth-tab active" id="loginTab">تسجيل الدخول</div>
        </div>

        <div class="auth-form">
            <div id="loginMessage" class="message error" style="display: none;">
                <i class="fas fa-exclamation-circle"></i>
                <span id="messageText"></span>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="email" placeholder="ادخل بريدك الإلكتروني" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">كلمة المرور</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" placeholder="ادخل كلمة المرور" required>
                        <span class="password-toggle" id="togglePassword">
                            <i class="fas fa-eye"></i>
                        </span>
                    </div>
                    <div class="security-indicator">
                        <div class="security-strength" id="passwordStrength"></div>
                    </div>
                    <div class="security-text" id="passwordStrengthText">قوة كلمة المرور: غير معروفة</div>
                </div>

                <div class="remember-forgot">
                    <div class="remember">
                        <input type="checkbox" id="rememberMe">
                        <label for="rememberMe">تذكرني</label>
                    </div>
                    <a href="#" class="forgot-password" id="forgotPassword">نسيت كلمة المرور؟</a>
                </div>

                <div class="attempts-warning" id="attemptsWarning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>محاولات تسجيل دخول خاطئة متبقية: <span id="remainingAttempts">3</span></span>
                </div>

                <button type="submit" class="btn btn-primary" id="loginBtn">
                    <span id="btnText">تسجيل الدخول</span>
                    <div class="spinner" id="spinner" style="display: none;"></div>
                </button>
            </form>

            <div class="two-factor" id="twoFactorAuth">
                <h3><i class="fas fa-shield-alt"></i> المصادقة الثنائية</h3>
                <div class="form-group">
                    <label for="authCode">رمز التحقق</label>
                    <div class="input-icon">
                        <i class="fas fa-key"></i>
                        <input type="text" id="authCode" placeholder="ادخل الرمز المكون من 6 أرقام" maxlength="6">
                    </div>
                </div>
                <button type="button" class="btn btn-primary" id="verifyAuthCode">تحقق</button>
            </div>
        </div>

        <div class="auth-footer">
            <p>© 2023 Prok. جميع الحقوق محفوظة | الإصدار 2.1.0</p>
        </div>
    </div>

    <script>
        // نظام المصادقة باستخدام JavaScript النقي
        document.addEventListener('DOMContentLoaded', function() {
            // عناصر DOM
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const togglePassword = document.getElementById('togglePassword');
            const rememberMe = document.getElementById('rememberMe');
            const loginBtn = document.getElementById('loginBtn');
            const btnText = document.getElementById('btnText');
            const spinner = document.getElementById('spinner');
            const loginMessage = document.getElementById('loginMessage');
            const messageText = document.getElementById('messageText');
            const passwordStrength = document.getElementById('passwordStrength');
            const passwordStrengthText = document.getElementById('passwordStrengthText');
            const attemptsWarning = document.getElementById('attemptsWarning');
            const remainingAttempts = document.getElementById('remainingAttempts');
            const twoFactorAuth = document.getElementById('twoFactorAuth');
            const verifyAuthCode = document.getElementById('verifyAuthCode');
            const authCode = document.getElementById('authCode');
            
            // متغيرات النظام
            let loginAttempts = 0;
            const maxLoginAttempts = 3;
            let twoFactorRequired = false;
            let tempAuthToken = null;
            
            // بيانات المستخدمين (في تطبيق حقيقي، سيتم استرجاعها من الخادم)
            const users = [
                {
                    id: 1,
                    email: 'admin@prok.com',
                    password: 'P@ssw0rd123', // في الواقع، سيتم تشفير كلمة المرور
                    name: 'مدير النظام',
                    twoFactorEnabled: true
                },
                {
                    id: 2,
                    email: 'user@prok.com',
                    password: 'User123!',
                    name: 'مستخدم عادي',
                    twoFactorEnabled: false
                }
            ];
            
            // تحميل بيانات الحفظ إن وجدت
            const savedEmail = localStorage.getItem('adminEmail');
            const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
            
            if (savedEmail && savedRememberMe) {
                emailInput.value = savedEmail;
                rememberMe.checked = true;
            }
            
            // إظهار/إخفاء كلمة المرور
            togglePassword.addEventListener('click', function() {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordInput.type = 'password';
                    togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
            
            // تحليل قوة كلمة المرور
            passwordInput.addEventListener('input', function() {
                const password = passwordInput.value;
                const strength = calculatePasswordStrength(password);
                updatePasswordStrengthUI(strength);
            });
            
            // إدارة عملية تسجيل الدخول
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                
                // التحقق من صحة البيانات
                if (!validateEmail(email)) {
                    showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
                    return;
                }
                
                if (password.length < 8) {
                    showMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
                    return;
                }
                
                // حفظ بيانات الدخول إذا طلب المستخدم ذلك
                if (rememberMe.checked) {
                    localStorage.setItem('adminEmail', email);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('adminEmail');
                    localStorage.removeItem('rememberMe');
                }
                
                // محاكاة عملية تسجيل الدخول
                loginUser(email, password);
            });
            
            // التحقق من رمز المصادقة الثنائية
            verifyAuthCode.addEventListener('click', function() {
                const code = authCode.value.trim();
                
                if (code.length !== 6 || isNaN(code)) {
                    showMessage('يرجى إدخال رمز تحقق صحيح مكون من 6 أرقام', 'error');
                    return;
                }
                
                // في التطبيق الحقيقي، سيتم التحقق من الرمز مع الخادم
                if (code === '123456') { // رمز افتراضي لل演示
                    completeLogin();
                } else {
                    showMessage('رمز التحقق غير صحيح', 'error');
                }
            });
            
            // وظيفة تسجيل الدخول
            function loginUser(email, password) {
                // عرض حالة التحميل
                btnText.textContent = 'جاري تسجيل الدخول...';
                spinner.style.display = 'inline-block';
                loginBtn.disabled = true;
                
                // محاكاة اتصال بالخادم
                setTimeout(() => {
                    // البحث عن المستخدم
                    const user = users.find(u => u.email === email && u.password === password);
                    
                    if (user) {
                        // التحقق من عدد المحاولات
                        if (loginAttempts >= maxLoginAttempts) {
                            showMessage('تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة لاحقاً', 'error');
                            resetLoginButton();
                            return;
                        }
                        
                        // إذا كان المستخدم مفعل المصادقة الثنائية
                        if (user.twoFactorEnabled) {
                            twoFactorRequired = true;
                            tempAuthToken = generateAuthToken();
                            twoFactorAuth.style.display = 'block';
                            showMessage('تم إرسال رمز التحقق إلى بريدك الإلكتروني', 'success');
                            resetLoginButton();
                        } else {
                            // تسجيل الدخول مباشرة
                            completeLogin();
                        }
                    } else {
                        loginAttempts++;
                        const remaining = maxLoginAttempts - loginAttempts;
                        
                        if (remaining > 0) {
                            showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
                            attemptsWarning.style.display = 'flex';
                            remainingAttempts.textContent = remaining;
                        } else {
                            showMessage('تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة بعد 5 دقائق', 'error');
                            lockAccountTemporarily();
                        }
                        
                        resetLoginButton();
                    }
                }, 1500);
            }
            
            // إكمال عملية تسجيل الدخول
            function completeLogin() {
                showMessage('تم تسجيل الدخول بنجاح!', 'success');
                
                // في التطبيق الحقيقي، سيتم حفظ token وإعادة التوجيه
                setTimeout(() => {
                    // توجيه إلى لوحة التحكم
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
            
            // إنشاء token (في التطبيق الحقيقي، سيأتي من الخادم)
            function generateAuthToken() {
                return 'token_' + Math.random().toString(36).substr(2) + '_' + Date.now();
            }
            
            // قفل الحساب مؤقتاً
            function lockAccountTemporarily() {
                loginBtn.disabled = true;
                emailInput.disabled = true;
                passwordInput.disabled = true;
                
                setTimeout(() => {
                    loginAttempts = 0;
                    loginBtn.disabled = false;
                    emailInput.disabled = false;
                    passwordInput.disabled = false;
                    attemptsWarning.style.display = 'none';
                    showMessage('يمكنك الآن محاولة تسجيل الدخول مرة أخرى', 'success');
                }, 300000); // 5 دقائق
            }
            
            // إعادة تعيين واجهة تسجيل الدخول
            function resetLoginButton() {
                btnText.textContent = 'تسجيل الدخول';
                spinner.style.display = 'none';
                loginBtn.disabled = false;
            }
            
            // التحقق من صحة البريد الإلكتروني
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            // حساب قوة كلمة المرور
            function calculatePasswordStrength(password) {
                let strength = 0;
                
                if (password.length >= 8) strength += 20;
                if (password.length >= 12) strength += 20;
                if (/[A-Z]/.test(password)) strength += 20;
                if (/[0-9]/.test(password)) strength += 20;
                if (/[^A-Za-z0-9]/.test(password)) strength += 20;
                
                return Math.min(strength, 100);
            }
            
            // تحديث واجهة قوة كلمة المرور
            function updatePasswordStrengthUI(strength) {
                let color, text;
                
                if (strength === 0) {
                    color = 'transparent';
                    text = 'قوة كلمة المرور: غير معروفة';
                } else if (strength < 40) {
                    color = '#e74c3c';
                    text = 'قوة كلمة المرور: ضعيفة';
                } else if (strength < 70) {
                    color = '#f39c12';
                    text = 'قوة كلمة المرور: متوسطة';
                } else if (strength < 100) {
                    color = '#3498db';
                    text = 'قوة كلمة المرور: قوية';
                } else {
                    color = '#27ae60';
                    text = 'قوة كلمة المرور: ممتازة';
                }
                
                passwordStrength.style.width = strength + '%';
                passwordStrength.style.background = color;
                passwordStrengthText.textContent = text;
                passwordStrengthText.style.color = color;
            }
            
            // عرض الرسائل
            function showMessage(text, type) {
                messageText.textContent = text;
                loginMessage.className = 'message ' + type;
                loginMessage.style.display = 'flex';
                
                // إخفاء الرسالة تلقائياً بعد 5 ثواني
                setTimeout(() => {
                    loginMessage.style.display = 'none';
                }, 5000);
            }
        });
    </script>
</body>
</html>
