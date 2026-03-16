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
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
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

// ===== Navigation scroll effect — progressive blur =====
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;

  function updateNav() {
    var y = window.scrollY;
    nav.classList.toggle('nav-scrolled', y > 60);
    var blur = Math.min(y / 3, 24);
    var opacity = Math.min(y / 200, 0.8);
    nav.style.backdropFilter = 'blur(' + blur + 'px)';
    nav.style.webkitBackdropFilter = 'blur(' + blur + 'px)';
    nav.style.background = 'rgba(9,9,11,' + opacity + ')';
  }

  window.addEventListener('scroll', updateNav);
  updateNav();
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
  var selfAnimated = document.querySelectorAll('.hw-flow-card, .trust-item, .trust-card, .included-item');

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

  // Expose observer so late-added text-reveals can register
  window._revealObserver = observer;

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
    if (window._revealObserver) window._revealObserver.observe(el);
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

// ===== Portfolio Before/After Tabs =====
(function() {
  var tabs = document.querySelectorAll('.ba-tab');
  var slider = document.getElementById('baSlider1');
  var projectName = document.getElementById('baProjectName');
  if (!tabs.length || !slider) return;

  var beforeImg = slider.querySelector('.ba-before img');
  var afterImg = slider.querySelector('.ba-after img');

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var beforeSrc = tab.getAttribute('data-before');
      var afterSrc = tab.getAttribute('data-after');
      var name = tab.getAttribute('data-name');
      var city = tab.getAttribute('data-city');

      // Fade out slider, swap, fade in
      slider.style.transition = 'opacity 0.25s ease';
      slider.style.opacity = '0';

      setTimeout(function() {
        if (beforeImg) beforeImg.src = beforeSrc;
        if (afterImg) afterImg.src = afterSrc;
        if (projectName) projectName.textContent = name + ' — ' + city;

        // Reset slider handle to 50%
        var before = slider.querySelector('.ba-before');
        var handle = slider.querySelector('.ba-handle');
        if (before) before.style.clipPath = 'inset(0 50% 0 0)';
        if (handle) handle.style.left = '50%';

        slider.style.opacity = '1';
      }, 260);
    });
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
      if (barUrl) {
        barUrl.textContent = tab.getAttribute('data-name');
        if (barUrl.tagName === 'A') barUrl.href = tab.getAttribute('data-url') || '#';
      }
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

// ===== Footer Reveal =====
(function() {
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

  // On load: slide overlay up off screen
  if (sessionStorage.getItem('pt-active') === '1') {
    sessionStorage.removeItem('pt-active');
    overlay.style.transition = 'none';
    overlay.style.transform = 'translateY(0)';
    overlay.style.pointerEvents = 'auto';
    overlay.offsetHeight;
    overlay.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    overlay.style.transform = 'translateY(-100%)';
    setTimeout(function() {
      overlay.style.cssText = '';
    }, 700);
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

// ===== Canvas Particle Network — Hero Background =====
(function() {
  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;
  var particleCount = isMobile ? 50 : 70;
  var connectionDist = isMobile ? 100 : 120;
  var mouseRadius = 150;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var heroSection = canvas.closest('.hero');
  var heroVisible = true;
  var animId = null;

  function initParticles() {
    particles.length = 0;
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: isMobile ? Math.random() * 2 + 0.8 : Math.random() * 1.5 + 0.5
      });
    }
  }

  function resize() {
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    initParticles();
  }
  resize();
  // Fallback — ensure canvas gets proper dimensions after full page load
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);

  if (!isMobile) {
    canvas.parentElement.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function() {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  // Hero visibility — pause when not visible
  if ('IntersectionObserver' in window) {
    var heroObs = new IntersectionObserver(function(entries) {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !animId && !reducedMotion) loop();
    }, { threshold: 0 });
    heroObs.observe(heroSection);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width, h = canvas.height;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (!reducedMotion) {
        // Mouse attraction
        if (!isMobile) {
          var dx = mouse.x - p.x;
          var dy = mouse.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 0) {
            var force = (mouseRadius - dist) / mouseRadius * 0.015;
            p.vx += dx / dist * force;
            p.vy += dy / dist * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isMobile ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.5)';
      ctx.fill();

      // Draw connections
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var ddx = p.x - p2.x;
        var ddy = p.y - p2.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < connectionDist) {
          var alpha = (1 - d / connectionDist) * (isMobile ? 0.15 : 0.1);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(99,102,241,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

  }

  function loop() {
    if (!heroVisible) { animId = null; return; }
    draw();
    animId = requestAnimationFrame(loop);
  }

  if (reducedMotion) {
    // Draw once — static snapshot
    draw();
  } else {
    loop();
  }
})();

// ===== Cursor Glow Trail — 3 elements =====
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Remove old single glow if present
  var oldGlow = document.querySelector('.cursor-glow');
  if (oldGlow) oldGlow.style.display = 'none';

  var trailConfig = [
    { lerp: 0.15, size: 300, opacity: 0.08 },
    { lerp: 0.08, size: 200, opacity: 0.05 },
    { lerp: 0.04, size: 140, opacity: 0.03 }
  ];

  var trails = trailConfig.map(function(cfg) {
    var el = document.createElement('div');
    el.className = 'cursor-glow-trail';
    el.style.width = cfg.size + 'px';
    el.style.height = cfg.size + 'px';
    el.style.opacity = cfg.opacity;
    el.style.left = '-300px';
    el.style.top = '-300px';
    el.style.setProperty('--trail-size', cfg.size + 'px');
    el.style.setProperty('--trail-opacity', cfg.opacity);
    document.body.appendChild(el);
    return { el: el, x: -300, y: -300, lerp: cfg.lerp, baseOpacity: cfg.opacity, baseSize: cfg.size };
  });

  var mx = -300, my = -300;
  var running = false;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!running) { running = true; updateTrails(); }
  });

  function updateTrails() {
    var stillMoving = false;
    trails.forEach(function(t) {
      t.x += (mx - t.x) * t.lerp;
      t.y += (my - t.y) * t.lerp;
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      if (Math.abs(mx - t.x) > 0.1 || Math.abs(my - t.y) > 0.1) stillMoving = true;
    });

    if (stillMoving) {
      requestAnimationFrame(updateTrails);
    } else {
      running = false;
    }
  }

  // Amplify on hover over interactive elements
  var hoverTargets = document.querySelectorAll('.btn, .diff-card, .hw-flow-card');
  hoverTargets.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      trails.forEach(function(t) { t.el.classList.add('glow-active'); });
    });
    el.addEventListener('mouseleave', function() {
      trails.forEach(function(t) { t.el.classList.remove('glow-active'); });
    });
  });
})();

// ===== SVG Self-Drawing Icons =====
(function() {
  var drawIcons = document.querySelectorAll('.icon-draw');
  if (!drawIcons.length) return;

  function initPaths(svg) {
    var paths = svg.querySelectorAll('path, circle, rect, polyline, line');
    paths.forEach(function(p) {
      var len = p.getTotalLength ? p.getTotalLength() : 100;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'none';
    });
  }

  drawIcons.forEach(function(svg) { initPaths(svg); });

  var drawObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var paths = entry.target.querySelectorAll('path, circle, rect, polyline, line');
      if (entry.isIntersecting) {
        // Small delay so browser registers the dashoffset reset
        requestAnimationFrame(function() {
          paths.forEach(function(p) {
            p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
            p.style.strokeDashoffset = '0';
          });
        });
        entry.target.classList.add('revealed');
      } else {
        // Reset when leaving viewport — so it replays on re-entry
        paths.forEach(function(p) {
          p.style.transition = 'none';
          var len = p.getTotalLength ? p.getTotalLength() : 100;
          p.style.strokeDashoffset = len;
        });
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.2 });

  drawIcons.forEach(function(svg) {
    drawObserver.observe(svg);
  });
})();

// ===== Animated Counters — Belief section =====
(function() {
  var nums = document.querySelectorAll('.belief-num');
  if (!nums.length) return;

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(function(el) {
    el.setAttribute('data-target', el.textContent.trim());
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    var text = el.getAttribute('data-target');
    var suffix = text.replace(/[\d.]/g, '');
    var target = parseFloat(text);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.round(easeOut(progress) * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }
})();

// ===== Contact Page Animations =====
(function() {
  var ciItems = document.querySelectorAll('.ci-item');
  var faqItems = document.querySelectorAll('.faq-item');
  var formCard = document.querySelector('.contact-form-card');
  if (!ciItems.length && !faqItems.length && !formCard) return;

  var contactObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        contactObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  ciItems.forEach(function(el) { contactObs.observe(el); });
  faqItems.forEach(function(el) { contactObs.observe(el); });
  if (formCard) contactObs.observe(formCard);
})();

// ===== Scroll Progress Bar =====
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  function updateProgress() {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    bar.style.transform = 'scaleX(' + (scrollY / docHeight) + ')';
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress();
})();

// ===== Button Ripple Effect =====
(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-glow, .btn-white');
    if (!btn) return;

    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', function() {
      ripple.remove();
    });
  });
})();

// ===== Testimonial Spotlight Autoplay =====
(function() {
  var stage = document.querySelector('.tspot-stage');
  var slides = document.querySelectorAll('.tspot-slide');
  var dots = document.querySelectorAll('.tspot-dot');
  var prevBtn = document.querySelector('.tspot-prev');
  var nextBtn = document.querySelector('.tspot-next');
  if (!stage || slides.length < 2) return;

  var INTERVAL = 6000;
  var currentIndex = 0;
  var timer = null;
  var isPaused = false;

  // Create progress bar
  var nav = document.querySelector('.tspot-nav');
  if (nav) {
    var progressWrap = document.createElement('div');
    progressWrap.className = 'tspot-progress';
    var progressBar = document.createElement('div');
    progressBar.className = 'tspot-progress-bar';
    progressWrap.appendChild(progressBar);
    nav.appendChild(progressWrap);
  }

  function goTo(index) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    resetProgress();
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.classList.remove('active');
    progressBar.classList.add('reset');
    // Force reflow
    progressBar.offsetHeight;
    progressBar.classList.remove('reset');
    if (!isPaused) {
      requestAnimationFrame(function() {
        progressBar.classList.add('active');
      });
    }
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(function() {
      if (!isPaused) goTo(currentIndex + 1);
    }, INTERVAL);
    resetProgress();
  }

  // Pause on hover
  stage.addEventListener('mouseenter', function() {
    isPaused = true;
    if (progressBar) {
      var w = progressBar.getBoundingClientRect().width;
      var pw = progressWrap.getBoundingClientRect().width;
      progressBar.classList.remove('active');
      progressBar.style.transition = 'none';
      progressBar.style.width = (w / pw * 100) + '%';
    }
  });
  stage.addEventListener('mouseleave', function() {
    isPaused = false;
    if (progressBar) {
      progressBar.style.transition = '';
      progressBar.style.width = '';
      requestAnimationFrame(function() {
        progressBar.classList.add('active');
      });
    }
  });

  // Reset on manual nav
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(currentIndex - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(currentIndex + 1); startAutoplay(); });
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); startAutoplay(); });
  });

  startAutoplay();
})();

// ===== WYG Card Scroll Reveal + Typing =====
(function() {
  var cards = document.querySelectorAll('.wyg-card');
  if (!cards.length) return;

  var typedEl = document.querySelector('.wyg-typed');
  var typingText = 'Dobro dosli';
  var hasTyped = false;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('wyg-visible');
        // Typing effect for editor card
        if (!hasTyped && typedEl && entry.target.contains(typedEl)) {
          hasTyped = true;
          typedEl.textContent = typingText;
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(function(c) { obs.observe(c); });

  // CTA v2 scroll reveal
  var ctaCard = document.querySelector('.cta-card-v2');
  if (ctaCard) {
    var ctaObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        ctaCard.classList.add('cta-visible');
        ctaObs.disconnect();
      }
    }, { threshold: 0.3 });
    ctaObs.observe(ctaCard);
  }
})();
