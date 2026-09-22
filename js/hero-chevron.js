/* Chevron hero.
   Every project builds the KD mark; the featured eight leave it for the ring as you scroll. */
(function () {
  var host = document.getElementById('chevHero');
  if (!host || !window.HERO_PROJECTS) return;

  var ALL = window.HERO_PROJECTS;                                   // every project builds the mark
  var LEADS = ALL.slice(0, window.HERO_RING || 8);                  // the front few reach the ring
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // the KD mark in its own units (viewBox 18.62 x 11.73)
  var BLUE = [[18.62, 0], [12, 0], [6, 5.86], [12, 11.73], [18.62, 11.73], [12.62, 5.86]];
  var INK = [[0, 0], [0, 11.72], [6, 5.86]];
  function inside(pt, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  // Build the mark from a grid, then merge neighbours into 2x1, 1x2 and 2x2 blocks so
  // the tiles vary in size and proportion instead of reading as one even mesh.
  function buildMark(target) {
    for (var s = 1.9; s > .40; s -= .035) {
      var cols = Math.floor(18.62 / s), rows = Math.floor(11.73 / s);
      var ox = (18.62 - cols * s) / 2, oy = (11.73 - rows * s) / 2;
      var kind = [], r, c;
      for (r = 0; r < rows; r++) {
        kind[r] = [];
        for (c = 0; c < cols; c++) {
          // judge a cell by how much of it the shape covers, not just its centre,
          // or every diagonal edge of the mark comes out stepped
          var bc = 0, ic = 0;
          for (var sy = 0; sy < 3; sy++) {
            for (var sx = 0; sx < 3; sx++) {
              var px = ox + (c + (sx + .5) / 3) * s, py = oy + (r + (sy + .5) / 3) * s;
              if (inside([px, py], BLUE)) bc++; else if (inside([px, py], INK)) ic++;
            }
          }
          kind[r][c] = (bc + ic) < 4 ? 0 : (bc >= ic ? 1 : 2);
        }
      }
      var used = [], blocks = [];
      for (r = 0; r < rows; r++) { used[r] = []; }
      var free = function (rr, cc, k) {
        return rr < rows && cc < cols && kind[rr] && kind[rr][cc] === k && !used[rr][cc];
      };
      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          var k = kind[r][c];
          if (!k || used[r][c]) continue;
          var q = rnd(r * 53 + c, 7), cw = 1, ch = 1;
          if (q < .10 && free(r, c + 1, k) && free(r + 1, c, k) && free(r + 1, c + 1, k)) { cw = 2; ch = 2; }
          else if (q < .34 && free(r, c + 1, k)) { cw = 2; }
          else if (q < .56 && free(r + 1, c, k)) { ch = 2; }
          for (var a = 0; a < ch; a++) for (var b = 0; b < cw; b++) used[r + a][c + b] = 1;
          blocks.push({
            x: ox + (c + cw / 2) * s, y: oy + (r + ch / 2) * s,
            cw: cw, ch: ch, ink: k === 2
          });
        }
      }
      if (blocks.length >= target) return { blocks: blocks, s: s };
    }
  }

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var rnd = function (i, k) { var x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#&';
  function scramble(el, text) {
    if (el._scr) cancelAnimationFrame(el._scr);
    if (reduced) { el.textContent = text; return; }
    var start = performance.now(), dur = Math.min(650, 300 + text.length * 10);
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur), out = '';
      for (var i = 0; i < text.length; i++) {
        out += (i / text.length < p || text[i] === ' ') ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(tick);
    })(start);
  }

  // one video element for the whole hero, moved into whichever tile holds focus
  var vid = document.createElement('video');
  vid.muted = true; vid.loop = true; vid.playsInline = true;
  vid.setAttribute('playsinline', ''); vid.setAttribute('muted', '');
  vid.preload = 'none'; vid.className = 'chev-vid';
  var vidHost = null;
  function playIn(tileEl, project) {
    if (vidHost === tileEl) return;
    vidHost = tileEl;
    vid.pause(); vid.classList.remove('on');
    if (!tileEl || !project || !project.video || reduced) { if (vid.parentNode) vid.parentNode.removeChild(vid); return; }
    vid.src = project.video;
    tileEl.appendChild(vid);
    vid.onplaying = function () { vid.classList.add('on'); };
    var p = vid.play(); if (p && p.catch) p.catch(function () {});
  }

  // enough blocks that every project gets one even after the leads claim theirs
  var grid = buildMark(Math.round(ALL.length * 1.75)), blocks = grid.blocks;
  var field = document.getElementById('chevField');
  var idxEl = document.getElementById('chevIdx'), nameEl = document.getElementById('chevName'),
      stmtEl = document.getElementById('chevStmt'), hintEl = document.getElementById('chevHint');

  blocks.forEach(function (b) {
    b.ang = Math.atan2(b.y - 5.865, b.x - 9.31);
    b.area = b.cw * b.ch;
  });

  // one lead per eighth of the mark, favouring the larger blocks, so the eight that
  // leave for the ring are spread rather than bunched
  var leadOf = {}, taken = {};
  LEADS.forEach(function (p, j) {
    var lo = -Math.PI + (j / LEADS.length) * Math.PI * 2, hi = lo + Math.PI * 2 / LEADS.length;
    var pool = blocks.filter(function (b, i) { return !taken[i] && b.ang >= lo && b.ang < hi; });
    if (!pool.length) pool = blocks.filter(function (b, i) { return !taken[i]; });
    pool.sort(function (a, b) { return b.area - a.area; });
    var chosen = pool[Math.min(pool.length - 1, 1)] || pool[0];
    taken[blocks.indexOf(chosen)] = 1;
    leadOf[blocks.indexOf(chosen)] = p;
  });

  var fill = 0;
  var tiles = blocks.map(function (b, i) {
    var lead = leadOf[i], p = lead || ALL[fill++ % ALL.length];
    var a = document.createElement('a');
    a.className = 'chev-tile' + (b.ink ? ' ink' : '') + (lead ? ' lead' : '');
    a.href = p.href;
    a.setAttribute('aria-label', p.name);
    a.innerHTML = '<img src="' + (p.thumbSm || p.thumb) + '" alt="" loading="lazy">';
    field.appendChild(a);
    return {
      el: a, p: p, b: b, lead: !!lead, fs: 1,
      sx: (rnd(i, 1) - .5) * 2.4, sy: (rnd(i, 2) - .5) * 2.4,
      // the mark builds outward from the centre, so the wave reads as one move
      delay: (Math.hypot(b.x - 9.31, b.y - 5.865) / 11) * 900 + rnd(i, 3) * 160,
      rot0: (rnd(i, 4) - .5) * 26, z0: 200 + rnd(i, 5) * 500,
      out: b.ang
    };
  });

  // lead tiles take ring slots in the order they sit around the mark, so none cross on the way out
  var leads = tiles.filter(function (t) { return t.lead; });
  leads.sort(function (a, b) { return a.out - b.out; });
  leads.forEach(function (t, j) {
    t.slot = j;
    // Cipher's ring is a loose cluster, not a clock face: vary each one's size,
    // proportion, distance and depth so they overlap at different scales.
    var v = function (kk) { return rnd(j + 1, kk); };
    // opposite slots share a distance and mirror their nudge, so the ring cannot
    // drift to one side; only the sizes stay free to vary
    var m = j < leads.length / 2 ? j : j - Math.floor(leads.length / 2), mv = function (kk) { return rnd(m + 1, kk); };
    var flip = j < leads.length / 2 ? 1 : -1;
    t.rs = .80 + v(11) * .48;                                  // size
    t.ar = [.72, .75, 1, 1.15, .62][Math.floor(v(12) * 5)];    // height / width
    t.rr = .93 + mv(13) * .16;                                 // distance from centre
    t.aj = (mv(14) - .5) * .24 * flip;                         // angular nudge
    t.rz = (v(15) - .5) * 420;                                 // depth
  });
  var n = leads.length;

  var hover = null, focusKey = -2, drift = 0;

  /* ---- timeline -------------------------------------------------------
     Once the count reaches 100 the hero plays itself: the tiles assemble into
     the mark, it holds for a beat, then it opens into the ring. Scrolling only
     takes over afterwards, to turn the ring and release the page. */
  var ASSEMBLE = 1400, HOLD = 700, OPEN_DUR = 1800;
  var maxDelay = tiles.reduce(function (m, t) { return Math.max(m, t.delay); }, 0);
  var OPEN_AT = ASSEMBLE + maxDelay + HOLD;
  var ph = 0, lastNow = 0, rush = 1;

  // an impatient visitor should speed the sequence up, not be stuck behind it
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
    window.addEventListener(ev, function () { if (ph < OPEN_AT + OPEN_DUR) rush = 2.6; }, { passive: true });
  });

  /* ---- loader ----------------------------------------------------------
     Cipher opens on a black screen with a count in small type. Here the count
     is the first beat of the mark rather than a screen in front of it: it runs
     on the real thumbnails loading, sits in the caption slot the project name
     will occupy, and hands straight over to the tiles flying into the chevron. */
  var bar = document.createElement('div');
  bar.className = 'chev-bar'; bar.innerHTML = '<i></i>';
  host.querySelector('.chev-sticky').appendChild(bar);
  var barFill = bar.firstChild;

  var MIN_HOLD = 900, MAX_WAIT = 4000;
  var bootAt = performance.now(), pctReal = 0, pctShown = 0;
  // someone arriving mid-page (a refresh, or a back button) should not be held
  var ready = reduced || window.scrollY > 40;

  if (!ready) {
    document.body.classList.add('chev-loading');
    nameEl.textContent = '0%';
    var seen = {}, urls = [];
    tiles.forEach(function (t) { var u = t.p.thumbSm || t.p.thumb; if (!seen[u]) { seen[u] = 1; urls.push(u); } });
    var done = 0;
    urls.forEach(function (u) {
      var im = new Image();
      im.onload = im.onerror = function () { done++; pctReal = done / urls.length; };
      im.src = u;
    });
  }
  leads.forEach(function (t) {
    t.el.addEventListener('pointerenter', function () { hover = t; });
    t.el.addEventListener('pointerleave', function () { if (hover === t) hover = null; });
  });

  function frame(now) {
    var r = host.getBoundingClientRect();
    var P = clamp(-r.top / (r.height - window.innerHeight), 0, 1);
    var onScreen = r.bottom > 0 && r.top < window.innerHeight;
    if (!onScreen) { requestAnimationFrame(frame); return; }          // idle once scrolled past

    if (!ready) {
      // count up, but never faster than it reads and never stuck on a slow image
      var waited = now - bootAt;
      if (waited > MAX_WAIT) pctReal = 1;
      var target = (pctReal >= 1 && waited > MIN_HOLD) ? 1 : Math.min(pctReal, .96);
      pctShown += (target - pctShown) * .12;
      nameEl.textContent = Math.round(pctShown * 100) + '%';
      barFill.style.width = (pctShown * 100).toFixed(1) + '%';
      tiles.forEach(function (t) { t.el.style.opacity = 0; });
      if (target === 1 && pctShown > .995) {
        ready = true;
        ph = -260;                      // a beat on 100 before the mark assembles
        lastNow = now;
        // take the hold before releasing the loader, or the page is free for one frame
        document.body.classList.add('chev-holding');
        document.body.classList.remove('chev-loading');
        // full-size stills for the ring, fetched quietly once the mark is up
        leads.forEach(function (t) { var im = new Image(); im.src = t.p.thumb; });
      }
      requestAnimationFrame(frame);
      return;
    }
    var dt = lastNow ? Math.min(64, now - lastNow) : 16;
    lastNow = now;
    ph += dt * rush;

    var open = reduced ? 1 : ease(clamp((ph - OPEN_AT) / OPEN_DUR, 0, 1));
    var turn = seg(P, 0, 1);
    if (!reduced) drift += .0012 * open;
    // hold only through the assemble and the beat on the mark; the ring then opens
    // by itself while the visitor is free to scroll on
    document.body.classList.toggle('chev-holding', ph < OPEN_AT - 120);
    host.dataset.open = open.toFixed(3);
    hintEl.style.opacity = (open > .98 && P < .04) ? .45 : 0;
    document.body.classList.toggle('chev-dark-nav', r.bottom > window.innerHeight * .35);

    var vw = window.innerWidth, vh = window.innerHeight;
    var mn = Math.min(vw, vh), portrait = vw < vh;
    var M = Math.min(vw * (portrait ? .86 : .6), vh * .56 * 18.62 / 11.73), k = M / 18.62;
    var cell = grid.s * k * .98;
    // wide enough to use the screen, short enough to sit centred clear of the nav
    var RX = Math.min(vw * (portrait ? .33 : .40), vh * .70), RY = Math.min(vh * .235, vw * .5);
    var ringDrop = vh * .015 * open;      // optical centring, the caption row sits below
    var W = mn * (n <= 8 ? .25 : n <= 12 ? .205 : .17);
    var rot = turn * Math.PI + drift;

    var best = null, bestD = 9;
    tiles.forEach(function (t, i) {
      var mx = (t.b.x - 9.31) * k, my = (t.b.y - 5.865) * k;
      var bw = t.b.cw * cell, bh = t.b.ch * cell;
      var ip = reduced ? 1 : clamp((ph - t.delay) / ASSEMBLE, 0, 1);
      var ie = 1 - Math.pow(1 - ip, 5);               // a long settle, so it lands rather than snaps
      var x, y, z = 0, w, h, op, tint;
      if (t.lead) {
        if (open > .12 && !t.hi) { t.hi = 1; t.el.querySelector('img').src = t.p.thumb; }
        var ang = (t.slot / n) * Math.PI * 2 + rot + t.aj;
        var ox = Math.sin(ang) * RX * t.rr, oy = Math.cos(ang) * RY * t.rr;
        x = mx + (ox - mx) * open; y = my + (oy - my) * open + ringDrop;
        var rw = W * t.rs, rh = rw * t.ar;
        w = bw + (rw - bw) * open; h = bh + (rh - bh) * open;
        z = t.rz * open;
        op = ie; tint = 1 - clamp(open * 1.5, 0, 1);
        var base = (t.slot / n) * Math.PI * 2 + rot;
        var d = Math.abs(Math.atan2(Math.sin(base), Math.cos(base)));  // six o'clock, beside the caption
        if (d < bestD) { bestD = d; best = t; }
      } else {
        var push = open * mn * .22;
        x = mx + Math.cos(t.out) * push; y = my + Math.sin(t.out) * push; z = -open * 400;
        w = bw * (1 - open * .5); h = bh * (1 - open * .5);
        op = ie * (1 - clamp(open * 1.8, 0, 1)); tint = 1;
      }
      x = t.sx * vw * (1 - ie) + x * ie; y = t.sy * vh * (1 - ie) + y * ie;
      z += t.z0 * (1 - ie);                            // they come in toward the camera
      var spin = t.rot0 * (1 - ie);
      t.fs += ((t === (hover || (open > .9 ? best : null)) ? 1.1 : 1) - t.fs) * .12;
      t.el.style.width = w + 'px'; t.el.style.height = h + 'px';
      t.el.style.opacity = op.toFixed(3);
      t.el.style.pointerEvents = op > .5 ? 'auto' : 'none';
      t.el.style.setProperty('--t', tint.toFixed(3));
      if (t.lead) t.el.style.setProperty('--open', open.toFixed(3));
      t.el.style.transform = 'translate3d(' + (x - w / 2) + 'px,' + (y - h / 2) + 'px,' +
        (z + (t.fs - 1) * 800) + 'px) rotate(' + spin.toFixed(2) + 'deg) scale(' + (t.fs * (.62 + .38 * ie)).toFixed(3) + ')';
      t.el.style.zIndex = t.lead ? 10 : 1;
    });

    var f = hover || (open > .9 ? best : null);
    var key = f ? f.slot : (open > .05 ? -3 : -1);
    if (key !== focusKey) {
      tiles.forEach(function (t) { t.el.classList.remove('focus'); });
      focusKey = key;
      if (!f) {
        playIn(null, null);
        idxEl.textContent = ALL.length + ' projects';
        nameEl.removeAttribute('href');
        scramble(nameEl, 'Kieran Duffy');
        scramble(stmtEl, 'Brand & digital designer, Dublin');
      } else {
        f.el.classList.add('focus');
        playIn(f.el, f.p);
        idxEl.textContent = pad(f.slot + 1) + ' / ' + pad(n);
        nameEl.href = f.p.href;
        scramble(nameEl, f.p.name);
        scramble(stmtEl, f.p.statement);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
