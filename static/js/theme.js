/**
 * LA DOCE — theme.js
 * Handles dark/light mode switching and persistence
 */

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const toggleIcon  = themeToggle.querySelector('.toggle-icon');
    const toggleLabel = themeToggle.querySelector('.toggle-label');
    const body        = document.body;

    // Apply theme helper
    const applyTheme = (isLight) => {
        body.classList.toggle('light-mode', isLight);
        if (toggleIcon) toggleIcon.textContent = isLight ? '☀️' : '🌙';
        if (toggleLabel) toggleLabel.textContent = isLight ? 'Modo Claro' : 'Modo Oscuro';
    };

    // Restore preference
    applyTheme(localStorage.getItem('laDoceTheme') === 'light');

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-mode');
        localStorage.setItem('laDoceTheme', isLight ? 'light' : 'dark');
        applyTheme(isLight);
    });
}

// Global listener for dynamic components
document.addEventListener('componentLoaded', (e) => {
    if (e.detail.elementId === 'navbar-placeholder') {
        initThemeToggle();
    }
});
