/* ============================================================
   UNBOXED by terdòô — gallery (90+ photos)

   HOW TO ADD YOUR PHOTOS
   1. Make a folder called  images/gallery  next to index.html
   2. Put your photos in it, named 1.jpg, 2.jpg, 3.jpg ... 90.jpg
   3. That's it. To use more or fewer photos, change TOTAL below.

   Photos named something else, or a mix of .jpg / .png / .webp?
   Paste the exact file names into the FILES list below and
   TOTAL / EXTENSION will be ignored.
   ============================================================ */

(function () {
  "use strict";

  /* ----------- EDIT THESE ----------- */
  const FOLDER = "images/gallery/";
  const TOTAL = ;          // how many numbered photos you have
  const EXTENSION = "jpg";   // jpg, jpeg, png or webp
  const BATCH = ;          // photos shown per "Load more" click
  const FILES = [
    // "black-orchid.jpg",
    // "oud-wood.png",
  ];
  /* ---------------------------------- */

  const names = FILES.length
    ? FILES
    : Array.from({ length: TOTAL }, (_, i) => (i + 1) + "." + EXTENSION);

  const grid = document.getElementById("galleryGrid");
  const moreBtn = document.getElementById("galleryMore");
  const countEl = document.getElementById("galleryCount");
  if (!grid || !moreBtn || !countEl) return;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCount = document.getElementById("lbCount");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let total = names.length;   // goes down if a file is missing
  let rendered = 0;           // how many have been added to the page
  const items = [];           // { src, el, failed }
  let current = -1;           // index inside visible() while lightbox is open
  let lastFocus = null;

  function visible() {
    return items.filter((it) => !it.failed);
  }

  function updateFoot() {
    const shown = visible().length;
    if (rendered >= names.length) {
      moreBtn.hidden = true;
      countEl.textContent = "That's the full shelf — " + shown + " photos";
    } else {
      moreBtn.hidden = false;
      countEl.textContent = "Showing " + shown + " of " + total;
    }
  }

  function makeItem(name, indexInBatch, eager) {
    const src = FOLDER + name;
    const number = items.length + 1;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "g-item";
    btn.style.setProperty("--i", indexInBatch);
    btn.setAttribute("aria-label", "View photo " + number + " larger");

    const img = document.createElement("img");
    img.alt = "Unboxed fragrance photo " + number;
    img.decoding = "async";
    img.loading = eager ? "eager" : "lazy";

    const item = { src: src, el: btn, failed: false, alt: img.alt };

    img.addEventListener("load", () => btn.classList.add("loaded"));
    img.addEventListener("error", () => {
      // missing file: remove the tile so there's no broken-image icon or gap
      item.failed = true;
      btn.remove();
      total -= 1;
      updateFoot();
    });
    img.src = src;

    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(visible().indexOf(item)));

    items.push(item);
    return btn;
  }

  function showNextBatch() {
    const slice = names.slice(rendered, rendered + BATCH);
    const frag = document.createDocumentFragment();
    slice.forEach((name, i) => {
      // first 6 photos on the page load straight away, the rest wait until needed
      frag.appendChild(makeItem(name, i, rendered + i < 6));
    });
    rendered += slice.length;
    grid.appendChild(frag);
    updateFoot();
  }

  moreBtn.addEventListener("click", showNextBatch);

  /* ---------------- Lightbox ---------------- */

  function show(index) {
    const list = visible();
    if (!list.length) return closeLightbox();
    current = (index + list.length) % list.length;
    const it = list[current];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCount.textContent = (current + 1) + " / " + list.length;

    // quietly pre-load the neighbours so next/prev feels instant
    [list[(current + 1) % list.length], list[(current - 1 + list.length) % list.length]]
      .forEach((n) => { new Image().src = n.src; });
  }

  function openLightbox(index) {
    if (index < 0) return;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    show(index);
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    current = -1;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => show(current - 1));
  lbNext.addEventListener("click", () => show(current + 1));

  // click on the dark area (not the photo or buttons) closes it
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the viewer while it's open
      const stops = [lbClose, lbPrev, lbNext];
      const i = stops.indexOf(document.activeElement);
      e.preventDefault();
      stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
    }
  });

  // swipe left / right on phones
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------------- Start ---------------- */

  showNextBatch();
})();
