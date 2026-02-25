/* ========================================================
   SajtPro — Case Study Viewer
   Fullscreen overlay for portfolio projects
   ======================================================== */

(function () {
  'use strict';

  // -------- Project Data --------
  var projects = [
    {
      name: 'Restoran Bella Napoli',
      cat: 'Ugostiteljstvo',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=70',
      afterImg: 'https://picsum.photos/800/500?random=60',
      beforeDesc: 'Zastario sajt iz 2015. bez online menija, bez mobilne verzije. Poseta sajtu bila minimalna.',
      afterDesc: 'Moderan sajt sa interaktivnim menijem, galerijom jela, Google Maps integracijom i sistemom za rezervacije.',
      problems: ['Nije responsivan', 'Bez online menija', 'Spora brzina'],
      improvements: ['Online meni', 'Responsivan dizajn', 'Sistem rezervacija'],
      process: [
        { title: 'Analiza', desc: 'Uporedili smo sa konkurencijom i identifikovali kljucne nedostatke.' },
        { title: 'Dizajn', desc: 'Kreirali moderan vizuelni identitet sa fokusom na hranu i atmosferu.' },
        { title: 'Razvoj', desc: 'Implementirali online meni, galleriju i formu za rezervacije.' }
      ],
      stats: [
        { num: '+200%', label: 'Online rezervacije' },
        { num: '+85%', label: 'Poseta sajtu' },
        { num: '1.2s', label: 'Brzina ucitavanja' }
      ]
    },
    {
      name: 'AutoServis Nikolic',
      cat: 'Automobilizam',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=71',
      afterImg: 'https://picsum.photos/800/500?random=61',
      beforeDesc: 'Bez sajta. Klijenti su mogli da ih nadju samo preko usmene preporuke ili Google Maps.',
      afterDesc: 'Profesionalni sajt sa zakazivanjem termina, cenovnikom usluga i povezanim Google Business profilom.',
      problems: ['Bez sajta', 'Samo usmena preporuka', 'Nevidljivi online'],
      improvements: ['SEO optimizacija', 'Online zakazivanje', 'Google Business'],
      process: [
        { title: 'Istrazivanje', desc: 'Analizirali lokalne pretrage i konkurentske sajtove u gradu.' },
        { title: 'Dizajn', desc: 'Kreirali profesionalan sajt sa jasnim cenovnikom i pozivom na akciju.' },
        { title: 'SEO', desc: 'Optimizovali za lokalne pretrage. Rezultat: #1 na Google-u.' }
      ],
      stats: [
        { num: '#1', label: 'Google pozicija' },
        { num: '+147%', label: 'Mesecnih poziva' },
        { num: '0.8s', label: 'Brzina ucitavanja' }
      ]
    },
    {
      name: 'Beauty Studio Ana',
      cat: 'Lepota i zdravlje',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=72',
      afterImg: 'https://picsum.photos/800/500?random=62',
      beforeDesc: 'Zastareo sajt sa losim slikama i bez mobilne verzije. Nije odrazavao kvalitet usluge.',
      afterDesc: 'Elegantan dizajn koji reflektuje premijum kvalitet. Galerija radova, cenovnik tretmana i online zakazivanje.',
      problems: ['Lose fotografije', 'Nema mobilnu verziju', 'Zastario dizajn'],
      improvements: ['Galerija radova', 'Online zakazivanje', 'Premijum dizajn'],
      process: [
        { title: 'Branding', desc: 'Definisali vizuelni identitet koji komunicira eleganciju i kvalitet.' },
        { title: 'Fotografija', desc: 'Prilagodili prikaz galerije za maximalan vizuelni uticaj.' },
        { title: 'Funkcionalnost', desc: 'Dodali cenovnik tretmana i online zakazivanje termina.' }
      ],
      stats: [
        { num: '+120%', label: 'Novih klijenata' },
        { num: '45%', label: 'Online zakazivanja' },
        { num: '1.0s', label: 'Brzina ucitavanja' }
      ]
    },
    {
      name: 'Stolarija Jovic',
      cat: 'Zanatstvo',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=73',
      afterImg: 'https://picsum.photos/800/500?random=63',
      beforeDesc: 'Nije imao sajt. Svi poslovi dolazili putem poznanika. Potencijal za rast bio blokiran.',
      afterDesc: 'Portfolio sajt sa galerijom projekata, referencama klijenata i jednostavnom kontakt formom.',
      problems: ['Bez sajta', 'Nema online prisustvo', 'Ogranicen doseg'],
      improvements: ['Portfolio galerija', 'Kontakt forma', 'Google vidljivost'],
      process: [
        { title: 'Konsultacija', desc: 'Razgovarali o ciljevima i izabrali najbolje projekte za portfolio.' },
        { title: 'Dizajn', desc: 'Naglasili kvalitet zanatskog rada kroz veliku galeriju slika.' },
        { title: 'Lansiranje', desc: 'Pokrenuli sajt sa SEO optimizacijom za lokalne pretrage.' }
      ],
      stats: [
        { num: '+90%', label: 'Upita za ponudu' },
        { num: '3x', label: 'Vise projekata' },
        { num: '0.9s', label: 'Brzina ucitavanja' }
      ]
    },
    {
      name: 'Dental Centar Smile',
      cat: 'Zdravlje',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=74',
      afterImg: 'https://picsum.photos/800/500?random=64',
      beforeDesc: 'Osnovni sajt sa minimalnim informacijama. Pacijenti nisu mogli da se informisu o uslugama online.',
      afterDesc: 'Profesionalni sajt sa online zakazivanjem, pregledom usluga sa cenama i blogom sa savetima.',
      problems: ['Minimalan sadrzaj', 'Nema online zakazivanje', 'Lose SEO'],
      improvements: ['Online zakazivanje', 'Blog sa savetima', 'SEO optimizacija'],
      process: [
        { title: 'Struktura', desc: 'Organizovali sadrzaj po uslugama sa jasnim cenama i opisima.' },
        { title: 'Poverenje', desc: 'Dodali blog sa savetima koji gradi autoritet i privlaci nove pacijente.' },
        { title: 'Konverzija', desc: 'Implementirali online zakazivanje i click-to-call dugmad.' }
      ],
      stats: [
        { num: '+160%', label: 'Online pacijenata' },
        { num: '#2', label: 'Google pozicija' },
        { num: '1.1s', label: 'Brzina ucitavanja' }
      ]
    },
    {
      name: 'Elektro Centar Nis',
      cat: 'Usluge',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=75',
      afterImg: 'https://picsum.photos/800/500?random=65',
      beforeDesc: 'Bez sajta. Kompletno oslanjanje na usmenu preporuku. Nedostupni za pretrazivanje.',
      afterDesc: 'Jasan, pregledan sajt sa click-to-call, spiskom usluga sa cenama i zonom pokrivanja na mapi.',
      problems: ['Bez sajta', 'Nedostupni online', 'Bez cenovnika'],
      improvements: ['Click-to-call', 'Cenovnik usluga', 'Mapa pokrivanja'],
      process: [
        { title: 'Fokus', desc: 'Identifikovali da 70% poziva dolazi sa mobilnih — optimizovali za to.' },
        { title: 'Sadrzaj', desc: 'Kreirali jasan cenovnik i spisak svih usluga sa opisima.' },
        { title: 'Lokalno', desc: 'Dodali mapu zone pokrivanja i Google Business optimizaciju.' }
      ],
      stats: [
        { num: '+200%', label: 'Telefonskih poziva' },
        { num: '70%', label: 'Sa mobilnih uredjaja' },
        { num: '0.7s', label: 'Brzina ucitavanja' }
      ]
    }
  ];

  // EN data
  var projectsEN = [
    {
      name: 'Restoran Bella Napoli',
      cat: 'Hospitality',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=70',
      afterImg: 'https://picsum.photos/800/500?random=60',
      beforeDesc: 'Outdated website from 2015 with no online menu and no mobile version. Minimal site traffic.',
      afterDesc: 'Modern website with interactive menu, food gallery, Google Maps integration, and reservation system.',
      problems: ['Not responsive', 'No online menu', 'Slow loading'],
      improvements: ['Online menu', 'Responsive design', 'Reservation system'],
      process: [
        { title: 'Analysis', desc: 'Compared with competitors and identified key shortcomings.' },
        { title: 'Design', desc: 'Created modern visual identity focused on food and atmosphere.' },
        { title: 'Development', desc: 'Implemented online menu, gallery and reservation form.' }
      ],
      stats: [
        { num: '+200%', label: 'Online Reservations' },
        { num: '+85%', label: 'Site Visits' },
        { num: '1.2s', label: 'Load Time' }
      ]
    },
    {
      name: 'AutoServis Nikolic',
      cat: 'Automotive',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=71',
      afterImg: 'https://picsum.photos/800/500?random=61',
      beforeDesc: 'No website. Clients could only find them through word of mouth or Google Maps.',
      afterDesc: 'Professional website with appointment booking, service pricing, and Google Business integration.',
      problems: ['No website', 'Word of mouth only', 'Invisible online'],
      improvements: ['SEO optimization', 'Online booking', 'Google Business'],
      process: [
        { title: 'Research', desc: 'Analyzed local searches and competitor websites in the city.' },
        { title: 'Design', desc: 'Created professional site with clear pricing and call-to-action.' },
        { title: 'SEO', desc: 'Optimized for local searches. Result: #1 on Google.' }
      ],
      stats: [
        { num: '#1', label: 'Google Position' },
        { num: '+147%', label: 'Monthly Calls' },
        { num: '0.8s', label: 'Load Time' }
      ]
    },
    {
      name: 'Beauty Studio Ana',
      cat: 'Beauty & Health',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=72',
      afterImg: 'https://picsum.photos/800/500?random=62',
      beforeDesc: 'Outdated website with poor photos and no mobile version. Didn\'t reflect service quality.',
      afterDesc: 'Elegant design reflecting premium quality. Work gallery, treatment pricing, and online booking.',
      problems: ['Poor photos', 'No mobile version', 'Outdated design'],
      improvements: ['Work gallery', 'Online booking', 'Premium design'],
      process: [
        { title: 'Branding', desc: 'Defined visual identity communicating elegance and quality.' },
        { title: 'Photography', desc: 'Adapted gallery display for maximum visual impact.' },
        { title: 'Functionality', desc: 'Added treatment pricing and online appointment booking.' }
      ],
      stats: [
        { num: '+120%', label: 'New Clients' },
        { num: '45%', label: 'Online Bookings' },
        { num: '1.0s', label: 'Load Time' }
      ]
    },
    {
      name: 'Stolarija Jovic',
      cat: 'Craftsmanship',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=73',
      afterImg: 'https://picsum.photos/800/500?random=63',
      beforeDesc: 'No website. All business came through acquaintances. Growth potential was blocked.',
      afterDesc: 'Portfolio website with project gallery, client references, and a simple contact form.',
      problems: ['No website', 'No online presence', 'Limited reach'],
      improvements: ['Portfolio gallery', 'Contact form', 'Google visibility'],
      process: [
        { title: 'Consultation', desc: 'Discussed goals and selected best projects for the portfolio.' },
        { title: 'Design', desc: 'Emphasized craft quality through large image gallery.' },
        { title: 'Launch', desc: 'Launched site with SEO optimization for local searches.' }
      ],
      stats: [
        { num: '+90%', label: 'Quote Requests' },
        { num: '3x', label: 'More Projects' },
        { num: '0.9s', label: 'Load Time' }
      ]
    },
    {
      name: 'Dental Centar Smile',
      cat: 'Healthcare',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=74',
      afterImg: 'https://picsum.photos/800/500?random=64',
      beforeDesc: 'Basic website with minimal information. Patients couldn\'t learn about services online.',
      afterDesc: 'Professional website with online booking, service overview with pricing, and patient advice blog.',
      problems: ['Minimal content', 'No online booking', 'Poor SEO'],
      improvements: ['Online booking', 'Advice blog', 'SEO optimization'],
      process: [
        { title: 'Structure', desc: 'Organized content by service with clear pricing and descriptions.' },
        { title: 'Trust', desc: 'Added advice blog building authority and attracting new patients.' },
        { title: 'Conversion', desc: 'Implemented online booking and click-to-call buttons.' }
      ],
      stats: [
        { num: '+160%', label: 'Online Patients' },
        { num: '#2', label: 'Google Position' },
        { num: '1.1s', label: 'Load Time' }
      ]
    },
    {
      name: 'Elektro Centar',
      cat: 'Services',
      beforeImg: 'https://picsum.photos/800/500?grayscale&random=75',
      afterImg: 'https://picsum.photos/800/500?random=65',
      beforeDesc: 'No website. Completely reliant on word of mouth. Unreachable through search.',
      afterDesc: 'Clean, clear website with click-to-call, service list with pricing, and coverage area map.',
      problems: ['No website', 'Unreachable online', 'No pricing'],
      improvements: ['Click-to-call', 'Service pricing', 'Coverage map'],
      process: [
        { title: 'Focus', desc: 'Identified that 70% of calls come from mobile — optimized for that.' },
        { title: 'Content', desc: 'Created clear pricing and full service list with descriptions.' },
        { title: 'Local', desc: 'Added coverage area map and Google Business optimization.' }
      ],
      stats: [
        { num: '+200%', label: 'Phone Calls' },
        { num: '70%', label: 'From Mobile' },
        { num: '0.7s', label: 'Load Time' }
      ]
    }
  ];

  // Detect language
  var isEN = document.documentElement.lang === 'en';
  var data = isEN ? projectsEN : projects;
  var labels = isEN
    ? { before: 'Before', after: 'After', process: 'Our Process', results: 'Results', close: 'Close', cta: 'Want similar results?', ctaBtn: 'Request a quote', ctaBtn2: 'View pricing' }
    : { before: 'Pre', after: 'Posle', process: 'Nas proces', results: 'Rezultati', close: 'Zatvori', cta: 'Zelite slicne rezultate?', ctaBtn: 'Zatrazite ponudu', ctaBtn2: 'Pogledajte cene' };

  var contactUrl = isEN ? 'contact.html' : 'kontakt.html';
  var pricingUrl = isEN ? '../cenovnik.html' : 'cenovnik.html';

  // -------- Build Overlay HTML --------

  var overlay = document.createElement('div');
  overlay.className = 'cs-overlay';
  overlay.id = 'csOverlay';
  overlay.innerHTML =
    '<div class="cs-progress" id="csProgress"></div>' +
    '<div class="cs-bar">' +
      '<div class="cs-bar-title"><span class="cs-cat" id="csCat"></span><span id="csName"></span></div>' +
      '<button class="cs-bar-close" id="csClose">' + labels.close +
        ' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="cs-slides" id="csSlides"></div>' +
    '<button class="cs-nav-arrow cs-arrow-left" id="csPrev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>' +
    '<button class="cs-nav-arrow cs-arrow-right" id="csNext"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>' +
    '<div class="cs-dots" id="csDots"></div>';
  document.body.appendChild(overlay);

  var slidesContainer = document.getElementById('csSlides');
  var dotsContainer = document.getElementById('csDots');
  var prevBtn = document.getElementById('csPrev');
  var nextBtn = document.getElementById('csNext');
  var closeBtn = document.getElementById('csClose');
  var progressBar = document.getElementById('csProgress');
  var catLabel = document.getElementById('csCat');
  var nameLabel = document.getElementById('csName');

  var currentSlide = 0;
  var totalSlides = 4;
  var isAnimating = false;

  // -------- Render Slides for a Project --------

  function renderProject(proj) {
    slidesContainer.innerHTML = '';

    // Slide 1: Before
    var s1 = document.createElement('div');
    s1.className = 'cs-slide active';
    s1.innerHTML =
      '<div class="cs-before">' +
        '<span class="cs-before-label">' + labels.before + '</span>' +
        '<h2>' + proj.name + '</h2>' +
        '<p>' + proj.beforeDesc + '</p>' +
        '<div class="cs-before-img"><img src="' + proj.beforeImg + '" alt="' + labels.before + '"></div>' +
        '<div class="cs-problems">' + proj.problems.map(function (p) { return '<span class="cs-problem-tag">' + p + '</span>'; }).join('') + '</div>' +
      '</div>';
    slidesContainer.appendChild(s1);

    // Slide 2: Process
    var s2 = document.createElement('div');
    s2.className = 'cs-slide';
    s2.innerHTML =
      '<div class="cs-process">' +
        '<h2>' + labels.process + '</h2>' +
        '<div class="cs-process-steps">' + proj.process.map(function (step, i) {
          return '<div class="cs-step-card"><div class="cs-step-num">' + (i + 1) + '</div><h4>' + step.title + '</h4><p>' + step.desc + '</p></div>';
        }).join('') + '</div>' +
      '</div>';
    slidesContainer.appendChild(s2);

    // Slide 3: After
    var s3 = document.createElement('div');
    s3.className = 'cs-slide';
    s3.innerHTML =
      '<div class="cs-after">' +
        '<span class="cs-after-label">' + labels.after + '</span>' +
        '<h2>' + proj.name + '</h2>' +
        '<p>' + proj.afterDesc + '</p>' +
        '<div class="cs-after-browser"><div class="cs-browser-bar"><span></span><span></span><span></span></div><img src="' + proj.afterImg + '" alt="' + labels.after + '"></div>' +
        '<div class="cs-improvements">' + proj.improvements.map(function (im) { return '<span class="cs-improvement-tag">' + im + '</span>'; }).join('') + '</div>' +
      '</div>';
    slidesContainer.appendChild(s3);

    // Slide 4: Results
    var s4 = document.createElement('div');
    s4.className = 'cs-slide';
    s4.innerHTML =
      '<div class="cs-results">' +
        '<h2>' + labels.results + '</h2>' +
        '<div class="cs-stats-grid">' + proj.stats.map(function (st) {
          return '<div class="cs-stat"><span class="cs-stat-num">' + st.num + '</span><span class="cs-stat-label">' + st.label + '</span></div>';
        }).join('') + '</div>' +
        '<p style="font-size:18px;color:var(--text-m);margin-bottom:28px;">' + labels.cta + '</p>' +
        '<div class="cs-results-cta">' +
          '<a href="' + contactUrl + '" class="btn btn-glow btn-lg">' + labels.ctaBtn + '</a>' +
          '<a href="' + pricingUrl + '" class="btn btn-glass btn-lg">' + labels.ctaBtn2 + '</a>' +
        '</div>' +
      '</div>';
    slidesContainer.appendChild(s4);

    catLabel.textContent = proj.cat;
    nameLabel.textContent = proj.name;
  }

  // -------- Navigation --------

  function goTo(index) {
    if (isAnimating || index < 0 || index >= totalSlides || index === currentSlide) return;
    isAnimating = true;
    var slides = slidesContainer.querySelectorAll('.cs-slide');
    var direction = index > currentSlide ? 1 : -1;
    var curr = slides[currentSlide];
    var next = slides[index];

    curr.classList.remove('active');
    curr.classList.add(direction > 0 ? 'exit-left' : '');
    if (direction < 0) {
      curr.style.transform = 'translateX(60px)';
      curr.style.opacity = '0';
    }

    next.classList.remove('exit-left');
    next.style.transform = direction > 0 ? 'translateX(60px)' : 'translateX(-60px)';
    next.style.opacity = '0';
    void next.offsetWidth;
    next.classList.add('active');
    next.style.transform = '';
    next.style.opacity = '';

    currentSlide = index;
    updateUI();

    setTimeout(function () {
      curr.classList.remove('exit-left');
      curr.style.transform = '';
      curr.style.opacity = '';
      isAnimating = false;
    }, 600);
  }

  function updateUI() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    progressBar.style.width = (currentSlide / (totalSlides - 1)) * 100 + '%';
    var dots = dotsContainer.querySelectorAll('.cs-dot');
    dots.forEach(function (d, i) { d.classList.toggle('active', i === currentSlide); });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.className = 'cs-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', function () { goTo(idx); });
        dotsContainer.appendChild(dot);
      })(i);
    }
  }

  // -------- Open / Close --------

  function open(index) {
    var proj = data[index];
    if (!proj) return;
    currentSlide = 0;
    renderProject(proj);
    buildDots();
    updateUI();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { goTo(currentSlide - 1); });
  nextBtn.addEventListener('click', function () { goTo(currentSlide + 1); });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentSlide + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentSlide - 1); }
    else if (e.key === 'Escape') { close(); }
  });

  // Touch
  var tx = 0, ty = 0;
  overlay.addEventListener('touchstart', function (e) {
    tx = e.changedTouches[0].clientX;
    ty = e.changedTouches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goTo(currentSlide + 1);
    else goTo(currentSlide - 1);
  }, { passive: true });

  // -------- Attach to Portfolio Cards --------

  var cards = document.querySelectorAll('.pf-full-card');
  cards.forEach(function (card, i) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // don't hijack links
      open(i);
    });
  });

})();
