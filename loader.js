/* Giuseppe Orellana — page loader
   Mechanical intro: a progress strip fills over a fixed run, then the
   dark curtain slides up to reveal the page. The first-load box swaps
   between words (Hello / Hola) with a hard cut. Runs on every load.

   Per-page configuration lives on the [data-loader] element:
     data-loader-word="Work"            single static word
     data-loader-alt="Hello,Hola"       comma list, swapped on an interval
*/
(function () {
  "use strict";

  var loader = document.querySelector("[data-loader]");
  if (!loader) return;

  var wordEl = loader.querySelector(".loader__word");
  var fill = loader.querySelector(".loader__bar > span");

  var RUN = 500;        // total run before reveal (ms)
  var ALT = 250;        // word-swap cadence (ms) — kept brisk so Hello/Hola both show within the short run
  var REVEAL = 660;     // curtain slide duration (ms), matches loader.css

  /* Word alternation (first-load box only) */
  var swap;
  var altAttr = loader.getAttribute("data-loader-alt");
  if (altAttr && wordEl) {
    var words = altAttr.split(",").map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length) {
      var i = 0;
      wordEl.textContent = words[0];
      if (words.length > 1) {
        swap = setInterval(function () {
          i = (i + 1) % words.length;
          wordEl.textContent = words[i];   // hard cut
        }, ALT);
      }
    }
  }

  /* Lock the page at the top while the curtain is down */
  var html = document.documentElement;
  var prevOverflow = html.style.overflow;
  html.style.overflow = "hidden";
  if (window.scrollY) window.scrollTo(0, 0);

  /* Drive the progress strip 0 -> 100% across the run (CSS keyframe) */
  loader.style.setProperty("--loader-run", RUN + "ms");

  /* Reveal */
  setTimeout(function () {
    if (swap) clearInterval(swap);
    loader.classList.add("is-revealing");
    html.style.overflow = prevOverflow;
    var done = function () { loader.setAttribute("hidden", ""); };
    loader.addEventListener("transitionend", done, { once: true });
    setTimeout(done, REVEAL + 120); // fallback if transitionend doesn't fire
  }, RUN);
})();
