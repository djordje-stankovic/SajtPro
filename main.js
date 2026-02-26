// ===== Smooth Scroll (Lenis-style) =====
(function() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('has-smooth-scroll');

  var current = window.scrollY;
  var target = window.scrollY;
  var ease = 0.08;
  var isRunning = false;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
  function getMaxScroll() { return document.documentElement.scrollHeight - window.innerHeight; }

  function onWheel(e) {
    e.preventDefault();
    target = clamp(target + e.deltaY, 0, getMaxScroll());
    if (!isRunning) { isRunning = true; requestAnimationFrame(update); }
  }

  function update() {
    current = lerp(current, target, ease);
    if (Math.abs(current - target) < 0.5) {
      current = target;
      window.scrollTo(0, current);
      isRunning = false;
      return;
    }
    window.scrollTo(0, current);
    requestAnimationFrame(update);
  }

  // Sync on programmatic scrolls
  window.addEventListener('scroll', function() {
    if (!isRunning) { current = window.scrollY; target = window.scrollY; }
  });

  window.addEventListener('wheel', onWheel, { passive: false });

  // Keyboard scroll support
  window.addEventListener('keydown', function(e) {
    var scrollKeys = { 32: 400, 33: -400, 34: 400, 38: -120, 40: 120 };
    if (e.keyCode === 36) { target = 0; }
    else if (e.keyCode === 35) { target = getMaxScroll(); }
    else if (scrollKeys[e.keyCode] !== undefined) {
      target = clamp(target + scrollKeys[e.keyCode], 0, getMaxScroll());
    } else { return; }
    if (!isRunning) { isRunning = true; requestAnimationFrame(update); }
  });

  window.addEventListener('resize', function() {
    target = clamp(target, 0, getMaxScroll());
    current = clamp(current, 0, getMaxScroll());
  });

  // Expose for anchor links
  window.__smoothScrollTarget = function(val) {
    target = clamp(val, 0, getMaxScroll());
    if (!isRunning) { isRunning = true; requestAnimationFrame(update); }
  };
})();

// ===== Navigation scroll effect =====
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  });
  nav.classList.toggle('nav-scrolled', window.scrollY > 60);
})();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#') return;
    var el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      if (window.__smoothScrollTarget) {
        var rect = el.getBoundingClientRect();
        window.__smoothScrollTarget(window.scrollY + rect.top);
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var toggle = document.getElementById('menu-toggle');
      if (toggle) toggle.checked = false;
    }
  });
});

// ===== Magnetic Buttons =====
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var magnets = document.querySelectorAll('.btn, .nav-cta');
  magnets.forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(function() { el.style.transition = ''; }, 400);
    });
  });
})();

// ===== 3D Tilt on Cards =====
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var maxTilt = 8;
  var cards = document.querySelectorAll('.diff-card, .pf-full-card, .hw-flow-card, .manifest-value, .pf-hscroll-item');

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rotY = (x - 0.5) * maxTilt * 2;
      var rotX = (0.5 - y) * maxTilt * 2;
      card.style.transform = 'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(function() { card.style.transition = ''; }, 500);
    });
  });
})();

// ===== Scroll Reveal =====
(function() {
  var genericReveals = document.querySelectorAll('.reveal, .service-card, .portfolio-item, .pf-card, .test-card, .diff-card, .timeline-item, .team-card, .pf-full-card, .split, .belief-section, .ba-slider-wrap, .live-browser, .manifest-value, .pf-hscroll-item');
  var selfAnimated = document.querySelectorAll('.hw-flow-card, .trust-item, .included-item');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  genericReveals.forEach(function(el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
  selfAnimated.forEach(function(el) {
    observer.observe(el);
  });

  var textReveals = document.querySelectorAll('.text-reveal');
  textReveals.forEach(function(el) { observer.observe(el); });

  var wordReveals = document.querySelectorAll('.word-reveal');
  wordReveals.forEach(function(el) { observer.observe(el); });
})();

// ===== Text Reveal — Split headings into lines =====
(function() {
  var targets = document.querySelectorAll('.hero-title, .section-head h2, .split-text h2, .quote-heading, .belief-heading, .page-hero h1, .manifest-headline');

  targets.forEach(function(el) {
    var html = el.innerHTML;
    var parts = html.split(/<br\s*\/?>/gi);
    if (parts.length < 2) {
      el.innerHTML = '<span class="line-wrap"><span class="line-inner">' + html.trim() + '</span></span>';
    } else {
      el.innerHTML = parts.map(function(part) {
        return '<span class="line-wrap"><span class="line-inner">' + part.trim() + '</span></span>';
      }).join('');
    }
    el.classList.add('text-reveal');
  });
})();

// ===== Word Reveal — Hero description =====
(function() {
  var desc = document.querySelector('.hero-desc');
  if (!desc) return;

  var text = desc.textContent;
  var words = text.split(/\s+/);
  desc.innerHTML = words.map(function(word, i) {
    return '<span class="word" style="transition-delay:' + (i * 0.03) + 's">' + word + '</span>';
  }).join(' ');
  desc.classList.add('word-reveal');

  setTimeout(function() { desc.classList.add('revealed'); }, 600);
})();

// ===== Hero Build Animation =====
(function() {
  var els = document.querySelectorAll('.build-el');
  if (!els.length) return;

  var isEn = document.documentElement.lang === 'en';
  var urlTarget = isEn ? 'yourbusiness.com' : 'vasafirma.rs';
  var urlEl = document.getElementById('typingUrl');
  var cursorEl = document.querySelector('.browser-bar-cursor');
  var charIndex = 0;

  function typeUrl() {
    if (!urlEl) return;
    if (charIndex <= urlTarget.length) {
      urlEl.textContent = urlTarget.substring(0, charIndex);
      charIndex++;
      setTimeout(typeUrl, 80 + Math.random() * 60);
    } else {
      if (cursorEl) cursorEl.style.display = 'none';
    }
  }

  setTimeout(function() {
    typeUrl();
    els.forEach(function(el, i) {
      setTimeout(function() { el.classList.add('built'); }, 800 + i * 400);
    });
  }, 300);
})();

// ===== Before/After Slider =====
(function() {
  var sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(function(slider) {
    var before = slider.querySelector('.ba-before');
    var handle = slider.querySelector('.ba-handle');
    if (!before || !handle) return;

    var isDragging = false;

    function updatePosition(x) {
      var rect = slider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      var pct = pos * 100;
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', function(e) {
      isDragging = true;
      updatePosition(e.clientX);
      e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      updatePosition(e.clientX);
    });
    document.addEventListener('mouseup', function() { isDragging = false; });

    slider.addEventListener('touchstart', function(e) {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function() { isDragging = false; });
  });
})();

// ===== Parallax =====
(function() {
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  var orb1 = document.querySelector('.hero-orb-1');
  var orb2 = document.querySelector('.hero-orb-2');

  function onScroll() {
    var y = window.scrollY;
    if (orb1) orb1.style.transform = 'translateY(' + (y * 0.15) + 'px)';
    if (orb2) orb2.style.transform = 'translateY(' + (y * 0.1) + 'px)';
  }

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() { onScroll(); ticking = false; });
      ticking = true;
    }
  });
})();

// ===== Live Preview Tabs =====
(function() {
  var tabs = document.querySelectorAll('.live-tab');
  var iframe = document.getElementById('liveIframe');
  var barUrl = document.getElementById('liveBarUrl');
  if (!tabs.length || !iframe) return;

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      iframe.src = tab.getAttribute('data-src');
      if (barUrl) barUrl.textContent = tab.getAttribute('data-name');
    });
  });
})();

// ===== Close mobile menu on link click =====
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    var toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});

// (Horizontal scroll removed — using before/after slider instead)

// ===== Footer Reveal (desktop only) =====
(function() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var footer = document.querySelector('.footer');
  if (!footer) return;

  function setupFooterReveal() {
    var footerH = footer.offsetHeight;
    var prev = footer.previousElementSibling;
    if (!prev) return;
    prev.style.marginBottom = footerH + 'px';
    prev.classList.add('footer-reveal-spacer');
    footer.classList.add('footer-sticky');
  }

  if (document.readyState === 'complete') { setupFooterReveal(); }
  else { window.addEventListener('load', setupFooterReveal); }

  window.addEventListener('resize', function() {
    var footerH = footer.offsetHeight;
    var prev = footer.previousElementSibling;
    if (prev) prev.style.marginBottom = footerH + 'px';
  });
})();

// ===== Page Transition =====
(function() {
  var overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  // On load: animate out if arriving via transition
  if (sessionStorage.getItem('pt-active') === '1') {
    sessionStorage.removeItem('pt-active');
    overlay.classList.add('pt-leaving');
    overlay.offsetHeight; // force reflow
    requestAnimationFrame(function() {
      overlay.classList.add('pt-exit');
      setTimeout(function() {
        overlay.classList.remove('pt-leaving', 'pt-exit');
      }, 700);
    });
  }

  // Intercept internal link clicks
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:')
        || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    if (link.target === '_blank') return;

    e.preventDefault();
    sessionStorage.setItem('pt-active', '1');
    overlay.classList.add('pt-entering');

    setTimeout(function() { window.location.href = href; }, 500);
  });
})();

// ===== Safety fallback — reveal all after 2.5s =====
setTimeout(function() {
  document.querySelectorAll('.reveal:not(.revealed), .text-reveal:not(.revealed), .word-reveal:not(.revealed), .build-el:not(.built)').forEach(function(el) {
    el.classList.add('revealed');
    el.classList.add('built');
  });
}, 2500);
