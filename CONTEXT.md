# Project context

Living notes on the state of this project: what was decided, why, and what is still open. For how to work in the repo, see `CLAUDE.md`.

## Background
- Built quickly by students for a project exhibition, largely with AI coding agents, so the original code was unstructured and unpolished.
- Brief from their supervisor: build a campus tour like the VIT Vellore one at https://campustour.vit.ac.in/tour.html (also student-made). This one covers **VIT Bhopal**.
- It will be **integrated into the official VIT Bhopal website (https://vitbhopal.ac.in)**, so it must look institutional and not over-designed. The owner said the first landing page looked "too AI" and asked for the AI avatar photo to be removed.

## Official site reference
- Next.js site, **light theme**: white and `#f6f7fb` backgrounds, primary `#2c3370` (dark `#202653`, deep `#151a3e`), amber accent `#f2ad4a`, Manrope + Newsreader. Navigation includes Programmes, Campus life, Infrastructure, Library, Placements, Contact, CALTech.
- Official contact details (from vitbhopal.ac.in/contact): Reception +91 75 6035 0900, Alternate +91 75 6025 4500, Help line +91 75 6035 0913, admissions@vitbhopal.ac.in, info@vitbhopal.ac.in, Bhopal-Indore Highway, Kothrikalan, Sehore, MP 466114.

## Comparison with the VIT Vellore tour
- Vellore: krpano 1.19 (2018) + jQuery/Bootstrap 3; location list in a hamburger menu; ~40 narrated green-screen clips (MP4 on S3); background music; Google Cardboard VR; dated.
- Ours: Pannellum 2.5.6; 70 scenes with walk-through hotspots; sidebar of locations; chroma-keyed guide on a few scenes; split-screen VR.
- Vellore is ahead on narrated content for every place and background music.

## Work done (local branch `improve/performance-and-polish`)
- **Speed:** panoramas re-encoded from originals (~106 MB to ~65-70 MB); drone video 29 MB to 11 MB; neighbouring scenes preloaded; guide videos `preload="metadata"`.
- **Blur/stretching:** the old landing page used raw equirectangular panoramas as flat backgrounds; now flat undistorted renders in `tour-project/showcase/` and `thumbs/`. Source panoramas are 3584 px wide, so very large screens stay slightly soft.
- **Tour UI:** top bar with logo, labelled sidebar with thumbnails, compact toolbar, round hotspots, first-visit hint, aria labels, mobile viewport meta, deep links (`?scene=`), official palette.
- **Phones:** no backdrop blur over the panorama, transform/opacity hotspot ring, hover only on pointer devices, smaller keying canvas. Verified by rendering in a 390 px iframe (not on a real device).
- **Names:** all scene titles and hotspot labels come from `scene-names.js` (LC = Lab Complex, AB = Academic Block, MPH = Multipurpose Hall, AR/arch = Architecture Block).
- **Landing page rebuilt** to match the official site: white header with the official navy logo, plain hero, short About, 8 location cards that deep-link into the tour, four-item how-to, official contact details, navy footer. Removed: AI avatar card and photo, the fake "Interactive Map Blueprint", numbered feature cards, showcase carousel, itinerary timeline, loading screen, Font Awesome, the EmailJS contact form, and unverified claims ("250-acre", "premier technology university").
- **Credits and VR** pages recoloured to the official navy and amber.
- **Cleanup:** removed unreferenced backups and old CSS; VR mode has its own `vr-style.css`; `tour-project/avatar.webp` deleted.
- **Git:** one push of this branch was made earlier at the owner's request. The owner then said **do not push anything to GitHub; they will push themselves.** `main` was never touched. Everything since is committed locally only.

## Open items / need the owner's input
- **Guessed scene names** (confirm in `scene-names.js`): Flag Point, Central Walkway, Central Junction, Parcel Area, Hostel Entrance. `ab N` walkway scenes are all labelled "Academic Block 1"; `ab 15` is "Food Court" (as in the original menu).
- **Card descriptions** on the landing page were trimmed from the team's earlier text ("Laboratory facilities and computing centres", "Hosts institutional activities, sports and cultural events", etc.); have someone at VIT confirm them.
- **Contact form removed:** if the university wants an enquiry form it should post to a VIT-owned service. The old EmailJS public key and service id are still visible in git history.
- **Footer line** "Virtual tour created by students of VIT Bhopal University" and the Credits page: confirm wording and whether the Credits page should stay.
- **README claims an MIT licence** and links `LICENSE`, but no LICENSE file exists. The university must decide the licence.
- **Folder naming left alone on purpose** (`tour-project/` mixes ~95 images, HTML, JS, CSS, videos; `image copy/`; `campus tour.html` has a space). Renaming would break existing links.
- **VR mode** still shows raw hotspot labels and keeps a duplicated scene config.
- **Integration with vitbhopal.ac.in:** decide where it is hosted (separate site linked from the official page, or embedded) and update the Vercel/DNS side. The tour needs HTTPS and must not be blocked by the official site's iframe/CSP rules if embedded.
- Unused media: `Drone_Background/videodrone.mp4` (11 MB), `Chancellor.png`, root `Vit Bhopal Logo.png` (duplicate of `logo/`), ~16 unused images in `tour-project/`.
- Possible future work: tiled or higher-resolution panoramas, narrated guide for every location, background music, a real campus map, an accessibility audit, a `scenes.json` to replace the hand-written config, real-device phone testing.

## Deployment
- Production: https://360-virtual-campur-tour.vercel.app (Vercel, tracks `main` of https://github.com/amanrock1/360-VIRTUAL-CAMPUR-TOUR).
- A pushed branch gets a Vercel preview build (integration is enabled). There is no `vercel.json`; the site is plain static files.
