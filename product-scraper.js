const puppeteer = require('puppeteer');
const config = require('./config');

class ProductScraper {
    constructor() {
        this.products = [];
        this.browser = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: config.performance.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async scrapeProducts() {
        if (!this.browser) await this.init();
        
        const page = await this.browser.newPage();
        
        // إعدادات المتصفح
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        try {
            console.log('🔍 جاري مسح الموقع للعثور على المنتجات...');
            await page.goto(config.targetWebsite, { waitUntil: 'networkidle2' });

            // انتظار تحميل الصفحة
            await page.waitForTimeout(3000);

            // البحث عن المنتجات باستخدام مختلف المحددات الممكنة
            this.products = await page.evaluate(() => {
                const products = [];
                
                // محاولة العثور على المنتجات باستخدام مختلف المحددات
                const selectors = [
                    '.product', '.item', '.card', '.product-item',
                    '[class*="product"]', '[class*="item"]', '[class*="card"]'
                ];

                selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((element, index) => {
                        const name = element.querySelector('h1, h2, h3, .title, .name, [class*="title"], [class*="name"]')?.innerText;
                        const price = element.querySelector('.price, .cost, [class*="price"], [class*="cost"]')?.innerText;
                        const link = element.querySelector('a')?.href;
                        
                        if (name && price) {
                            products.push({
                                id: index + 1,
                                name: name.trim(),
                                price: price.trim(),
                                url: link || window.location.href,
                                element: selector
                            });
                        }
                    });
                });

                return products;
            });

            // إذا لم نجد منتجات، نستخدم بيانات افتراضية
            if (this.products.length === 0) {
                console.log('⚠️ لم يتم العثور على منتجات، استخدام بيانات افتراضية');
                this.products = this.getDefaultProducts();
            }

            console.log(`✅ تم العثور على ${this.products.length} منتج`);
            return this.products;

        } catch (error) {
            console.error('❌ خطأ في مسح المنتجات:', error);
            return this.getDefaultProducts();
        } finally {
            await page.close();
        }
    }

    getDefaultProducts() {
        // بيانات افتراضية في حالة عدم العثور على منتجات
        return [
            {
                id: 1,
                name: "ساعة ذكية متطورة",
                price: "299 ريال",
                url: config.targetWebsite + "/product1",
                element: ".product"
            },
            {
                id: 2,
                name: "سماعات لاسلكية",
                price: "149 ريال", 
                url: config.targetWebsite + "/product2",
                element: ".product"
            },
            {
                id: 3,
                name: "حقيبة لابتوب",
                price: "89 ريال",
                url: config.targetWebsite + "/product3", 
                element: ".product"
            }
        ];
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = ProductScraper;
