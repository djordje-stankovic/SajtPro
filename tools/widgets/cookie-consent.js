/**
 * SajtPro Cookie Consent banner — GDPR/Zakon o zaštiti podataka
 *
 * Ubacivanje:
 *   <script src="cookie-consent.js"
 *     data-policy-url="/politika-privatnosti"
 *     data-color="#6366f1">
 *   </script>
 */
(function () {
  // Ako je već prihvatio — ne prikazuj
  if (document.cookie.indexOf('sajtpro_cookies=accepted') !== -1) return;

  const script = document.currentScript;
  const policyUrl = script.getAttribute('data-policy-url') || '#';
  const color = script.getAttribute('data-color') || '#6366f1';

  const banner = document.createElement('div');
  banner.id = 'sajtpro-cookie-banner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#1a1a1a;color:#e4e4e7;padding:16px 24px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 -4px 24px rgba(0,0,0,0.3);transform:translateY(100%);transition:transform 0.4s ease;';

  banner.innerHTML = `
    <div style="flex:1;min-width:280px;">
      Koristimo kolačiće da bismo poboljšali vaše iskustvo na sajtu.
      <a href="${policyUrl}" style="color:${color};text-decoration:underline;margin-left:4px;">Politika privatnosti</a>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0;">
      <button id="sajtpro-cookie-decline" style="padding:8px 20px;border:1px solid #52525b;background:transparent;color:#e4e4e7;border-radius:6px;cursor:pointer;font-size:13px;transition:background 0.2s;">Odbij</button>
      <button id="sajtpro-cookie-accept" style="padding:8px 20px;border:none;background:${color};color:#fff;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity 0.2s;">Prihvatam</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Animacija ulaska
  setTimeout(function () {
    banner.style.transform = 'translateY(0)';
  }, 1000);

  function closeBanner(accepted) {
    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = 'sajtpro_cookies=' + (accepted ? 'accepted' : 'declined') + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () { banner.remove(); }, 500);

    // Ako je prihvatio, pokreni GA ili druge skripte
    if (accepted && window.sajtproCookieCallback) {
      window.sajtproCookieCallback();
    }
  }

  document.getElementById('sajtpro-cookie-accept').onclick = function () { closeBanner(true); };
  document.getElementById('sajtpro-cookie-decline').onclick = function () { closeBanner(false); };
})();
