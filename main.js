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
const WEBHOOK_HOMEPAGE = 'https://hooks.zapier.com/hooks/catch/27185988/u7l6it4/';
const WEBHOOK_CONTACT  = 'https://hooks.zapier.com/hooks/catch/27185988/u7l6it4/';

function val(form, id) {
  return (form.querySelector('#' + id) || {}).value || '';
}

function buildPayload(form) {
  // Full contact-page form (contact.html)
  if (form.querySelector('#first_name')) {
    return {
      url: WEBHOOK_CONTACT,
      payload: {
        firstName:    val(form, 'first_name'),
        lastName:     val(form, 'last_name'),
        company:      val(form, 'company_name'),
        email:        val(form, 'email_addr'),
        phone:        val(form, 'phone_num'),
        service:      val(form, 'service_type'),
        siteSize:     val(form, 'site_size'),
        frequency:    val(form, 'frequency'),
        requirements: val(form, 'details'),
      },
    };
  }

  // Homepage quick-quote form (index.html)
  return {
    url: WEBHOOK_HOMEPAGE,
    payload: {
      businessName:  val(form, 'company'),
      contactPerson: (val(form, 'fname') + ' ' + val(form, 'lname')).trim(),
      email:         val(form, 'email'),
      phone:         val(form, 'phone'),
    },
  };
}

const forms = document.querySelectorAll('.form');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const { url, payload } = buildPayload(form);

    try {
      const res = await fetch(url, {
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
