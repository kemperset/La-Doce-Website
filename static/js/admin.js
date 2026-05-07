/**
 * LA DOCE — admin.js
 * Dashboard logic for product management using Supabase
 */

// ── Authentication Check ──────────────────────────────────────
async function checkAuth() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
}

// ── Load Products ──────────────────────────────────────────────
async function loadAdminProducts() {
    const { data, error } = await db
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error loading products:', error);
        return;
    }

    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    tbody.innerHTML = data.map(p => `
        <tr>
            <td><img src="${p.image}" alt="${p.name}"></td>
            <td>${p.name}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>
                <button onclick="deleteProduct(${p.id})" class="btn btn-delete">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// ── Add Product ────────────────────────────────────────────────
async function addProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const description = document.getElementById('p-desc').value;
    const image = document.getElementById('p-img').value;

    const { error } = await db
        .from('products')
        .insert([{ name, price, description, image }]);

    if (error) {
        alert('Error al añadir producto: ' + error.message);
    } else {
        alert('Producto añadido con éxito');
        document.getElementById('add-product-form').reset();
        loadAdminProducts();
    }
}

// ── Delete Product ─────────────────────────────────────────────
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    const { error } = await db
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Error al eliminar: ' + error.message);
    } else {
        loadAdminProducts();
    }
}

// ── Logout ─────────────────────────────────────────────────────
async function logout() {
    await db.auth.signOut();
    window.location.href = 'index.html';
}

// ── Initialize ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    loadAdminProducts();
    
    const form = document.getElementById('add-product-form');
    if (form) form.addEventListener('submit', addProduct);
});
