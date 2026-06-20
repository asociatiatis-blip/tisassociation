/* =====================================================================
   TIS Association — progressive enhancement
   The site is fully readable and navigable with JavaScript disabled.
   This only adds polish: reveals, scroll-spy, mobile menu, back-to-top.
   ===================================================================== */
(function () {
  'use strict';

  // Signal that JS is available (CSS uses .js to hide reveal elements safely)
  var root = document.documentElement;
  root.classList.add('js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Current year in footer ---- */
    var yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Sticky header scrolled state ---- */
    var header = document.querySelector('[data-header]');
    var onScrollHeader = function () {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScrollHeader();

    /* ---- Back to top ---- */
    var toTop = document.querySelector('[data-to-top]');
    var onScrollToTop = function () {
      if (!toTop) return;
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    onScrollToTop();
    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }

    /* ---- Throttled scroll listener ---- */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScrollHeader();
        onScrollToTop();
        ticking = false;
      });
    }, { passive: true });

    /* ---- Mobile menu ---- */
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (nav && toggle && menu) {
      var setMenu = function (open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      toggle.addEventListener('click', function () {
        setMenu(!nav.classList.contains('is-open'));
      });
      // Close on link click
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
      });
      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          setMenu(false);
          toggle.focus();
        }
      });
      // Close when resizing up to desktop
      window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
        if (e.matches) setMenu(false);
      });
    }

    /* ---- Copy email to clipboard ---- */
    var copyStatus = document.getElementById('copy-status');
    var announce = function (msg) { if (copyStatus) copyStatus.textContent = msg; };

    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for older / non-secure contexts
      return new Promise(function (resolve, reject) {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          ok ? resolve() : reject();
        } catch (e) { reject(e); }
      });
    };

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-copy-email]');
      if (!btn) return;
      var email = btn.getAttribute('data-copy-email');
      var label = btn.querySelector('.btn-copy-label');
      copyText(email).then(function () {
        announce(email + ' copied to clipboard');
        var prev = label ? label.textContent : null;
        if (label) label.textContent = 'Copied ✓';
        btn.classList.add('is-copied');
        setTimeout(function () {
          if (label) label.textContent = prev;
          btn.classList.remove('is-copied');
        }, 2200);
      }).catch(function () {
        announce('Could not copy — the address is ' + email);
      });
    });

    /* ---- Reveal on scroll ---- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // gentle stagger within a group
            var delay = Math.min(i * 60, 240);
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---- Scroll-spy: highlight active nav link ---- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
    var sections = navLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      var setActive = function (id) {
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      };
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }
  });
})();
