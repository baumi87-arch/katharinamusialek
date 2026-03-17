/* =========================================
   KATHARINA MUSIALEK – Website JS
   ========================================= */

// ---- NAV: scroll state & mobile menu ----
const nav      = document.getElementById('nav');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (scrollProgress) scrollProgress.style.width = scrollPct + '%';
  nav.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  burger.setAttribute('aria-label', navLinks.classList.contains('open') ? 'Menü schließen' : 'Menü öffnen');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ---- PILLAR ACCORDION ----
document.querySelectorAll('.pillar').forEach(pillar => {
  pillar.addEventListener('click', () => {
    const isOpen = pillar.classList.contains('open');
    // Close all
    document.querySelectorAll('.pillar').forEach(p => p.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) pillar.classList.add('open');
  });
});

// ---- TESTIMONIAL SLIDER ----
const testimonials = document.querySelectorAll('.testimonial');
const dots         = document.querySelectorAll('.dot');
let   currentIdx   = 0;
let   autoSlide;

function goTo(idx) {
  testimonials[currentIdx].classList.remove('active');
  dots[currentIdx].classList.remove('active');
  currentIdx = (idx + testimonials.length) % testimonials.length;
  testimonials[currentIdx].classList.add('active');
  dots[currentIdx].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goTo(parseInt(dot.dataset.index, 10));
    startAutoSlide();
  });
});

function startAutoSlide() {
  autoSlide = setInterval(() => goTo(currentIdx + 1), 5000);
}
startAutoSlide();

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Simple validation
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    // Success state
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Anfrage gesendet!';
    btn.style.background = '#4A7A64';
    btn.disabled = true;

    // Show success message
    const note = form.querySelector('.form-note');
    note.textContent = 'Vielen Dank! Katharina meldet sich innerhalb von 48 Stunden bei Ihnen.';
    note.style.color = '#2E5D4B';
    note.style.fontWeight = '500';
  });

  // Remove error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// ---- BACK TO TOP ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinksAll.forEach(link => {
        link.style.fontWeight = link.getAttribute('href') === `#${id}` ? '500' : '400';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- PARALLAX (subtle, desktop only) ----
if (window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
  const heroImg = document.querySelector('.hero__img');
  window.addEventListener('scroll', () => {
    if (heroImg) {
      const offset = window.scrollY * 0.25;
      heroImg.style.transform = `scale(1) translateY(${offset}px)`;
    }
  }, { passive: true });
}
