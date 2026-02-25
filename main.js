// ===== Navigation scroll effect =====
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  });
  // Trigger on load
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

// ===== Scroll Reveal =====
(function() {
  // Elements that need the .reveal class added (generic reveal pattern)
  var genericReveals = document.querySelectorAll('.reveal, .service-card, .portfolio-item, .pf-card, .test-card, .diff-card, .timeline-item, .team-card, .pf-full-card, .split, .belief-section');
  // Elements that have their OWN opacity:0 + transition in CSS (just need .revealed)
  var selfAnimated = document.querySelectorAll('.hw-flow-card, .trust-item, .included-item');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  genericReveals.forEach(function(el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
  selfAnimated.forEach(function(el) {
    observer.observe(el);
  });
})();

// ===== Counter Animation =====
(function() {
  var counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-target'));
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function animate(time) {
        if (!startTime) startTime = time;
        var progress = Math.min((time - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        var current = Math.floor(ease * target);
        el.textContent = current + (target === 98 ? '%' : '+');
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { observer.observe(c); });
})();

// ===== Testimonial Spotlight =====
(function() {
  var stage = document.getElementById('tspotStage');
  if (!stage) return;
  var slides = stage.querySelectorAll('.tspot-slide');
  var dots = document.querySelectorAll('.tspot-dot');
  var prevBtn = document.getElementById('tspotPrev');
  var nextBtn = document.getElementById('tspotNext');
  var current = 0;
  var total = slides.length;
  var autoTimer = null;

  function goTo(i) {
    if (i < 0) i = total - 1;
    if (i >= total) i = 0;
    slides[current].classList.remove('active');
    slides[current].style.transform = 'translateY(-30px)';
    slides[current].style.opacity = '0';
    current = i;
    slides[current].style.transform = 'translateY(30px)';
    slides[current].style.opacity = '0';
    void slides[current].offsetWidth;
    slides[current].classList.add('active');
    slides[current].style.transform = '';
    slides[current].style.opacity = '';
    dots.forEach(function(d, idx) { d.classList.toggle('active', idx === current); });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current + 1); }, 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() { goTo(parseInt(dot.getAttribute('data-i'))); });
  });

  resetAuto();
})();

// ===== Close mobile menu on link click =====
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    var toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});
