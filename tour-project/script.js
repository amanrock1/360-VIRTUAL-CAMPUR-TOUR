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

// ---------- Look around by moving the phone (gyroscope) ----------
// Uses the same head-tracking maths as VR mode (vr_tour/vr.js). Pannellum's own
// motion support is not used because it cannot re-aim the view after each step.
const motionBtn = document.getElementById("btnMotion");
const MOTION_PREF = "vitb-tour-motion"; // "off" once the visitor has switched it off
const DEG = Math.PI / 180;
const motion = { on: false, angles: null, gotEvent: false, needCalib: true, dragging: false, offYaw: 0, offPitch: 0, smYaw: 0, smPitch: 0 };

function motionSupported() {
  return (
    "DeviceOrientationEvent" in window &&
    window.isSecureContext &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function getPref() {
  try {
    return localStorage.getItem(MOTION_PREF);
  } catch (e) {
    return null;
  }
}

function setPref(v) {
  try {
    localStorage.setItem(MOTION_PREF, v);
  } catch (e) {
    /* storage blocked: the choice just is not remembered */
  }
}

function showHint(text) {
  hint.textContent = text;
  hint.classList.remove("hidden");
  setTimeout(hideHint, 6000);
}

function mul3(a, b) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return r;
}
const rotX = (t) => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];
const rotY = (t) => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)];
const rotZ = (t) => [Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t), 0, 0, 0, 1];

// Direction the phone is pointing, as yaw/pitch in degrees (same convention as Pannellum).
function deviceHeading() {
  const o = motion.angles;
  const a = (screen.orientation && typeof screen.orientation.angle === "number" ? screen.orientation.angle : window.orientation) || 0;
  const m = mul3(mul3(mul3(rotY(o.alpha), rotX(o.beta)), rotZ(-o.gamma)), mul3(rotX(-Math.PI / 2), rotZ(-a * DEG)));
  const f = [-m[2], -m[5], m[8]];
  return { yaw: Math.atan2(f[0], f[2]) / DEG, pitch: Math.asin(Math.max(-1, Math.min(1, f[1]))) / DEG };
}

const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180;

function onMotionEvent(e) {
  if (e.alpha === null || e.beta === null || e.gamma === null) return;
  motion.angles = { alpha: e.alpha * DEG, beta: e.beta * DEG, gamma: e.gamma * DEG };
  motion.gotEvent = true;
  applyMotion(); // sensors report about 60 times a second, so no separate animation loop is needed
}

function applyMotion() {
  if (!motion.on) return;
  if (!motion.angles || motion.dragging || !viewer.isLoaded()) return;

  const d = deviceHeading();
  if (motion.needCalib) {
    // keep facing the way the scene intends (e.g. the direction you walked), then follow the phone from there
    motion.offYaw = viewer.getYaw() - d.yaw;
    motion.offPitch = 0;
    motion.smYaw = d.yaw;
    motion.smPitch = d.pitch;
    motion.needCalib = false;
  }
  // light smoothing removes sensor jitter without adding noticeable lag
  motion.smYaw += wrap180(d.yaw - motion.smYaw) * 0.4;
  motion.smPitch += (d.pitch - motion.smPitch) * 0.4;
  viewer.setYaw(wrap180(motion.smYaw + motion.offYaw), false);
  viewer.setPitch(Math.max(-85, Math.min(85, motion.smPitch + motion.offPitch)), false);
}

function setMotionUI(on) {
  motionBtn.classList.toggle("active", on);
  motionBtn.setAttribute("aria-pressed", String(on));
}

function disableMotion() {
  motion.on = false;
  window.removeEventListener("deviceorientation", onMotionEvent, true);
  setMotionUI(false);
}

function startMotion() {
  if (motion.on) return;
  motion.on = true;
  motion.needCalib = true;
  motion.gotEvent = false;
  window.addEventListener("deviceorientation", onMotionEvent, true);
  setMotionUI(true);
  showHint("Move your phone to look around");
  setTimeout(function () {
    if (motion.on && !motion.gotEvent) {
      disableMotion();
      motionBtn.hidden = true;
      showHint("No motion sensor found: drag to look around");
    }
  }, 2500);
}

// Called from a tap or click (the only time iPhones allow the permission prompt).
async function enableMotion() {
  if (motion.on) return;
  try {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const r = await DeviceOrientationEvent.requestPermission();
      if (r !== "granted") {
        setMotionUI(false);
        showHint("Motion access is blocked in the browser settings");
        return;
      }
    }
  } catch (e) {
    setMotionUI(false);
    return;
  }
  startMotion();
}

// Waits for the first tap, then asks for permission (iPhone behaviour).
function enableOnFirstTap() {
  showHint("Tap the screen, then move your phone to look around");
  const first = function () {
    document.removeEventListener("click", first, true);
    document.removeEventListener("touchend", first, true);
    enableMotion();
  };
  document.addEventListener("click", first, true);
  document.addEventListener("touchend", first, true);
}

// Tries to switch motion on straight away. Android grants it silently; iPhones refuse without a tap.
function enableOnLoad() {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(function (r) {
        if (r === "granted") startMotion();
        else enableOnFirstTap();
      })
      .catch(enableOnFirstTap);
  } else {
    startMotion();
  }
}

if (motionSupported()) {
  motionBtn.hidden = false;

  motionBtn.addEventListener("click", function () {
    if (motion.on) {
      disableMotion();
      setPref("off");
    } else {
      setPref("on");
      enableMotion();
    }
  });

  // after each step to a new location, re-aim the view on the scene's intended direction
  viewer.on("load", function () {
    motion.needCalib = true;
  });

  // dragging with a finger still works: the drag becomes the new reference, then the phone continues from there
  const pano = document.getElementById("panorama");
  pano.addEventListener("pointerdown", function () {
    motion.dragging = true;
  });
  ["pointerup", "pointercancel"].forEach(function (n) {
    window.addEventListener(n, function () {
      if (!motion.dragging) return;
      motion.dragging = false;
      if (motion.on) {
        motion.offYaw = viewer.getYaw() - motion.smYaw;
        motion.offPitch = Math.max(-45, Math.min(45, viewer.getPitch() - motion.smPitch));
      }
    });
  });

  // switch it on by default (unless the visitor turned it off before)
  if (getPref() !== "off") enableOnLoad();
}
