/* ==========================================================================
   Chooses which panorama set to load.

   LITE_IMAGES = true  -> "lite/<file>.jpg"  (2560 px wide, ~0.5 MB)
   LITE_IMAGES = false -> "<file>.jpg"       (3584 px wide, ~1.2 MB)

   Lite is used on phones and on slow or data-saving connections, so the first
   view appears quickly. Force a set by adding ?quality=lite or ?quality=full
   to the page address.
   Must be loaded before scenes-data.js.
   ========================================================================== */
var LITE_IMAGES = (function () {
  var forced = new URLSearchParams(location.search).get("quality");
  if (forced === "full") return false;
  if (forced === "lite") return true;

  var conn = navigator.connection || {};
  var slow = conn.saveData === true || /(^|-)2g$|3g/.test(conn.effectiveType || "");
  var phone = Math.min(screen.width, screen.height) <= 600; // CSS pixels
  return slow || phone;
})();
