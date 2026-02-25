/* ========================================================
   SajtPro — Deck.js
   Fullscreen slide navigation with flow selection
   ======================================================== */

(function () {
  'use strict';

  var deck = document.getElementById('deck');
  var allSlides = Array.from(document.querySelectorAll('.deck-slide'));
  var dotsContainer = document.getElementById('deckDots');
  var prevBtn = document.getElementById('deckPrev');
  var nextBtn = document.getElementById('deckNext');
  var stepLabel = document.getElementById('deckStep');
  var progressBar = document.getElementById('deckProgress');

  var activeFlow = null; // 'a' or 'b'
  var currentIndex = 0;
  var visibleSlides = [allSlides[0]]; // start with just intro
  var isAnimating = false;

  // -------- Flow selection --------

  var flowCards = document.querySelectorAll('.flow-card');
  flowCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var flow = card.getAttribute('data-flow');
      selectFlow(flow);
    });
  });

  function selectFlow(flow) {
    activeFlow = flow;

    // Hide hint
    var hint = document.querySelector('.flow-hint');
    if (hint) hint.style.display = 'none';

    // Mark selected card
    flowCards.forEach(function (c) { c.classList.remove('selected'); });
    document.querySelector('.flow-card-' + flow).classList.add('selected');

    // Build visible slides: intro + flow slides + cta
    visibleSlides = [];
    allSlides.forEach(function (s) {
      var slideFlow = s.getAttribute('data-flow');
      var slideId = s.getAttribute('data-slide');
      if (slideId === 'intro' || slideId === 'cta' || slideFlow === flow) {
        visibleSlides.push(s);
      }
    });

    // Rebuild dots
    buildDots();
    updateUI();

    // Auto-advance to slide 1 after short delay
    setTimeout(function () { goTo(1); }, 400);
  }

  // -------- Navigation --------

  function goTo(index) {
    if (isAnimating || index < 0 || index >= visibleSlides.length) return;
    if (index === currentIndex) return;

    isAnimating = true;
    var direction = index > currentIndex ? 1 : -1;
    var currentSlide = visibleSlides[currentIndex];
    var nextSlide = visibleSlides[index];

    // Exit current
    currentSlide.classList.remove('active');
    currentSlide.classList.add(direction > 0 ? 'exit-left' : '');
    if (direction < 0) {
      currentSlide.style.transform = 'translateX(60px)';
      currentSlide.style.opacity = '0';
    }

    // Prepare next
    nextSlide.classList.remove('exit-left');
    if (direction > 0) {
      nextSlide.style.transform = 'translateX(60px)';
    } else {
      nextSlide.style.transform = 'translateX(-60px)';
    }
    nextSlide.style.opacity = '0';

    // Force reflow
    void nextSlide.offsetWidth;

    // Animate in
    nextSlide.classList.add('active');
    nextSlide.style.transform = '';
    nextSlide.style.opacity = '';

    currentIndex = index;
    updateUI();

    setTimeout(function () {
      currentSlide.classList.remove('exit-left');
      currentSlide.style.transform = '';
      currentSlide.style.opacity = '';
      isAnimating = false;
    }, 600);
  }

  function next() {
    if (currentIndex === 0 && !activeFlow) return; // must pick flow first
    goTo(currentIndex + 1);
  }

  function prev() {
    if (currentIndex === 1 && activeFlow) {
      // Going back from first flow slide to intro — reset flow
      resetFlow();
      return;
    }
    goTo(currentIndex - 1);
  }

  function resetFlow() {
    if (isAnimating) return;
    isAnimating = true;

    var currentSlide = visibleSlides[currentIndex];
    var introSlide = allSlides[0];

    // Exit current
    currentSlide.classList.remove('active');
    currentSlide.style.transform = 'translateX(60px)';
    currentSlide.style.opacity = '0';

    // Reset state
    activeFlow = null;
    currentIndex = 0;
    visibleSlides = [introSlide];
    flowCards.forEach(function (c) { c.classList.remove('selected'); });

    // Show hint again
    var hint = document.querySelector('.flow-hint');
    if (hint) hint.style.display = '';

    // Show intro
    introSlide.style.transform = 'translateX(-60px)';
    introSlide.style.opacity = '0';
    void introSlide.offsetWidth;
    introSlide.classList.add('active');
    introSlide.style.transform = '';
    introSlide.style.opacity = '';

    buildDots();
    updateUI();

    setTimeout(function () {
      currentSlide.style.transform = '';
      currentSlide.style.opacity = '';
      isAnimating = false;
    }, 600);
  }

  // -------- Dots --------

  function buildDots() {
    dotsContainer.innerHTML = '';
    visibleSlides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'deck-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', function () {
        if (i === 0 || activeFlow) goTo(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  // -------- UI Update --------

  function updateUI() {
    // Dots
    var dots = dotsContainer.querySelectorAll('.deck-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentIndex);
    });

    // Arrows
    var isLastSlide = currentIndex === visibleSlides.length - 1;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = isLastSlide;
    // Hide both arrows on last slide (final/privacy)
    if (isLastSlide) {
      prevBtn.style.opacity = '0';
      prevBtn.style.pointerEvents = 'none';
      nextBtn.style.opacity = '0';
      nextBtn.style.pointerEvents = 'none';
    } else if (currentIndex === 0 && !activeFlow) {
      nextBtn.style.opacity = '0.3';
      nextBtn.style.pointerEvents = 'none';
      prevBtn.style.opacity = '';
      prevBtn.style.pointerEvents = '';
    } else {
      nextBtn.style.opacity = '';
      nextBtn.style.pointerEvents = '';
      prevBtn.style.opacity = '';
      prevBtn.style.pointerEvents = '';
    }

    // Step label
    if (currentIndex === 0) {
      stepLabel.textContent = '';
    } else if (currentIndex === visibleSlides.length - 1) {
      stepLabel.textContent = '';
    } else {
      stepLabel.textContent = 'Korak ' + currentIndex + ' od ' + (visibleSlides.length - 2);
    }

    // Progress bar
    var progress = visibleSlides.length > 1 ? (currentIndex / (visibleSlides.length - 1)) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // -------- Event Listeners --------

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Escape') {
      window.location.href = 'index.html';
    }
  });

  // Touch / Swipe
  var touchStartX = 0;
  var touchStartY = 0;

  deck.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  deck.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });

  // -------- Restart button --------

  var restartBtn = document.getElementById('deckRestart');
  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      // Go back to intro and reset flow
      if (isAnimating) return;
      isAnimating = true;

      var currentSlide = visibleSlides[currentIndex];
      var introSlide = allSlides[0];

      currentSlide.classList.remove('active');
      currentSlide.style.opacity = '0';

      activeFlow = null;
      currentIndex = 0;
      visibleSlides = [introSlide];
      flowCards.forEach(function (c) { c.classList.remove('selected'); });

      var hint = document.querySelector('.flow-hint');
      if (hint) hint.style.display = '';

      introSlide.style.transform = 'translateX(-60px)';
      introSlide.style.opacity = '0';
      void introSlide.offsetWidth;
      introSlide.classList.add('active');
      introSlide.style.transform = '';
      introSlide.style.opacity = '';

      buildDots();
      updateUI();

      setTimeout(function () {
        currentSlide.style.transform = '';
        currentSlide.style.opacity = '';
        isAnimating = false;
      }, 600);
    });
  }

  // -------- Init --------

  buildDots();
  updateUI();

})();
