# Security Fixes for SajtPro + Dabog WAF

## CRITICAL — Fix Immediately

### 1. Sakrij Dabog identitet iz HTML source-a
**Problem:** Aegis script tag i Dabog badge su vidljivi u source-u svake stranice. Napadač odmah zna koji WAF štiti sajt.
```html
<!-- OVO JE VIDLJIVO SVIMA: -->
<script src="https://aegis-production-a218.up.railway.app/s/aegis.min.js" data-key="site_ec2aa89964c6be57e7781ddd351bace1" async defer></script>
<a href='https://dabog.dev'>Protected by Dabog</a>
```
**Fix:**
- Preimenuj `aegis.min.js` u generičko ime (npr. `a.js` ili `analytics.js`) — ne sme da se zove aegis
- Ukloni `data-key` atribut iz HTML-a — ključ treba da se učita na drugi način (npr. server-side injection ili obfuscirano)
- Dabog badge na dnu stranice neka bude opcioni, ne default — svaki badge je signal napadaču
- Railway hostname `aegis-production-a218.up.railway.app` treba sakriti iza custom domene (npr. `cdn.sajtpro.rs` ili `s.sajtpro.rs`)

### 2. Zaštiti Railway backend od direktnog pristupa
**Problem:** `aegis-production-a218.up.railway.app` je dostupan direktno, zaobilazeći Cloudflare i sve WAF zaštite.
**Fix:**
- Postavi firewall pravilo na Railway da prihvata requestove SAMO sa Cloudflare IP range-ova
- Ili koristi Cloudflare Tunnel umesto javnog Railway URL-a
- Isto važi za `hostsite-production.up.railway.app` i `sajtpro-panel-production.up.railway.app`

### 3. Ukloni `reports/clients.json` iz Git-a
**Problem:** Sadrži prave klijentske podatke — email, GA4 property ID, UptimeRobot monitor ID, Search Console site.
**Fix:**
- Dodaj `reports/clients.json` u `.gitignore`
- Obriši iz Git istorije: `git filter-branch` ili `git filter-repo`
- Prebaci podatke u environment varijable ili enkriptovan config koji se ne commit-uje
- Ako je repo ikada bio public — rotiraj sve klijentske API ID-jeve

### 4. Formspree spam zaštita
**Problem:** Form ID `mkoqqjww` je u source-u. Bilo ko može da pošalje neograničen spam direktno na endpoint, zaobilazeći client-side rate limit koji je u sessionStorage.
**Fix:**
- Uključi Formspree reCAPTCHA integraciju (Formspree to podržava nativno)
- Ili zameni Formspree sa server-side form handler-om koji ide kroz Dabog WAF
- Dodaj server-side rate limiting po IP (npr. u Dabog-u — ako request ide na formspree endpoint, limitiraj na 3/min po IP)
- `_gotcha` honeypot polje preimenuj u nešto manje očigledno

---

## HIGH — Fix This Week

### 5. Honeypot sadržaj treba poboljšati
**Problem:** "Meridian Solutions" lažni sajt je statičan i uvek isti. Ako napadač pošalje 2 requesta (bot UA i browser UA) i uporedi — odmah vidi razliku.
**Fix:**
- Generiši randomizovan honeypot sadržaj po requestu (različito ime firme, različiti brojevi, različit layout)
- Ili serviraj honeypot koji liči na pravi sajt ali sa subtilno pogrešnim podacima
- Dodaj realistične meta tagove, favicon, i structured data u honeypot (trenutno ih nema — to je red flag)
- Honeypot treba da ima isti CSS/font stack kao pravi sajt

### 6. Tarpit pattern je predvidljiv
**Problem:** Iz logova se vidi da tarpit koristi `/tarpit/` prefix. Napadač koji vidi jedan tarpit URL zna da ignoriše sve sa `/tarpit/`.
**Fix:**
- Ukloni `/tarpit/` prefix — neka tarpit URL-ovi izgledaju kao pravi URL-ovi
- Umesto `/tarpit/admin/user/6544` neka bude `/admin/user/6544` sa internim flag-om da je tarpit
- Randomiziraj tarpit putanje — ne koristiti uvek isti pattern

### 7. Dodaj Content Security Policy
**Problem:** Nema CSP header-a. Ako se bilo koji externi script kompromituje — napadač ima potpunu kontrolu.
**Fix:** Dodaj u Cloudflare (Transform Rules > Response Headers) ili u HTML meta tag:
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://cdn.sajtpro.rs; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://djordje-stankovic.github.io https://marcodoo.com https://skaskabrandy.com; connect-src 'self' https://formspree.io https://www.google-analytics.com;
```
Prilagodi domene po potrebi — ključno je da `script-src` NE sadrži `'unsafe-inline'` ili `'unsafe-eval'`.

### 8. Dodaj ostale security header-e
**Fix:** U Cloudflare Transform Rules dodaj:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 9. Fix innerHTML u lang.js
**Problem:** Linija 71 koristi `innerHTML` za language switching sa `data-en-html` atributima. Ako napadač može da manipuliše DOM — XSS.
**Fix:**
- Ako `data-en-html` uvek sadrži samo tekst + basic HTML tagove (`<span>`, `<br>`, `<svg>`), napravi whitelist pristup
- Ili koristi DOMPurify biblioteku: `el.innerHTML = DOMPurify.sanitize(content)`
- Najbolje: prepakuj da koristi `textContent` gde god je moguće, a `innerHTML` samo za elemente koji zaista trebaju HTML

### 10. Fix URL validacija u ponuda.js
**Problem:** Linija 36-46 proverava samo hostname, ne i protokol. Može da primi `javascript://` URL.
**Fix:**
```javascript
// Dodaj proveru protokola:
if ((urlObj.protocol === 'https:' || urlObj.protocol === 'http:') &&
    (urlObj.hostname === 'hostsite-production.up.railway.app' || urlObj.hostname === 'localhost')) {
```

---

## MEDIUM — Fix This Month

### 11. Iframe sandbox
**Problem:** Live preview iframe na homepage-u učitava eksterne sajtove bez sandbox-a.
**Fix:**
```html
<iframe src="..." class="live-iframe" sandbox="allow-scripts allow-same-origin" title="SajtPro rad"></iframe>
```

### 12. Subresource Integrity za eksterne skripte
**Fix:** Dodaj SRI hash za Google Analytics i Aegis/Dabog skripte:
```html
<script src="https://www.googletagmanager.com/gtag/js?id=G-YJXSC9RS3G" integrity="sha384-HASH" crossorigin="anonymous"></script>
```
Ovo sprečava da kompromitovan CDN servira maliciozan kod.

### 13. Bot detekcija — poboljšaj fingerprinting
**Problem:** Dabog trenutno detektuje botove po User-Agent stringu. Headless browser sa pravim UA prolazi.
**Sugestije:**
- Dodaj JavaScript challenge koji proverava: `navigator.webdriver`, `window.chrome`, canvas fingerprint, WebGL renderer
- Proveri TLS fingerprint (JA3/JA4) — headless browseri imaju drugačiji TLS handshake od pravih
- Proveri HTTP/2 settings frame — botovi često imaju default Go/Python h2 settings
- Mouse movement / interaction tracking pre prvog form submit-a

### 14. Rate limiting po IP u Dabog-u
**Problem:** Nema vidljivog server-side rate limiting-a.
**Fix:**
- Implementiraj sliding window rate limit: max 60 req/min po IP za obične stranice
- Max 5 req/min po IP za forme
- Max 10 req/min po IP za sensitive putanje (/admin, /.env, /.git itd.)
- Ako IP prekorači limit — redirect u tarpit

### 15. .env.example ne treba da bude u repo-u
**Problem:** Pokazuje napadaču tačno koje servise koristiš (UptimeRobot, Google Service Account, SMTP).
**Fix:** Obriši `.env.example` iz Git-a. Dokumentuj potrebne env varijable u privatnom README ili Notion-u.

---

## LOW / NICE TO HAVE

### 16. Telefon i email u source-u
- Razmotri da kontakt info učitavaš dinamički ili renderuješ kao sliku/SVG da otežaš scraping

### 17. Source map fajlovi
- Proveri da `.map` fajlovi nisu dostupni na produkciji

### 18. npm audit
- Pokreni `npm audit` u `/reports` i `/tools` direktorijumima redovno

### 19. Dabog dashboard log retencija
- Iz logova se vidi da čuvaš IP + putanju + timestamp — proveri GDPR compliance za EU posetioce
