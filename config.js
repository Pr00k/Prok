module.exports = {
    // الموقع المستهدف
    targetWebsite: 'https://silk.wuiltstore.com/ar',
    
    // إعدادات التقييم
    ratingSettings: {
        minRatingsPerProduct: 3,
        maxRatingsPerProduct: 8,
        minStars: 4,
        maxStars: 5,
        commentsPerProduct: 2
    },
    
    // إعدادات الحسابات
    accountSettings: {
        totalAccounts: 10,
        password: 'Password123!'
    },
    
    // إعدادات الأداء
    performance: {
        delayBetweenActions: 2000,
        randomDelay: true,
        headless: false // تغيير لـ true في الإنتاج
    },
    
    // قوائم البيانات
    arabicFirstNames: ['أحمد', 'محمد', 'علي', 'خالد', 'سعيد', 'فهد', 'ناصر', 'طارق', 'يوسف', 'إبراهيم'],
    arabicLastNames: ['الغامدي', 'الحربي', 'القحطاني', 'العتيبي', 'الزهراني', 'الشمراني', 'الجعفري', 'المالكي'],
    comments: [
        "منتج رائع وجودة ممتازة! شكراً للتوصيل السريع 🌟",
        "جودة المنتج تتجاوز التوقعات، أنصح الجميع به 💯",
        "سعر مناسب وجودة عالية، شكراً لكم على الخدمة الممتازة 👏",
        "التغليف كان محكماً والمنتج يعمل بشكل ممتاز 👍",
        "تجربة شراء رائعة، سأطلب مرة أخرى بالتأكيد 🎯"
    ]
};
