# -*- coding: utf-8 -*-
"""KD Portfolio static site generator.
Run:  python3 _build/build.py   (from the kd-portfolio folder, or anywhere; paths are script-relative)
Regenerates index.html, about.html, services.html, work.html, contact.html and projects/*.html
"""
import os, sys, html, re, json
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAYOUTS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cdg_layouts.json")))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content_projects_a import PROJECTS_A
from content_projects_b import PROJECTS_B
from content_deep import DEEP, FLAGSHIP
from content_lab import EXPERIMENTS, TOOLS

PROJECTS = PROJECTS_A + PROJECTS_B
LIVE_PROJECTS = [p for p in PROJECTS if not p.get("draft")]

SITE_NAME = "Kieran Duffy"
BRAND = "KD"
EMAIL = "kieranduffy87@gmail.com"
SITE_URL = "https://kieranduffy87.github.io/portfolio-site"
YEARS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "project_years.json")))
import datetime as _dt
LAST_UPDATED = _dt.date.today().strftime("%B %Y")

FEATURED = ["whatsexposed", "quinnit", "mistara", "mjflood", "asl", "celsius", "engineers-ireland", "liffey-meats"]

SERVICES = [
 ("Brand Strategy", "brand-strategy",
  "I define how your business should speak and operate in its market.",
  [
   ("Clarity that drives performance",
    "I work out how a business competes, how it is understood, and how it can grow or perform better. Strong brands start with clear positioning, aligned thinking and a structure that supports better decisions. My work removes ambiguity. I assess your market, your competitors and how you're currently perceived, then find where clarity is missing and where opportunity exists."),
   ("How I work",
    "From that research I set a clear strategic direction: your core values, and how the brand should operate across the organisation. Design thinking is then applied across brand, digital and communication systems so you present, communicate and perform consistently. Expect focused working sessions to get into every corner of your brand: customer journey mapping, brand archetypes and personas, and strategy sprints."),
  ]),
 ("Brand Identity & Design Systems", "brand-identity",
  "I create structured identity systems that keep your organisation consistent everywhere it appears.",
  [
   ("Identities, not logos",
    "A brand shouldn't stand still. It should evolve, stay relevant and perform across every touchpoint. I design identity systems that go far beyond a refreshed logo: a foundation for your entire communication system, from online presence to marketing collateral, built to live in the real world."),
   ("Positioning to guidelines",
    "A thorough audit of your internal and external processes, systems and infrastructure grounds the work, leading to a roadmap that raises the value of your proposition. From there I develop the language, tone and visual identity that reinforce the strategy: colour positioning, typeface families, iconography, sub-branding and continuity. Everything is captured in a brand book so anyone in the business, whether marketer, salesperson, receptionist or director, can carry the brand consistently."),
  ]),
 ("Digital & Performance Marketing", "digital-marketing",
  "I plan and manage campaigns aligned with your brand, your audience and your commercial objectives.",
  [
   ("Performance-led growth",
    "Digital marketing should deliver measurable performance and support how your business is found, engaged with and chosen. I combine content, search, social, email and paid media into joined-up campaigns that increase visibility, drive engagement and support conversion."),
   ("Grounded in data",
    "I analyse how users discover, interact with and respond to your brand, and use those insights to refine targeting, messaging and spend, improving return on investment over time. From SEO and content strategy to paid campaigns and automation, every element works together across the full customer journey."),
  ]),
 ("Social Media Marketing", "social-media",
  "I build structured social channels for visibility, consistency and measurable growth.",
  [
   ("More than presence",
    "Social media should support how your business is understood, engaged with and chosen, not just keep a feed ticking over. I deliver strategy, content creation and account management across LinkedIn, Facebook, Instagram, TikTok and X, positioning your business clearly within each platform."),
   ("One brand system, every platform",
    "The approach is built on audience insight, content planning and platform understanding. Tone of voice, visual identity and messaging align with your wider brand system, so every post reinforces recognition, from B2B lead generation on LinkedIn to visual storytelling on consumer platforms."),
  ]),
 ("Web & Digital Development", "web-development",
  "I design and build digital platforms that are reliable, scalable and made for long-term use.",
  [
   ("Platforms built to perform",
    "Your website should do more than exist. It should support how your business is understood, engaged with and converted. I design and build websites and applications that combine structure, usability and performance, with a consistent, intuitive experience across desktop, tablet and mobile."),
   ("From brochure sites to platforms",
    "The work spans brochure websites, complex e-commerce and custom web applications, choosing the most appropriate technology for each business. Design, development and user experience run as a single process, so visual identity, functionality and performance stay aligned, with custom integrations connecting to your existing tools where needed."),
  ]),
 ("Content Production", "content-production",
  "Photography, video, copywriting and motion that support your broader strategy.",
  [
   ("Content built to perform",
    "Content should communicate clearly, reflect your brand and support how your business is chosen, not just fill space. I produce photography, video, copywriting and new media with a clear purpose, applied consistently across every digital and physical touchpoint."),
   ("Cohesive narratives",
    "Grounded in your audience, your message and the context where content is experienced, visual and written work are made to operate together, from campaign content and social assets to website imagery, film and long-form writing. Adaptable, scalable, and built for ongoing use."),
  ]),
]

HERO_ROTATOR = [
 "Brand Identity for Professional Services",
 "Digital Experiences for Civil & Public",
 "Brand Identity for Hospitality",
 "Brand Identity for Consumers",
 "Digital Experiences for Aviation",
 "Brand Identity for the Food Industry",
]

def e(s): return html.escape(s, quote=True)

KD_MARK = """<svg class="kd-mark" viewBox="0 0 18.62 11.73" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon fill="#0339f8" points="18.62 0 12 0 6 5.86 12 11.73 18.62 11.73 12.62 5.86 18.62 0"/><polygon class="kd-mark-ink" points="0 0 0 11.72 6 5.86 0 0"/></svg>"""

def head(title, depth=0, desc="", path="", og_image=None, noindex=False):
    p = "../" * depth
    url = f"{SITE_URL}/{path}" if path else f"{SITE_URL}/"
    ogimg = og_image or f"{SITE_URL}/assets/site/og.png"
    d = desc or "Kieran Duffy, brand and digital designer in Dublin. Identity systems, digital experiences and campaigns built to perform."
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(title)}</title>
<meta name="description" content="{e(d)}">
<link rel="canonical" href="{url}">{'<meta name="robots" content="noindex, nofollow">' if noindex else ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kieran Duffy">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(d)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{ogimg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:image" content="{ogimg}">
<script>(function(){{var t;try{{t=localStorage.getItem('kd-theme')}}catch(err){{}}document.documentElement.setAttribute('data-theme', t==='dark'?'dark':'light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{p}css/style.css">
<link rel="icon" type="image/svg+xml" href="{p}assets/site/brand/kd-icon-dark.svg">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
"""

def nav(depth=0, active=""):
    p = "../" * depth
    def cls(k): return ' class="active"' if k == active else ""
    return f"""
<header class="pill-nav" id="pillNav">
  <a class="pill-logo" href="{p}index.html" aria-label="Kieran Duffy home">{KD_MARK}</a>
  <nav class="pill-links" id="siteNav">
    <a class="menu-logo" href="{p}index.html" aria-label="Home">{KD_MARK}</a>
    <a href="{p}work.html"{cls('work')}>Work</a>
    <a href="{p}playground.html"{cls('playground')}>Playground</a>
    <a href="{p}services.html"{cls('services')}>Services</a>
    <a href="{p}about.html"{cls('about')}>About</a>
    <a href="{p}contact.html" class="mobile-only{' active' if active == 'contact' else ''}">Contact</a>
  </nav>
  <a class="pill-cta{' active' if active == 'contact' else ''}" href="{p}contact.html">Contact</a>
  <button class="theme-toggle" id="themeToggle" aria-label="Switch between light and dark mode">
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
  </button>
  <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
</header>
"""

def footer(depth=0):
    p = "../" * depth
    return f"""
<footer class="site-foot">
  <div class="foot-cta reveal">
    <p class="foot-kicker">Next project?</p>
    <h2 class="foot-title">Let&rsquo;s make your brand<br><em>work harder.</em></h2>
    <a class="btn" href="{p}contact.html">Get in touch</a>
  </div>
  <div class="foot-grid">
    <div class="foot-col">
      <span class="foot-mark">KD&reg;</span>
      <p>Brand &amp; digital design<br>Dublin, Ireland</p>
    </div>
    <div class="foot-col">
      <a href="{p}about.html">About</a>
      <a href="{p}services.html">Services</a>
      <a href="{p}work.html">Work</a>
      <a href="{p}playground.html">Playground</a>
      <a href="{p}contact.html">Contact</a>
    </div>
    <div class="foot-col">
      <a href="mailto:{EMAIL}">{EMAIL}</a>
      <p>&copy; 2026 Kieran Duffy &middot; Last updated {LAST_UPDATED}</p>
    </div>
  </div>
</footer>
<script src="{p}js/main.js"></script>
</body>
</html>
"""

def q(path):
    return urllib.parse.quote(path, safe="/")

def dedupe_images(files):
    """Collapse WordPress size variants (foo-1024x683.jpg, foo-scaled.jpg) to one best file each."""
    best = {}
    for f in files:
        stem, _ = os.path.splitext(os.path.basename(f))
        key = re.sub(r"-scaled$", "", re.sub(r"-\d+x\d+$", "", stem)).lower()
        if key not in best or os.path.getsize(f) > os.path.getsize(best[key]):
            best[key] = f
    return sorted(best.values(), key=os.path.getsize, reverse=True)

VIDEO_CAP = 30 * 1024 * 1024  # skip anything heavier than 30MB for inline playback

def project_assets(slug):
    """Return (images sorted best-first, usable videos) from assets/scraped/<slug>/."""
    sdir = os.path.join(ROOT, "assets", "scraped", slug)
    imgs, vids = [], []
    if os.path.isdir(sdir):
        for f in sorted(os.listdir(sdir)):
            path = os.path.join(sdir, f)
            low = f.lower()
            if low.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
                imgs.append(path)
            elif low.endswith((".mp4", ".webm")):
                vids.append(path)
    imgs = dedupe_images(imgs)
    def vscore(v):
        n = os.path.basename(v).lower()
        named = 0 if any(k in n for k in ("header", "hero", "banner", "home")) else 1
        return (named, -os.path.getsize(v))
    usable = sorted((v for v in vids if 0 < os.path.getsize(v) <= VIDEO_CAP), key=vscore)
    return imgs, usable

def user_file(slug, name):
    p = os.path.join(ROOT, "assets", "projects", slug, name)
    return p if os.path.exists(p) and os.path.getsize(p) > 0 else None

def rel(path, depth):
    return "../" * depth + q(os.path.relpath(path, ROOT))

VIDEO_EXTS = (".mp4", ".webm", ".mov")

def local_asset(slug, url):
    """Map a cdg.ie media URL from the layout to its downloaded file (case-insensitive, ext-tolerant)."""
    d = os.path.join(ROOT, "assets", "scraped", slug)
    if not os.path.isdir(d):
        return None
    name = os.path.basename(urllib.parse.unquote(url).split("?")[0])
    files = os.listdir(d)
    for f in files:
        if f == name:
            return os.path.join(d, f)
    low = name.lower()
    for f in files:
        if f.lower() == low:
            return os.path.join(d, f)
    stem = os.path.splitext(low)[0]
    cands = [f for f in files if os.path.splitext(f.lower())[0] == stem]
    if cands:
        cands.sort(key=lambda f: os.path.getsize(os.path.join(d, f)), reverse=True)
        return os.path.join(d, cands[0])
    return None

def layout_media(slug):
    """Ordered media rows from the CDG layout: list of lists of (kind, localpath, poster)."""
    rows = []
    for b in LAYOUTS.get(slug, []):
        if b["t"] != "media":
            continue
        row = []
        for it in b["items"]:
            p = local_asset(slug, it["url"])
            if p:
                kind = "video" if p.lower().endswith(VIDEO_EXTS) else "image"
                row.append((kind, p, local_asset(slug, it["poster"]) if it.get("poster") else None))
        if row:
            rows.append(row)
    return rows

def layout_first_image(slug):
    rows = layout_media(slug)
    if rows and rows[0] and rows[0][0][0] == "video" and rows[0][0][2]:
        return rows[0][0][2]  # hero poster is the intended share image

    for row in layout_media(slug):
        for kind, p, _po in row:
            if kind == "image":
                return p
    return None

def media_item(name, depth, kind, path, poster=None):
    if kind == "video":
        pa = f' poster="{rel(poster, depth)}"' if poster else ""
        return f"""<figure class="m-item">
  <video autoplay muted loop playsinline preload="metadata"{pa} src="{rel(path, depth)}"></video>
</figure>"""
    return f"""<figure class="m-item">
  <img src="{rel(path, depth)}" alt="{e(name)} project imagery" loading="lazy">
</figure>"""

def media_row(name, depth, row, hero=False):
    n = min(len(row), 3)
    items = "\n".join(media_item(name, depth, k, p, po) for k, p, po in row)
    return f'<div class="media-row cols-{n}{" media-hero" if hero else ""}">\n{items}\n</div>'

def media(name, depth, src=None, video=None, poster=None, tall=False, note=""):
    """Media slot: video > image > styled placeholder."""
    cls = "media media-tall" if tall else "media"
    initial = e(name[0].upper())
    if video:
        poster_attr = f' poster="{rel(poster, depth)}"' if poster else ""
        return f"""<figure class="{cls}" data-initial="{initial}">
  <video autoplay muted loop playsinline preload="metadata"{poster_attr}>
    <source src="{rel(video, depth)}" type="video/mp4">
  </video>
</figure>"""
    if src:
        return f"""<figure class="{cls}" data-initial="{initial}">
  <img src="{rel(src, depth)}" alt="{e(name)} project imagery" loading="lazy"
       onerror="this.parentNode.classList.add('ph');this.remove()">
</figure>"""
    return f"""<figure class="{cls} ph" data-initial="{initial}">
  <figcaption class="ph-note">Drop imagery into <code>{e(note)}</code></figcaption>
</figure>"""

MOSAIC_CYCLE = ["sz-s", "sz-l", "sz-t", "sz-t", "sz-t", "sz-l", "sz-s", "sz-t", "sz-t", "sz-t"]

# card thumbnails that should differ from the case-study hero
CARD_MEDIA = {
    # Quinn IT: cards and slides carry their own title, so they use the no-logo cut
    "quinnit": ("assets/scraped/quinnit/qi-3dlayers.mp4", "assets/scraped/quinnit/qi-3dlayers-card.jpg"),
}

def project_card(pr, depth=0, num=None, size=""):
    p = "../" * depth
    tags = " ".join(f"<span>{e(t)}</span>" for t in pr["tags"][:3])
    n = f'<span class="card-num">{num:02d}</span>' if num else ""
    initial = e(pr["name"][0].upper())
    thumb = user_file(pr["slug"], "hero.jpg") or layout_first_image(pr["slug"])
    if not thumb:
        imgs, _ = project_assets(pr["slug"])
        thumb = imgs[0] if imgs else None
    vid = layout_first_video(pr["slug"])
    if pr["slug"] in CARD_MEDIA:
        cv, cp = (os.path.join(ROOT, x) for x in CARD_MEDIA[pr["slug"]])
        if os.path.exists(cv): vid = cv
        if os.path.exists(cp): thumb = cp
    if vid:
        poster = f' poster="{rel(thumb, depth)}"' if thumb else ""
        media_inner = f'<video class="card-vid" muted loop playsinline preload="none"{poster} data-src="{rel(vid, depth)}"></video>'
        ph = ""
    elif thumb:
        media_inner = f"""<img src="{rel(thumb, depth)}" alt="" loading="lazy"
         onerror="this.parentNode.classList.add('ph');this.remove()">"""
        ph = ""
    else:
        media_inner = ""
        ph = " ph"
    return f"""<a class="proj-card reveal{' ' + size if size else ''}" href="{p}projects/{pr['slug']}.html" data-industry="{e(pr['industry'])}">
  <figure class="card-media{ph}" data-initial="{initial}">
    {media_inner}
    <div class="card-tags">{tags}</div>
  </figure>
  <h3 class="card-client">{e(pr['name'])}</h3>
  <p class="card-tagline">{e(pr['tagline'])}</p>
</a>"""

# ---------------- HOME ----------------
# explicit homepage slide videos (site/sliders are Kieran's custom cuts)
HOME_SLIDE_VIDEOS = {
    "whatsexposed": "assets/scraped/whatsexposed/we-hero.mp4",
    "mistara": "assets/site/sliders/mistara-slider.mp4",
    "liffey-meats": "assets/site/sliders/liffey-slider.mp4",
    "celsius": "assets/site/sliders/celsius-slider.mp4",
    "mjflood": "assets/scraped/mjflood/Mjflood-M.mp4",
    "asl": "assets/scraped/asl/ASL-2.mp4",
    # Quinn IT: the project page hero carries the logo lockup; the homepage slider
    # overlays its own title, so it uses the clean no-logo cut of the same film.
    "quinnit": "assets/scraped/quinnit/qi-3dlayers.mp4",
}

def layout_first_video(slug):
    for row in layout_media(slug):
        for kind, p, _po in row:
            if kind == "video":
                return p
    return None

def hero_slide_media(slug, depth=0, first=False):
    """Video-first feature media; explicit slide cuts win, then the project's feature video.

    Only the opening slide ships a real src. iOS caps how many media elements a page
    may hold open and silently refuses the rest, so the other slides carry data-src
    and are attached by the slider as they come round.
    """
    path = None
    if slug in HOME_SLIDE_VIDEOS:
        cand = os.path.join(ROOT, HOME_SLIDE_VIDEOS[slug])
        if os.path.exists(cand):
            path = cand
    path = path or layout_first_video(slug)
    poster = layout_first_image(slug)
    if slug in CARD_MEDIA:                      # homepage slots use the no-logo cut and its still
        cv, cp = (os.path.join(ROOT, x) for x in CARD_MEDIA[slug])
        if os.path.exists(cp): poster = cp
    if path:
        pa = f' poster="{rel(poster, depth)}"' if poster else ""
        attr = f'src="{rel(path, depth)}"' if first else f'data-src="{rel(path, depth)}"'
        pre = "metadata" if first else "none"
        return f'<video muted loop playsinline preload="{pre}"{pa} {attr}></video>'
    img = layout_first_image(slug)
    return f'<img src="{rel(img, depth)}" alt="" loading="lazy">' if img else ""

SLIDE_STATEMENTS = {
    "whatsexposed": "Brand Identity for Cybersecurity",
    "mistara": "Brand Identity for Consumers",
    "mjflood": "Brand Identity for Professional Services",
    "asl": "Digital Experiences for Aviation",
    "celsius": "Digital Campaigns for Consumers",
    "engineers-ireland": "Digital Experiences for Civil & Public",
    "liffey-meats": "Brand Identity for the Food Industry",
    "quinnit": "Brand Identity for Technology",
}

def build_home():
    feats = [p for s in FEATURED for p in LIVE_PROJECTS if p["slug"] == s]
    slides = []
    for i, p in enumerate(feats):
        statement = SLIDE_STATEMENTS.get(p["slug"], p["tagline"])
        slides.append(f"""<a class="slide{' active' if i == 0 else ''}" href="projects/{p['slug']}.html" data-slide="{i}">
      <div class="slide-media">{hero_slide_media(p['slug'], first=(i == 0))}</div>
      <div class="slide-scrim"></div>
      <div class="slide-statement">
        <span class="st-lead">I design</span>
        <span class="st-line">{e(statement)}</span>
      </div>
      <div class="slide-copy">
        <h2 class="slide-name">{e(p['name'])}</h2>
        <p class="slide-tagline">{e(p['tagline'])}</p>
      </div>
    </a>""")
    dots = "".join(f'<button class="dot{" active" if i == 0 else ""}" data-goto="{i}" aria-label="Slide {i+1}"></button>' for i in range(len(feats)))
    cards = "\n".join(project_card(p, 0, size=MOSAIC_CYCLE[i % len(MOSAIC_CYCLE)]) for i, p in enumerate(feats))
    pg_strip = "\n    ".join(
        '<a class="pg-tile reveal" href="%s"%s><span class="pgt-media">'
        '<video muted loop playsinline preload="none" poster="lab/previews/%s.jpg" '
        'data-src="lab/previews/%s.mp4"></video></span>'
        '<span class="pgt-name">%s</span><span class="pgt-tag">%s</span></a>'
        % (x.get("url", "lab/%s/index.html" % x["slug"]),
           ' target="_blank" rel="noopener"' if x.get("external") else "",
           x["slug"], x["slug"], e(x["title"]), e(x["tags"][0]))
        for x in EXPERIMENTS[:4])
    logo_dir = os.path.join(ROOT, "assets", "site", "logos")
    logos = sorted(f for f in os.listdir(logo_dir) if f.endswith(".svg")) if os.path.isdir(logo_dir) else []
    marq = "".join(
        f'<span class="logo"><img src="assets/site/logos/{q(f)}" alt="Client logo" loading="lazy"></span>'
        for f in logos)
    svc = "\n".join(
        f'<a class="svc-row reveal" href="services.html#{sid}"><span class="svc-num">{i+1:02d}</span><h3>{e(name)}</h3><span class="svc-arrow">&rarr;</span></a>'
        for i, (name, sid, _, _) in enumerate(SERVICES))
    preloader = """
<div id="preloader" aria-hidden="true">
  <div class="pre-mark">
    <svg viewBox="0 0 18.62 11.73" xmlns="http://www.w3.org/2000/svg">
      <polygon class="pre-blue" fill="#0339f8" points="18.62 0 12 0 6 5.86 12 11.73 18.62 11.73 12.62 5.86 18.62 0"/>
      <polygon class="pre-ink" points="0 0 0 11.72 6 5.86 0 0"/>
    </svg>
  </div>
</div>
"""
    body = preloader + f"""
<main>
<section class="hero hero-slider" id="heroSlider">
  <div class="slides">
    {''.join(slides)}
  </div>
  <div class="slider-ui">
    <div class="dots">{dots}</div>
    <div class="arrows">
      <button class="arrow" id="slidePrev" aria-label="Previous project">&larr;</button>
      <button class="arrow" id="slideNext" aria-label="Next project">&rarr;</button>
    </div>
  </div>
</section>

<div class="marquee logo-marquee" aria-hidden="true"><div class="marquee-track">{marq}{marq}</div></div>

<section class="statement" id="statement">
  <h2 class="reveal">Brands. Built<br>to <em>perform.</em></h2>
  <p class="reveal">Most designers improve how you look. I improve how your business works: clearer communication, more efficient operations, and stronger trust with your audience, through brand identity, digital experience and design systems that do real work.</p>
</section>

<section class="showreel">
  <div class="sec-head reveal"><h2>In <em>motion</em></h2></div>
  <div class="reel-frame reveal">
    <iframe src="https://www.youtube-nocookie.com/embed/Ghs9NiJKnKU?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1"
            title="Kieran Duffy showreel" loading="lazy" allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  </div>
</section>

<section class="home-projects">
  <div class="sec-head reveal"><h2>Selected <em>Work</em></h2><a class="btn ghost" href="work.html">All {len(LIVE_PROJECTS)} projects</a></div>
  <div class="proj-grid mosaic" id="scrubGrid">{cards}</div>
</section>

<section class="playground" id="playground">
  <div class="sec-head reveal"><h2>Playground</h2><a class="btn ghost" href="playground.html">Enter the lab</a></div>
  <p class="pg-lede reveal">Where I test ideas with no client attached: motion studies, interaction experiments and small tools. {len(EXPERIMENTS) + len(TOOLS)} live pieces, all built from scratch.</p>
  <div class="pg-strip">
    {pg_strip}
  </div>
</section>

<section class="understanding">
  <h2 class="reveal">Understanding<br>changes <em>everything.</em></h2>
  <p class="reveal">The difference between being noticed and being chosen is how clearly you are understood.</p>
  <div class="under-links">
    <a class="under-card reveal" href="about.html"><span class="mono">About</span><p>Design thinking and digital innovation, fifteen years of it.</p><i>&rarr;</i></a>
    <a class="under-card reveal" href="work.html"><span class="mono">Work</span><p>{len(LIVE_PROJECTS)} projects across four continents.</p><i>&rarr;</i></a>
    <a class="under-card reveal" href="about.html#responsible"><span class="mono">Responsible design</span><p>Low-carbon platforms. Efficiency without compromise.</p><i>&rarr;</i></a>
  </div>
</section>

<section class="home-services">
  <div class="sec-head reveal"><h2>Services</h2></div>
  {svc}
</section>
</main>
"""
    return head("Kieran Duffy | Brand & Digital Designer, Dublin", path="") + nav(0, "home") + body + footer(0)

# ---------------- ABOUT ----------------
def build_about():
    body = f"""
<main class="page">
<section class="page-hero">
  <p class="hero-kicker mono">About</p>
  <h1 class="page-title">Intelligent digital experiences,<br>designed to <em>perform.</em></h1>
</section>

<section class="about-me" id="aboutMe">
  <div class="am-copy">
    <p class="am-lede reveal">I&rsquo;m Kieran. I make businesses clearer,<br>more consistent, and easier to choose.</p>
    <div class="am-facts reveal">
      <span>Dublin, Ireland</span>
      <span>15 years in brand &amp; digital</span>
      <span>Strategy to shipped</span>
    </div>
  </div>
  <div class="portrait-stage" id="portraitStage" aria-hidden="false">
    <div class="portrait-clip" id="portraitClip">
      <img src="assets/site/portrait.jpg" alt="Portrait of Kieran Duffy"
           onerror="this.closest('.portrait-stage').classList.add('ph');this.remove()">
      <div class="portrait-tint"></div>
    </div>
  </div>
</section>

<section class="prose-block">
  <h2 class="reveal">Design solutions<br>with purpose</h2>
  <div class="prose reveal">
    <p>I&rsquo;m Kieran Duffy, a creative director and designer based in Dublin. Over 15 years of practice I&rsquo;ve worked across a wide range of market sectors, which has given me a deep understanding of how different businesses operate and grow. I&rsquo;ve helped organisations from the world&rsquo;s largest cargo airline to Ireland&rsquo;s largest indigenous print management company improve their brand equity, positioning and performance.</p>
    <p>My work makes businesses clearer, more consistent, and easier for their customers to relate to, so each company&rsquo;s uniqueness stands out and builds stronger connections with its audience. I combine research, design thinking and hands-on making: strategy, design and technology brought together into practical solutions that improve how a business is perceived at every touchpoint.</p>
    <p>I take the time to understand how people interact with a business, where confusion exists, and what can be improved. That lets me design experiences that are practical, intuitive, and aligned with real business goals. The result is simple: clearer communication, better user experiences, and stronger performance overall.</p>
  </div>
  <a class="btn reveal" href="contact.html">Start a project</a>
</section>

<section class="stats">
  <div class="stat reveal"><span class="stat-big">15</span><p>years of design practice across brand and digital</p></div>
  <div class="stat reveal"><span class="stat-big">4</span><p>continents of clients, from Dublin to Boston to Courchevel</p></div>
  <div class="stat reveal"><span class="stat-big">{len(LIVE_PROJECTS)}</span><p>selected case studies in this portfolio, and counting</p></div>
</section>

<section class="prose-block" id="responsible">
  <h2 class="reveal">Low-carbon websites.<br><em>Efficiency without compromise.</em></h2>
  <div class="prose reveal">
    <p>I design and build low-carbon websites that prioritise efficiency without compromising quality. By optimising code, simplifying design systems and choosing energy-efficient hosting, the platforms I make are faster, more stable and more resource-efficient.</p>
    <p>This reduces environmental impact while improving the numbers that matter: load speed, usability, search visibility. Sustainability becomes a practical advantage: better user experiences, more effective platforms, and solutions resilient enough to perform long-term in a changing digital environment.</p>
  </div>
</section>

<section class="prose-block">
  <h2 class="reveal">How I <em>work</em></h2>
  <div class="prose reveal">
    <p>Every engagement starts with understanding: your market, your audience, and how value actually moves through your business. Strategy comes before style: positioning and structure first, then identity, then the digital platforms and content that carry it into the world.</p>
    <p>I work directly with founders, marketing teams and boards, and I stay hands-on from the first workshop to the final deployment. When a project needs specialist depth in development, film or photography, I direct trusted collaborators while keeping one design vision across everything.</p>
    <p>Accessibility is part of the craft, not an afterthought. This site, like my client work, is built WCAG-minded: keyboard navigable, respectful of reduced-motion preferences, readable in light and dark. The same Universal Design thinking earned award recognition on projects like Monaghan Institute and ASL.</p>
  </div>
</section>
</main>
"""
    return head("About | Kieran Duffy", path="about.html") + nav(0, "about") + body + footer(0)

# ---------------- SERVICES ----------------
def build_services():
    blocks = []
    for i, (name, sid, lede, sections) in enumerate(SERVICES):
        secs = "".join(f"<h3>{e(h)}</h3><p>{e(t)}</p>" for h, t in sections)
        blocks.append(f"""
<section class="svc-block" id="{sid}">
  <div class="svc-block-head reveal">
    <span class="svc-num">{i+1:02d}</span>
    <h2>{e(name)}</h2>
    <p class="svc-lede">{e(lede)}</p>
  </div>
  <div class="prose reveal">{secs}</div>
</section>""")
    body = f"""
<main class="page">
<section class="page-hero">
  <p class="hero-kicker mono">Services</p>
  <h1 class="page-title">Strategy and creativity,<br>solving <em>complexity.</em></h1>
</section>
{''.join(blocks)}
</main>
"""
    return head("Services | Kieran Duffy", path="services.html") + nav(0, "services") + body + footer(0)

# ---------------- WORK ----------------
def build_work():
    inds = sorted({p["industry"] for p in PROJECTS})
    chips = '<button class="chip active" data-filter="all">All</button>' + "".join(
        f'<button class="chip" data-filter="{e(i)}">{e(i)}</button>' for i in inds)
    flags = [p for s2 in FLAGSHIP for p in LIVE_PROJECTS if p["slug"] == s2]
    rest = [p for p in LIVE_PROJECTS if p["slug"] not in FLAGSHIP]
    cards = "\n".join(project_card(p, 0, size=MOSAIC_CYCLE[i % len(MOSAIC_CYCLE)]) for i, p in enumerate(flags))
    archive = "\n".join(project_card(p, 0, size="sz-a") for p in rest)
    body = f"""
<main class="page">
<section class="page-hero">
  <p class="hero-kicker mono">Work</p>
  <h1 class="page-title">Built for impact.<br>Designed to <em>last.</em></h1>
  <p class="hero-sub">I&rsquo;ve partnered with respected organisations in Ireland and internationally, and the work I&rsquo;m proudest of continues to perform years after delivery.</p>
</section>
<div class="filter-bar reveal"><span class="mono filter-label">Filter&nbsp;/</span>{chips}<span class="mono" id="projCount">{len(LIVE_PROJECTS)} projects</span></div>
<section class="work-featured">
  <h2 class="work-sub reveal">Featured case studies</h2>
  <div class="proj-grid mosaic" id="workGrid">{cards}</div>
</section>
<section class="work-archive">
  <h2 class="work-sub reveal">Archive</h2>
  <p class="archive-lede reveal">The wider body of work: {len(rest)} more projects across brand, digital and campaigns.</p>
  <div class="proj-grid archive-grid" id="archiveGrid">{archive}</div>
</section>
</main>
"""
    return head("Work | Kieran Duffy", path="work.html") + nav(0, "work") + body + footer(0)

# ---------------- CONTACT ----------------
def build_contact():
    body = f"""
<main class="page">
<section class="page-hero">
  <p class="hero-kicker mono">Contact</p>
  <h1 class="page-title">Let&rsquo;s start<br>your <em>journey.</em></h1>
  <p class="hero-sub">Have a brand that needs to work harder? A platform that needs rebuilding? Tell me about it.</p>
</section>
<section class="contact-grid">
  <div class="contact-card reveal">
    <span class="mono">Work with me</span>
    <a class="contact-big" href="mailto:{EMAIL}">{EMAIL}</a>
    <p>New projects, collaborations and consulting.</p>
  </div>
  <div class="contact-card reveal">
    <span class="mono">Studio</span>
    <p class="contact-big">Dublin,<br>Ireland</p>
    <p>Working with clients across Ireland, the UK, Europe and the US.</p>
  </div>
</section>
</main>
"""
    return head("Contact | Kieran Duffy", path="contact.html") + nav(0, "contact") + body + footer(0)

# ---------------- PROJECT PAGES ----------------
# ---------------- flagship deep-dives ----------------
def render_exhibit(ex):
    accent = ex.get("accent", "#0339f8")
    if ex["type"] == "architecture":
        kids = "".join(
            f'<div class="ex-node"><strong>{e(n)}</strong><span>{e(d)}</span></div>'
            for n, d in ex["children"])
        body = f"""<div class="ex-arch">
      <div class="ex-node ex-parent"><strong>{e(ex['parent'])}</strong><span>{e(ex['parent_note'])}</span></div>
      <div class="ex-stem"></div>
      <div class="ex-children">{kids}</div>
    </div>"""
    elif ex["type"] == "platform":
        tgts = "".join(
            f'<div class="ex-node"><strong>{e(n)}</strong><span>{e(d)}</span></div>'
            for n, d in ex["targets"])
        body = f"""<div class="ex-flow">
      <div class="ex-node ex-src"><strong>{e(ex['source'][0])}</strong><span>{e(ex['source'][1])}</span></div>
      <div class="ex-arrow" aria-hidden="true">&rarr;</div>
      <div class="ex-node ex-hub"><strong>{e(ex['hub'][0])}</strong><span>{e(ex['hub'][1])}</span></div>
      <div class="ex-arrow" aria-hidden="true">&rarr;</div>
      <div class="ex-targets">{tgts}</div>
    </div>"""
    elif ex["type"] == "system":
        sw = "".join(
            f'<div class="tok-swatch"><i style="background:{c}"></i><strong>{e(n)}</strong><span>{c}</span></div>'
            for n, c in ex["colors"])
        ts = "".join(
            f'<div class="tok-type" style="font-weight:{w}"><span class="tt-label">{e(n)}</span><span class="tt-sample" style="font-size:{int(sz.split("/")[0])//2 + 8}px">Chartered for the future</span><span class="tt-spec">{sz} &middot; {w}</span></div>'
            for n, sz, w in ex["type_scale"])
        sp = "".join(f'<div class="tok-space"><i style="width:{v}px"></i><span>{v}</span></div>' for v in ex["spacing"])
        body = f"""<div class="ex-system">
      <div class="ex-sys-block"><h4>Colour tokens</h4><div class="tok-swatches">{sw}</div></div>
      <div class="ex-sys-block"><h4>Type scale</h4><div class="tok-types">{ts}</div></div>
      <div class="ex-sys-block"><h4>Spacing</h4><div class="tok-spaces">{sp}</div></div>
      <div class="ex-sys-block"><h4>Components &amp; states</h4>
        <div class="tok-components">
          <div class="comp-row">
            <button class="c-btn" type="button">Become a member</button>
            <button class="c-btn c-ghost" type="button">Find a course</button>
            <button class="c-btn" type="button" disabled>Renew (disabled)</button>
          </div>
          <div class="comp-row comp-inputs">
            <label class="c-field"><span>Membership number</span><input type="text" placeholder="EI-000000" readonly></label>
            <label class="c-field c-focus"><span>Email</span><input type="text" value="you@engineersireland.ie" readonly></label>
            <label class="c-field c-error"><span>Password</span><input type="text" value="&bull;&bull;&bull;" readonly><em>Required field</em></label>
          </div>
          <div class="comp-card"><span class="cc-tag">CPD</span><strong>Structural design refresher</strong><span class="cc-meta">Online &middot; 2 hours &middot; 12 credits</span></div>
        </div>
      </div>
    </div>"""
    else:  # brandworld
        sw = "".join(
            f'<div class="tok-swatch"><i style="background:{c}"></i><strong>{e(n)}</strong><span>{c}</span></div>'
            for n, c in ex["swatches"])
        pr = "".join(
            f'<div class="ex-node"><strong>{e(n)}</strong><span>{e(d)}</span></div>'
            for n, d in ex["principles"])
        body = f"""<div class="ex-system">
      <div class="ex-sys-block"><h4>Palette</h4><div class="tok-swatches">{sw}</div></div>
      <div class="ex-sys-block"><h4>Principles</h4><div class="ex-children ex-principles">{pr}</div></div>
    </div>"""
    return f"""<section class="cs-exhibit reveal" style="--ex:{accent}">
  <h2>{e(ex['title'])}</h2>
  <p class="ex-note">{e(ex['note'])}</p>
  {body}
</section>"""

def render_deep(slug):
    d = DEEP.get(slug)
    if not d:
        return ""
    phases = "".join(
        f'<li><span class="ph-num">{i+1:02d}</span><strong>{e(n)}</strong><p>{e(t)}</p></li>'
        for i, (n, t) in enumerate(d["phases"]))
    decisions = "".join(
        f'<div class="dec-card reveal"><span class="dec-num">{i+1:02d}</span><h3>{e(t)}</h3><p>{e(b)}</p></div>'
        for i, (t, b) in enumerate(d["decisions"]))
    return f"""
<section class="cs-deep-head reveal"><h2>Process notes</h2><p>How the work actually happened: the phases it moved through and the decisions that shaped it.</p></section>
<section class="cs-phases reveal"><ol>{phases}</ol></section>
<section class="cs-decisions">
  <h2 class="dec-title reveal">Three decisions that shaped it</h2>
  <div class="dec-grid">{decisions}</div>
</section>
{render_exhibit(d['exhibit'])}
"""

def text_section(sec):
    h, paras = sec
    ps = "".join(f"<p>{e(p)}</p>" for p in paras)
    return f'<section class="cs-section reveal"><h2>{e(h)}</h2>{ps}</section>'

def build_project(pr, idx):
    d = 1
    slug = pr["slug"]
    tags = "".join(f"<span>{e(t)}</span>" for t in pr["tags"])
    blocks = LAYOUTS.get(slug, [])
    rows = layout_media(slug)  # ordered media rows, aligned with 'media' blocks

    # feature the project's video first (like CDG): if the first video sits
    # deeper in the layout, promote it to the hero and drop it from its row
    first_vid = None
    for ri, row in enumerate(rows):
        for ii, (kind, path, po) in enumerate(row):
            if kind == "video":
                first_vid = (ri, ii, path, po)
                break
        if first_vid:
            break
    if first_vid and not (first_vid[0] == 0 and first_vid[1] == 0):
        ri, ii, path, po = first_vid
        rows[ri] = [it for j, it in enumerate(rows[ri]) if j != ii]
        rows = [[("video", path, po)]] + [r for r in rows if r]

    # Follow the CDG page structure block-by-block:
    # first media block = feature/hero (same media as CDG), text blocks pull my copy in order.
    text_queue = list(pr["sections"])
    hero_html = ""
    body_parts = []
    intro_used = False
    row_i = 0
    for b in blocks:
        if b["t"] == "media":
            if row_i < len(rows):
                if not hero_html:
                    hero_html = media_row(pr["name"], d, rows[row_i], hero=True)
                else:
                    body_parts.append(media_row(pr["name"], d, rows[row_i]))
                row_i += 1
        else:
            if not intro_used:
                body_parts.append(f'<section class="cs-intro reveal"><p>{e(pr["intro"])}</p></section>')
                intro_used = True
            elif text_queue:
                body_parts.append(text_section(text_queue.pop(0)))
    # anything CDG's page didn't leave room for still gets shown
    if not intro_used:
        body_parts.insert(0, f'<section class="cs-intro reveal"><p>{e(pr["intro"])}</p></section>')
    for sec in text_queue:
        body_parts.append(text_section(sec))
    if not hero_html:
        imgs, vids = project_assets(slug)
        src = vids[0] if vids else (imgs[0] if imgs else None)
        if src:
            kind = "video" if src.lower().endswith(VIDEO_EXTS) else "image"
            hero_html = media_row(pr["name"], d, [(kind, src)], hero=True)
    sections_html = body_parts
    stats = ""
    if pr.get("stats"):
        cells = "".join(f'<div class="stat"><span class="stat-big">{e(a)}</span><p>{e(b)}</p></div>' for a, b in pr["stats"])
        stats = f'<section class="stats cs-stats">{cells}</section>'
    svcs = "".join(f"<li>{e(s)}</li>" for s in pr["services"])
    ring = LIVE_PROJECTS if not pr.get("draft") else LIVE_PROJECTS
    ri = ring.index(pr) if pr in ring else 0
    prev = ring[(ri - 1) % len(ring)]
    nxt = ring[(ri + 1) % len(ring)]
    body = f"""
<main class="page case-study">
<section class="cs-hero">
  <p class="hero-kicker mono"><a href="../work.html">Work</a><span class="k-year"> / {YEARS.get(slug, "")}</span></p>
  <h1 class="cs-client">{e(pr['name'])}</h1>
  <p class="cs-tagline">{e(pr['tagline'])}</p>
  <div class="cs-tags">{tags}</div>
</section>
{hero_html}
{''.join(sections_html)}
{render_deep(slug)}
{stats}
<aside class="cs-services reveal">
  <h2 class="mono">Services provided</h2>
  <ul>{svcs}</ul>
</aside>
<nav class="cs-pagenav">
  <a href="{prev['slug']}.html"><span class="mono">&larr; Previous</span><strong>{e(prev['name'])}</strong></a>
  <a class="right" href="{nxt['slug']}.html"><span class="mono">Next &rarr;</span><strong>{e(nxt['name'])}</strong></a>
</nav>
</main>
"""
    title = f"{pr['name']} | {pr['tagline']} | Kieran Duffy"
    ogi = layout_first_image(slug)
    og_abs = f"{SITE_URL}/{q(os.path.relpath(ogi, ROOT))}" if ogi else None
    return head(title, depth=1, desc=pr["intro"][:150], path=f"projects/{slug}.html", og_image=og_abs, noindex=pr.get("draft", False)) + nav(1, "work") + body + footer(1)

def build_playground():
    cards = []
    for x in EXPERIMENTS:
        tags = "".join(f"<span>{e(t)}</span>" for t in x["tags"])
        href = x.get("url", f"lab/{x['slug']}/index.html")
        ext = ' target="_blank" rel="noopener"' if x.get("external") else ""
        label = "Open project" if x.get("external") or x.get("url") else "Open experiment"
        cards.append(f"""<article class="lab-card reveal">
  <a class="lab-media" href="{href}"{ext} aria-label="Open {e(x['title'])}">
    <video muted loop playsinline preload="none" poster="lab/previews/{x['slug']}.jpg" data-src="lab/previews/{x['slug']}.mp4"></video>
    <span class="lab-open">{label} &rarr;</span>
  </a>
  <div class="lab-body">
    <div class="lab-head"><span class="lab-num">{x['num']}</span><div class="lab-tags">{tags}</div></div>
    <h3><a href="{href}"{ext}>{e(x['title'])}</a></h3>
    <p class="lab-tagline">{e(x['tagline'])}</p>
    <p class="lab-desc">{e(x['desc'])}</p>
  </div>
</article>""")
    tools = []
    for t in TOOLS:
        ttags = "".join(f"<span>{e(z)}</span>" for z in t["tags"])
        if t["preview"] == "video":
            prev = (f'<div class="pg-preview pg-preview-vid">'
                    f'<video muted loop playsinline preload="none" poster="lab/previews/{t["slug"]}.jpg" '
                    f'data-src="lab/previews/{t["slug"]}.mp4"></video></div>')
        elif t["preview"] == "3d":
            prev = '<div class="pg-preview pg-preview-3d">' + KD_MARK + '</div>'
        else:
            prev = '<div class="pg-preview pg-preview-mesh"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span></div>'
        tools.append(f"""<a class="pg-card reveal" href="{t['url']}" target="_blank" rel="noopener">
      {prev}
      <div class="pg-tags">{ttags}</div>
      <h3>{e(t['title'])}</h3>
      <p>{e(t['desc'])}</p>
      <span class="pg-cta">Open tool <i>&rarr;</i></span>
    </a>""")
    body = f"""
<main class="page" id="main">
<section class="page-hero">
  <p class="hero-kicker mono">Playground</p>
  <h1 class="page-title">A place to build things<br>nobody <em>asked for.</em></h1>
  <p class="hero-sub">Client work has constraints, and that is mostly a good thing. This is where they come off: motion studies, interaction experiments and small tools, built from scratch and running live in the browser.</p>
</section>

<section class="lab-intro reveal">
  <div class="li-stat"><strong>{len(EXPERIMENTS)}</strong><span>motion experiments</span></div>
  <div class="li-stat"><strong>{len(TOOLS)}</strong><span>tools in the wild</span></div>
  <div class="li-stat"><strong>0</strong><span>animation libraries used</span></div>
</section>

<section class="lab-grid-wrap">
  <h2 class="work-sub reveal">Motion experiments</h2>
  <p class="archive-lede reveal">Each one is a self-contained page with hand-written motion and no animation libraries. Previews play on hover, click to open the real thing.</p>
  <div class="lab-grid">{''.join(cards)}</div>
</section>

<section class="lab-grid-wrap">
  <h2 class="work-sub reveal">Tools</h2>
  <p class="archive-lede reveal">Small utilities I designed and built for myself and other designers. Free to use, open in your browser.</p>
  <div class="pg-grid">{''.join(tools)}</div>
</section>

<section class="lab-note reveal">
  <h2>Why bother?</h2>
  <p>Because the fastest way to understand an interaction is to build it. Everything here started as a question: what does scroll feel like moving sideways, what makes a hover feel physical, how much can a single shader carry. The answers end up back in client work, which is the real point.</p>
</section>
</main>
"""
    return head("Playground | Kieran Duffy", path="playground.html",
                desc="Motion experiments, interaction studies and small tools by Kieran Duffy. Built from scratch, live in the browser.") + nav(0, "playground") + body + footer(0)

def build_404():
    body = """
<main class="page nf-page" id="main">
<section class="page-hero nf-hero">
  <p class="hero-kicker mono">404</p>
  <h1 class="page-title">This page moved,<br>or never <em>shipped.</em></h1>
  <p class="hero-sub">The link you followed doesn&rsquo;t exist here. The work does, though.</p>
  <div class="nf-actions">
    <a class="btn" href="work.html">See the work</a>
    <a class="btn ghost" href="index.html">Go home</a>
  </div>
</section>
</main>
"""
    return head("Page not found | Kieran Duffy", path="404.html") + nav(0, "") + body + footer(0)

def build_sitemap():
    urls = ["", "about.html", "services.html", "work.html", "playground.html", "contact.html"] + [x.get("url", f"lab/{x['slug']}/index.html") for x in EXPERIMENTS if not str(x.get("url", "")).startswith("http")] + [f"projects/{p['slug']}.html" for p in LIVE_PROJECTS]
    today = _dt.date.today().isoformat()
    items = "".join(f"<url><loc>{SITE_URL}/{u}</loc><lastmod>{today}</lastmod></url>" for u in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{items}</urlset>'

def main():
    pages = {
        "index.html": build_home(),
        "about.html": build_about(),
        "services.html": build_services(),
        "work.html": build_work(),
        "contact.html": build_contact(),
        "playground.html": build_playground(),
        "404.html": build_404(),
    }
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(build_sitemap())
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n")
    for fn, content in pages.items():
        open(os.path.join(ROOT, fn), "w").write(content)
    os.makedirs(os.path.join(ROOT, "projects"), exist_ok=True)
    for i, pr in enumerate(PROJECTS):
        # drafts render to drafts/ so they are viewable locally but never picked up by a deploy of projects/
        outdir = "drafts" if pr.get("draft") else "projects"
        os.makedirs(os.path.join(ROOT, outdir), exist_ok=True)
        open(os.path.join(ROOT, outdir, pr["slug"] + ".html"), "w").write(build_project(pr, i))
        os.makedirs(os.path.join(ROOT, "assets", "projects", pr["slug"]), exist_ok=True)
    drafts = [p["slug"] for p in PROJECTS if p.get("draft")]
    print(f"Built {len(pages)} pages + {len(PROJECTS)} case studies" + (f" (drafts, not linked publicly: {', '.join(drafts)})" if drafts else "") + ".")

if __name__ == "__main__":
    main()
