/* ───────────────────────────────────────────
   script.js — Vishesha S Portfolio
   Theme toggle, mobile nav, hero reveal,
   scroll progress, and active nav tracking
   ─────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Theme toggle ── */
  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // On load: saved preference > system preference > light
  const saved = localStorage.getItem('theme');
  applyTheme(saved || getSystemTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // Listen for system theme changes (only if no saved preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── Mobile nav toggle ── */
  const menuBtn = document.querySelector('.nav__menu-btn');
  const navLinks = document.querySelector('.nav__links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ── Nav scroll state & Scroll progress line ── */
  const nav = document.querySelector('.nav');
  const progressBar = document.getElementById('scroll-progress');
  let scrolled = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Hairline border once scrolled
    const shouldBeScrolled = scrollY > 10;
    if (shouldBeScrolled !== scrolled) {
      scrolled = shouldBeScrolled;
      if (nav) nav.classList.toggle('is-scrolled', scrolled);
    }

    // Scroll progress line
    if (progressBar) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hero reveal animation ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function revealHero() {
    const reveals = document.querySelectorAll('.hero__reveal');
    if (prefersReducedMotion.matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    reveals.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-visible'); }, 80 + i * 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHero);
  } else {
    revealHero();
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksAll.forEach(function (link) {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
