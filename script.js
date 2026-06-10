/* ============================================================
   BGI PROPIEDADES – script.js
   - Scroll suave (menú de navegación)
   - Menú hamburguesa (mobile)
   - Header scroll shadow
   - Carrusel infinito (CSS puro, JS solo como respaldo)
   - Popup flotante WhatsApp
   - EmailJS: envío de formulario de contacto
   ============================================================ */

/* ============================================================
   CONFIGURACIÓN EMAILJS
   Reemplaza los siguientes valores con los datos de tu cuenta:
   https://www.emailjs.com/
   ============================================================ */
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';   // ej: 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';  // ej: 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';   // ej: 'aBcDeFgHiJ1234567'

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initEmailJS();
  initSmoothScroll();
  initHamburger();
  initHeaderScroll();
  initContactForm();
});

/* ============================================================
   1. EMAILJS INIT
   ============================================================ */
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.warn('BGI: EmailJS no está cargado. Verifica la etiqueta <script> en el HTML.');
  }
}

/* ============================================================
   2. SCROLL SUAVE
   Captura todos los enlaces con href que comience con "#"
   y desplaza suavemente a la sección destino.
   ============================================================ */
function initSmoothScroll() {
  const HEADER_HEIGHT = 72; // altura del header fijo en px

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // Cerrar el menú móvil si está abierto
      const nav = document.getElementById('mainNav');
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        updateHamburgerIcon(false);
      }
    });
  });
}

/* ============================================================
   3. MENÚ HAMBURGUESA (mobile)
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    updateHamburgerIcon(isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      updateHamburgerIcon(false);
    }
  });
}

function updateHamburgerIcon(isOpen) {
  const icon = document.querySelector('#hamburger i');
  if (!icon) return;
  icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

/* ============================================================
   4. HEADER: SOMBRA AL HACER SCROLL
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    }
  }, { passive: true });
}

/* ============================================================
   5. FORMULARIO DE CONTACTO CON EMAILJS
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación básica del lado del cliente
    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const msgBox  = document.getElementById('formMessage');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const submitBtn = document.getElementById('submitBtn');

    if (!nombre || !email || !mensaje) {
      showFormMessage(msgBox, 'Por favor, completa los campos obligatorios (nombre, correo y mensaje).', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFormMessage(msgBox, 'Por favor, ingresa un correo electrónico válido.', 'error');
      return;
    }

    // Estado de carga
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';
    hideFormMessage(msgBox);

    // Parámetros del template de EmailJS
    // Los nombres de variable deben coincidir con los del template en el dashboard de EmailJS
    const templateParams = {
      from_name:  nombre,
      from_email: email,
      phone:      document.getElementById('telefono').value.trim() || 'No indicado',
      message:    mensaje
    };

    if (typeof emailjs === 'undefined') {
      // Modo demo (sin EmailJS cargado)
      setTimeout(function () {
        resetBtn(submitBtn, btnText, btnIcon);
        showFormMessage(msgBox, '⚠️ EmailJS no está configurado. Reemplaza las credenciales en script.js para activar el envío real.', 'error');
      }, 1500);
      return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        resetBtn(submitBtn, btnText, btnIcon);
        form.reset();
        showFormMessage(msgBox, '✅ ¡Mensaje enviado con éxito! Te responderemos en menos de 24 horas hábiles.', 'success');
      })
      .catch(function (err) {
        console.error('BGI EmailJS error:', err);
        resetBtn(submitBtn, btnText, btnIcon);
        showFormMessage(msgBox, '❌ Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directamente a nuestro correo.', 'error');
      });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(el, text, type) {
  el.textContent = text;
  el.className = 'form-message ' + type;
}

function hideFormMessage(el) {
  el.className = 'form-message';
  el.textContent = '';
}

function resetBtn(btn, textEl, iconEl) {
  btn.disabled = false;
  textEl.textContent = 'Enviar mensaje';
  iconEl.className = 'fa-solid fa-paper-plane';
}

/* ============================================================
   6. CARRUSEL INFINITO – RESPALDO JS
   El carrusel corre por CSS (animation: scrollLeft).
   Este bloque sólo actúa si prefers-reduced-motion está activo:
   en ese caso construye un carrusel básico con botones opcionales.
   ============================================================ */
(function () {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motionQuery.matches) return; // la animación CSS se encarga

  // Si el usuario prefiere no animación, detenemos el CSS y añadimos scroll
  // manual con drag/swipe (sin botones visibles, accesible por teclado).
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  track.style.animation = 'none';
  track.style.overflowX = 'auto';
  track.style.scrollSnapType = 'x mandatory';
  track.style.cursor = 'grab';

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', function (e) {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', function () { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    function () { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove',  function (e) {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
})();
