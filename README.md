# 360 Interactive Campus Tour 🌐

An immersive, web-based 360° virtual navigation and spatial exploration platform for the VIT Bhopal campus. This application features interactive stereoscopic VR capabilities and a real-time chroma-keyed virtual guide rendering engine, allowing prospective students, parents, and visitors to navigate and experience the campus environment remotely.

**Live Tour Portal:** [360-virtual-campur-tour.vercel.app](https://360-virtual-campur-tour.vercel.app/)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/amanrock1/360-VIRTUAL-CAMPUR-TOUR.svg)](https://github.com/amanrock1/360-VIRTUAL-CAMPUR-TOUR/stargazers)
[![Pannellum](https://img.shields.io/badge/library-Pannellum_v2.5.6-orange.svg)](https://pannellum.org/)
[![JavaScript](https://img.shields.io/badge/language-JavaScript_ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Overview 📝

Exploring large university campuses remotely poses a spatial understanding challenge. Standard static photo galleries and linear videos fail to convey architectural scale, connectivity, and environmental context. Visitors, incoming students, and parents often cannot visit the campus physically before enrollment or orientation.

This project addresses this issue by implementing a web-based, interactive 360° virtual tour. By combining high-definition equirectangular panoramic photography, web-based spherical projection mapping, and custom real-time pixel processing (chroma keying) for tour guide video overlays, the platform provides a self-guided spatial walkthrough of the campus grounds.

---

## Key Features 🚀

| Feature | Technical Implementation | Description |
| :--- | :--- | :--- |
| **Interactive 360° Panorama** | Equirectangular projection rendering via the Pannellum API. | Users can drag, pan, and zoom across high-resolution panoramic views of campus sites. |
| **Spatial Hotspot Navigation** | Coordinate-mapped programmatic scene links. | Visual point-of-interest elements map relative physical connections to guide users between adjacent scenes. |
| **Stereoscopic VR Mode** | Dual-viewport synchronization via `requestAnimationFrame`. | Splits the display for mobile VR headsets, matching camera orientations across views without recursion loops. |
| **Chroma-Keyed Virtual Guide** | Real-time HTML5 Canvas pixel extraction and blending. | Programmatically removes green-screen backdrops from overlay guide videos, blending presenters into the 3D scene. |
| **Direct Navigation Sidebar** | Slide-out overlay linking to key destinations. | Provides direct jump points to major locations, bypassing step-by-step navigation. |
| **Performance-Optimized Core** | Texture capping, dynamic canvas scaling, and lazy scene instantiation. | Prevents frame-rate drops during real-time image manipulation on lower-end devices. |

---

## Technology Stack 💻

| Layer | Component / Library | Application & Usage |
| :--- | :--- | :--- |
| **Core Client Stack** | HTML5, CSS3, ES6+ JavaScript | Structural layout, responsive styles, event routing, and state machine control. |
| **Panorama Rendering Engine** | Pannellum (v2.5.6) | Projective mapping of equirectangular coordinates to sphere meshes inside the browser. |
| **Pixel Processing Pipeline** | HTML5 Canvas 2D API | Context operations executing real-time chroma subtraction on video frame buffers. |
| **Visual Resources** | Equirectangular Panoramic Photography, MP4 Video Guides | Media library containing 360° captures and green-screen guide recordings. |
| **Typography & Icons** | Manrope and Newsreader (Google Fonts), inline SVG icons | Clean UI layouts and clear navigation controls. |

---

## Architecture 🏗️

The application structure consists of a presentation layer, a coordinate sync layer, and an asset storage pool. Visual guides are processed frame-by-frame and superimposed on top of the active panorama coordinates.

```mermaid
graph TD
    UI[User Interface Layer: HTML5/CSS3/Vanilla JS] --> SML[Scene Management Layer: tour-project/campus tour.html + script.js + scene-names.js]
    SML --> PRE[Panorama Rendering Engine: Pannellum API]
    SML --> CK[Chroma-Key Video Engine: HTML5 Canvas API]
    PRE --> AS[Asset Storage: 360° Equirectangular Images]
    CK --> VS[Video Storage: MP4 Video Guides]
```

---

## Project Structure 📁

```
.
├── index.html                  # Landing page (hero, about, location cards, how-to, contact, footer)
├── style.css                   # Landing page styles (navy + gold theme)
├── main.js                     # Landing page behaviour (mobile menu, campus video dialog)
├── Credits.html                # Team credits page
├── styles3.css                 # Credits page styles
├── logo/vit-bhopal-logo.png    # Official logo, navy on transparent (use on light backgrounds)
├── logo/Vit Bhopal Logo.png    # Official logo, WHITE on transparent (use on dark backgrounds only)
├── tour-project/               # Main 360° tour
│   ├── campus tour.html        # Tour page: Pannellum config (70 scenes), chroma-key guide videos
│   ├── style1.css              # Tour UI styles (top bar, sidebar, toolbar, hotspots)
│   ├── script.js               # Tour UI controls + neighbour-scene preloading
│   ├── scene-names.js          # Readable names for every scene and hotspot (edit names here)
│   ├── *.jpg                   # 3584x1792 equirectangular panoramas (one per scene)
│   ├── thumbs/                 # Flat 720x460 views for sidebar and itinerary
│   ├── showcase/               # Flat 1600x1000 views for the landing page
│   └── videos/                 # Green-screen guide videos + preview video
├── vr_tour/                    # Stereoscopic VR mode
│   ├── index.html              # Dual-viewer VR page (has its own copy of the scene config)
│   └── vr-style.css            # VR page styles (independent of the tour styles)
├── image copy/                 # README screenshots and Credits page photos
├── Drone_Background/           # Drone video (currently not used by any page)
└── Chancellor.png              # Leadership image (currently not used by any page)
```

---

## Start Here (for new contributors) 🧭

Read in this order: this README, then [`CLAUDE.md`](CLAUDE.md) (how the code is laid out and the gotchas) and [`CONTEXT.md`](CONTEXT.md) (what was done, and what is still undecided).

**Where things live**

| I want to... | Go to |
| :--- | :--- |
| Change the text or sections of the landing page | `index.html` (styles in `style.css`, behaviour in `main.js`) |
| Rename a place or fix a hotspot label | `tour-project/scene-names.js` |
| Change the tour buttons, sidebar, or colours | `tour-project/campus tour.html` (markup), `tour-project/style1.css` (look), `tour-project/script.js` (behaviour) |
| Add or change a scene, or a link between scenes | The `tourConfig` object inside `tour-project/campus tour.html` |
| Change the guide (green-screen) videos | `tour-project/videos/` and the chroma-key section at the bottom of `campus tour.html` |
| Change VR mode | `vr_tour/index.html` (it keeps its **own copy** of the scene list) |

**Adding a new scene**
1. Put the equirectangular panorama in `tour-project/` as `<scene id>.jpg` (about 3584x1792, JPEG quality ~4).
2. Add a block for it in `tourConfig.scenes` in `campus tour.html`, with `panorama: pfile("<scene id>")` and its `hotSpots`.
3. Add a hotspot **back** from each neighbouring scene (the arrival direction is calculated from these pairs).
4. Add a naming rule in `scene-names.js` if it is a new place, so it shows a readable title.
5. Optional: add a thumbnail in `tour-project/thumbs/` and a button in the sidebar markup.
6. Repeat in `vr_tour/index.html` if it should appear in VR.

Scene ids are file names and some contain double spaces (for example `ab2  3`). Keep them exactly as they are.

---

## Installation 🔧

Since the application is built on static client technologies, compiling code or running a server environment is not required. However, because modern browsers restrict file access (`file://`) due to CORS policies, the project must be served from a local server to load panoramas and guide videos correctly.

### Prerequisites
- Node.js (v14+) or Python (v3+) installed on your machine.
- A modern web browser supporting WebGL and canvas manipulation.

### Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/amanrock1/360-VIRTUAL-CAMPUR-TOUR.git
   cd 360-VIRTUAL-CAMPUR-TOUR
   ```

2. **Serve the Application:**
   * **Using Python (Recommended):**
     ```bash
     python -m http.server 8000
     ```
   * **Using Node.js:**
     ```bash
     npx http-server -p 8000
     ```

3. **Launch in Browser:**
   Open your browser and navigate to `http://localhost:8000`.

---

## Usage 📖

1. **Enter the Campus Gateway:** On the landing page, read the overview, watch the campus video, then press "Start the tour" or pick a location card to open the tour at that place (cards use `campus tour.html?scene=<scene id>`).
2. **Rotate and Look Around:** Click and drag using your mouse, or swipe on mobile screens, to rotate the panorama 360 degrees. Use the `+` and `-` controls in the toolbar to adjust your field of view.
3. **Move to Adjacent Locations:** Identify hotspot overlays within the scene. Hovering over a hotspot displays the destination name. Clicking the hotspot triggers a fade transition to that location.
4. **Utilize Quick Navigation:** Click the "Locations" button on the top left to open the sidebar. Click any location (e.g., Lab Complex, Girls Hostel, Food Court) to jump directly to that scene.
5. **Activate VR Mode:** Click the VR headset icon in the bottom toolbar. Insert your mobile device into a VR viewer (e.g., Google Cardboard) to explore the campus using dual-pane stereo views.

---

## Screenshots 🖼️

*To add screenshots, replace the placeholders below with project image assets stored in your repository:*

#### Home Page / Landing Portal
![Home Page Placeholder](image%20copy/homepage_preview.png)
*Figure 1: The gateway landing page showcasing introductory cards, team credits, and entry triggers.*

#### 360° Panoramic View
![Panorama View Placeholder](image%20copy/panorama_preview.jpg)
*Figure 2: The interactive campus viewer rendering equirectangular environment maps.*

#### Hotspot Navigation and Interactive Controls
![Hotspot Navigation Placeholder](image%20copy/hotspots_preview.png)
*Figure 3: Overlaid spatial navigation links pointing to neighboring scenes.*

#### Stereoscopic VR Mode
![VR Mode Placeholder](image%20copy/vrmode_preview.png)
*Figure 4: Dual-viewport output optimized for cardboard VR headsets.*

#### Mobile Layout View
![Mobile View Placeholder](image%20copy/mobile_preview.jpeg)
*Figure 5: Optimized layout and collapsed menus running on mobile screens.*

---

## How Navigation Works 🗺️

- **Scene Transitions:** Handled by Pannellum’s programmatic `viewer.loadScene(sceneId)` API. When triggered, the engine swaps the underlying texture coordinates and performs a fade-out to fade-in transition.
- **Hotspot Mapping:** Declared statically in the tour config. Each hotspot holds spatial Euler angles (`pitch`, `yaw`) and a target `sceneId`.
- **Camera Orientation Sync:** To prevent disorienting camera movements during transition, the target scene's initial facing yaw is aligned dynamically based on the direction from which the visitor approached the hotspot.
- **User Input Routing:** Pointer events translate screen coordinates into changes in pitch and yaw. The interface supports keyboard arrow controls, scrollwheel zoom, and pinch-to-zoom touch actions.

---

## Performance Optimizations ⚡

- **Compressed media:** panoramas are JPEG quality ~4 (about 35% smaller than the originals with no visible loss); the drone video is 1080p H.264 (29 MB to 11 MB).
- **Neighbour preloading:** after a scene loads, `script.js` quietly fetches the panoramas its hotspots lead to, so the next click opens instantly.
- **On-demand loading:** only the current scene is fetched up front; guide videos use `preload="metadata"`.
- **Undistorted flat images for the website:** the landing page uses small flat renders (`thumbs/`, `showcase/`) instead of raw 360° panoramas, so the page loads fast and looks sharp.
- **Cheaper chroma key:** the keying canvas is capped at 640 px wide (360 px on phones) and driven by `requestAnimationFrame`.
- **Phone-friendly UI:** no backdrop blur over the live panorama on touch devices, GPU-only hotspot animation, hover effects only on devices with a real pointer, and `100dvh` layouts.

---

## Challenges Faced 🧠

- **Establishing Orientation Continuity:** Swapping scenes often left users facing the wrong direction. We solved this by parsing the incoming path direction, calculating the opposite vector, and setting the camera's entry yaw (`targetYaw = (incomingYaw + 180) % 360`) to create a continuous walking sensation.
- **Low-Latency Stereoscopic Sync:** Standard VR frameworks require high resource consumption. We implemented dual Pannellum instances side-by-side. To prevent feedback loops and update lag, we configured an active-side detector. When a user drags one side, the system captures those coordinates and overrides the peer’s orientation directly (`setYaw(yaw, false)`), suppressing animation updates and synchronization lag.
- **Real-Time Web-Based Green Screen Subtraction:** Building a clean keying filter in pure JavaScript required balanced RGB thresholding. Simple chroma keys produce harsh green margins around edges. We solved this by using dominant color subtraction logic:
  ```javascript
  const maxRB = Math.max(r, b);
  if (g > maxRB + 20 && g > 70) {
      const dominance = g - maxRB;
      if (dominance > 45) {
          data[i + 3] = 0; // Transparent
      } else {
          data[i + 3] = Math.max(0, 255 - (dominance - 20) * 10); // Alpha edge smoothing
      }
  }
  ```
  This creates smooth alpha blending on the boundary pixels, resolving pixelation without WebGL shaders.
- **Viewport Constraints on Mobile Browsers:** Mobile address bars shift layouts dynamically. We resolved layout clipping by wrapping interactive elements in containers styled with Dynamic Viewport Heights (`100dvh`).

---

## Future Improvements 🔮

- **Voice Narratives:** Incorporating text-to-speech audio logs for each campus building.
- **Conversational Agents:** Adding interactive chat helpers inside scenes to reply to student queries.
- **Visitor Heatmaps:** Implementing analytics to see which campus zones are visited most frequently.
- **Localization Options:** Providing translation files to switch UI languages.
- **Enhanced Accessibility:** Building screen-reader voice notifications and implementing keyboard-tab navigation maps.
- **Facility Interiors:** Expanding the tour database to include indoor floor maps of hostels, libraries, and laboratories.

---

## Learning Outcomes 🎓

- **Spatial UX Design:** Mapping flat coordinate spaces into interactive spherical projections.
- **Advanced DOM Control:** Syncing multiple WebGL panorama canvases simultaneously.
- **Client-Side Image Manipulation:** Implementing low-level, frame-by-frame color channel edits on media streams.
- **Responsive Layout Design:** Deploying flexible control systems that scale across various devices and screens.
- **Performance Profiling:** Identifying frame-rate bottlenecks in JavaScript rendering loops and using canvas scaling to maintain performance.

---

## Contributing 🤝

Contributions to expand the Virtual Tour database are welcome.

1. Fork the Project.
2. Create your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

---

## License 📄

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author 👥

Developed by Project Exhibition 01 - Group 1:
- **Shoubhik Bhattacharya** - Frontend Developer
- **Aman Kumar Prabhat** - 360° Website Developer
