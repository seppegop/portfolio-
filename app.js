/* Giuseppe Orellana — portfolio interactions
   Minimal, mechanical. No scroll reveals.
   Only: reading progress + active section spy on case study pages. */

(function () {
  "use strict";

  /* Brand split-flap (nav): mechanically roll "Design by Giuseppe" up to
     "Giuseppe Orellana" on hover/focus, one staggered cell per glyph. */
  var brandSpan = document.querySelector(".nav .brand > span");
  if (brandSpan) {
    var FROM = "Design by Giuseppe";
    var TO = "Giuseppe Orellana";
    var len = Math.max(FROM.length, TO.length);
    var pad = function (s) { return s + Array(len - s.length + 1).join(" "); };
    var from = pad(FROM), to = pad(TO);
    brandSpan.textContent = "";
    brandSpan.className = "flapline";
    brandSpan.setAttribute("aria-hidden", "true");
    for (var i = 0; i < len; i++) {
      var cell = document.createElement("span");
      cell.className = "flap";
      var roll = document.createElement("span");
      roll.className = "flap__roll";
      roll.style.setProperty("--d", (i * 20) + "ms");
      var top = document.createElement("span");
      top.textContent = from.charAt(i);
      var bottom = document.createElement("span");
      bottom.textContent = to.charAt(i);
      roll.appendChild(top);
      roll.appendChild(bottom);
      cell.appendChild(roll);
      brandSpan.appendChild(cell);
    }
  }

  /* Reading progress bar (case study pages) */
  var progress = document.querySelector(".reading-progress span");
  var article = document.querySelector("[data-article]");
  if (progress && article) {
    var updateProgress = function () {
      var rect = article.getBoundingClientRect();
      var total = article.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      var pct = total > 0 ? scrolled / total : 0;
      progress.style.transform = "scaleX(" + pct + ")";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
  }

  /* Sticky mini-nav active section (case study pages) */
  var miniLinks = document.querySelectorAll("[data-mininav] a");
  if (miniLinks.length) {
    var sections = [];
    miniLinks.forEach(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      var sec = document.getElementById(id);
      if (sec) sections.push({ a: a, sec: sec });
    });
    var spy = function () {
      var pos = window.scrollY + window.innerHeight * 0.28;
      var current = null;
      sections.forEach(function (s) {
        if (s.sec.offsetTop <= pos) current = s;
      });
      miniLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (current) current.a.setAttribute("aria-current", "true");
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
  }

  /* Click-to-copy buttons ([data-copy]) */
  var copyButtons = document.querySelectorAll("[data-copy]");
  copyButtons.forEach(function (btn) {
    var labelEl = btn.firstChild; // leading text node holds the email
    var original = btn.getAttribute("data-copy-label") || (labelEl && labelEl.nodeValue) || "";
    var resetTimer;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.setAttribute("data-copied", "true");
        if (labelEl) labelEl.nodeValue = "copied! ";
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          btn.removeAttribute("data-copied");
          if (labelEl) labelEl.nodeValue = original.trim() + " ";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  });

  /* Image gallery lightbox — click an exhibit figure to browse all project
     screens in an expanded overlay with prev / next navigation. */
  var zoomables = document.querySelectorAll(".exhibit .figimg");
  if (zoomables.length) {
    /* Collect the gallery items in document order. */
    var gallery = [];

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Project screens gallery");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close gallery">\u2715 close</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">\u2190</button>' +
      '<figure class="lightbox__stage">' +
        '<img class="lightbox__img" alt="" />' +
        '<figcaption class="lightbox__cap">' +
          '<span class="lightbox__count" aria-hidden="true"></span>' +
          '<span class="lightbox__label"></span>' +
        '</figcaption>' +
      '</figure>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">\u2192</button>' +
      '<div class="lightbox__thumbs" role="tablist" aria-label="Jump to image"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector(".lightbox__img");
    var lbClose = lb.querySelector(".lightbox__close");
    var lbPrev = lb.querySelector(".lightbox__nav--prev");
    var lbNext = lb.querySelector(".lightbox__nav--next");
    var lbCount = lb.querySelector(".lightbox__count");
    var lbLabel = lb.querySelector(".lightbox__label");
    var lbThumbs = lb.querySelector(".lightbox__thumbs");
    var lastFocus = null;
    var current = 0;

    var pad2 = function (n) { return n < 10 ? "0" + n : "" + n; };

    /* Append a gallery-only entry (image + thumbnail) that has no visible
       figure on the page — used for extra detail screens. */
    var addGalleryItem = function (src, alt, label) {
      var index = gallery.length;
      gallery.push({ src: src, alt: alt, label: label });
      var thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "lightbox__thumb";
      thumb.setAttribute("role", "tab");
      thumb.setAttribute("aria-label", "Show image " + (index + 1));
      thumb.innerHTML = '<img src="' + src + '" alt="" />';
      thumb.addEventListener("click", function () { show(index); });
      lbThumbs.appendChild(thumb);
      return index;
    };

    var show = function (i) {
      if (!gallery.length) return;
      current = (i + gallery.length) % gallery.length;
      var item = gallery[current];
      lbImg.setAttribute("src", item.src);
      lbImg.setAttribute("alt", item.alt || "");
      lbCount.textContent = pad2(current + 1) + " / " + pad2(gallery.length);
      lbLabel.textContent = item.label || "";
      var thumbBtns = lbThumbs.children;
      for (var t = 0; t < thumbBtns.length; t++) {
        var active = t === current;
        thumbBtns[t].setAttribute("aria-selected", active ? "true" : "false");
        thumbBtns[t].classList.toggle("is-active", active);
      }
      /* Single-image galleries hide the navigation affordances. */
      var multi = gallery.length > 1;
      lbPrev.hidden = !multi;
      lbNext.hidden = !multi;
      lbThumbs.hidden = !multi;
    };

    var openLb = function (i) {
      show(i);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    };
    var closeLb = function () {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    zoomables.forEach(function (img) {
      var fig = img.closest(".exhibit");
      var headEl = fig && (fig.querySelector(".exhibit__head > span") || fig.querySelector(".exhibit__head"));
      var label = headEl ? headEl.textContent.replace(/\s+/g, " ").trim() : (img.getAttribute("alt") || "");

      /* The visible figure becomes the first entry in its mini-set. */
      var index = addGalleryItem(img.getAttribute("src"), img.getAttribute("alt"), label);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "figzoom";
      btn.setAttribute("aria-label", "Expand image to full size");
      img.parentNode.insertBefore(btn, img);
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        lastFocus = btn;
        openLb(index);
      });

      /* Optional gallery-only detail screens, declared on the image as
         data-gallery-extra="src::alt||src::alt" — they show only in the
         expanded gallery, never on the page. */
      var extra = img.getAttribute("data-gallery-extra");
      if (extra) {
        extra.split("||").forEach(function (entry) {
          var parts = entry.split("::");
          var esrc = (parts[0] || "").trim();
          if (!esrc) return;
          var ealt = (parts[1] || "").trim();
          addGalleryItem(esrc, ealt, ealt || label);
        });
      }
    });

    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
})();
