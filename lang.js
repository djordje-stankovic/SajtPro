// lang.js — Inline SR/EN toggle without page reload
(function() {
  var KEY = 'sajtpro-lang';
  var lang = localStorage.getItem(KEY) || 'sr';
  var originals = new Map();
  var originalsHtml = new Map();
  var originalPlaceholders = new Map();
  var origTitle = '';
  var isAnimating = false;

  function apply(newLang, animate) {
    lang = newLang;
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;

    var targets = document.querySelectorAll('[data-en], [data-en-html]');

    if (animate) {
      isAnimating = true;

      // Phase 1: fade out all translatable elements
      targets.forEach(function(el) {
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(4px)';
      });

      // Phase 2: swap content after fade out, then fade in
      setTimeout(function() {
        swapContent();

        targets.forEach(function(el, i) {
          // Stagger the fade-in slightly for a wave effect
          var delay = Math.min(i * 8, 150);
          el.style.transition = 'none';
          el.style.transform = 'translateY(-4px)';
          el.offsetHeight; // force reflow

          setTimeout(function() {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
        });

        // Clean up inline styles after animation
        setTimeout(function() {
          targets.forEach(function(el) {
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
          });
          isAnimating = false;
        }, 500);
      }, 220);
    } else {
      swapContent();
    }
  }

  function swapContent() {
    // Swap text content
    document.querySelectorAll('[data-en]').forEach(function(el) {
      if (!originals.has(el)) originals.set(el, el.textContent);
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : originals.get(el);
    });

    // Swap HTML content
    document.querySelectorAll('[data-en-html]').forEach(function(el) {
      if (!originalsHtml.has(el)) originalsHtml.set(el, el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : originalsHtml.get(el);
    });

    // Swap placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(function(el) {
      if (!originalPlaceholders.has(el)) originalPlaceholders.set(el, el.placeholder);
      el.placeholder = lang === 'en' ? el.getAttribute('data-en-placeholder') : originalPlaceholders.get(el);
    });

    // Update page title
    var titleEl = document.querySelector('title');
    if (titleEl && titleEl.getAttribute('data-en')) {
      if (!origTitle) origTitle = document.title;
      document.title = lang === 'en' ? titleEl.getAttribute('data-en') : origTitle;
    }

    // Update toggle button(s)
    document.querySelectorAll('.lang-toggle').forEach(function(btn) {
      btn.textContent = lang === 'sr' ? 'EN' : 'SR';
    });

    // Re-apply text reveals
    reapplyTextReveals();
  }

  function reapplyTextReveals() {
    var targets = document.querySelectorAll('.text-reveal');
    targets.forEach(function(el) {
      if (!el.querySelector('.line-wrap')) return;
      if (!el.hasAttribute('data-en-html')) return;

      var html = lang === 'en' ? el.getAttribute('data-en-html') : (originalsHtml.has(el) ? originalsHtml.get(el) : el.innerHTML);

      var parts = html.split(/<br\s*\/?>/gi);
      if (parts.length < 2) {
        el.innerHTML = '<span class="line-wrap"><span class="line-inner">' + html.trim() + '</span></span>';
      } else {
        el.innerHTML = parts.map(function(p) {
          return '<span class="line-wrap"><span class="line-inner">' + p.trim() + '</span></span>';
        }).join('');
      }
      el.classList.add('revealed');
    });
  }

  function init() {
    var link = document.querySelector('.nav-lang');
    if (!link) return;

    if (link.classList.contains('lang-toggle')) {
      link.textContent = lang === 'sr' ? 'EN' : 'SR';
      link.addEventListener('click', function() {
        if (isAnimating) return;
        apply(lang === 'sr' ? 'en' : 'sr', true);
      });
    } else {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-lang lang-toggle';
      btn.textContent = lang === 'sr' ? 'EN' : 'SR';
      btn.addEventListener('click', function() {
        if (isAnimating) return;
        apply(lang === 'sr' ? 'en' : 'sr', true);
      });
      link.parentNode.replaceChild(btn, link);
    }

    // On first load, apply without animation
    if (lang !== 'sr') apply(lang, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
