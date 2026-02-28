/**
 * SajtPro Speed Badge — prikazuje PageSpeed score i uptime na sajtu
 *
 * Ubacivanje:
 *   <script src="speed-badge.js"
 *     data-speed="92"
 *     data-uptime="99.9"
 *     data-response="340"
 *     data-position="bottom-left"
 *     data-style="minimal">
 *   </script>
 *
 * data-style opcije: "minimal" (samo ikonica), "badge" (kartica), "footer" (inline za footer)
 *
 * Vrednosti se ažuriraju iz reports sistema — posle svakog izveštaja
 * script automatski čita iz data-* atributa koje postavljamo pri deploy-u.
 */
(function () {
  var script = document.currentScript;
  var speed = parseInt(script.getAttribute('data-speed') || '0', 10);
  var uptime = script.getAttribute('data-uptime') || '';
  var responseTime = script.getAttribute('data-response') || '';
  var position = script.getAttribute('data-position') || 'bottom-left';
  var style = script.getAttribute('data-style') || 'badge';

  // Boja na osnovu skora
  function scoreColor(s) {
    if (s >= 90) return '#16a34a';
    if (s >= 50) return '#f59e0b';
    return '#dc2626';
  }

  // Ring SVG (krug oko broja)
  function ring(score, size) {
    var r = (size - 4) / 2;
    var c = Math.PI * 2 * r;
    var offset = c - (score / 100) * c;
    var col = scoreColor(score);
    return '<svg width="' + size + '" height="' + size + '" style="transform:rotate(-90deg)">' +
      '<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + r + '" fill="none" stroke="#e4e4e7" stroke-width="3"/>' +
      '<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-dasharray="' + c + '" stroke-dashoffset="' + offset + '" stroke-linecap="round"/>' +
      '</svg>';
  }

  if (style === 'footer') {
    // Inline verzija za footer sekciju
    var footerEl = document.createElement('div');
    footerEl.className = 'sajtpro-speed-footer';
    footerEl.style.cssText = 'display:inline-flex;align-items:center;gap:16px;padding:12px 20px;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;color:#3f3f46;';

    var items = '';
    if (speed > 0) {
      items += '<div style="display:flex;align-items:center;gap:6px;">' +
        '<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">' +
        ring(speed, 36) +
        '<span style="position:absolute;font-size:11px;font-weight:700;color:' + scoreColor(speed) + ';">' + speed + '</span>' +
        '</div>' +
        '<div><div style="font-weight:600;color:#18181b;">Brzina</div><div style="font-size:11px;color:#71717a;">' + speed + '/100</div></div>' +
        '</div>';
    }
    if (uptime) {
      items += '<div style="display:flex;align-items:center;gap:6px;">' +
        '<div style="width:8px;height:8px;border-radius:50%;background:#16a34a;"></div>' +
        '<div><div style="font-weight:600;color:#18181b;">Uptime</div><div style="font-size:11px;color:#71717a;">' + uptime + '%</div></div>' +
        '</div>';
    }
    if (responseTime) {
      items += '<div style="display:flex;align-items:center;gap:6px;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '<div><div style="font-weight:600;color:#18181b;">Odgovor</div><div style="font-size:11px;color:#71717a;">' + responseTime + 'ms</div></div>' +
        '</div>';
    }
    items += '<div style="font-size:10px;color:#a1a1aa;">Pokreće <span style="color:#6366f1;font-weight:600;">SajtPro</span></div>';

    footerEl.innerHTML = items;

    // Ubaci u footer ili na kraj body-ja
    var target = document.querySelector('[data-speed-badge]') || document.querySelector('footer') || document.body;
    if (target.querySelector('[data-speed-badge]')) {
      target.querySelector('[data-speed-badge]').appendChild(footerEl);
    } else {
      target.appendChild(footerEl);
    }
    return;
  }

  // "badge" i "minimal" stilovi — floating badge
  var pos = {
    'bottom-left': 'bottom:20px;left:20px;',
    'bottom-right': 'bottom:20px;right:20px;',
    'top-left': 'top:20px;left:20px;',
    'top-right': 'top:20px;right:20px;',
  }[position] || 'bottom:20px;left:20px;';

  var badge = document.createElement('div');
  badge.id = 'sajtpro-speed-badge';

  if (style === 'minimal') {
    badge.style.cssText = 'position:fixed;' + pos + 'z-index:9998;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s;';
    badge.innerHTML = '<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:50%;box-shadow:0 2px 12px rgba(0,0,0,0.1);">' +
      ring(speed, 40) +
      '<span style="position:absolute;font-size:12px;font-weight:700;color:' + scoreColor(speed) + ';">' + speed + '</span>' +
      '</div>';
  } else {
    // Full badge
    badge.style.cssText = 'position:fixed;' + pos + 'z-index:9998;background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);padding:12px 16px;font-family:Arial,sans-serif;display:flex;align-items:center;gap:12px;cursor:pointer;transition:transform 0.2s,opacity 0.2s;max-width:220px;';

    var leftSide = '<div style="position:relative;width:48px;height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">' +
      ring(speed, 48) +
      '<span style="position:absolute;font-size:14px;font-weight:700;color:' + scoreColor(speed) + ';">' + speed + '</span>' +
      '</div>';

    var rightSide = '<div style="font-size:12px;line-height:1.4;">';
    rightSide += '<div style="font-weight:700;color:#18181b;">Brzina sajta</div>';
    if (uptime) {
      rightSide += '<div style="color:#71717a;">Uptime: <span style="color:#16a34a;font-weight:600;">' + uptime + '%</span></div>';
    }
    if (responseTime) {
      rightSide += '<div style="color:#71717a;">Odgovor: ' + responseTime + 'ms</div>';
    }
    rightSide += '<div style="color:#a1a1aa;font-size:10px;margin-top:2px;">Pokreće SajtPro</div>';
    rightSide += '</div>';

    badge.innerHTML = leftSide + rightSide;
  }

  badge.onmouseenter = function () { badge.style.transform = 'scale(1.05)'; };
  badge.onmouseleave = function () { badge.style.transform = 'scale(1)'; };

  document.body.appendChild(badge);
})();
