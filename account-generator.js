const config = require('./config');
const fs = require('fs');

class AccountGenerator {
    constructor() {
        this.accounts = [];
    }

    generateEmail(firstName, lastName) {
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const randomNum = Math.floor(Math.random() * 1000);
        return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
    }

    generatePhone() {
        return `05${Math.floor(Math.random() * 9000000) + 1000000}`;
    }

    generateAccount() {
        const firstName = config.arabicFirstNames[Math.floor(Math.random() * config.arabicFirstNames.length)];
        const lastName = config.arabicLastNames[Math.floor(Math.random() * config.arabicLastNames.length)];
        
        return {
            firstName: firstName,
            lastName: lastName,
            email: this.generateEmail(firstName, lastName),
            phone: this.generatePhone(),
            password: config.accountSettings.password,
            createdAt: new Date().toISOString()
        };
    }

    generateAccounts(count) {
        this.accounts = [];
        for (let i = 0; i < count; i++) {
            this.accounts.push(this.generateAccount());
        }
        this.saveAccounts();
        return this.accounts;
    }

    saveAccounts() {
        fs.writeFileSync('accounts.json', JSON.stringify(this.accounts, null, 2));
        console.log(`✅ تم إنشاء ${this.accounts.length} حساب وحفظهم في accounts.json`);
    }

    loadAccounts() {
        if (fs.existsSync('accounts.json')) {
            this.accounts = JSON.parse(fs.readFileSync('accounts.json'));
            return this.accounts;
        }
        return [];
    }
}

module.exports = AccountGenerator;
