/**
 * LA DOCE — admin.js
 * Dashboard logic for product management using Supabase
 */

const FALLBACK_IMAGE = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Imagen+No+Disponible';

// ── Authentication Check ──────────────────────────────────────
async function checkAuth() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
}

// ── Load Products ──────────────────────────────────────────────
let allProducts = []; // To keep track of all products for searching

async function loadAdminProducts() {
    const { data, error } = await db
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error loading products:', error);
        return;
    }

    allProducts = data;
    renderAdminTable(allProducts);
}

function renderAdminTable(products) {
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" alt="${p.name}" onerror="this.src='${FALLBACK_IMAGE}'; this.onerror=null;"></td>
            <td>${p.name} <br> <small style="opacity:0.5">${p.sizes || 'Sin tallas'}</small></td>
            <td>S/ ${p.price.toFixed(2)}</td>
            <td>
                <div class="actions-cell">
                    <button onclick="showProductDetails('${p.id}')" class="btn-icon btn-info" title="Detalles">ℹ️</button>
                    <button onclick="openEditModal('${p.id}')" class="btn-icon btn-edit" title="Editar">✏️</button>
                    <button onclick="deleteProduct('${p.id}')" class="btn-icon btn-delete-icon" title="Eliminar">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ── Search Logic ───────────────────────────────────────────────
function setupSearch() {
    const searchInput = document.getElementById('inventory-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(term) || 
            (p.sizes && p.sizes.toLowerCase().includes(term))
        );
        renderAdminTable(filtered);
    });
}

// ── Add Product ────────────────────────────────────────────────
async function addProduct(e) {
    e.preventDefault();
    
    const session = await checkAuth();
    if (!session) return;

    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const description = document.getElementById('p-desc').value;
    const image = document.getElementById('p-img').value;
    const sizes = document.getElementById('p-sizes').value;
    const stock = parseInt(document.getElementById('p-stock').value) || 0;

    const { error } = await db
        .from('products')
        .insert([{ 
            name, 
            price, 
            description, 
            image, 
            sizes,
            stock,
            last_user_id: session.user.id,
            last_entry_qty: stock, // Initial entry is the whole stock
            prev_stock: 0
        }]);

    if (error) {
        alert('Error al añadir producto: ' + error.message);
    } else {
        alert('Producto añadido con éxito');
        document.getElementById('add-product-form').reset();
        document.getElementById('image-preview').innerHTML = '<p>Vista previa aparecerá aquí</p>';
        loadAdminProducts();
    }
}

// ── Edit Logic ─────────────────────────────────────────────────
function openEditModal(id) {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;

    document.getElementById('edit-p-id').value = product.id;
    document.getElementById('edit-p-name').value = product.name;
    document.getElementById('edit-p-price').value = product.price;
    document.getElementById('edit-p-stock').value = product.stock || 0;
    document.getElementById('edit-p-desc').value = product.description;
    document.getElementById('edit-p-img').value = product.image;
    document.getElementById('edit-p-sizes').value = product.sizes || '';

    document.getElementById('edit-modal').style.display = 'flex';
}

async function updateProduct(e) {
    e.preventDefault();
    
    const session = await checkAuth();
    if (!session) return;

    const id = document.getElementById('edit-p-id').value;
    const name = document.getElementById('edit-p-name').value;
    const price = parseFloat(document.getElementById('edit-p-price').value);
    const description = document.getElementById('edit-p-desc').value;
    const image = document.getElementById('edit-p-img').value;
    const sizes = document.getElementById('edit-p-sizes').value;
    const newStock = parseInt(document.getElementById('edit-p-stock').value) || 0;

    // Get current product to calculate changes
    const product = allProducts.find(p => p.id == id);
    const prevStock = product ? (product.stock || 0) : 0;
    const lastEntryQty = newStock - prevStock;

    const { data, error } = await db
        .from('products')
        .update({ 
            name, 
            price, 
            description, 
            image, 
            sizes,
            stock: newStock,
            last_user_id: session.user.id,
            last_entry_qty: lastEntryQty,
            prev_stock: prevStock
        })
        .eq('id', id)
        .select();

    if (error) {
        alert('Error al actualizar: ' + error.message);
    } else if (!data || data.length === 0) {
        alert('Error: No se pudo actualizar el producto. Esto suele ocurrir si no tienes permisos (RLS) en Supabase para hacer UPDATE.');
    } else {
        alert('Producto actualizado');
        closeModal('edit-modal');
        loadAdminProducts();
    }
}

// ── Details Logic ──────────────────────────────────────────────
async function showProductDetails(id) {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;

    const container = document.getElementById('details-content');
    
    // Format date and time
    const dateObj = new Date(product.updated_at || product.created_at);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();

    container.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">${product.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Usuario ID:</span>
            <span class="detail-value" style="font-size: 0.7rem;">${product.last_user_id || 'N/A'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Fecha:</span>
            <span class="detail-value">${date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Hora:</span>
            <span class="detail-value">${time}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Cant. Último Ingreso:</span>
            <span class="detail-value">${product.last_entry_qty || 0}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Stock Anterior:</span>
            <span class="detail-value">${product.prev_stock || 0}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Stock Actual:</span>
            <span class="detail-value" style="font-weight:bold; color:var(--color-accent);">${product.stock || 0}</span>
        </div>
    `;

    document.getElementById('details-modal').style.display = 'flex';
}

// ── Modal Helpers ──────────────────────────────────────────────
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
    setupSearch();
    
    const addForm = document.getElementById('add-product-form');
    if (addForm) addForm.addEventListener('submit', addProduct);

    const editForm = document.getElementById('edit-product-form');
    if (editForm) editForm.addEventListener('submit', updateProduct);

    // Image Preview Logic
    const imgInput = document.getElementById('p-img');
    const previewContainer = document.getElementById('image-preview');

    if (imgInput && previewContainer) {
        imgInput.addEventListener('input', () => {
            const url = imgInput.value.trim();
            if (url) {
                previewContainer.innerHTML = `<img src="${url}" onerror="this.src='${FALLBACK_IMAGE}'; this.onerror=null;">`;
            } else {
                previewContainer.innerHTML = `<p>Vista previa aparecerá aquí</p>`;
            }
        });
    }

    // Close modals on overlay click
    window.onclick = function(event) {
        if (event.target.className === 'modal-overlay') {
            event.target.style.display = 'none';
        }
    }
});
