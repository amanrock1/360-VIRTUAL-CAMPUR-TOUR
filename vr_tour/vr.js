/* ==========================================================================
   VIT Bhopal - VR mode

   A small WebGL2 renderer built for phone headsets (Google Cardboard style):
   - side-by-side stereo view with optional lens (barrel) correction
   - head tracking from the phone's gyroscope (deviceorientation)
   - gaze selection: look at a round arrow for DWELL seconds to walk there,
     because nothing on the screen can be tapped while the phone is in a headset
   - fullscreen, landscape lock and screen wake lock when entering VR

   Scene data comes from ../tour-project/scenes-data.js (shared with the tour)
   and readable names from ../tour-project/scene-names.js.

   Direction convention (same as Pannellum): yaw 0 is the centre of the
   panorama, +yaw turns right, +pitch looks up.
   direction(yaw, pitch) = (sin yaw * cos pitch, sin pitch, cos yaw * cos pitch)
   ========================================================================== */
(function () {
  "use strict";

  // ---------- Tunable settings ----------
  var DWELL = 1.5; // seconds of looking at an arrow before it activates
  var EXIT_DWELL = 2.0; // seconds of looking straight down to leave VR
  var TARGET_RADIUS = 0.1; // angular radius of an arrow marker (radians, ~5.7 deg)
  var EXIT_RADIUS = 0.22;
  var STEREO_TAN = 0.7; // tan(half field of view) per eye (about 35 deg at the edge, before lens correction)
  var MONO_TAN = 0.75; // tan(half vertical field of view) for the non-headset preview
  var LENS_K1 = 0.22; // lens correction strength (Cardboard-like; lower = weaker)
  var LENS_K2 = 0.1;
  var MAX_PIXELS_VR = 2.4e6; // keeps frame rate up on mid-range phones
  var MAX_PIXELS_PREVIEW = 4e6;
  var ASSET_BASE = "../tour-project/";
  var DEG = Math.PI / 180;

  var canvas = document.getElementById("gl");
  var gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) {
    document.getElementById("unsupported").hidden = false;
    document.getElementById("start").hidden = true;
    return;
  }

  applySceneNames(tourConfig);

  // ---------- Shaders ----------
  var VERT = "#version 300 es\nin vec2 aPos;\nvoid main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";

  var FRAG = [
    "#version 300 es",
    "precision highp float;",
    "uniform sampler2D uTex;",
    "uniform vec2 uRes;",
    "uniform float uStereo, uDist, uTan, uFade, uK1, uK2, uProg;",
    "uniform mat3 uBasis;",
    "uniform vec4 uT[8];",
    "uniform float uTType[8];",
    "uniform int uCount, uGaze;",
    "out vec4 outColor;",
    "const float PI = 3.14159265359;",
    "void main(){",
    "  vec2 fc = gl_FragCoord.xy;",
    "  float eyeW = uStereo > 0.5 ? uRes.x * 0.5 : uRes.x;",
    "  if (uStereo > 0.5 && abs(fc.x - eyeW) < 1.0) { outColor = vec4(0.0, 0.0, 0.0, 1.0); return; }",
    "  float eye = (uStereo > 0.5 && fc.x > eyeW) ? 1.0 : 0.0;",
    "  vec2 local = vec2(fc.x - eye * eyeW, fc.y);",
    "  vec2 p = (local - vec2(eyeW, uRes.y) * 0.5) / (uRes.y * 0.5);",
    "  if (uDist > 0.5) { float r2 = dot(p, p); p *= 1.0 + uK1 * r2 + uK2 * r2 * r2; }",
    "  vec3 ray = normalize(uBasis * vec3(p * uTan, 1.0));",
    "  float lon = atan(ray.x, ray.z);",
    "  float lat = asin(clamp(ray.y, -1.0, 1.0));",
    "  vec2 uv = vec2(0.5 + lon / (2.0 * PI), 0.5 - lat / PI);",
    "  vec2 uvs = vec2(fract(uv.x + 0.5), uv.y);", // half-turn shifted copy: smooth exactly where uv is not
    "  vec2 gx = dFdx(uv), gy = dFdy(uv), sx = dFdx(uvs), sy = dFdy(uvs);",
    "  if (abs(sx.x) + abs(sy.x) < abs(gx.x) + abs(gy.x)) { gx = sx; gy = sy; }",
    "  vec3 col = textureGrad(uTex, uv, gx, gy).rgb;",
    "  for (int i = 0; i < 8; i++) {",
    "    if (i >= uCount) break;",
    "    float R = uT[i].w;",
    "    float ang = acos(clamp(dot(ray, uT[i].xyz), -1.0, 1.0));",
    "    if (ang < R * 1.12) {",
    "      vec3 base = uTType[i] > 0.5 ? vec3(0.62, 0.17, 0.15) : vec3(0.17, 0.2, 0.44);",
    "      bool filled = (i == uGaze) && ang < R * uProg;",
    "      if (ang < R) {",
    "        col = mix(col, base, 0.82);",
    "        if (filled) col = vec3(0.95, 0.68, 0.29);",
    "        else if (ang < R * 0.26) col = vec3(1.0);",
    "      }",
    "      if (ang > R * 0.93) col = vec3(1.0);",
    "    }",
    "  }",
    "  float c = acos(clamp(dot(ray, uBasis[2]), -1.0, 1.0));", // gaze reticle at the centre of each eye
    "  if (c < 0.010) col = vec3(1.0); else if (c < 0.014) col = vec3(0.05);",
    "  outColor = vec4(col * uFade, 1.0);",
    "}",
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  var prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  ["uTex", "uRes", "uStereo", "uDist", "uTan", "uFade", "uK1", "uK2", "uProg", "uBasis", "uT", "uTType", "uCount", "uGaze"].forEach(function (n) {
    U[n] = gl.getUniformLocation(prog, n);
  });

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([20, 24, 60]));
  gl.uniform1i(U.uTex, 0);

  function uploadTexture(img) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  // ---------- State ----------
  var mode = "idle"; // "vr" | "preview"
  var state = {
    sceneId: null,
    yaw: 0, // manual look direction (used without a gyroscope)
    pitch: 0,
    homeYaw: 0, // heading this scene should face when (re)centred
    yawOffset: 0, // aligns the gyroscope heading with homeYaw
    needCalib: true,
    fade: 0,
    fadeTarget: 0,
  };
  var orient = null; // {alpha, beta, gamma} in radians, from deviceorientation
  var targets = []; // {dir:[x,y,z], radius, type, name, dest, arrivalYaw}
  var gazeIndex = -1;
  var dwell = 0;
  var navToken = 0;
  var wakeLock = null;
  var lensOn = true;

  // ---------- Small math helpers ----------
  function dirFrom(yawDeg, pitchDeg) {
    var y = yawDeg * DEG;
    var p = pitchDeg * DEG;
    return [Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p)];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function mul(a, b) {
    var r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 3; i++)
      for (var j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
    return r;
  }

  function rx(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return [1, 0, 0, 0, c, -s, 0, s, c];
  }

  function ry(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return [c, 0, s, 0, 1, 0, -s, 0, c];
  }

  function rz(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  }

  function screenAngle() {
    var a = (screen.orientation && typeof screen.orientation.angle === "number" ? screen.orientation.angle : window.orientation) || 0;
    return a * DEG;
  }

  // Camera axes (right, up, forward) in our coordinate system, from the gyroscope.
  // Same composition three.js uses for device orientation, converted from its
  // right-handed world (camera looks down -Z) into ours (forward is +Z).
  function gyroAxes() {
    var m = mul(mul(mul(ry(orient.alpha), rx(orient.beta)), rz(-orient.gamma)), mul(rx(-Math.PI / 2), rz(-screenAngle())));
    // columns of m: c0 = camera right, c1 = camera up, c2 = camera back
    return {
      right: [m[0], m[3], -m[6]],
      up: [m[1], m[4], -m[7]],
      fwd: [-m[2], -m[5], m[8]],
    };
  }

  function rotateY(v, theta) {
    var c = Math.cos(theta), s = Math.sin(theta);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function manualAxes() {
    var y = state.yaw * DEG, p = state.pitch * DEG;
    var cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
    return {
      right: [cy, 0, -sy],
      up: [-sy * sp, cp, -cy * sp],
      fwd: [sy * cp, sp, cy * cp],
    };
  }

  function currentAxes() {
    if (orient) {
      var g = gyroAxes();
      if (state.needCalib) {
        // make the heading the viewer is facing right now equal to the scene's intended heading
        state.yawOffset = state.homeYaw * DEG - Math.atan2(g.fwd[0], g.fwd[2]);
        state.needCalib = false;
      }
      var t = state.yawOffset;
      return { right: rotateY(g.right, t), up: rotateY(g.up, t), fwd: rotateY(g.fwd, t) };
    }
    return manualAxes();
  }

  // ---------- UI helpers ----------
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1800);
  }

  var labelL = document.getElementById("labelL");
  var labelR = document.getElementById("labelR");
  function showLabel(text) {
    var on = !!text;
    [labelL, labelR].forEach(function (el) {
      if (on) el.textContent = text;
      el.classList.toggle("show", on);
    });
  }

  function placeLabels() {
    if (mode === "vr") {
      labelL.style.left = "25%";
      labelR.style.left = "75%";
      labelR.style.display = "";
    } else {
      labelL.style.left = "50%";
      labelR.style.display = "none";
    }
  }

  // ---------- Image loading ----------
  var imgCache = {};
  function loadImage(url) {
    if (imgCache[url]) return imgCache[url];
    imgCache[url] = new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        delete imgCache[url];
        reject(new Error("failed " + url));
      };
      img.src = encodeURI(url);
    });
    return imgCache[url];
  }

  function fullUrl(id) {
    return ASSET_BASE + tourConfig.scenes[id].panorama;
  }

  function previewUrl(id) {
    return ASSET_BASE + tourConfig.scenes[id].preview;
  }

  function wait(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  // ---------- Scenes ----------
  function buildTargets(id) {
    var list = [];
    (tourConfig.scenes[id].hotSpots || []).forEach(function (hs) {
      if (hs.type !== "scene" || !tourConfig.scenes[hs.sceneId] || list.length >= 7) return;
      list.push({
        dir: dirFrom(hs.yaw, hs.pitch),
        radius: TARGET_RADIUS,
        type: 0,
        name: hs.text || tourConfig.scenes[hs.sceneId].title,
        dest: hs.sceneId,
        arrivalYaw: typeof hs.targetYaw === "number" ? hs.targetYaw : 0,
      });
    });
    list.push({ dir: [0, -1, 0], radius: EXIT_RADIUS, type: 1, name: "Keep looking down to exit VR", dest: null, arrivalYaw: 0 });
    return list;
  }

  function preloadNeighbours(id) {
    targets.forEach(function (t) {
      if (t.dest) loadImage(fullUrl(t.dest)).catch(function () {});
    });
  }

  function goTo(id, arrivalYaw) {
    if (!tourConfig.scenes[id]) return Promise.resolve();
    var token = ++navToken;
    state.fadeTarget = 0;
    return wait(mode === "idle" ? 0 : 220)
      .then(function () {
        if (token !== navToken) return null;
        return loadImage(previewUrl(id)).catch(function () {
          return null;
        });
      })
      .then(function (preview) {
        if (token !== navToken) return null;
        if (preview) uploadTexture(preview);
        state.sceneId = id;
        state.homeYaw = arrivalYaw;
        state.yaw = arrivalYaw;
        state.pitch = 0;
        state.needCalib = true;
        targets = buildTargets(id);
        gazeIndex = -1;
        dwell = 0;
        showLabel("");
        document.getElementById("hudName").textContent = tourConfig.scenes[id].title || "";
        state.fadeTarget = 1;
        return loadImage(fullUrl(id));
      })
      .then(function (full) {
        if (!full || token !== navToken) return;
        uploadTexture(full); // sharp version replaces the quick preview
        preloadNeighbours(id);
      })
      .catch(function () {
        toast("Could not load this location");
        state.fadeTarget = 1;
      });
  }

  function exitToTour() {
    var id = state.sceneId || "exit 1";
    window.location.href = "../tour-project/campus%20tour.html?scene=" + encodeURIComponent(id);
  }

  // ---------- Gaze ----------
  function updateGaze(fwd, dt) {
    var found = -1;
    for (var i = 0; i < targets.length; i++) {
      var ang = Math.acos(Math.max(-1, Math.min(1, dot(fwd, targets[i].dir))));
      if (ang < targets[i].radius) {
        found = i;
        break;
      }
    }
    if (found !== gazeIndex) {
      gazeIndex = found;
      dwell = 0;
      showLabel(found >= 0 ? targets[found].name : "");
    }
    if (found < 0 || state.fadeTarget === 0) return 0;
    dwell += dt;
    var need = targets[found].type === 1 ? EXIT_DWELL : DWELL;
    if (dwell >= need) {
      var t = targets[found];
      dwell = 0;
      gazeIndex = -1;
      if (navigator.vibrate) navigator.vibrate(30);
      if (t.type === 1) exitToTour();
      else goTo(t.dest, t.arrivalYaw);
      return 0;
    }
    return dwell / need;
  }

  // ---------- Rendering ----------
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth * dpr;
    var h = window.innerHeight * dpr;
    var maxPx = mode === "vr" ? MAX_PIXELS_VR : MAX_PIXELS_PREVIEW;
    var s = Math.min(1, Math.sqrt(maxPx / (w * h)));
    canvas.width = Math.max(2, Math.round(w * s));
    canvas.height = Math.max(2, Math.round(h * s));
    gl.viewport(0, 0, canvas.width, canvas.height);
    var portrait = window.innerHeight > window.innerWidth;
    document.getElementById("rotate").classList.toggle("needed", mode === "vr" && portrait);
    placeLabels();
  }

  var tArr = new Float32Array(32);
  var tType = new Float32Array(8);
  var lastTime = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (mode === "idle" || document.hidden) return;
    var dt = Math.min(0.1, (now - lastTime) / 1000 || 0.016);
    lastTime = now;

    state.fade += (state.fadeTarget - state.fade) * Math.min(1, dt * 9);
    var axes = currentAxes();
    var prog = updateGaze(axes.fwd, dt);

    for (var i = 0; i < 8; i++) {
      var t = targets[i];
      tArr[i * 4] = t ? t.dir[0] : 0;
      tArr[i * 4 + 1] = t ? t.dir[1] : 0;
      tArr[i * 4 + 2] = t ? t.dir[2] : 0;
      tArr[i * 4 + 3] = t ? t.radius : 0;
      tType[i] = t ? t.type : 0;
    }

    var vr = mode === "vr";
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uStereo, vr ? 1 : 0);
    gl.uniform1f(U.uDist, vr && lensOn ? 1 : 0);
    gl.uniform1f(U.uTan, vr ? STEREO_TAN : MONO_TAN);
    gl.uniform1f(U.uFade, state.fade);
    gl.uniform1f(U.uK1, LENS_K1);
    gl.uniform1f(U.uK2, LENS_K2);
    gl.uniform1f(U.uProg, prog);
    // columns: right, up, forward
    gl.uniformMatrix3fv(U.uBasis, false, new Float32Array([].concat(axes.right, axes.up, axes.fwd)));
    gl.uniform4fv(U.uT, tArr);
    gl.uniform1fv(U.uTType, tType);
    gl.uniform1i(U.uCount, Math.min(8, targets.length));
    gl.uniform1i(U.uGaze, gazeIndex);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ---------- Input ----------
  function onOrient(e) {
    if (e.beta === null || e.alpha === null || e.gamma === null) return;
    orient = { alpha: e.alpha * DEG, beta: e.beta * DEG, gamma: e.gamma * DEG };
  }

  var dragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener("pointerdown", function (e) {
    if (mode === "idle") return;
    if (mode === "vr") {
      recenter();
      return;
    }
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging || orient) return;
    state.yaw -= (e.clientX - lastX) * 0.12;
    state.pitch = Math.max(-85, Math.min(85, state.pitch + (e.clientY - lastY) * 0.12));
    lastX = e.clientX;
    lastY = e.clientY;
  });
  ["pointerup", "pointercancel"].forEach(function (n) {
    canvas.addEventListener(n, function () {
      dragging = false;
    });
  });

  window.addEventListener("keydown", function (e) {
    if (mode === "idle") return;
    if (e.key === "Escape") exitToTour();
    else if (e.key === "ArrowLeft") state.yaw -= 5;
    else if (e.key === "ArrowRight") state.yaw += 5;
    else if (e.key === "ArrowUp") state.pitch = Math.min(85, state.pitch + 5);
    else if (e.key === "ArrowDown") state.pitch = Math.max(-85, state.pitch - 5);
    else if (e.key === "d" || e.key === "D") {
      lensOn = !lensOn;
      toast("Lens correction " + (lensOn ? "on" : "off"));
    }
  });

  function recenter() {
    state.needCalib = true;
    state.yaw = state.homeYaw;
    state.pitch = 0;
    toast("View re-centred");
  }

  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      resize();
      state.needCalib = true;
    }, 250);
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && mode === "vr" && "wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }).catch(function () {});
    }
  });

  // ---------- Entering VR / preview ----------
  function enter(kind, opts) {
    opts = opts || {};
    // Motion permission (iOS) must be requested directly from the tap.
    var permission = Promise.resolve();
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      permission = DeviceOrientationEvent.requestPermission().catch(function () {});
    }
    var fullscreen = Promise.resolve();
    if (kind === "vr" && !opts.skipDevice) {
      var el = document.documentElement;
      if (el.requestFullscreen) fullscreen = el.requestFullscreen().catch(function () {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
    return Promise.all([permission, fullscreen]).then(function () {
      window.addEventListener("deviceorientation", onOrient, true);
      if (kind === "vr" && !opts.skipDevice) {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(function () {});
        if ("wakeLock" in navigator) navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }).catch(function () {});
      }
      mode = kind;
      lensOn = document.getElementById("optDist").checked;
      document.body.classList.toggle("vr", kind === "vr");
      document.getElementById("start").hidden = true;
      document.getElementById("hud").hidden = kind === "vr";
      resize();
      var first = new URLSearchParams(location.search).get("scene");
      if (!tourConfig.scenes[first]) first = "exit 1";
      var scene = tourConfig.scenes[first];
      return goTo(first, typeof scene.yaw === "number" ? scene.yaw : 0);
    });
  }

  document.getElementById("btnVR").addEventListener("click", function () {
    enter("vr");
  });
  document.getElementById("btnPreview").addEventListener("click", function () {
    enter("preview");
  });
  document.getElementById("btnBack").addEventListener("click", exitToTour);

  // Test hook: ?autostart=vr|preview&yaw=..&pitch=..&lens=0 (used for automated screenshots)
  var q = new URLSearchParams(location.search);
  if (q.get("autostart")) {
    document.getElementById("optDist").checked = q.get("lens") !== "0";
    enter(q.get("autostart"), { skipDevice: true }).then(function () {
      if (q.get("yaw")) state.yaw = parseFloat(q.get("yaw"));
      if (q.get("pitch")) state.pitch = parseFloat(q.get("pitch"));
    });
  }

  window.__vr = { state: state, goTo: goTo };
  requestAnimationFrame(frame);
})();
