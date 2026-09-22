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

  var TAU = Math.PI * 2, DEG = 180 / Math.PI, RAD = Math.PI / 180;
  var wrap = function (v, lo, hi) { var r = hi - lo; return ((v - lo) % r + r) % r + lo; };

  /* ---- layouts ---------------------------------------------------------
     Each one places a lead tile for the current frame and reports how close
     it is to being the tile in focus (lower wins). They all share the same
     mark assemble, the same scroll, and the one-video rule.               */
  var MODES = {
    // the work circles the mark, the tile at six o'clock in focus
    ring: function (t, c) {
      var ang = (t.slot / c.n) * TAU + c.rot + t.aj, base = (t.slot / c.n) * TAU + c.rot;
      var w = c.W * t.rs;
      return { x: Math.sin(ang) * c.RX * t.rr, y: Math.cos(ang) * c.RY * t.rr + c.drop,
               z: t.rz, w: w, h: w * t.ar,
               foc: Math.abs(Math.atan2(Math.sin(base), Math.cos(base))) };
    },
    // a deck dealt along a diagonal; scrolling walks the camera through it
    deck: function (t, c) {
      var step = c.mn * .19, d = wrap(t.slot - c.turn * c.n - 1.4, -2.5, c.n - 2.5), w = c.mn * .66;
      return { x: c.mn * -.20 + d * step * .78, y: c.mn * .13 - d * step * .36, z: -d * 330,
               w: w, h: w * .70,
               op: clamp(d + 2.2, 0, 1) * clamp(1 - (d - (c.n - 4)) / 2.4, 0, 1) * .92,
               foc: Math.abs(d) };
    },
    // a carousel you spin, every card turned to face out of the drum
    cylinder: function (t, c) {
      var ang = (t.slot / c.n) * TAU + c.turn * TAU + c.rot;
      var R = Math.min(c.vw * .46, 640), w = c.mn * .32;
      return { x: Math.sin(ang) * R, y: 0, z: Math.cos(ang) * R - R * .5, rotY: -ang * DEG,
               w: w, h: w * .72, op: .3 + .7 * (Math.cos(ang) * .5 + .5),
               foc: Math.abs(Math.atan2(Math.sin(ang), Math.cos(ang))) };
    },
    // a helix climbing up through the screen
    helix: function (t, c) {
      var k = wrap(t.slot - c.turn * c.n, -1.5, c.n - 1.5);
      var ang = k * .85 + c.rot * 2, R = Math.min(c.vw * .30, 430), w = c.mn * .27;
      return { x: Math.sin(ang) * R, y: c.vh * .30 - k * c.vh * .16, z: Math.cos(ang) * R - 220,
               rotY: -ang * DEG * .5, w: w, h: w * .72,
               op: clamp(k + 1.2, 0, 1) * clamp(c.n - 1.4 - k, 0, 1),
               foc: Math.abs(k - 1.4) };
    },
    // one wall of work, angled away, scrolling pans along it
    wall: function (t, c) {
      var cols = 4, cw = c.mn * .44, ch = cw * .72, th = -27 * RAD;
      var col = t.slot % cols, row = (t.slot / cols) | 0;
      var u = (col - (cols - 1) / 2) * cw * 1.07 + (row % 2 ? cw * .34 : 0) - (c.turn - .5) * c.mn * 2.2;
      return { x: u * Math.cos(th), z: -u * Math.sin(th) - 140, y: (row - 1) * ch * 1.07,
               rotY: th * DEG, w: cw, h: ch,
               op: clamp(2.4 - Math.abs(u) / (c.vw * .5), 0, 1), foc: Math.abs(u) / 120 };
    },
    // a hand of cards fanned from below the fold. A phone gets a tighter arc and
    // bigger cards, or the fan swings its shoulders off both edges of the screen.
    fan: function (t, c) {
      var k = wrap(t.slot - c.turn * c.n, -c.n / 2, c.n / 2);
      var spread = c.portrait ? 6 : 9;
      var R = c.vh * (c.portrait ? .40 : .80);
      var w = c.mn * (c.portrait ? .44 : .30);
      var ang = k * spread, a = ang * RAD;
      return { x: Math.sin(a) * R, y: -Math.cos(a) * R + R * (c.portrait ? .62 : .84), rot: ang, z: -Math.abs(k) * 26,
               w: w, h: w * 1.26, op: clamp(1.9 - Math.abs(k) * .34, 0, 1), foc: Math.abs(k) };
    },
    // flying down a corridor of work
    tunnel: function (t, c) {
      var gap = 620, len = c.n * gap, w = c.mn * .34;
      var z = wrap(-t.slot * gap + c.turn * len * 1.3, -len + 380, 380);
      var ang = t.slot * 2.39996, near = clamp((z + len) / (len - 300), 0, 1);
      return { x: Math.cos(ang) * c.vw * .28, y: Math.sin(ang) * c.vh * .26, z: z, w: w, h: w * .72,
               op: Math.pow(near, 2.4) * (z > 120 ? clamp(1 - (z - 120) / 260, 0, 1) : 1),
               foc: Math.abs(z + 300) / 100 };
    },
    // a globe of work you turn
    sphere: function (t, c) {
      var i = t.slot + .5, phi = Math.acos(1 - 2 * i / c.n);
      var th = Math.PI * (1 + Math.sqrt(5)) * i + c.turn * TAU + c.rot;
      var R = Math.min(c.vw * .34, c.vh * .46), w = c.mn * .23;
      var z = Math.sin(phi) * Math.sin(th) * R;
      return { x: Math.sin(phi) * Math.cos(th) * R, y: Math.cos(phi) * R * .92, z: z, w: w, h: w * .72,
               op: .28 + .72 * clamp((z + R) / (2 * R), 0, 1), foc: (R - z) / 90 };
    },
    // a loose field in depth that answers the mouse
    drift: function (t, c) {
      var d = wrap(t.slot - c.turn * c.n * .85, -2, c.n - 2);
      var w = c.mn * (.20 + (t.rs - .8) * .26);
      return { x: t.sx * c.vw * .34 + c.mouseX * (60 + d * 20),
               y: t.sy * c.vh * .30 + c.mouseY * (48 + d * 16),
               z: -d * 230, w: w, h: w * t.ar,
               op: clamp(d + 1.6, 0, 1) * clamp(c.n - 2.2 - d, 0, 1), foc: Math.abs(d) };
    }
  };

  var MODE_NAMES = Object.keys(MODES);
  if (MODES[MODE] === undefined) MODE = 'ring';
  var mouseX = 0, mouseY = 0, mTargX = 0, mTargY = 0;
  window.addEventListener('pointermove', function (e) {
    mTargX = e.clientX / window.innerWidth - .5; mTargY = e.clientY / window.innerHeight - .5;
  });

  // live switching, for the hero lab
  window.KDHero = {
    modes: MODE_NAMES,
    get: function () { return MODE; },
    set: function (m) {
      if (!MODES[m]) return false;
      host.classList.remove('mode-' + MODE);
      MODE = m;
      host.classList.add('mode-' + MODE);
      return true;
    }
  };

  var hover = null, focusKey = -2, drift = 0;

  // how the mark opens: 'ring' circles the work, 'stack' deals it as a deck receding
  // into depth. ?open=stack to compare.
  var MODE = (location.search.match(/[?&]open=([a-z]+)/) || [])[1] || 'fan';
  if (MODE === 'stack') MODE = 'deck';                 // the old name for the diagonal deck
  host.classList.add('mode-' + MODE);

  // the line that lands in the middle of the ring; ?hero=1..4 previews the alternates
  var centreEl = document.getElementById('chevCentre'), centreShown = false;
  if (centreEl && window.HERO_LINES && window.HERO_LINES.length) {
    var pick = parseInt((location.search.match(/[?&]hero=(\d+)/) || [])[1], 10);
    var line = window.HERO_LINES[(pick > 0 ? pick - 1 : 0) % window.HERO_LINES.length];
    document.getElementById('chevLine').innerHTML = line[0];
    document.getElementById('chevSub').textContent = line[1];
  }

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

  var stage = host.querySelector('.chev-sticky');
  function frame(now) {
    var r = host.getBoundingClientRect();
    // measure against the stage, which may be a small viewport height, not the window
    var stageH = stage.clientHeight || window.innerHeight;
    var P = clamp(-r.top / (r.height - stageH), 0, 1);
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

    var vw = window.innerWidth, vh = stageH;
    var mn = Math.min(vw, vh), portrait = vw < vh;
    var M = Math.min(vw * (portrait ? .86 : .6), vh * .56 * 18.62 / 11.73), k = M / 18.62;
    var cell = grid.s * k * .98;
    // wide enough to use the screen, short enough to sit centred clear of the nav
    var RX = Math.min(vw * (portrait ? .33 : .40), vh * .70), RY = Math.min(vh * .235, vw * .5);
    var ringDrop = (portrait ? -vh * .085 : vh * .015) * open;   // phones stack: ring up, line below      // optical centring, the caption row sits below
    var W = mn * (n <= 8 ? .25 : n <= 12 ? .205 : .17);
    var rot = turn * Math.PI + drift;

    mouseX += (mTargX - mouseX) * .06; mouseY += (mTargY - mouseY) * .06;
    var ctx = { n: n, turn: turn, open: open, vw: vw, vh: vh, mn: mn, portrait: portrait,
                W: W, RX: RX, RY: RY, rot: rot, drop: ringDrop, mouseX: mouseX, mouseY: mouseY };
    var layout = MODES[MODE] || MODES.ring;

    var best = null, bestD = 1e9;
    tiles.forEach(function (t, i) {
      var mx = (t.b.x - 9.31) * k, my = (t.b.y - 5.865) * k;
      var bw = t.b.cw * cell, bh = t.b.ch * cell;
      var ip = reduced ? 1 : clamp((ph - t.delay) / ASSEMBLE, 0, 1);
      var ie = 1 - Math.pow(1 - ip, 5);               // a long settle, so it lands rather than snaps
      var x, y, z = 0, w, h, op, tint;
      var rotY = 0, extraRot = 0;
      if (t.lead) {
        if (open > .12 && !t.hi) { t.hi = 1; t.el.querySelector('img').src = t.p.thumb; }
        var L = layout(t, ctx);
        w = bw + (L.w - bw) * open; h = bh + (L.h - bh) * open;
        x = mx + (L.x - mx) * open; y = my + (L.y - my) * open;
        z = (L.z || 0) * open;
        rotY = (L.rotY || 0) * open;
        extraRot = (L.rot || 0) * open;
        op = ie * (L.op == null ? 1 : L.op);
        tint = 1 - clamp(open * 1.5, 0, 1);
        if (L.foc < bestD) { bestD = L.foc; best = t; }
      } else {
        var push = open * mn * .22;
        x = mx + Math.cos(t.out) * push; y = my + Math.sin(t.out) * push; z = -open * 400;
        w = bw * (1 - open * .5); h = bh * (1 - open * .5);
        op = ie * (1 - clamp(open * 1.8, 0, 1)); tint = 1;
      }
      x = t.sx * vw * (1 - ie) + x * ie; y = t.sy * vh * (1 - ie) + y * ie;
      z += t.z0 * (1 - ie);                            // they come in toward the camera
      var spin = t.rot0 * (1 - ie) + extraRot;
      t.fs += ((t === (hover || (open > .9 ? best : null)) ? 1.1 : 1) - t.fs) * .12;
      t.el.style.width = w + 'px'; t.el.style.height = h + 'px';
      t.el.style.opacity = op.toFixed(3);
      t.el.style.pointerEvents = op > .5 ? 'auto' : 'none';
      t.el.style.setProperty('--t', tint.toFixed(3));
      if (t.lead) t.el.style.setProperty('--open', open.toFixed(3));
      t.el.style.transform = 'translate3d(' + (x - w / 2) + 'px,' + (y - h / 2) + 'px,' +
        (z + (t.fs - 1) * 800) + 'px) rotateY(' + rotY.toFixed(2) + 'deg) rotate(' + spin.toFixed(2) + 'deg) scale(' + (t.fs * (.62 + .38 * ie)).toFixed(3) + ')';
      t.el.style.zIndex = t.lead ? 10 : 1;
    });

    if (centreEl && MODE !== 'deck' && !centreShown && open > .995) { centreShown = true; centreEl.classList.add('in'); }

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
