/* ========================================================
   SajtPro — Ponuda Page Logic
   Handles: query params, firma name, preview link, pkg links
   ======================================================== */

(function() {
  'use strict';

  // Parse URL query parameters
  function getParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (!search) return params;
    var pairs = search.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return params;
  }

  var params = getParams();

  // Set firma name in hero
  var firmaName = document.getElementById('firma-name');
  if (firmaName && params.firma) {
    var displayName = params.firma
      .split('-')
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    firmaName.textContent = displayName + '.';
  }

  // Set preview link
  var previewLink = document.getElementById('preview-link');
  if (previewLink && params.preview) {
    previewLink.href = decodeURIComponent(params.preview);
  }

  // Add firma name to package links as query param
  var pkgLinks = document.querySelectorAll('.pkg-card .btn');
  if (pkgLinks && params.firma) {
    for (var i = 0; i < pkgLinks.length; i++) {
      var href = pkgLinks[i].getAttribute('href');
      if (href && href.indexOf('kontakt') !== -1) {
        pkgLinks[i].href = href + '?paket=' + encodeURIComponent(
          pkgLinks[i].closest('.pkg-card').querySelector('.pkg-header h3').textContent
        ) + '&firma=' + encodeURIComponent(params.firma);
      }
    }
  }

})();
