# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is
A static 360° virtual campus tour for **VIT Bhopal University**, intended to be linked from the official VIT Bhopal website. No build step, no framework, no package.json. Production: https://360-virtual-campur-tour.vercel.app (Vercel, deploys from `main`).

Because it represents the university officially: keep wording factual, keep the design restrained and professional, and do not add claims that cannot be verified. See `CONTEXT.md` for open questions.

## Run it
Serve the folder over HTTP (opening `index.html` via `file://` blocks panorama textures):
```
python -m http.server 8000     # then open http://localhost:8000
```
For headless screenshots from `file://`, Chrome needs `--allow-file-access-from-files`.

There are no tests or linters. Verify by: `node --check <file>.js`, confirming referenced files exist, and looking at the page in a browser (desktop and ~390 px wide).

## Layout
- `index.html`, `style.css`, `main.js` - landing page. `Credits.html` + `styles3.css` - credits.
- `tour-project/campus tour.html` - the tour: one inline script holds the Pannellum config for 70 scenes, then the chroma-key guide-video logic.
- `tour-project/script.js` - UI controls (sidebar, zoom, fullscreen, hold-to-look arrows) and neighbour-scene preloading. Loaded after the inline script; relies on globals `viewer` and `tourConfig`.
- `tour-project/scene-names.js` - **the only place scene/hotspot display names live.** `applySceneNames(tourConfig)` runs before the viewer is created.
- `tour-project/style1.css` - tour UI. `thumbs/` (sidebar/itinerary) and `showcase/` (landing page) are flat, undistorted renders made from the panoramas.
- `vr_tour/index.html` - split-screen VR. It has its **own copy** of the scene config and its **own stylesheet** `vr-style.css`. Changes to the tour config do not propagate here.

## Conventions and gotchas
- **Scene ids are file names** and contain odd spacing, e.g. `"ab2  3"` (two spaces), `"ab 2 gate 9"`. Never "tidy" them; `pfile(name)` appends `.jpg`.
- **The logo (`logo/Vit Bhopal Logo.png`) is white on transparent.** Always place it on a dark background; on white it is invisible.
- **Brand colours:** navy `#0b2a5b` / `#071c3f` (tour), `#050d1f` (landing background), gold `#f2a900`. Fonts: system stack in the tour; Outfit + Playfair Display on the landing page.
- **Touch devices:** do not put `backdrop-filter` over the live panorama, do not animate `box-shadow`, and keep hover effects inside pointer-capable contexts. These caused flicker on phones (see the "Touch devices" block at the end of `tour-project/style1.css`).
- Pannellum's own drag/touch/keyboard handling is used; do not re-add custom drag handlers.
- Do not touch the green-screen guide videos (`tour-project/videos/`) without checking the chroma key in `campus tour.html` (`g > max(r,b) + 20`), since re-encoding can break the keying.
- `Drone_Background/` and `Chancellor.png` are currently unused by any page.

## Media pipeline (ffmpeg is available)
Panoramas must be regenerated from the **original** files in git history (commit `4004e46`), never by recompressing the current ones:
```
ffmpeg -i original.jpg -q:v 4 -pix_fmt yuvj420p out.jpg
```
Flat renders from a panorama (yaw must be within -180..180):
```
ffmpeg -i pano.jpg -vf "v360=input=e:output=flat:h_fov=85:v_fov=55:yaw=0:pitch=-2:w=720:h=460:interp=cubic" -q:v 3 out.jpg
```

## Git
Work on branches; `main` auto-deploys to production. Do not merge to `main` without the owner's go-ahead.
