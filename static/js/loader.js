/**
 * LA DOCE — loader.js
 * Handles loading of reusable HTML components (Navbar, Footer)
 */

async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.ok ? await response.text() : '';
        element.innerHTML = html;
        
        // Dispatch a custom event so other scripts know a component is ready
        document.dispatchEvent(new CustomEvent('componentLoaded', { detail: { elementId } }));
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load all required components
document.addEventListener('DOMContentLoaded', () => {
    // We expect containers with these specific IDs in the HTML
    loadComponent('navbar-placeholder', 'components/navbar.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});
