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
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ===== Scroll Reveal =====
(function() {
  var genericReveals = document.querySelectorAll('.reveal, .service-card, .portfolio-item, .pf-card, .test-card, .diff-card, .timeline-item, .team-card, .pf-full-card, .split, .belief-section, .ba-slider-wrap, .live-browser, .manifest-value');
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

  // Text reveal elements
  var textReveals = document.querySelectorAll('.text-reveal');
  textReveals.forEach(function(el) {
    observer.observe(el);
  });

  // Word reveal
  var wordReveals = document.querySelectorAll('.word-reveal');
  wordReveals.forEach(function(el) {
    observer.observe(el);
  });
})();

// ===== Text Reveal — Split headings into lines =====
(function() {
  var targets = document.querySelectorAll('.hero-title, .section-head h2, .split-text h2, .quote-heading, .belief-heading, .page-hero h1, .manifest-headline');

  targets.forEach(function(el) {
    // Preserve original inner HTML
    var html = el.innerHTML;
    // Split by <br> tags
    var parts = html.split(/<br\s*\/?>/gi);
    if (parts.length < 2) {
      // Single line — wrap whole content
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

  // Trigger reveal after a small delay (hero is visible on load)
  setTimeout(function() {
    desc.classList.add('revealed');
  }, 600);
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

  // Start build sequence after page load
  setTimeout(function() {
    typeUrl();
    els.forEach(function(el, i) {
      setTimeout(function() {
        el.classList.add('built');
      }, 800 + i * 400);
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
    document.addEventListener('mouseup', function() {
      isDragging = false;
    });

    // Touch support
    slider.addEventListener('touchstart', function(e) {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function() {
      isDragging = false;
    });
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
      requestAnimationFrame(function() {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== Close mobile menu on link click =====
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    var toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});

// ===== Safety fallback — reveal all after 2.5s =====
setTimeout(function() {
  document.querySelectorAll('.reveal:not(.revealed), .text-reveal:not(.revealed), .word-reveal:not(.revealed), .build-el:not(.built)').forEach(function(el) {
    el.classList.add('revealed');
    el.classList.add('built');
  });
}, 2500);
