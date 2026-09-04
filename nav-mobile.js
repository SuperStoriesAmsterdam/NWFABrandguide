/* NWFA — shared mobile nav. Builds a hamburger + drawer from the existing
   .nav / .sitenav links and a persistent floating buy-tickets CTA.
   No markup changes needed per page; include on every page. */
(function () {
  function ready(fn){ document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var nav = document.querySelector('nav.nav, nav.sitenav');
    if (!nav) return;
    var lk = nav.querySelector('.lk');
    if (!lk) return;

    // tickets link — read from the nav; if absent (e.g. the map), no CTA at all.
    var tixEl = lk.querySelector('a.tix');
    var tixHref = tixEl ? tixEl.getAttribute('href') : null;
    var tixLabel = tixEl ? tixEl.textContent.trim() : 'buy tickets →';

    // hamburger
    var burger = document.createElement('button');
    burger.className = 'nm-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span>';
    nav.appendChild(burger);

    // drawer
    var drawer = document.createElement('div');
    drawer.className = 'nm-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'menu');

    var esc = function (s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
    var html = '<div class="nm-scrim" data-close></div><nav class="nm-panel">' +
               '<button class="nm-close" type="button" aria-label="close" data-close>&times;</button>';

    Array.prototype.forEach.call(lk.children, function (child) {
      if (child.classList.contains('has')) {
        var btn = child.querySelector('button');
        html += '<div class="nm-sec"><div class="nm-h">' + esc(btn ? btn.textContent.trim() : '') + '</div>';
        child.querySelectorAll('.drop a').forEach(function (a) {
          var b = a.querySelector('b');
          html += '<a class="nm-sub" href="' + a.getAttribute('href') + '">' + esc((b ? b.textContent : a.textContent).trim()) + '</a>';
        });
        html += '</div>';
      } else if (child.matches('a') && !child.classList.contains('tix')) {
        html += '<a class="nm-top" href="' + child.getAttribute('href') + '">' + esc(child.textContent.trim()) + '</a>';
      }
    });
    if (tixHref) html += '<a class="nm-cta" href="' + tixHref + '" target="_blank" rel="noopener">' + esc(tixLabel) + '</a>';
    html += '</nav>';
    drawer.innerHTML = html;
    document.body.appendChild(drawer);

    // persistent floating CTA (only when the page actually sells tickets)
    var floatEl = null;
    if (tixHref) {
      floatEl = document.createElement('a');
      floatEl.className = 'nm-float';
      floatEl.href = tixHref;
      floatEl.target = '_blank';
      floatEl.rel = 'noopener';
      floatEl.textContent = tixLabel;
      document.body.appendChild(floatEl);
    }

    function close(){ document.body.classList.remove('nm-open'); burger.setAttribute('aria-expanded', 'false'); }
    function open(){ document.body.classList.add('nm-open'); burger.setAttribute('aria-expanded', 'true'); }
    burger.addEventListener('click', function () { document.body.classList.contains('nm-open') ? close() : open(); });
    drawer.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
    drawer.querySelectorAll('.nm-panel a[href]').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // float: always on mobile, after-scroll on desktop
    if (floatEl) {
      var mq = window.matchMedia('(max-width:860px)');
      function sync(){
        if (mq.matches) floatEl.classList.add('nm-show');
        else floatEl.classList.toggle('nm-show', window.scrollY > 600);
      }
      sync();
      window.addEventListener('scroll', sync, { passive: true });
      mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
    }
  });
})();
