# Project context

Living notes on the state of this project: what was decided, why, and what is still open. For how to work in the repo, see `CLAUDE.md`.

## Background
- Built quickly by students for a project exhibition, largely with AI coding agents, so the original code was unstructured and unpolished.
- Brief from their supervisor: build a campus tour like the VIT Vellore one at https://campustour.vit.ac.in/tour.html (also student-made). This one covers **VIT Bhopal**.
- The tour will be linked from the **official VIT Bhopal page**, so it should look professional and not be over-designed.

## Comparison with the VIT Vellore tour (checked from its raw HTML)
- Vellore: krpano 1.19 (2018) + jQuery/Bootstrap 3; location list in a hamburger menu; ~40 narrated green-screen clips (MP4 on S3) with popup text; background music; Google Cardboard VR; dated (dead analytics tag, `http://` fonts).
- Ours: Pannellum 2.5.6; 70 scenes with walk-through hotspots; sidebar of locations; chroma-keyed guide on a few scenes; split-screen VR; full landing page.
- Where Vellore is ahead: narrated content for every place, background music. Where we were behind: loading speed and polish (addressed below).

## Work done (branch `improve/performance-and-polish`)
- **Speed:** panoramas re-encoded from originals (~106 MB to ~65-70 MB); drone video 29 MB to 11 MB; neighbouring scenes preloaded; guide videos `preload="metadata"`.
- **Blur/stretching:** landing page had been using raw equirectangular panoramas as flat backgrounds. Replaced with undistorted flat renders in `tour-project/showcase/` and `thumbs/`. Source panoramas are only 3584 px wide, so large screens will always look slightly soft.
- **Tour UI:** new top bar with logo, labelled sidebar (with real thumbnails), smaller icon toolbar, crisp round hotspots, first-visit hint, accessibility labels, mobile viewport meta (was missing).
- **Bugs fixed:** undefined `canvas` listener, toolbar outside `<body>`, duplicate drag handler, 600°/s arrow-button panning, invisible white logo on a white pill, timeline items wrapping onto a second row, missing X/Twitter icon (Font Awesome upgraded to 6.5.1), white-on-gold button contrast.
- **Phones:** removed backdrop blur over the panorama, replaced box-shadow pulse with a transform/opacity ring, hover only on pointer devices, centred toolbar without `transform`, smaller keying canvas on phones.
- **Naming:** all scene titles/hotspot labels come from `scene-names.js` (LC = Lab Complex, AB = Academic Block, MPH = Multipurpose Hall, AR/arch = Architecture Block).
- **Cleanup:** removed unreferenced backups and old CSS (`index_backup.html`, `style_backup.css`, `1.cpp`, `Style2.css`, `style2gallery.css`, `navbarstyle.css`, `footerstyle.css`, root `style1.css`, `tour-project/Style3.css`). VR mode now has its own `vr-style.css`.

## Open items / need the owner's input
- **Guessed scene names** (confirm or correct in `scene-names.js`): Flag Point, Central Walkway, Central Junction, Parcel Area, Hostel Entrance. Also `ab N` walkway scenes are all labelled "Academic Block 1", and `ab 15` is labelled "Food Court" (as in the original menu).
- **Unverified wording on the landing page:** "250-acre campus", "CALTECH classrooms", "India's premier technology university", the phone number and email addresses.
- **"Guided by AI Avatar" card** uses a photo of a real-looking person (`tour-project/avatar.webp`); confirm it is approved for an official page.
- **"Interactive Map Blueprint"** is not a real map: five pins sit at arbitrary spots on a darkened road photo. Rename or replace with a real campus map.
- **Footer** says "© 2025 Group-1" and links "Credits Of our Team Members"; decide whether that suits an official page.
- **VR mode** still shows the original (raw) hotspot labels and has a duplicated scene config; ideally it should share the tour's data.
- Unused media: `Drone_Background/videodrone.mp4` (11 MB), `Chancellor.png`, root `Vit Bhopal Logo.png` (duplicate of `logo/`), and 16 old unused images in `tour-project/` (e.g. `girls 19.jpg`, `ab 8.jpg`).
- Possible future work: tiled/higher-resolution panoramas, narrated guide for every location, background music, real campus map, a verified accessibility pass, a `scenes.json` to replace the hand-written config.

## Deployment
- Production: https://360-virtual-campur-tour.vercel.app (Vercel, tracks `main` of https://github.com/amanrock1/360-VIRTUAL-CAMPUR-TOUR).
- Pushing a branch can create a Vercel preview deployment if the Vercel GitHub integration is enabled. There is no `vercel.json`; the site is served as plain static files.
