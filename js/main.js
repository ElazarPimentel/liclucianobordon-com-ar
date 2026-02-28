/**
 * Lic. Luciano Bordon - Site JS
 * Smooth scroll + active section detection for nav
 */

(function () {
  'use strict';

  const navItems = document.querySelectorAll('.bottom-nav__item');
  const sections = [];

  // Build section list from nav data-section attributes
  navItems.forEach(function (item) {
    const id = item.getAttribute('data-section');
    const el = document.getElementById(id);
    if (el) {
      sections.push({ id: id, el: el, navItem: item });
    }
  });

  // Smooth scroll on nav click
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('data-section');
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active section detection via IntersectionObserver
  var currentActive = sections[0] ? sections[0].navItem : null;

  function setActive(navItem) {
    if (currentActive === navItem) return;
    if (currentActive) currentActive.classList.remove('is-active');
    navItem.classList.add('is-active');
    currentActive = navItem;
  }

  // Use IntersectionObserver with threshold
  if ('IntersectionObserver' in window) {
    var visibleSections = new Map();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target);
        }
      });

      // Find the section with the highest visibility
      var best = null;
      var bestRatio = 0;

      sections.forEach(function (s) {
        var ratio = visibleSections.get(s.el);
        if (ratio !== undefined && ratio > bestRatio) {
          bestRatio = ratio;
          best = s;
        }
      });

      if (best) {
        setActive(best.navItem);
      }
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (s) {
      observer.observe(s.el);
    });
  }
})();
