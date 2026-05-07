// ============================================================
//  LA DOCE — trabaja.js
//  Lógica para trabaja.html: tema, CV upload y EmailJS
// ============================================================

// ── Dark / Light Mode Toggle ─────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');
const toggleLabel = themeToggle.querySelector('.toggle-label');

function applyTheme(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    toggleIcon.textContent  = isLight ? '☀️' : '🌙';
    toggleLabel.textContent = isLight ? 'Modo Claro' : 'Modo Oscuro';
}

// Restaurar preferencia guardada al cargar la página
applyTheme(localStorage.getItem('laDoceTheme') === 'light');

themeToggle.addEventListener('click', () => {
    const nowLight = !document.body.classList.contains('light-mode');
    applyTheme(nowLight);
    localStorage.setItem('laDoceTheme', nowLight ? 'light' : 'dark');
});

// ── File Input — actualizar etiqueta al seleccionar archivo ──
const cvInput   = document.getElementById('cv');
const fileLabel = document.getElementById('file-label');

cvInput.addEventListener('change', () => {
    fileLabel.textContent = cvInput.files[0]
        ? '📄 ' + cvInput.files[0].name
        : 'Arrastra tu CV aquí o haz clic para seleccionar';
});

// ── EmailJS ───────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'pDnUMVwzAlmp_b1ZBvGhI';
const EMAILJS_SERVICE_ID  = 'service_r7o6ssg';
const EMAILJS_TEMPLATE_ID = 'template_nvz7l7d';

// Inicialización EmailJS v4
emailjs.init(EMAILJS_PUBLIC_KEY);

const form       = document.getElementById('trabaja-form');
const formStatus = document.getElementById('form-status');
const btnEnviar  = document.getElementById('btn-enviar');
const btnText    = document.getElementById('btn-text');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre    = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo    = document.getElementById('correo').value.trim();
    const mensaje   = document.getElementById('mensaje').value.trim();
    const cvFile    = cvInput.files[0];

    // ── Validación de campos ──────────────────────────────────
    if (!nombre || !apellidos || !correo || !mensaje) {
        showStatus('⚠️ Por favor completa todos los campos obligatorios.', 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        showStatus('⚠️ Ingresa un correo electrónico válido.', 'error');
        return;
    }
    if (cvFile && cvFile.size > 3 * 1024 * 1024) {
        showStatus('⚠️ El CV no puede superar los 3 MB.', 'error');
        return;
    }

    // ── Estado de carga ───────────────────────────────────────
    btnEnviar.disabled       = true;
    btnText.textContent      = '⏳ Enviando...';
    formStatus.className     = '';
    formStatus.style.display = 'none';

    try {
        // NOTA: EmailJS free tier no soporta adjuntos binarios.
        // Se envía el nombre del archivo como referencia en el mensaje.
        const templateParams = {
            nombre,
            apellidos,
            correo,
            mensaje,
            cv_name: cvFile ? cvFile.name : 'No adjuntado',
            fecha:   new Date().toLocaleDateString('es-PE', {
                         year: 'numeric', month: 'long', day: 'numeric'
                     }),
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('EmailJS OK:', response.status, response.text);
        showStatus(
            '✅ ¡Solicitud enviada con éxito! Te contactaremos pronto en ' + correo,
            'success'
        );
        form.reset();
        fileLabel.textContent = 'Arrastra tu CV aquí o haz clic para seleccionar';

    } catch (err) {
        console.error('EmailJS error:', err);
        const detail = err && err.text ? ` (${err.text})` : '';
        showStatus(
            '❌ Error al enviar' + detail + '. Verifica tu conexión e inténtalo de nuevo.',
            'error'
        );
    } finally {
        btnEnviar.disabled  = false;
        btnText.textContent = '✉️ Enviar Solicitud';
    }
});

// ── Mostrar mensaje de estado del formulario ──────────────────
function showStatus(message, type) {
    formStatus.textContent   = message;
    formStatus.className     = type;
    formStatus.style.display = 'block';
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
