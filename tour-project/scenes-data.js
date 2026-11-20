/* ==========================================================================
   Shared scene data for the whole project.
   Loaded by the tour ("campus tour.html") and by VR mode ("../vr_tour/index.html").

   - Every scene is one panorama file. Scene ids are the file names; keep their
     exact spelling (some contain double spaces, e.g. "ab2  3").
   - hotSpots: pitch/yaw (degrees) place the arrow; sceneId is the destination.
   - Readable names are NOT set here: see scene-names.js.
   - A low-resolution "preview" image (previews/<file>) is attached to every
     scene so something appears instantly while the full panorama downloads.
   ========================================================================== */

function pfile(name) {
  return name + ".jpg";
}
// showControls: false

var tourConfig = {
  default: {
    firstScene: "exit 1",
    hfov: 90,
    minHfov: 50,
    maxHfov: 110,
    sceneFadeDuration: 600,
    autoLoad: true,
    showControls: false,
    dragger: true,
    draggerFriction: 0.01, // Adjust friction for smoother dragging
  },
  scenes: {
    /* EXITS */
    "exit 1": {
      title: "Exit 1",
      type: "equirectangular",
      panorama: pfile("exit 1"),
      hotSpots: [
        {
          pitch: -3,
          yaw: 180,
          type: "scene",
          text: "To Exit 2",
          sceneId: "exit 2",
        },
      ],
    },

    "exit 2": {
      title: "Exit 2",
      type: "equirectangular",
      panorama: pfile("exit 2"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -8,
          yaw: 0,
          type: "scene",
          text: "Back: Exit 1",
          sceneId: "exit 1",
        },
        {
          pitch: -5,
          yaw: 60,
          type: "scene",
          text: "Flag",
          sceneId: "flag",
        },
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "All Path",
          sceneId: "all path",
        },
      ],
    },

    flag: {
      title: "Flag",
      type: "equirectangular",
      panorama: pfile("flag"),
      hotSpots: [
        {
          pitch: -6,
          yaw: 180,
          type: "scene",
          text: "Back: Exit 2",
          sceneId: "exit 2",
        },
      ],
    },

    /* ALL PATH */
    "all path": {
      title: "All Path",
      type: "equirectangular",
      panorama: pfile("all path"),
      hotSpots: [
        {
          pitch: -15,
          yaw: -65,
          type: "scene",
          text: "Back: Exit 2",
          sceneId: "exit 2",
        },
        {
          pitch: -6,
          yaw: 0,
          type: "scene",
          text: "AB 4 (right)",
          sceneId: "ab 4",
        },
        {
          pitch: -6,
          yaw: -180,
          type: "scene",
          text: "AB 3 (left)",
          sceneId: "ab 3",
        },
      ],
    },

    /* AB 3 → AB 2 → AB 1 → Main Mid */
    "ab 3": {
      title: "AB 3",
      type: "equirectangular",
      panorama: pfile("ab 3"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Back: All Path",
          sceneId: "all path",
        },
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "Next: AB 2",
          sceneId: "ab 2",
        },
      ],
    },

    "ab 2": {
      title: "AB 2",
      type: "equirectangular",
      panorama: pfile("ab 2"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: AB 3",
          sceneId: "ab 3",
        },
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "Next: AB 1",
          sceneId: "ab 1",
        },
      ],
    },

    "ab 1": {
      title: "AB 1",
      type: "equirectangular",
      panorama: pfile("ab 1"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: AB 2",
          sceneId: "ab 2",
        },
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "To Main Mid",
          sceneId: "main mid",
        },
      ],
    },

    "main mid": {
      title: "Main Mid",
      type: "equirectangular",
      panorama: pfile("main mid"),
      hotSpots: [
        {
          pitch: -5,
          yaw: -100,
          type: "scene",
          text: "To AB 1",
          sceneId: "ab 1",
        },
        {
          pitch: -5,
          yaw: 70,
          type: "scene",
          text: "Parcel 1",
          sceneId: "parcel 1",
        },
        {
          pitch: -5,
          yaw: 10,
          type: "scene",
          text: "Girls 21",
          sceneId: "girls 21",
        },
      ],
    },

    /* PARCELS */
    "parcel 1": {
      title: "Parcel 1",
      type: "equirectangular",
      panorama: pfile("parcel 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "Back: Main Mid",
          sceneId: "main mid",
        },
        {
          pitch: -5,
          yaw: 20,
          type: "scene",
          text: "Parcel 2",
          sceneId: "parcel 2",
        },
      ],
    },

    "parcel 2": {
      title: "Parcel 2",
      type: "equirectangular",
      panorama: pfile("parcel 2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: Parcel 1",
          sceneId: "parcel 1",
        },
      ],
    },

    /* GIRLS 21 → ... → GIRLS 1 → HOSTEL START 2 */
    "girls 21": {
      title: "Girls 21",
      type: "equirectangular",
      panorama: pfile("girls 21"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Back: Main Mid",
          sceneId: "main mid",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 20",
          sceneId: "girls 20",
        },
      ],
    },

    "girls 20": {
      title: "Girls 20",
      type: "equirectangular",
      panorama: pfile("girls 20"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 21",
          sceneId: "girls 21",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 18",
          sceneId: "girls 18",
        },
      ],
    },

    "girls 18": {
      title: "Girls 18",
      type: "equirectangular",
      panorama: pfile("girls 18"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 20",
          sceneId: "girls 20",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 17",
          sceneId: "girls 17",
        },
      ],
    },

    "girls 17": {
      title: "Girls 17",
      type: "equirectangular",
      panorama: pfile("girls 17"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 18",
          sceneId: "girls 18",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 16",
          sceneId: "girls 16",
        },
      ],
    },

    "girls 16": {
      title: "Girls 16",
      type: "equirectangular",
      panorama: pfile("girls 16"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 17",
          sceneId: "girls 17",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 15",
          sceneId: "girls 15",
        },
      ],
    },

    "girls 15": {
      title: "Girls 15",
      type: "equirectangular",
      panorama: pfile("girls 15"),
      yaw: -90,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 90,
          type: "scene",
          text: "Prev: Girls 16",
          sceneId: "girls 16",
        },
        {
          pitch: -5,
          yaw: -90,
          type: "scene",
          text: "Next: Girls 14",
          sceneId: "girls 14",
        },
      ],
    },

    "girls 14": {
      title: "Girls 14",
      type: "equirectangular",
      panorama: pfile("girls 14"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 15",
          sceneId: "girls 15",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 13",
          sceneId: "girls 13",
        },
      ],
    },

    "girls 13": {
      title: "Girls 13",
      type: "equirectangular",
      panorama: pfile("girls 13"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 14",
          sceneId: "girls 14",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 12",
          sceneId: "girls 12",
        },
      ],
    },

    "girls 12": {
      title: "Girls 12",
      type: "equirectangular",
      panorama: pfile("girls 12"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 13",
          sceneId: "girls 13",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 11",
          sceneId: "girls 11",
        },
      ],
    },

    "girls 11": {
      title: "Girls 11",
      type: "equirectangular",
      panorama: pfile("girls 11"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 12",
          sceneId: "girls 12",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 10",
          sceneId: "girls 10",
        },
      ],
    },

    "girls 10": {
      title: "Girls 10",
      type: "equirectangular",
      panorama: pfile("girls 10"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 11",
          sceneId: "girls 11",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 9",
          sceneId: "girls 9",
        },
      ],
    },

    "girls 9": {
      title: "Girls 9",
      type: "equirectangular",
      panorama: pfile("girls 9"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 10",
          sceneId: "girls 10",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 8",
          sceneId: "girls 8",
        },
      ],
    },

    "girls 8": {
      title: "Girls 8",
      type: "equirectangular",
      panorama: pfile("girls 8"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 9",
          sceneId: "girls 9",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 7",
          sceneId: "girls 7",
        },
      ],
    },

    "girls 7": {
      title: "Girls 7",
      type: "equirectangular",
      panorama: pfile("girls 7"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 8",
          sceneId: "girls 8",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 6",
          sceneId: "girls 6",
        },
      ],
    },

    "girls 6": {
      title: "Girls 6",
      type: "equirectangular",
      panorama: pfile("girls 6"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 7",
          sceneId: "girls 7",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 5",
          sceneId: "girls 5",
        },
      ],
    },

    "girls 5": {
      title: "Girls 5",
      type: "equirectangular",
      panorama: pfile("girls 5"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 6",
          sceneId: "girls 6",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 4",
          sceneId: "girls 4",
        },
      ],
    },

    "girls 4": {
      title: "Girls 4",
      type: "equirectangular",
      panorama: pfile("girls 4"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 5",
          sceneId: "girls 5",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 3",
          sceneId: "girls 3",
        },
      ],
    },

    "girls 3": {
      title: "Girls 3",
      type: "equirectangular",
      panorama: pfile("girls 3"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 4",
          sceneId: "girls 4",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 2",
          sceneId: "girls 2",
        },
      ],
    },

    "girls 2": {
      title: "Girls 2",
      type: "equirectangular",
      panorama: pfile("girls 2"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 3",
          sceneId: "girls 3",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Next: Girls 1",
          sceneId: "girls 1",
        },
      ],
    },

    "girls 1": {
      title: "Girls 1",
      type: "equirectangular",
      panorama: pfile("girls 1"),
      yaw: 180,
      pitch: 0,
      hfov: 100,
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: Girls 2",
          sceneId: "girls 2",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "To Hostel Start 2",
          sceneId: "hostel start 2",
        },
      ],
    },

    /* HOSTEL START 2 and AB 2 chain */
    "hostel start 2": {
      title: "Hostel Start 2",
      type: "equirectangular",
      panorama: pfile("hostel start 2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "To AB 2 1",
          sceneId: "ab2  1",
        },
        {
          pitch: -5,
          yaw: 120,
          type: "scene",
          text: "To Girls 1",
          sceneId: "girls 1",
        },
      ],
    },

    "ab2  1": {
      title: "AB 2 1",
      type: "equirectangular",
      panorama: pfile("ab2  1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: Hostel Start 2",
          sceneId: "hostel start 2",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB2 2",
          sceneId: "ab2  2",
        },
      ],
    },

    "ab2  2": {
      title: "AB 2 2",
      type: "equirectangular",
      panorama: pfile("ab2  2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 1",
          sceneId: "ab2  1",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 3",
          sceneId: "ab2  3",
        },
      ],
    },

    "ab2  3": {
      title: "AB 2 3",
      type: "equirectangular",
      panorama: pfile("ab2  3"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 2",
          sceneId: "ab2  2",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 5",
          sceneId: "ab2  5",
        },
      ],
    },

    "ab2  5": {
      title: "AB 2 5",
      type: "equirectangular",
      panorama: pfile("ab2  5"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 3",
          sceneId: "ab2  3",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 6",
          sceneId: "ab2  6",
        },
      ],
    },

    "ab2  6": {
      title: "AB 2 6",
      type: "equirectangular",
      panorama: pfile("ab2  6"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 5",
          sceneId: "ab2  5",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 7",
          sceneId: "ab2  7",
        },
      ],
    },

    "ab2  7": {
      title: "AB 2 7",
      type: "equirectangular",
      panorama: pfile("ab2  7"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 6",
          sceneId: "ab2  6",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 8",
          sceneId: "ab2  8",
        },
      ],
    },

    "ab2  8": {
      title: "AB 2 8",
      type: "equirectangular",
      panorama: pfile("ab2  8"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 2 7",
          sceneId: "ab2  7",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 2 9",
          sceneId: "ab 2 gate 9",
        },
      ],
    },

    "ab 2 gate 9": {
      title: "AB 2 9",
      type: "equirectangular",
      panorama: pfile("ab 2 gate 9"),
      hotSpots: [
        {
          pitch: -5,
          yaw: -90,
          type: "scene",
          text: "Prev: AB 2 8",
          sceneId: "ab2  8",
        },
      ],
    },

    /* AB 4 → AB 5 → AB 6 → branch to mph1 and ab7 */
    "ab 4": {
      title: "AB 4",
      type: "equirectangular",
      panorama: pfile("ab 4"),
      hotSpots: [
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "Back: All Path",
          sceneId: "all path",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 5",
          sceneId: "ab 5",
        },
      ],
    },

    "ab 5": {
      title: "AB 5",
      type: "equirectangular",
      panorama: pfile("ab 5"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 4",
          sceneId: "ab 4",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 6",
          sceneId: "ab 6",
        },
      ],
    },

    "ab 6": {
      title: "AB 6",
      type: "equirectangular",
      panorama: pfile("ab 6"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 5",
          sceneId: "ab 5",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 7",
          sceneId: "ab 7",
        },
        {
          pitch: -5,
          yaw: -90,
          type: "scene",
          text: "To MPH 1 (branch)",
          sceneId: "mph 1",
        },
      ],
    },

    /* MPH path */
    "mph 1": {
      title: "MPH 1",
      type: "equirectangular",
      panorama: pfile("mph 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: AB 6",
          sceneId: "ab 6",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: MPH 2",
          sceneId: "mph 2",
        },
      ],
    },

    "mph 2": {
      title: "MPH 2",
      type: "equirectangular",
      panorama: pfile("mph 2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: MPH 1",
          sceneId: "mph 1",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: MPH 3",
          sceneId: "mph 3",
        },
      ],
    },

    "mph 3": {
      title: "MPH 3",
      type: "equirectangular",
      panorama: pfile("mph 3"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: MPH 2",
          sceneId: "mph 2",
        },
        {
          pitch: -5,
          yaw: 80,
          type: "scene",
          text: "Next: MPH 4",
          sceneId: "mph 4",
        },
      ],
    },

    "mph 4": {
      title: "MPH 4",
      type: "equirectangular",
      panorama: pfile("mph 4"),
      hotSpots: [
        {
          pitch: -5,
          yaw: -90,
          type: "scene",
          text: "Prev: MPH 3",
          sceneId: "mph 3",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "To Lion Park",
          sceneId: "lion park",
        },
      ],
    },

    "lion park": {
      title: "Lion Park",
      type: "equirectangular",
      panorama: pfile("lion park"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: MPH 4",
          sceneId: "mph 4",
        },
      ],
    },

    /* AB 7 → AB 9 → AB 10 → ... → AB 15 */
    "ab 7": {
      title: "AB 7",
      type: "equirectangular",
      panorama: pfile("ab 7"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 6",
          sceneId: "ab 6",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 9",
          sceneId: "ab 9",
        },
      ],
    },

    "ab 9": {
      title: "AB 9",
      type: "equirectangular",
      panorama: pfile("ab 9"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 7",
          sceneId: "ab 7",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 10",
          sceneId: "ab 10",
        },
      ],
    },

    "ab 10": {
      title: "AB 10",
      type: "equirectangular",
      panorama: pfile("ab 10"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 9",
          sceneId: "ab 9",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 11",
          sceneId: "ab 11",
        },
      ],
    },

    "ab 11": {
      title: "AB 11",
      type: "equirectangular",
      panorama: pfile("ab 11"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 10",
          sceneId: "ab 10",
        },
        {
          pitch: -5,
          yaw: 5,
          type: "scene",
          text: "Next: AB 12",
          sceneId: "ab 12",
        },
      ],
    },

    "ab 12": {
      title: "AB 12",
      type: "equirectangular",
      panorama: pfile("ab 12"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 11",
          sceneId: "ab 11",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 13",
          sceneId: "ab 13",
        },
      ],
    },

    "ab 13": {
      title: "AB 13",
      type: "equirectangular",
      panorama: pfile("ab 13"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 12",
          sceneId: "ab 12",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 14",
          sceneId: "ab 14",
        },
      ],
    },

    "ab 14": {
      title: "AB 14",
      type: "equirectangular",
      panorama: pfile("ab 14"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 13",
          sceneId: "ab 13",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 15",
          sceneId: "ab 15",
        },
      ],
    },

    "ab 15": {
      title: "AB 15",
      type: "equirectangular",
      panorama: pfile("ab 15"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 140,
          type: "scene",
          text: "To AB Front Gate 1",
          sceneId: "ab front gate 1",
        },
        {
          pitch: -5,
          yaw: -140,
          type: "scene",
          text: "Back: AB 14",
          sceneId: "ab 14",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Forward: AB 16",
          sceneId: "ab 16",
        },
      ],
    },

    "ab front gate 1": {
      title: "AB Front Gate 1",
      type: "equirectangular",
      panorama: pfile("ab front gate 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Prev: AB 15",
          sceneId: "ab 15",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "To AB Front Gate 2",
          sceneId: "ab front gate 2",
        },
      ],
    },

    "ab front gate 2": {
      title: "AB Front Gate 2",
      type: "equirectangular",
      panorama: pfile("ab front gate 2"),
      hotSpots: [
        {
          pitch: 0,
          yaw: -80,
          type: "scene",
          text: "Back: AB Front Gate 1",
          sceneId: "ab front gate 1",
        },
      ],
    },

    /* AB 16 → AB 17 → AB 18 → AB 19 */
    "ab 16": {
      title: "AB 16",
      type: "equirectangular",
      panorama: pfile("ab 16"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: AB 15",
          sceneId: "ab 15",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 17",
          sceneId: "ab 17",
        },
      ],
    },

    "ab 17": {
      title: "AB 17",
      type: "equirectangular",
      panorama: pfile("ab 17"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 16",
          sceneId: "ab 16",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 18",
          sceneId: "ab 18",
        },
      ],
    },

    "ab 18": {
      title: "AB 18",
      type: "equirectangular",
      panorama: pfile("ab 18"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB 17",
          sceneId: "ab 17",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB 19",
          sceneId: "ab 19",
        },
      ],
    },

    "ab 19": {
      title: "AB 19",
      type: "equirectangular",
      panorama: pfile("ab 19"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 170,
          type: "scene",
          text: "Prev: AB 18",
          sceneId: "ab 18",
        },
        {
          pitch: -5,
          yaw: 80,
          type: "scene",
          text: "To AB Back Gate 3",
          sceneId: "ab back gate 3",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "To LC 1",
          sceneId: "lc 1",
        },
      ],
    },

    /* AB BACK GATE chain */
    "ab back gate 3": {
      title: "AB Back 3",
      type: "equirectangular",
      panorama: pfile("ab back gate 3"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: AB Back 2",
          sceneId: "ab back gate 2",
        },
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB BACK 19",
          sceneId: "ab 19",
        },
      ],
    },

    "ab back gate 2": {
      title: "AB Back 2",
      type: "equirectangular",
      panorama: pfile("ab back gate 2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB Back 3",
          sceneId: "ab back gate 3",
        },
        {
          pitch: -5,
          yaw: 10,
          type: "scene",
          text: "Next: AB Back 1",
          sceneId: "ab back gate 1",
        },
      ],
    },

    "ab back gate 1": {
      title: "AB Back 1",
      type: "equirectangular",
      panorama: pfile("ab back gate 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: AB Back 2",
          sceneId: "ab back gate 2",
        },
      ],
    },

    /* LC path */
    "lc 1": {
      title: "LC 1",
      type: "equirectangular",
      panorama: pfile("lc 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: LC 2",
          sceneId: "lc 2",
        },
        {
          pitch: -5,
          yaw: -180,
          type: "scene",
          text: "Back: AB 19",
          sceneId: "ab 19",
        },
      ],
    },

    "lc 2": {
      title: "LC 2",
      type: "equirectangular",
      panorama: pfile("lc 2"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: LC 1",
          sceneId: "lc 1",
        },
        {
          pitch: -5,
          yaw: -100,
          type: "scene",
          text: "Arch 1",
          sceneId: "arch 1",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: LC 3",
          sceneId: "lc 3",
        },
      ],
    },

    "arch 1": {
      title: "Arch 1",
      type: "equirectangular",
      panorama: pfile("arch 1"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Back: LC 2",
          sceneId: "lc 2",
        },
      ],
    },

    "lc 3": {
      title: "LC 3",
      type: "equirectangular",
      panorama: pfile("lc 3"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: LC 2",
          sceneId: "lc 2",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: LC 4",
          sceneId: "lc 4",
        },
      ],
    },

    "lc 4": {
      title: "LC 4",
      type: "equirectangular",
      panorama: pfile("lc 4"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: LC 3",
          sceneId: "lc 3",
        },
        {
          pitch: -5,
          yaw: 0,
          type: "scene",
          text: "Next: LC 5",
          sceneId: "lc 5",
        },
      ],
    },

    "lc 5": {
      title: "LC 5",
      type: "equirectangular",
      panorama: pfile("lc 5"),
      hotSpots: [
        {
          pitch: -5,
          yaw: 180,
          type: "scene",
          text: "Prev: LC 4",
          sceneId: "lc 4",
        },
      ],
    },
  }, // end scenes
};

//Navigation orientation automatically(forward- backward)
for (let sceneKey in tourConfig.scenes) {
  let scene = tourConfig.scenes[sceneKey];
  if (scene.hotSpots) {
    for (let hs of scene.hotSpots) {
      if (hs.type === "scene" && hs.sceneId) {
        let targetScene = tourConfig.scenes[hs.sceneId];
        if (targetScene && targetScene.hotSpots) {
          let rev = targetScene.hotSpots.find(
            (s) => s.type === "scene" && s.sceneId === sceneKey,
          );
          if (
            rev &&
            rev.yaw !== undefined &&
            hs.targetYaw === undefined
          ) {
            let y = rev.yaw + 180;
            while (y > 180) y -= 360;
            while (y <= -180) y += 360;
            hs.targetYaw = y;
          }
        }
      }
    }
  }
}

// Low-resolution placeholder shown immediately while the panorama loads, and the
// smaller "lite" panorama on phones / slow connections (see device.js).
const useLite = typeof LITE_IMAGES !== "undefined" && LITE_IMAGES;
for (const sceneKey in tourConfig.scenes) {
  const scene = tourConfig.scenes[sceneKey];
  const file = scene.panorama;
  scene.preview = "previews/" + file;
  if (useLite) scene.panorama = "lite/" + file;
}
