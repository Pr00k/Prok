const puppeteer = require('puppeteer');
const AccountGenerator = require('./account-generator');
const ProductScraper = require('./product-scraper');
const config = require('./config');

class AutoRater {
    constructor() {
        this.accountGenerator = new AccountGenerator();
        this.productScraper = new ProductScraper();
        this.browser = null;
        this.stats = {
            accountsCreated: 0,
            ratingsAdded: 0,
            commentsAdded: 0,
            productsRated: 0
        };
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: config.performance.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
        });
    }

    async randomDelay() {
        const delay = config.performance.delayBetweenActions + 
                     (config.performance.randomDelay ? Math.random() * 2000 : 0);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async simulateHumanBehavior(page) {
        // تحريك الماوس عشوائياً
        await page.mouse.move(
            Math.random() * 1000, 
            Math.random() * 500
        );
        await this.randomDelay();
    }

    async registerAccount(account) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            await page.setViewport({ width: 1366, height: 768 });

            console.log(`👤 جاري إنشاء حساب لـ ${account.firstName} ${account.lastName}`);
            
            await page.goto(config.targetWebsite, { waitUntil: 'networkidle2' });
            await this.randomDelay();

            // البحث عن رابط التسجيل
            const signupSelectors = [
                'a[href*="register"]',
                'a[href*="signup"]', 
                'a[href*="create"]',
                '.register',
                '.signup',
                '[class*="register"]',
                '[class*="signup"]'
            ];

            let signupFound = false;
            for (const selector of signupSelectors) {
                const element = await page.$(selector);
                if (element) {
                    await element.click();
                    signupFound = true;
                    await this.randomDelay();
                    break;
                }
            }

            if (!signupFound) {
                console.log('⚠️ لم يتم العثور على نموذج التسجيل، استخدام نموذج افتراضي');
                // سنحاول ملء الحقول مباشرة إذا عرفنا أسمائها
            }

            // محاولة ملء نموذج التسجيل
            await this.fillRegistrationForm(page, account);
            
            this.stats.accountsCreated++;
            console.log(`✅ تم إنشاء حساب: ${account.email}`);
            
            return true;

        } catch (error) {
            console.error(`❌ فشل في إنشاء حساب ${account.email}:`, error.message);
            return false;
        } finally {
            await page.close();
        }
    }

    async fillRegistrationForm(page, account) {
        // محاولة العثور على حقول الإدخال الشائعة
        const fieldSelectors = {
            firstName: ['input[name="firstName"]', 'input[name="first_name"]', '#firstName', '.firstName'],
            lastName: ['input[name="lastName"]', 'input[name="last_name"]', '#lastName', '.lastName'],
            email: ['input[type="email"]', 'input[name="email"]', '#email', '.email'],
            phone: ['input[type="tel"]', 'input[name="phone"]', '#phone', '.phone'],
            password: ['input[type="password"]', 'input[name="password"]', '#password', '.password']
        };

        for (const [field, selectors] of Object.entries(fieldSelectors)) {
            for (const selector of selectors) {
                const element = await page.$(selector);
                if (element) {
                    let value = '';
                    switch(field) {
                        case 'firstName': value = account.firstName; break;
                        case 'lastName': value = account.lastName; break;
                        case 'email': value = account.email; break;
                        case 'phone': value = account.phone; break;
                        case 'password': value = account.password; break;
                    }
                    
                    await element.click({ clickCount: 3 }); // تحديد النص الموجود
                    await element.type(value, { delay: 100 });
                    await this.randomDelay();
                    break;
                }
            }
        }

        // محاولة الضغط على زر التسجيل
        const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            '.submit',
            '.register-btn',
            '[class*="submit"]',
            '[class*="register"]'
        ];

        for (const selector of submitSelectors) {
            const element = await page.$(selector);
            if (element) {
                await element.click();
                await this.randomDelay();
                break;
            }
        }

        // انتظار Completion التسجيل
        await page.waitForTimeout(3000);
    }

    async rateProduct(product, account, rating, comment) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            await page.setViewport({ width: 1366, height: 768 });

            console.log(`⭐ جاري تقييم ${product.name} بواسطة ${account.email}`);
            
            await page.goto(product.url, { waitUntil: 'networkidle2' });
            await this.randomDelay();

            // البحث عن قسم التقييمات
            const reviewSelectors = [
                '.reviews',
                '.ratings',
                '.review-form',
                '[class*="review"]',
                '[class*="rating"]'
            ];

            let reviewSectionFound = false;
            for (const selector of reviewSelectors) {
                const element = await page.$(selector);
                if (element) {
                    reviewSectionFound = true;
                    break;
                }
            }

            if (!reviewSectionFound) {
                console.log(`⚠️ لم يتم العثور على قسم التقييمات لـ ${product.name}`);
                return false;
            }

            // إضافة التقييم
            await this.addRating(page, rating, comment);
            
            this.stats.ratingsAdded++;
            this.stats.commentsAdded++;
            
            console.log(`✅ تم تقييم ${product.name} بـ ${rating} نجوم`);
            return true;

        } catch (error) {
            console.error(`❌ فشل في تقييم ${product.name}:`, error.message);
            return false;
        } finally {
            await page.close();
        }
    }

    async addRating(page, rating, comment) {
        // اختيار النجوم
        const starSelectors = [
            `.star:nth-child(${rating})`,
            `.rating-star:nth-child(${rating})`,
            `[data-rating="${rating}"]`,
            `.star[data-value="${rating}"]`
        ];

        for (const selector of starSelectors) {
            const element = await page.$(selector);
            if (element) {
                await element.click();
                await this.randomDelay();
                break;
            }
        }

        // كتابة التعليق
        const commentSelectors = [
            'textarea[name="review"]',
            'textarea[name="comment"]',
            '.review-text',
            '.comment-box',
            '[class*="review"]',
            '[class*="comment"]'
        ];

        for (const selector of commentSelectors) {
            const element = await page.$(selector);
            if (element) {
                await element.click();
                await element.type(comment, { delay: 50 });
                await this.randomDelay();
                break;
            }
        }

        // إرسال التقييم
        const submitSelectors = [
            'button[type="submit"]',
            '.submit-review',
            '.post-review',
            '[class*="submit"]'
        ];

        for (const selector of submitSelectors) {
            const element = await page.$(selector);
            if (element) {
                await element.click();
                await this.randomDelay();
                break;
            }
        }

        await page.waitForTimeout(2000);
    }

    async startAutoRating() {
        console.log('🚀 بدء نظام التقييم الآلي الحقيقي...');
        
        await this.init();
        
        try {
            // 1. إنشاء الحسابات
            console.log('\n📝 مرحلة إنشاء الحسابات...');
            const accounts = this.accountGenerator.generateAccounts(config.accountSettings.totalAccounts);
            
            for (const account of accounts) {
                const success = await this.registerAccount(account);
                if (success) {
                    await this.randomDelay();
                }
            }

            // 2. استخراج المنتجات
            console.log('\n🛍️ مرحلة استخراج المنتجات...');
            const products = await this.productScraper.scrapeProducts();
            
            // 3. إضافة التقييمات
            console.log('\n⭐ مرحلة إضافة التقييمات...');
            
            for (const product of products) {
                console.log(`\n📦 جاري تقييم ${product.name}...`);
                
                let productRatings = 0;
                const targetRatings = Math.floor(
                    Math.random() * (config.ratingSettings.maxRatingsPerProduct - config.ratingSettings.minRatingsPerProduct + 1)
                ) + config.ratingSettings.minRatingsPerProduct;

                for (let i = 0; i < targetRatings && i < accounts.length; i++) {
                    const account = accounts[i];
                    const rating = Math.floor(
                        Math.random() * (config.ratingSettings.maxStars - config.ratingSettings.minStars + 1)
                    ) + config.ratingSettings.minStars;
                    
                    const comment = config.comments[Math.floor(Math.random() * config.comments.length)];
                    
                    const success = await this.rateProduct(product, account, rating, comment);
                    if (success) {
                        productRatings++;
                    }
                    
                    await this.randomDelay();
                }
                
                if (productRatings > 0) {
                    this.stats.productsRated++;
                    console.log(`✅ تم إضافة ${productRatings} تقييم لـ ${product.name}`);
                }
            }

            // 4. عرض النتائج
            this.showFinalStats();

        } catch (error) {
            console.error('❌ خطأ في النظام:', error);
        } finally {
            await this.close();
        }
    }

    showFinalStats() {
        console.log('\n🎉 ========== النتائج النهائية ==========');
        console.log(`📊 الحسابات المُنشأة: ${this.stats.accountsCreated}`);
        console.log(`⭐ التقييمات المُضافة: ${this.stats.ratingsAdded}`);
        console.log(`💬 التعليقات المُضافة: ${this.stats.commentsAdded}`);
        console.log(`🛍️ المنتجات المُقيمة: ${this.stats.productsRated}`);
        console.log('=====================================\n');
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        await this.productScraper.close();
    }
}

// تشغيل النظام
const autoRater = new AutoRater();
autoRater.startAutoRating().catch(console.error);
