// Mobile menu toggle
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    if (!menuToggle || !sidebar) {
      return;
    }

    function toggleMenu() {
      const isOpen = body.classList.contains('menu-open');

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      body.style.overflow = 'hidden';
    }

    function closeMenu() {
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        setTimeout(closeMenu, 100);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) {
        closeMenu();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 900 && body.classList.contains('menu-open')) {
          closeMenu();
        }
      }, 250);
    });
  });
})();
