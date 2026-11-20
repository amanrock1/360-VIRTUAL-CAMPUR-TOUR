/* ==========================================================
   Display names for every scene in the tour.
   Scene ids (e.g. "ab2  3") are internal file names; visitors
   should only ever see the readable names produced here.
   To rename a place, edit the matching rule below.
   ========================================================== */

const SCENE_NAME_RULES = [
  [/^exit/, "Main Entrance"],
  [/^flag$/, "Flag Point"],
  [/^all path$/, "Central Walkway"],
  [/^main mid$/, "Central Junction"],
  [/^parcel/, "Parcel Area"],
  [/^girls/, "Girls Hostel"],
  [/^hostel start/, "Hostel Entrance"],
  [/^ab front gate/, "Academic Block 1 – Front Gate"],
  [/^ab back gate/, "Academic Block 1 – Back Gate"],
  [/^ab 2 gate|^ab2/, "Academic Block 2"],
  [/^ab 15$/, "Food Court"],
  [/^ab \d+/, "Academic Block 1"],
  [/^mph/, "Multipurpose Hall"],
  [/^lion park$/, "Lion Park"],
  [/^lc /, "Lab Complex"],
  [/^arch/, "Architecture Block"],
];

function sceneDisplayName(sceneId) {
  for (const [pattern, name] of SCENE_NAME_RULES) {
    if (pattern.test(sceneId)) return name;
  }
  return sceneId.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Replaces every scene title and hotspot label in the tour config.
function applySceneNames(config) {
  Object.entries(config.scenes).forEach(([id, scene]) => {
    const here = sceneDisplayName(id);
    scene.title = here;

    (scene.hotSpots || []).forEach((hs) => {
      if (hs.type !== "scene" || !hs.sceneId) return;
      const there = sceneDisplayName(hs.sceneId);
      if (there !== here) {
        hs.text = there;
      } else {
        hs.text = /^(prev|back)/i.test(hs.text || "") ? "Back" : "Forward";
      }
    });
  });
}
