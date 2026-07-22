# Adding your project imagery

Every case study page has image slots that currently show styled black-and-blue
placeholders. To fill them, drop your own image files (JPG) into the matching
project folder using these exact filenames:

```
assets/projects/<project-slug>/hero.jpg   → large hero image (also used on the Work grid cards)
assets/projects/<project-slug>/01.jpg     → first inline image
assets/projects/<project-slug>/02.jpg     → second inline image
assets/projects/<project-slug>/03.jpg     → third inline image
```

The folders for all 35 projects already exist (e.g. `assets/projects/mistara/`).
As soon as a file with the right name is present, it appears automatically —
no code changes needed. Missing images simply keep the placeholder look.

Recommended sizes: hero.jpg ~2000×1000px, inline images ~1600×1200px,
exported at web quality (~200–400KB each) to keep the site fast.

## Rebuilding pages after editing copy

All page copy lives in `_build/content_projects_a.py`, `_build/content_projects_b.py`
and `_build/build.py` (home/about/services/contact). After editing, regenerate with:

```
python3 _build/build.py
```
