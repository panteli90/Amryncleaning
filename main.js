// =============================================
// AMRYN CLEANING SERVICES — Main JS
// =============================================

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

// --- Contact Form ---
const WEBHOOK_URL = 'https://hook.us2.make.com/o7a5xu3g9glbfgof3wkuxwjwj8rs1rpe';

const forms = document.querySelectorAll('.form');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fname = (form.querySelector('#fname') || {}).value || '';
    const lname = (form.querySelector('#lname') || {}).value || '';

    const payload = {
      businessName:   (form.querySelector('#company') || {}).value || '',
      contactPerson:  (fname + ' ' + lname).trim(),
      email:          (form.querySelector('#email') || {}).value || '',
      phone:          (form.querySelector('#phone') || {}).value || '',
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      form.reset();
      showToast('Enquiry sent — we\'ll be in touch within 24 hours.', 'success');
    } catch {
      showToast('Something went wrong. Please try again or call us directly.', 'error');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
});
