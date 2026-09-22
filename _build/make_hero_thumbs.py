# -*- coding: utf-8 -*-
"""Hero tiles for the chevron homepage.

The hero builds the KD mark out of every project, then opens a ring of the
featured few, so it needs two sizes of each project still:

  assets/hero-thumbs-sm/<slug>.jpg   160px, the mark (dozens on screen at once)
  assets/hero-thumbs/<slug>.jpg      640px, the ring (a handful, shown large)

Run after adding a project:  python3 _build/make_hero_thumbs.py
"""
import os, sys, subprocess, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build as B
from PIL import Image

# A few projects lead with a still that makes a poor tile (a white sheet, a
# pale mockup). Pull a frame from their film instead, and say where to crop.
OVERRIDES = {
    "whatsexposed": {"video": "assets/scraped/whatsexposed/we-hero.mp4", "at": 1.8, "bias": 0.96},
    # its card still is a black frame, which leaves a hole in the mark
    "kcmg": {"image": "assets/scraped/kcmg/kcmg-external-office-shot.jpg"},
}

BIG, SMALL, AR = 640, 160, 4 / 3


def source_image(slug):
    """The still a project card would use, resolved to a file on disk."""
    if slug in OVERRIDES and "video" in OVERRIDES[slug]:
        o = OVERRIDES[slug]
        import imageio_ffmpeg
        out = os.path.join("/tmp", "hero-%s.jpg" % slug)
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-ss", str(o["at"]),
                        "-i", os.path.join(B.ROOT, o["video"]), "-frames:v", "1", out],
                       capture_output=True, check=True)
        return out
    if slug in OVERRIDES and "image" in OVERRIDES[slug]:
        return os.path.join(B.ROOT, OVERRIDES[slug]["image"])
    if slug in B.CARD_MEDIA:                      # the no-logo still, where one exists
        cand = os.path.join(B.ROOT, B.CARD_MEDIA[slug][1])
        if os.path.exists(cand):
            return cand
    return B.user_file(slug, "hero.jpg") or B.layout_first_image(slug)


def crop_to_ar(im, bias=0.5):
    """Centre crop to 4:3, or toward `bias` horizontally (1.0 = hard right)."""
    w, h = im.size
    if w / h > AR:
        nw = int(h * AR)
        x = int((w - nw) * bias)
        return im.crop((x, 0, x + nw, h))
    nh = int(w / AR)
    y = int((h - nh) * 0.5)
    return im.crop((0, y, w, y + nh))


def main():
    big_dir = os.path.join(B.ROOT, "assets", "hero-thumbs")
    small_dir = os.path.join(B.ROOT, "assets", "hero-thumbs-sm")
    for d in (big_dir, small_dir):
        os.makedirs(d, exist_ok=True)

    total_b = total_s = 0
    missing = []
    for p in B.PROJECTS:
        slug = p["slug"]
        src = source_image(slug)
        if not src or not os.path.exists(src):
            missing.append(slug)
            continue
        im = Image.open(urllib.parse.unquote(src)).convert("RGB")
        im = crop_to_ar(im, OVERRIDES.get(slug, {}).get("bias", 0.5))
        b = im.resize((BIG, int(BIG / AR)), Image.LANCZOS)
        s = im.resize((SMALL, int(SMALL / AR)), Image.LANCZOS)
        bp = os.path.join(big_dir, slug + ".jpg")
        sp = os.path.join(small_dir, slug + ".jpg")
        b.save(bp, quality=80, optimize=True, progressive=True)
        s.save(sp, quality=74, optimize=True, progressive=True)
        total_b += os.path.getsize(bp)
        total_s += os.path.getsize(sp)

    print("hero tiles: %d projects" % (len(B.PROJECTS) - len(missing)))
    print("  ring  %-22s %6.0f KB" % ("assets/hero-thumbs/", total_b / 1024))
    print("  mark  %-22s %6.0f KB" % ("assets/hero-thumbs-sm/", total_s / 1024))
    if missing:
        print("  no usable still for: %s" % ", ".join(missing))


if __name__ == "__main__":
    main()
