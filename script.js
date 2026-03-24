/* ════════════════════════════════════════
   GO RED SEA — JavaScript
   ════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Nav: scroll state ─────────────────────── */
  const nav = document.getElementById('nav-header');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── Mobile burger ─────────────────────────── */
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  burger.addEventListener('click', function () {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    burger.setAttribute('aria-expanded', menuOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', function () {
      menuOpen = false;
      mobileMenu.classList.remove('open');
    });
  });


  /* ── Hero image subtle zoom on load ───────── */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.addEventListener('load', function () {
      heroImg.classList.add('loaded');
    });
    if (heroImg.complete) heroImg.classList.add('loaded');
  }


  /* ── Intersection Observer — reveal ────────── */
  const revealEls = document.querySelectorAll(
    '.dest-card, .exp-card, .pillar, .testi-card, .section-header, .why-text, .footer-col, .footer-brand'
  );

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    // Stagger siblings within the same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx === 3) el.classList.add('reveal-delay-3');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });


  /* ── Booking bar: typing placeholder animation ─ */
  const destInput = document.getElementById('dest-input');
  const placeholders = [
    'Sharm El-Sheikh, Egypt',
    'Hurghada, Egypt',
    'NEOM Coast, Saudi Arabia',
    'Aqaba, Jordan',
    'Dahab, Egypt',
  ];

  let phIdx = 0;
  let charIdx = 0;
  let typing = true;
  let phTimer;

  function typePlaceholder() {
    if (!destInput || document.activeElement === destInput) {
      phTimer = setTimeout(typePlaceholder, 120);
      return;
    }

    const current = placeholders[phIdx];

    if (typing) {
      charIdx++;
      destInput.placeholder = current.slice(0, charIdx);
      if (charIdx >= current.length) {
        typing = false;
        phTimer = setTimeout(typePlaceholder, 1800);
        return;
      }
    } else {
      charIdx--;
      destInput.placeholder = current.slice(0, charIdx);
      if (charIdx <= 0) {
        typing = true;
        phIdx = (phIdx + 1) % placeholders.length;
        phTimer = setTimeout(typePlaceholder, 400);
        return;
      }
    }

    phTimer = setTimeout(typePlaceholder, typing ? 68 : 32);
  }

  // Start after 1s so it doesn't fight hero animations
  setTimeout(typePlaceholder, 1000);


  /* ── Date input: default to today → +7 days ── */
  const datesInput = document.getElementById('dates-input');
  if (datesInput) {
    const today = new Date();
    const next  = new Date(today);
    next.setDate(next.getDate() + 7);

    const fmt = function (d) {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    datesInput.placeholder = fmt(today) + ' — ' + fmt(next);
  }


  /* ── Search button ─────────────────────────── */
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const dest   = document.getElementById('dest-input').value.trim();
      const dates  = document.getElementById('dates-input').value.trim();
      const guests = document.getElementById('guests-input').value.trim();

      if (!dest) {
        document.getElementById('dest-input').focus();
        shakeEl(document.getElementById('booking-dest'));
        return;
      }

      // In a real app, navigate to search results
      console.log('Search:', { dest, dates, guests });
      alert('🌊 Searching for: ' + dest + '\n\nIn a live version, this would open search results!');
    });
  }

  function shakeEl(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(function () { el.style.animation = ''; }, 400);
  }


  /* ── Newsletter form ───────────────────────── */
  const newsletterBtn = document.getElementById('newsletter-btn');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function () {
      const emailInput = document.getElementById('email-input');
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        emailInput.focus();
        shakeEl(emailInput);
        return;
      }

      newsletterBtn.textContent = '✓ You\'re in!';
      newsletterBtn.disabled = true;
      newsletterBtn.style.opacity = '0.8';
      emailInput.value = '';
      emailInput.placeholder = 'Welcome aboard!';
    });
  }


  /* ── Smooth scroll for nav links ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── Parallax: hero image on scroll ────────── */
  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight;
      if (scrolled < maxScroll) {
        heroImg.style.transform = 'scale(1) translateY(' + (scrolled * 0.25) + 'px)';
      }
    }, { passive: true });
  }


  /* ── Add shake keyframe dynamically ────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(styleEl);

})();
