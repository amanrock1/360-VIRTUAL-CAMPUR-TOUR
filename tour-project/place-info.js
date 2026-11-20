/* ==========================================================================
   Place information pop-ups for the tour.

   Round "i" circles are placed on buildings inside some scenes. Clicking one
   opens a short information card. Edit the text in PLACE_INFO and the
   positions in INFO_SPOTS; nothing else needs to change.

   Every statement below comes from the official site, vitbhopal.ac.in
   (pages: /infrastructure, /library, /caltech-vit, /schools/architecture,
   /hostel-life, /campus-life, /student-welfare/sports, /contact), except where a
   comment says "confirm with VIT". Keep new text just as factual.
   Used by the tour only (VR mode does not load this file).
   ========================================================================== */

var PLACE_INFO = {
  entrance: {
    title: "VIT Bhopal University",
    text: "Welcome to VIT Bhopal University. The campus is on the Bhopal–Indore Highway at Kothrikalan, Sehore, Madhya Pradesh.",
    links: [{ label: "Contact and location", url: "https://vitbhopal.ac.in/contact" }],
  },
  labComplex: {
    title: "Lab Complex",
    text: "The Lab Complex is home to the gaming studio, the aerospace and IoT labs and the bioengineering labs. It also has a library reading room (LC 204).",
    links: [{ label: "Infrastructure", url: "https://vitbhopal.ac.in/infrastructure" }],
  },
  academicBlock1: {
    title: "Academic Block 1",
    text: "Classes here follow CALTech (Collaborative Active Learning through Technology): classrooms are studios, with seating that groups and regroups and a work surface at every place. The Central Library has two dedicated floors in Academic Block 1 and two in Academic Block 2.",
    links: [
      { label: "About CALTech", url: "https://vitbhopal.ac.in/caltech-vit" },
      { label: "Central Library", url: "https://vitbhopal.ac.in/library" },
    ],
  },
  academicBlock2: {
    title: "Academic Block 2",
    text: "The Central Library has two dedicated floors in each of Academic Blocks 1 and 2, with open-access shelves, an online catalogue, RFID self-issue kiosks and digital libraries with 60 dedicated systems across the two blocks.",
    links: [{ label: "Central Library", url: "https://vitbhopal.ac.in/library" }],
  },
  architecture: {
    title: "Architecture Block",
    text: "The School of Architecture teaches through a pedagogy it calls “Vernacular to Virtual”, where traditional wisdom meets digital tools such as AR/VR. The five-year Bachelor of Architecture began in 2021 and is approved by the Council of Architecture.",
    links: [{ label: "School of Architecture", url: "https://vitbhopal.ac.in/schools/architecture" }],
  },
  mph: {
    // Confirm with VIT: the official site does not describe the MPH itself. The sentence about sports
    // facilities is from /campus-life and /student-welfare/sports.
    title: "Multipurpose Hall (MPH)",
    text: "The Multipurpose Hall hosts indoor sports and student activities. Sports on campus include indoor courts, grounds, nets and a gym.",
    links: [{ label: "Sports at VIT Bhopal", url: "https://vitbhopal.ac.in/student-welfare/sports" }],
  },
  girlsHostel: {
    title: "Hostels",
    text: "Separate residences are provided for men and women, each with its own entrance, staff and security. A Faculty-in-Residence team lives alongside the students in every block, and every block has a study area. Facilities include 24-hour Wi-Fi, mess options, filtered drinking water and an ATM.",
    links: [{ label: "Hostel life", url: "https://vitbhopal.ac.in/hostel-life" }],
  },
  foodCourt: {
    title: "Food Court",
    text: "Mess halls, cafeterias and food courts are spread across the campus. Hostel mess menus include South Indian, North Indian and Jain options.",
    links: [{ label: "Campus life", url: "https://vitbhopal.ac.in/campus-life" }],
  },
};

// Where the circles go: scene id -> [{ info, yaw, pitch }] (degrees; yaw 0 = centre of the panorama)
var INFO_SPOTS = {
  "exit 1": [{ info: "entrance", yaw: -12, pitch: 8 }],
  "lc 3": [{ info: "labComplex", yaw: -72, pitch: 8 }],
  "ab front gate 2": [{ info: "academicBlock1", yaw: 2, pitch: 12 }],
  "ab2  3": [{ info: "academicBlock2", yaw: -28, pitch: 10 }],
  "arch 1": [{ info: "architecture", yaw: -50, pitch: 10 }],
  "mph 1": [{ info: "mph", yaw: -80, pitch: 5 }],
  "hostel start 2": [{ info: "girlsHostel", yaw: 100, pitch: 16 }],
  "ab 15": [{ info: "foodCourt", yaw: -58, pitch: 6 }],
};

// ---------- Pop-up card ----------
var placeInfoCard = null;

function closePlaceInfo() {
  var card = document.getElementById("infoCard");
  if (card) card.hidden = true;
}

function showPlaceInfo(event, info) {
  var card = document.getElementById("infoCard");
  if (!card || !info) return;
  document.getElementById("infoTitle").textContent = info.title;
  document.getElementById("infoText").textContent = info.text;

  var links = document.getElementById("infoLinks");
  links.textContent = "";
  (info.links || []).forEach(function (l) {
    var a = document.createElement("a");
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.label;
    links.appendChild(a);
  });

  card.hidden = false;
  document.getElementById("infoClose").focus({ preventScroll: true });
}

// Adds the round "i" hotspots to the scenes listed in INFO_SPOTS.
function applyPlaceInfo(config) {
  Object.keys(INFO_SPOTS).forEach(function (sceneId) {
    var scene = config.scenes[sceneId];
    if (!scene) return;
    scene.hotSpots = scene.hotSpots || [];
    INFO_SPOTS[sceneId].forEach(function (spot) {
      var info = PLACE_INFO[spot.info];
      if (!info) return;
      scene.hotSpots.push({
        type: "info",
        yaw: spot.yaw,
        pitch: spot.pitch,
        text: info.title,
        cssClass: "info-hotspot",
        clickHandlerFunc: showPlaceInfo,
        clickHandlerArgs: info,
      });
    });
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closePlaceInfo();
});

document.addEventListener("pointerdown", function (e) {
  var card = document.getElementById("infoCard");
  if (!card || card.hidden) return;
  if (card.contains(e.target) || (e.target.closest && e.target.closest(".info-hotspot"))) return;
  closePlaceInfo();
});

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("infoClose");
  if (btn) btn.addEventListener("click", closePlaceInfo);
});
