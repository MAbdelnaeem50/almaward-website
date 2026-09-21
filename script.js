// year
document.getElementById('year').textContent = new Date().getFullYear();

// header shrink on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 24) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// reduced motion check
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// scroll reveal (sections, cards, gallery wipes)
const revealEls = document.querySelectorAll('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// animated stat counters
const counters = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('ar-EG');
  };
  requestAnimationFrame(step);
};
if (reduceMotion || !('IntersectionObserver' in window)) {
  counters.forEach(el => { el.textContent = parseInt(el.dataset.count, 10).toLocaleString('ar-EG'); });
} else {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));
}

// subtle parallax on hero swatches following the pointer
const heroStage = document.getElementById('heroStage');
if (heroStage && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const pieces = heroStage.querySelectorAll('[data-depth]');
  heroStage.addEventListener('mousemove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pieces.forEach(p => {
      const depth = parseFloat(p.dataset.depth);
      p.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
  heroStage.addEventListener('mouseleave', () => {
    pieces.forEach(p => { p.style.transform = 'translate(0,0)'; });
  });
}

// accordion (FAQ)
document.querySelectorAll('.accordion-item').forEach(item => {
  const trigger = item.querySelector('.accordion-trigger');
  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// contact form (front-end only demo — no backend wired up)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'تم استلام رسالتك، سنتواصل معك في أقرب وقت. (هذا النموذج تجريبي ويحتاج ربط بخدمة إرسال فعلية)';
    formNote.classList.remove('hidden');
    form.reset();
  });
}
