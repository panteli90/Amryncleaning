// =============================================
// AMRYN CLEANING SERVICES — Main JS
// =============================================

// --- Sticky Nav on Scroll ---
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });
}

// --- Mobile Nav ---
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

// --- Active Nav Link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// --- Scroll Fade-In ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// --- Our Process Section ---
const processSection = document.getElementById('our-process-section');

if (processSection) {
  const flowNodes = processSection.querySelectorAll('.process-flow__node');
  const stepCards = processSection.querySelectorAll('.process-item');

  // 1. Icon activation as each step scrolls into view
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = entry.target.dataset.step;
        const node = processSection.querySelector(`.process-flow__node[data-step="${step}"]`);
        if (node) node.classList.add('is-active');
      }
    });
  }, { threshold: 0.5 });

  stepCards.forEach(card => stepObserver.observe(card));

  // 3. Bidirectional hover: node ↔ card
  function linkHover(triggerEls, targetSelector) {
    triggerEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const step = el.dataset.step;
        const target = processSection.querySelector(`${targetSelector}[data-step="${step}"]`);
        if (target) target.classList.add('is-hovered');
      });
      el.addEventListener('mouseleave', () => {
        const step = el.dataset.step;
        const target = processSection.querySelector(`${targetSelector}[data-step="${step}"]`);
        if (target) target.classList.remove('is-hovered');
      });
    });
  }

  linkHover(flowNodes, '.process-item');   // node hover → highlight card
  linkHover(stepCards, '.process-flow__node'); // card hover → highlight node
}

// --- Toast Notification ---
function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast--' + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
}

