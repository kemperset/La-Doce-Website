/**
 * LA DOCE — products.js
 * Handles dynamic rendering of products from a data source
 */

// Initial local data (will be replaced by Supabase later)
const initialProducts = [
    {
        id: 1,
        name: "Apex Neon Runners",
        price: 189.99,
        description: "Engineered for speed with responsive neon cushioning.",
        image: "static/images/product_1.png"
    },
    {
        id: 2,
        name: "Vanguard Horizon Watch",
        price: 299.00,
        description: "Next-gen biometric tracking with holographic HUD.",
        image: "static/images/product_2.png"
    },
    {
        id: 3,
        name: "Elite Tech Fleece",
        price: 125.00,
        description: "Ultra-breathable micro-fiber for peak performance.",
        image: "static/images/product_1.png"
    }
];

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card reveal">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">$${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
            </div>
        </div>
    `).join('');

    // Re-trigger reveal animation for new elements
    if (window.observer) {
        document.querySelectorAll('.reveal').forEach(el => window.observer.observe(el));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch from Supabase
        const { data, error } = await db
            .from('products')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            renderProducts(data);
        } else {
            console.log('No hay productos en la base de datos, usando locales...');
            renderProducts(initialProducts);
        }
    } catch (err) {
        console.error('Error fetching products:', err);
        renderProducts(initialProducts); // Fallback on error
    }
});
