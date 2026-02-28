/**
 * SajtPro Google Reviews Widget
 *
 * Prikazuje Google recenzije na sajtu. Podaci se prosleđuju preko JSON-a
 * koji se generiše pri deploy-u (Google Places API ne dozvoljava client-side pozive).
 *
 * Ubacivanje:
 *   <div id="sajtpro-reviews"></div>
 *   <script src="reviews-widget.js"
 *     data-reviews-url="/reviews-data.json"
 *     data-max="5"
 *     data-color="#6366f1"
 *     data-layout="grid">
 *   </script>
 *
 * Alternativno — hardcode reviews direktno:
 *   <script>
 *     window.sajtproReviews = { rating: 4.8, total: 47, reviews: [...] };
 *   </script>
 *   <script src="reviews-widget.js"></script>
 *
 * data-layout: "grid" (kartice), "slider" (horizontalni scroll), "list" (vertikalna lista)
 */
(function () {
  var script = document.currentScript;
  var reviewsUrl = script.getAttribute('data-reviews-url');
  var maxReviews = parseInt(script.getAttribute('data-max') || '5', 10);
  var color = script.getAttribute('data-color') || '#6366f1';
  var layout = script.getAttribute('data-layout') || 'grid';
  var targetId = script.getAttribute('data-target') || 'sajtpro-reviews';

  function stars(rating) {
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.3;
    var html = '';
    for (var i = 0; i < 5; i++) {
      if (i < full) {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      } else if (i === full && half) {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="none"><defs><linearGradient id="half"><stop offset="50%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#d4d4d8"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half)"/></svg>';
      } else {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#d4d4d8" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      }
    }
    return html;
  }

  function timeAgo(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var days = Math.floor(diff / 86400000);
    if (days < 1) return 'danas';
    if (days < 7) return 'pre ' + days + ' dana';
    if (days < 30) return 'pre ' + Math.floor(days / 7) + ' nedelja';
    if (days < 365) return 'pre ' + Math.floor(days / 30) + ' meseci';
    return 'pre ' + Math.floor(days / 365) + ' godina';
  }

  function renderReviews(data) {
    var target = document.getElementById(targetId);
    if (!target) return;

    var reviews = (data.reviews || []).slice(0, maxReviews);

    // Header sa ukupnom ocenom
    var header = '<div style="text-align:center;margin-bottom:24px;font-family:Arial,sans-serif;">' +
      '<div style="font-size:48px;font-weight:800;color:#18181b;line-height:1;">' + (data.rating || '—') + '</div>' +
      '<div style="margin:8px 0;display:flex;justify-content:center;gap:2px;">' + stars(data.rating || 0) + '</div>' +
      '<div style="font-size:14px;color:#71717a;">' + (data.total || 0) + ' recenzija na Google-u</div>' +
      '</div>';

    // Kartice
    var isGrid = layout === 'grid';
    var isList = layout === 'list';
    var wrapStyle = isGrid
      ? 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;'
      : isList
        ? 'display:flex;flex-direction:column;gap:12px;'
        : 'display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px;-webkit-overflow-scrolling:touch;';

    var cards = '';
    for (var i = 0; i < reviews.length; i++) {
      var r = reviews[i];
      var cardWidth = (!isGrid && !isList) ? 'min-width:300px;scroll-snap-align:start;' : '';
      cards += '<div style="background:#fff;border:1px solid #e4e4e7;border-radius:12px;padding:20px;' + cardWidth + 'font-family:Arial,sans-serif;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="width:40px;height:40px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;">' + (r.author || 'A').charAt(0).toUpperCase() + '</div>' +
        '<div>' +
        '<div style="font-weight:600;color:#18181b;font-size:14px;">' + (r.author || 'Anonimno') + '</div>' +
        '<div style="font-size:12px;color:#a1a1aa;">' + (r.date ? timeAgo(r.date) : '') + '</div>' +
        '</div>' +
        '</div>' +
        '<div style="display:flex;gap:2px;margin-bottom:8px;">' + stars(r.rating || 5) + '</div>' +
        (r.text ? '<p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.5;">' + r.text + '</p>' : '') +
        '</div>';
    }

    // Google atribucija
    var footer = '<div style="text-align:center;margin-top:16px;font-size:12px;color:#a1a1aa;font-family:Arial,sans-serif;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
      'Recenzije sa Google-a · Ažurirano automatski' +
      '</div>';

    target.innerHTML = header + '<div style="' + wrapStyle + '">' + cards + '</div>' + footer;
  }

  // Učitaj podatke
  if (window.sajtproReviews) {
    renderReviews(window.sajtproReviews);
  } else if (reviewsUrl) {
    fetch(reviewsUrl)
      .then(function (r) { return r.json(); })
      .then(renderReviews)
      .catch(function () {
        var target = document.getElementById(targetId);
        if (target) target.innerHTML = '<p style="color:#a1a1aa;font-size:14px;">Recenzije trenutno nedostupne.</p>';
      });
  }
})();
