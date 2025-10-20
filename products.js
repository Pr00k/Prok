class ProductManager {
    constructor() {
        this.products = [];
    }

    loadProducts() {
        db.collection('products').onSnapshot(snapshot => {
            this.products = [];
            snapshot.forEach(doc => {
                this.products.push({ id: doc.id, ...doc.data() });
            });
            this.renderProducts();
        });
    }

    renderProducts() {
        const container = document.getElementById('products');
        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <p><strong>السعر: ${product.price} ر.س</strong></p>
            </div>
        `).join('');
    }

    async addProduct(productData) {
        await db.collection('products').add({
            ...productData,
            createdAt: new Date()
        });
    }

    async deleteProduct(productId) {
        await db.collection('products').doc(productId).delete();
    }
}

const productManager = new ProductManager();
