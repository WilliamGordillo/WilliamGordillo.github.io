/* ============================================================
   main.js — Portfolio interactions
   ============================================================ */

// ── Nav: shrink on scroll + mobile burger ──────────────────
const nav       = document.querySelector('.nav');
const burger    = document.querySelector('.nav-burger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Active nav link highlighting on scroll ─────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNavLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--text)';
    }
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });

// ── Scroll reveal via IntersectionObserver ─────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);

// Observe skill cards, timeline items, and generic reveal elements
document.querySelectorAll('.skill-card, .timeline-item, .reveal').forEach(el => {
  revealObserver.observe(el);
});

// ── Smooth parallax on hero background text ────────────────
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.25}px))`;
  }, { passive: true });
}

// ── Subtle mouse-tracking glow on hero ─────────────────────
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    hero.style.backgroundImage = `
      radial-gradient(ellipse 60% 50% at ${x}% ${y}%, rgba(167,139,250,0.12) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(244,114,182,0.07) 0%, transparent 60%)
    `;
  });
  hero.addEventListener('mouseleave', () => {
    hero.style.backgroundImage = '';
  });
}

// ── Typed-style cursor blink on hero name ──────────────────
// (purely decorative, CSS handles the italic stroke, no library needed)

// ── Stats counter animation ────────────────────────────────
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(el => {
          const target = parseFloat(el.textContent);
          const suffix = el.textContent.replace(/[\d.]/g, ''); // e.g. "+" or ""
          let start    = 0;
          const dur    = 1200;
          const step   = 16;
          const inc    = target / (dur / step);
          const timer  = setInterval(() => {
            start += inc;
            if (start >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(start) + suffix;
            }
          }, step);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const statsBlock = document.querySelector('.about-stats');
if (statsBlock) statsObserver.observe(statsBlock);

// ── Reduce logo animation for users who prefer less motion ─
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const track = document.getElementById('logosTrack');
  if (track) track.style.animation = 'none';

  document.querySelectorAll('.skill-card, .timeline-item, .reveal').forEach(el => {
    el.classList.add('visible');
  });
}

// ── Back-to-top smooth scroll ──────────────────────────────
document.querySelector('.back-to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.social-links a').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'click', {
      event_category: 'outbound',
      event_label: link.textContent.trim()
    });
  });
});

console.log('Portfolio loaded');