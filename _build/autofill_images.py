# -*- coding: utf-8 -*-
"""Auto-fill case-study image slots from scraped assets.

For each project, copies the four largest images (by file size, JPG/PNG/WebP)
from assets/scraped/<slug>/ into the slots the pages already look for:
    assets/projects/<slug>/hero.jpg, 01.jpg, 02.jpg, 03.jpg

Existing slot files are never overwritten, so anything you've placed by hand wins.
Run:  python3 _build/autofill_images.py
Undo a project by deleting the files in assets/projects/<slug>/.
"""
import os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRAPED = os.path.join(ROOT, "assets", "scraped")
SLOTS = ["hero.jpg", "01.jpg", "02.jpg", "03.jpg"]
EXTS = (".jpg", ".jpeg", ".png", ".webp")

if not os.path.isdir(SCRAPED):
    raise SystemExit("No assets/scraped directory found - run the scrape first.")

filled = skipped = 0
for slug in sorted(os.listdir(SCRAPED)):
    src_dir = os.path.join(SCRAPED, slug)
    if not os.path.isdir(src_dir):
        continue
    imgs = [os.path.join(src_dir, f) for f in os.listdir(src_dir) if f.lower().endswith(EXTS)]
    imgs.sort(key=os.path.getsize, reverse=True)
    dst_dir = os.path.join(ROOT, "assets", "projects", slug)
    os.makedirs(dst_dir, exist_ok=True)
    for slot, src in zip(SLOTS, imgs):
        dst = os.path.join(dst_dir, slot)
        if os.path.exists(dst):
            skipped += 1
            continue
        shutil.copy2(src, dst)
        filled += 1
    print(f"{slug}: {min(len(imgs), len(SLOTS))} slot(s) available, largest = {os.path.basename(imgs[0]) if imgs else '-'}")

print(f"\nFilled {filled} slots, left {skipped} existing files untouched.")
print("Note: slots are .jpg paths; browsers render PNG/WebP data fine regardless of the extension.")
