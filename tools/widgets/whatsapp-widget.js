/**
 * SajtPro WhatsApp/Viber plutajuće dugme
 *
 * Ubacivanje na sajt:
 *   <script src="whatsapp-widget.js"
 *     data-phone="381601234567"
 *     data-message="Zdravo, zanima me..."
 *     data-viber="true"
 *     data-position="right"
 *     data-color="#25D366">
 *   </script>
 */
(function () {
  const script = document.currentScript;
  const phone = script.getAttribute('data-phone') || '';
  const defaultMsg = script.getAttribute('data-message') || 'Zdravo! Imam pitanje u vezi vaših usluga.';
  const showViber = script.getAttribute('data-viber') === 'true';
  const position = script.getAttribute('data-position') || 'right';
  const color = script.getAttribute('data-color') || '#25D366';
  const viberColor = '#7360F2';

  const posStyle = position === 'left' ? 'left:20px;' : 'right:20px;';

  // WhatsApp ikonica (SVG)
  const waIcon = '<svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  // Viber ikonica (SVG)
  const vbIcon = '<svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M11.398.002C9.473.028 5.269.344 3.004 2.456.949 4.378.08 7.294.003 10.928c-.078 3.634-.178 10.442 6.398 12.112l.007.001h.009l-.003 2.76s-.042.702.436 .845c.578.173.917-.374 1.47-.97l1.062-1.19c2.925.245 5.169-.32 5.42-.405.582-.196 3.87-.611 4.407-4.977.556-4.508-.268-7.357-1.712-8.636l-.003-.002c-.376-.524-2.393-2.876-6.977-3.043-.003 0-.02-.002-.02-.002 0 0-3.1-.22-5.1 1.056-.635.404-.993.93-1.244 1.423l-.003.006c-.383.768-.543 1.702-.589 2.767-.046 1.064.037 2.258.281 3.508.398 2.044 1.318 3.166 2.57 3.673.867.35 1.527.258 1.963.068.51-.222.866-.7.866-.7l.118-.163c.282-.395.44-.659.624-.98.26-.457.197-1.054-.208-1.194 0 0-.763-.277-1.085-.406-.322-.13-.559-.212-.763.33-.203.54-.872 1.47-.872 1.47s-.122.166-.363.077c-.48-.177-.98-.585-1.476-1.413-.496-.828-.784-1.813-.784-1.813s-.088-.254.069-.39c.147-.126.62-.735.62-.735s.459-.566.268-.937c-.19-.37-1.087-2.43-1.285-2.77-.142-.24-.39-.3-.39-.3-.243-.058-.564-.095-.888-.085-.324.01-.65.062-.89.23 0 0-1.312.93-1.402 2.915-.09 1.985.927 4.105.927 4.105l.012.024c.018.036 1.02 2.076 2.817 3.462 1.686 1.3 3.648 1.452 3.648 1.452z"/></svg>';

  // Container
  const container = document.createElement('div');
  container.id = 'sajtpro-chat-widget';
  container.style.cssText = `position:fixed;bottom:20px;${posStyle}z-index:9999;display:flex;flex-direction:column;align-items:${position === 'left' ? 'flex-start' : 'flex-end'};gap:12px;font-family:Arial,sans-serif;`;

  // Tooltip / pozdrav
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `background:#fff;color:#1a1a1a;padding:12px 16px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);font-size:14px;line-height:1.4;max-width:240px;opacity:0;transform:translateY(10px);transition:all 0.3s ease;pointer-events:none;`;
  tooltip.textContent = 'Zdravo! Kako vam možemo pomoći?';

  // Dugmad wrapper
  const btnsWrap = document.createElement('div');
  btnsWrap.style.cssText = 'display:flex;gap:10px;align-items:center;';

  // WhatsApp dugme
  const waBtn = document.createElement('a');
  const encodedMsg = encodeURIComponent(defaultMsg);
  waBtn.href = `https://wa.me/${phone}?text=${encodedMsg}`;
  waBtn.target = '_blank';
  waBtn.rel = 'noopener';
  waBtn.title = 'Pišite nam na WhatsApp';
  waBtn.style.cssText = `display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:${color};box-shadow:0 4px 16px rgba(0,0,0,0.2);cursor:pointer;transition:transform 0.2s;text-decoration:none;`;
  waBtn.innerHTML = waIcon;
  waBtn.onmouseenter = function () { this.style.transform = 'scale(1.1)'; };
  waBtn.onmouseleave = function () { this.style.transform = 'scale(1)'; };

  btnsWrap.appendChild(waBtn);

  // Viber dugme (opciono)
  if (showViber) {
    const vbBtn = document.createElement('a');
    vbBtn.href = `viber://chat?number=%2B${phone}`;
    vbBtn.title = 'Pišite nam na Viber';
    vbBtn.style.cssText = `display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:${viberColor};box-shadow:0 4px 16px rgba(0,0,0,0.2);cursor:pointer;transition:transform 0.2s;text-decoration:none;`;
    vbBtn.innerHTML = vbIcon;
    vbBtn.onmouseenter = function () { this.style.transform = 'scale(1.1)'; };
    vbBtn.onmouseleave = function () { this.style.transform = 'scale(1)'; };
    btnsWrap.appendChild(vbBtn);
  }

  container.appendChild(tooltip);
  container.appendChild(btnsWrap);
  document.body.appendChild(container);

  // Prikaži tooltip posle 3 sekunde, sakrij posle 8
  setTimeout(function () {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
  }, 3000);

  setTimeout(function () {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
  }, 8000);
})();
