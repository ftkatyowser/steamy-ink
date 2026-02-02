// Mobile menu toggle functionality
(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    if (!menuToggle || !sidebar) {
      return;
    }

    // Toggle menu open/closed
    function toggleMenu() {
      const isOpen = body.classList.contains('menu-open');

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Open menu
    function openMenu() {
      body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      // Prevent body scroll when menu is open
      body.style.overflow = 'hidden';
    }

    // Close menu
    function closeMenu() {
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      // Restore body scroll
      body.style.overflow = '';
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link (for better UX)
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        // Small delay to allow navigation to start
        setTimeout(closeMenu, 100);
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) {
        closeMenu();
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Close menu if window is resized above mobile breakpoint
        if (window.innerWidth > 900 && body.classList.contains('menu-open')) {
          closeMenu();
        }
      }, 250);
    });
  });
})();
