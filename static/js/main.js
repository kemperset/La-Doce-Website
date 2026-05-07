// ============================================================
//  LA DOCE — main.js
//  Lógica principal para index.html
// ============================================================

// ── Dark / Light Mode Toggle ─────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');
const toggleLabel = themeToggle.querySelector('.toggle-label');
const body        = document.body;

// Restaurar preferencia guardada
if (localStorage.getItem('laDoceTheme') === 'light') {
    body.classList.add('light-mode');
    toggleIcon.textContent  = '☀️';
    toggleLabel.textContent = 'Modo Claro';
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    if (isLight) {
        toggleIcon.textContent  = '☀️';
        toggleLabel.textContent = 'Modo Claro';
        localStorage.setItem('laDoceTheme', 'light');
    } else {
        toggleIcon.textContent  = '🌙';
        toggleLabel.textContent = 'Modo Oscuro';
        localStorage.setItem('laDoceTheme', 'dark');
    }
});

// ── Scroll Reveal ─────────────────────────────────────────────
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(reveal => observer.observe(reveal));
