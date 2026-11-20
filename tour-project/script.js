/* ==========================================================
   VIT Bhopal – Virtual Campus Tour: UI controls
   Relies on the global `viewer` and `tourConfig` created in
   "campus tour.html". Dragging, touch, pinch and keyboard
   navigation are handled natively by Pannellum.
   ========================================================== */

// ---------- Sidebar ----------
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

function setSidebar(open) {
  sidebar.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () =>
  setSidebar(!sidebar.classList.contains("active")),
);
document.getElementById("closeBtn").addEventListener("click", () => setSidebar(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setSidebar(false);
});

// ---------- Scene buttons (sidebar + toolbar) ----------
document.querySelectorAll("[data-scene]").forEach((el) => {
  el.addEventListener("click", () => {
    viewer.loadScene(el.dataset.scene);
    setSidebar(false);
  });
});

// ---------- Zoom / fullscreen ----------
const ZOOM_STEP = 10;

function zoomIn() {
  viewer.setHfov(viewer.getHfov() - ZOOM_STEP);
}

function zoomOut() {
  viewer.setHfov(viewer.getHfov() + ZOOM_STEP);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    (document.documentElement.requestFullscreen || (() => {})).call(
      document.documentElement,
    );
  } else {
    document.exitFullscreen();
  }
}

document.querySelector('[data-action="zoom-in"]').addEventListener("click", zoomIn);
document.querySelector('[data-action="zoom-out"]').addEventListener("click", zoomOut);
document
  .querySelector('[data-action="fullscreen"]')
  .addEventListener("click", toggleFullscreen);

// ---------- Hold-to-look arrow buttons ----------
const PAN_SPEED = 60; // degrees per second
let panFrame = null;

function startPan(direction) {
  stopPan();
  let last = performance.now();

  function step(now) {
    const delta = (PAN_SPEED * (now - last)) / 1000;
    last = now;
    if (direction === "up") viewer.setPitch(viewer.getPitch() + delta);
    if (direction === "down") viewer.setPitch(viewer.getPitch() - delta);
    if (direction === "left") viewer.setYaw(viewer.getYaw() - delta);
    if (direction === "right") viewer.setYaw(viewer.getYaw() + delta);
    panFrame = requestAnimationFrame(step);
  }
  panFrame = requestAnimationFrame(step);
}

function stopPan() {
  if (panFrame) {
    cancelAnimationFrame(panFrame);
    panFrame = null;
  }
}

function attachPanEvents(id, direction) {
  const btn = document.getElementById(id);
  btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startPan(direction);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
    btn.addEventListener(evt, stopPan),
  );
}

attachPanEvents("btnUp", "up");
attachPanEvents("btnDown", "down");
attachPanEvents("btnLeft", "left");
attachPanEvents("btnRight", "right");

// ---------- Preload neighbouring scenes ----------
// Once a scene has loaded, quietly fetch the panoramas its hotspots lead to,
// so the next click opens instantly instead of waiting on the network.
const preloaded = new Map();

function preloadNeighbours() {
  if (navigator.connection && navigator.connection.saveData) return; // respect Data Saver
  const scene = tourConfig.scenes[viewer.getScene()];
  if (!scene || !scene.hotSpots) return;

  scene.hotSpots.forEach((hs) => {
    if (hs.type !== "scene") return;
    const target = tourConfig.scenes[hs.sceneId];
    if (!target || preloaded.has(target.panorama)) return;
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous"; // match Pannellum so the cached file is reused
    img.src = target.panorama;
    preloaded.set(target.panorama, img); // keep a reference so it stays cached
  });
}

viewer.on("load", () => {
  // wait a moment so preloading never competes with the scene being shown
  setTimeout(preloadNeighbours, 400);
});

// ---------- VR button keeps the current location ----------
const vrLink = document.querySelector('a[href^="../vr_tour/index.html"]');
function updateVrLink() {
  if (vrLink) vrLink.href = "../vr_tour/index.html?scene=" + encodeURIComponent(viewer.getScene());
}
viewer.on("load", updateVrLink);
viewer.on("scenechange", function () {
  if (typeof closePlaceInfo === "function") closePlaceInfo();
});
viewer.on("scenechange", updateVrLink);

window.viewer = viewer;

// ---------- First-visit hint ----------
const hint = document.getElementById("hint");
function hideHint() {
  hint.classList.add("hidden");
}
setTimeout(hideHint, 7000);
document.getElementById("panorama").addEventListener("pointerdown", hideHint, {
  once: true,
});
