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
- `index.html`, `style.css`, `main.js` - landing page (light theme matching vitbhopal.ac.in; no frameworks, no Font Awesome). `Credits.html` + `styles3.css` - credits.
- `tour-project/scenes-data.js` - **single source of truth for scenes**: `pfile()`, `tourConfig` (70 scenes, hotspots), the arrival-direction calculation and a `preview` image per scene. Loaded by both the tour and VR mode.
- `tour-project/campus tour.html` - the tour page: reads `?scene=`, applies names, starts Pannellum (self-hosted in `vendor/pannellum/`), then the chroma-key guide-video logic.
- `tour-project/script.js` - UI controls (sidebar, zoom, fullscreen, hold-to-look arrows) and neighbour-scene preloading. Loaded after the inline script; relies on globals `viewer` and `tourConfig`.
- `tour-project/scene-names.js` - **the only place scene/hotspot display names live.** `applySceneNames(tourConfig)` runs before the viewer is created.
- `tour-project/style1.css` - tour UI. `thumbs/` (sidebar/itinerary) and `showcase/` (landing page) are flat, undistorted renders made from the panoramas.
- `vr_tour/` - real VR for Cardboard-style headsets. `vr.js` is a self-contained WebGL2 renderer (no libraries): one fullscreen shader draws both eyes from an equirectangular texture, with lens correction, gyroscope head tracking (`deviceorientation`), gaze-dwell hotspots, fullscreen + landscape lock + wake lock. Tunables are constants at the top of `vr.js` (`DWELL`, `STEREO_TAN`, `LENS_K1/K2`, pixel budget). It reads `scenes-data.js` and `scene-names.js`, so scene changes apply to both. It has no guide videos. Test hook: `?autostart=vr|preview&scene=<id>&yaw=..&pitch=..&lens=0`.

## Conventions and gotchas
- **Scene ids are file names** and contain odd spacing, e.g. `"ab2  3"` (two spaces), `"ab 2 gate 9"`. Never "tidy" them; `pfile(name)` appends `.jpg`.
- **Two logos:** `logo/vit-bhopal-logo.png` is navy (for light backgrounds, copied from vitbhopal.ac.in/logos); `logo/Vit Bhopal Logo.png` is WHITE on transparent (dark backgrounds only; invisible on white). When resizing PNGs with ffmpeg keep alpha (`-pix_fmt rgba`).
- **Brand colours (taken from the official site's CSS):** primary `#2c3370`, dark `#202653`, deep `#151a3e`, light `#e9eaf4`, muted background `#f6f7fb`, amber accent `#f2ad4a`. Fonts: Manrope (text) and Newsreader (headings) on the landing page; system stack in the tour. Keep the landing page plain and institutional: no glow, gradient text, carousels, numbered feature cards or marketing slogans.
- **Touch devices:** do not put `backdrop-filter` over the live panorama, do not animate `box-shadow`, and keep hover effects inside pointer-capable contexts. These caused flicker on phones (see the "Touch devices" block at the end of `tour-project/style1.css`).
- Pannellum's own drag/touch/keyboard handling is used; do not re-add custom drag handlers.
- Do not touch the green-screen guide videos (`tour-project/videos/`) without checking the chroma key in `campus tour.html` (`g > max(r,b) + 20`), since re-encoding can break the keying.
- `Drone_Background/` and `Chancellor.png` are currently unused by any page.
- **Deep links:** `tour-project/campus tour.html?scene=<scene id>` opens the tour at that scene (URL-encode spaces, e.g. `ab2%20%203`). The landing-page location cards rely on this.
- The landing page has no contact form any more (it used a student's EmailJS account); contact details link to the official site.

## Performance notes
- First view must appear fast: every scene has a ~22 KB `previews/<file>.jpg` (Pannellum `preview`), the first scene is preloaded from the page head, neighbouring scenes are preloaded after each load, and Pannellum is self-hosted. Preloads and `new Image()` use `crossOrigin = "anonymous"` to match how Pannellum requests images so the browser cache is reused.
- The source panoramas are 3584 px wide and slightly soft; compression is not the limit. Panoramas are encoded at `-q:v 3` with a mild `unsharp`.
- Do not add `vercel.json` cache headers without care: JS, CSS and HTML are not content-hashed, so long cache times would serve stale pages after an update.

## Media pipeline (ffmpeg is available)
Panoramas must be regenerated from the **original** files in git history (commit `4004e46`), never by recompressing the current ones:
```
ffmpeg -i original.jpg -vf unsharp=5:5:0.6:5:5:0.0 -q:v 3 -huffman optimal -pix_fmt yuvj420p out.jpg
ffmpeg -i original.jpg -vf scale=640:-2 -q:v 6 -huffman optimal -pix_fmt yuvj420p previews/out.jpg
```
Flat renders from a panorama (yaw must be within -180..180):
```
ffmpeg -i pano.jpg -vf "v360=input=e:output=flat:h_fov=85:v_fov=55:yaw=0:pitch=-2:w=720:h=460:interp=cubic" -q:v 3 out.jpg
```

## Git
**Never push anything to GitHub** (any branch, any remote change) unless the owner explicitly asks in that moment. Commit locally only. `main` auto-deploys to production on Vercel, and this site feeds the official VIT Bhopal page. Never merge to `main`.

Test phone layouts by loading a page inside a 390px-wide `<iframe>` in headless Chrome (headless Chrome itself will not go narrower than about 500px).
