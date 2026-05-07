// ============================================================
//  LA DOCE — main.js
//  Lógica principal para index.html
// ============================================================

// ── Scroll Reveal ─────────────────────────────────────────────
const reveals  = document.querySelectorAll('.reveal');
window.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(reveal => window.observer.observe(reveal));

