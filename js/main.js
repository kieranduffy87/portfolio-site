/* KD portfolio interactions */
(function () {
  // --- KD preloader (homepage): halves assemble, mark flies into the nav pill ---
  var pre = document.getElementById('preloader');
  if (pre) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      pre.remove();
    } else {
      document.body.classList.add('loading');
      var started = Date.now();
      var finished = false;
      var finish = function () {
        if (finished) return;
        finished = true;
        var wait = Math.max(0, 1350 - (Date.now() - started));
        setTimeout(function () {
          var mark = pre.querySelector('.pre-mark');
          var target = document.querySelector('.pill-logo .kd-mark');
          if (mark && target) {
            var from = mark.getBoundingClientRect();
            var to = target.getBoundingClientRect();
            var scale = to.width / from.width;
            var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
            var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
            pre.classList.add('fly');
            requestAnimationFrame(function () {
              mark.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(' + scale + ')';
            });
          }
          pre.classList.add('done');
          setTimeout(function () {
            document.body.classList.remove('loading');
            pre.remove();
          }, 700);
        }, wait);
      };
      if (document.readyState === 'complete') { finish(); }
      else {
        window.addEventListener('load', finish);
        setTimeout(finish, 3000); // never hold the page hostage
      }
    }
  }
  // --- light/dark theme toggle (default light, persisted) ---
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('kd-theme', next); } catch (err) {}
    });
  }

  // --- mobile nav ---
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var header = document.getElementById('pillNav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      if (header) header.classList.toggle('menu-open', open); // pill's blur traps the fixed overlay
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
  }

  // --- lazy card videos: load + play only while on screen ---
  var cardVids = document.querySelectorAll('.card-vid');
  if (cardVids.length && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '120px 0px' });
    cardVids.forEach(function (v) { vio.observe(v); });
  } else {
    cardVids.forEach(function (v) { if (v.dataset.src) { v.src = v.dataset.src; v.play().catch(function () {}); } });
  }

  // --- homepage scroll scrub: case studies ease in as you scroll ---
  var scrubGrid = document.getElementById('scrubGrid');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (scrubGrid && !reducedMotion) {
    var scrubCards = [].slice.call(scrubGrid.querySelectorAll('.proj-card'));
    scrubCards.forEach(function (c) { c.classList.remove('reveal'); c.classList.add('in'); });
    var ticking = false;
    var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
    var scrub = function () {
      ticking = false;
      var vh = window.innerHeight;
      scrubCards.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        if (r.top > vh + 120 || r.bottom < -120) return;
        var p = clamp((vh * 0.94 - r.top) / (vh * 0.5));
        var ease = 1 - Math.pow(1 - p, 3);
        var ty = (1 - ease) * 90;
        var rot = (1 - ease) * (i % 2 === 0 ? -2 : 2);
        var sc = 0.92 + ease * 0.08;
        card.style.transform = 'translateY(' + ty + 'px) rotate(' + rot + 'deg) scale(' + sc + ')';
        card.style.opacity = (0.1 + ease * 0.9).toFixed(3);
      });
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(scrub); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    scrub();
  }

  // --- hero project slider ---
  var slider = document.getElementById('heroSlider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.dot');
    var cur = 0, timer;
    function playVid(slide, on) {
      var v = slide.querySelector('video');
      if (!v) return;
      if (on) { v.play().catch(function () {}); } else { v.pause(); }
    }
    function goTo(n) {
      n = (n + slides.length) % slides.length;
      if (n === cur) return;
      slides[cur].classList.remove('active');
      dots[cur].classList.remove('active');
      playVid(slides[cur], false);
      cur = n;
      slides[cur].classList.add('active');
      dots[cur].classList.add('active');
      playVid(slides[cur], true);
    }
    function arm() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(cur + 1); }, 6000);
    }
    playVid(slides[0], true);
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(+d.getAttribute('data-goto')); arm(); });
    });
    var prev = document.getElementById('slidePrev');
    var next = document.getElementById('slideNext');
    if (prev) prev.addEventListener('click', function () { goTo(cur - 1); arm(); });
    if (next) next.addEventListener('click', function () { goTo(cur + 1); arm(); });
    // hold auto-advance while the preloader is up so visitors land on slide one
    setTimeout(arm, document.getElementById('preloader') ? 2300 : 0);
  }

  // --- reveal on scroll ---
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // --- work page filters (mosaic pattern reflows around the visible cards) ---
  var MOSAIC = ['sz-s', 'sz-l', 'sz-t', 'sz-t', 'sz-t', 'sz-l', 'sz-s', 'sz-t', 'sz-t', 'sz-t'];
  function applyMosaic(cards) {
    var vi = 0;
    cards.forEach(function (card) {
      if (card.classList.contains('hidden')) return;
      card.classList.remove('sz-s', 'sz-l', 'sz-t');
      card.classList.add(MOSAIC[vi % MOSAIC.length]);
      vi++;
    });
  }
  var chips = document.querySelectorAll('.chip');
  var grid = document.getElementById('workGrid');
  if (chips.length && grid) {
    var cards = [].slice.call(grid.querySelectorAll('.proj-card'));
    var count = document.getElementById('projCount');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.getAttribute('data-filter');
        var shown = 0;
        cards.forEach(function (card) {
          var show = f === 'all' || card.getAttribute('data-industry') === f;
          card.classList.toggle('hidden', !show);
          if (show) { shown++; card.classList.add('in'); }
        });
        applyMosaic(cards);
        if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
      });
    });
  }
})();

// iOS Safari ignores user-scalable=no; block pinch gestures explicitly
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
