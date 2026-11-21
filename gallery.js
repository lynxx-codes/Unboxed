/* ============================================================
   UNBOXED by terdòô — product gallery (84 products)

   HOW TO ADD YOUR PRODUCTS
   1. Put your photos in a folder called  images/gallery  (next to index.html)
   2. Fill in the list below — ONE LINE PER PRODUCT, like this:

        file name | Product name | Size | Price

      Example:   3.jpg | Your Perfume Name | 50ml | 23000

   - Size and Price can be left empty. Price is numbers only (no ₦, no commas).
   - Leave the name empty and the card says "Fragrance 3" until you add it.
   - To remove a product: delete its line. To add one: add a new line.
   - Do NOT use the | symbol or the ` symbol inside a name.
   - Lines starting with # are ignored.
   ============================================================ */

(function () {
  "use strict";

  /* ----------- YOUR PRODUCT LIST ----------- */
  const PRODUCT_LIST = `
    1.jpg |hugo  |  | 
    2.jpg |  |  | 
    3.jpg |  |  | 
    4.jpg |  |  | 
    5.jpg |  |  | 
    6.jpg |  |  | 
    7.jpg |  |  | 
    8.jpg |  |  | 
    9.jpg |  |  | 
    10.jpg |  |  | 
    11.jpg |  |  | 
    12.jpg |  |  | 
    13.jpg |  |  | 
    14.jpg |  |  | 
    15.jpg |  |  | 
    16.jpg |  |  | 
    17.jpg |  |  | 
    18.jpg |  |  | 
    19.jpg |  |  | 
    20.jpg |  |  | 
    21.jpg |  |  | 
    22.jpg |  |  | 
    23.jpg |  |  | 
    24.jpg |  |  | 
    25.jpg |  |  | 
    26.jpg |  |  | 
    27.jpg |  |  | 
    28.jpg |  |  | 
    29.jpg |  |  | 
    30.jpg |  |  | 
    31.jpg |  |  | 
    32.jpg |  |  | 
    33.jpg |  |  | 
    34.jpg |  |  | 
    35.jpg |  |  | 
    36.jpg |  |  | 
    37.jpg |  |  | 
    38.jpg |  |  | 
    39.jpg |  |  | 
    40.jpg |  |  | 
    41.jpg |  |  | 
    42.jpg |  |  | 
    43.jpg |  |  | 
    44.jpg |  |  | 
    45.jpg |  |  | 
    46.jpg |  |  | 
    47.jpg |  |  | 
    48.jpg |  |  | 
    49.jpg |  |  | 
    50.jpg |  |  | 
    51.jpg |  |  | 
    52.jpg |  |  | 
    53.jpg |  |  | 
    54.jpg |  |  | 
    55.jpg |  |  | 
    56.jpg |  |  | 
    57.jpg |  |  | 
    58.jpg |  |  | 
    59.jpg |  |  | 
    60.jpg |  |  | 
    61.jpg |  |  | 
    62.jpg |  |  | 
    63.jpg |  |  | 
    64.jpg |  |  | 
    65.jpg |  |  | 
    66.jpg |  |  | 
    67.jpg |  |  | 
    68.jpg |  |  | 
    69.jpg |  |  | 
    70.jpg |  |  | 
    71.jpg |  |  | 
    72.jpg |  |  | 
    73.jpg |  |  | 
    74.jpg |  |  | 
    75.jpg |  |  | 
    76.jpg |  |  | 
    77.jpg |  |  | 
    78.jpg |  |  | 
    79.jpg |  |  | 
    80.jpg |  |  | 
    81.jpg |  |  | 
    82.jpg |  |  | 
    83.jpg |  |  | 
    84.jpg |  |  | 
  `;
  /* ----------------------------------------- */

  const FOLDER = "images/gallery/";
  const WHATSAPP_NUMBER = "2349065551118";
  const BATCH = 24;   // products shown per "Load more" click

  /* ---------- turn the text list into product objects ---------- */
  const products = PRODUCT_LIST
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.charAt(0) !== "#")
    .map((line, i) => {
      const p = line.split("|").map((s) => s.trim());
      const digits = (p[3] || "").replace(/[^\d]/g, "");
      return {
        file: p[0],
        name: p[1] || "Fragrance " + (i + 1),
        hasName: !!p[1],
        size: p[2] || "",
        price: digits ? Number(digits) : null,
        number: i + 1,
      };
    });

  const money = (n) => {
    try { return "₦" + n.toLocaleString("en-NG"); }
    catch (e) { return "₦" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  };

  function metaText(p) {
    const bits = [];
    if (p.size) bits.push(p.size);
    bits.push(p.price !== null ? money(p.price) : "Ask for price");
    return bits.join(" · ");
  }

  function orderLink(p) {
    let msg = "Hello Unboxed by terdòô, I'd like to order: " + p.name;
    if (p.size) msg += " (" + p.size + ")";
    if (p.price !== null) msg += " — " + money(p.price);
    if (!p.hasName) msg += " [photo " + p.file + "]";
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  /* ---------- page elements ---------- */
  const grid = document.getElementById("galleryGrid");
  const moreBtn = document.getElementById("galleryMore");
  const countEl = document.getElementById("galleryCount");
  if (!grid || !moreBtn || !countEl) return;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCount = document.getElementById("lbCount");
  const lbName = document.getElementById("lbName");
  const lbMeta = document.getElementById("lbMeta");
  const lbOrder = document.getElementById("lbOrder");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let total = products.length;  // goes down if a photo file is missing
  let rendered = 0;
  const items = [];             // { product, src, el, failed }
  let current = -1;
  let lastFocus = null;

  const visible = () => items.filter((it) => !it.failed);

  function updateFoot() {
    const shown = visible().length;
    if (rendered >= products.length) {
      moreBtn.hidden = true;
      countEl.textContent = "That's the full shelf — " + shown + " fragrances";
    } else {
      moreBtn.hidden = false;
      countEl.textContent = "Showing " + shown + " of " + total;
    }
  }

  /* ---------- one product card ---------- */
  function makeCard(p, indexInBatch, eager) {
    const src = FOLDER + p.file;

    const card = document.createElement("article");
    card.className = "g-card";
    card.style.setProperty("--i", indexInBatch);

    const photoBtn = document.createElement("button");
    photoBtn.type = "button";
    photoBtn.className = "g-item";
    photoBtn.setAttribute("aria-label", "View " + p.name + " larger");

    const img = document.createElement("img");
    img.alt = p.name;
    img.decoding = "async";
    img.loading = eager ? "eager" : "lazy";

    const item = { product: p, src: src, el: card, failed: false };

    img.addEventListener("load", () => photoBtn.classList.add("loaded"));
    img.addEventListener("error", () => {
      item.failed = true;   // missing photo: remove the whole card, no broken icon
      card.remove();
      total -= 1;
      updateFoot();
    });
    img.src = src;
    photoBtn.appendChild(img);
    photoBtn.addEventListener("click", () => openLightbox(visible().indexOf(item)));

    const info = document.createElement("div");
    info.className = "g-info";

    const name = document.createElement("h3");
    name.className = "g-name";
    name.textContent = p.name;
    name.title = p.name;

    const meta = document.createElement("p");
    meta.className = "g-meta";
    meta.textContent = metaText(p);

    info.appendChild(name);
    info.appendChild(meta);

    const order = document.createElement("a");
    order.className = "g-order";
    order.href = orderLink(p);
    order.target = "_blank";
    order.rel = "noopener";
    order.textContent = "Order on WhatsApp";
    order.setAttribute("aria-label", "Order " + p.name + " on WhatsApp");

    card.appendChild(photoBtn);
    card.appendChild(info);
    card.appendChild(order);

    items.push(item);
    return card;
  }

  function showNextBatch() {
    const slice = products.slice(rendered, rendered + BATCH);
    const frag = document.createDocumentFragment();
    slice.forEach((p, i) => {
      frag.appendChild(makeCard(p, i, rendered + i < 6));  // first 6 load straight away
    });
    rendered += slice.length;
    grid.appendChild(frag);
    updateFoot();
  }

  moreBtn.addEventListener("click", showNextBatch);

  /* ---------- lightbox (big view) ---------- */
  function show(index) {
    const list = visible();
    if (!list.length) return closeLightbox();
    current = (index + list.length) % list.length;
    const it = list[current];
    lbImg.src = it.src;
    lbImg.alt = it.product.name;
    lbName.textContent = it.product.name;
    lbMeta.textContent = metaText(it.product);
    lbOrder.href = orderLink(it.product);
    lbCount.textContent = (current + 1) + " / " + list.length;

    [list[(current + 1) % list.length], list[(current - 1 + list.length) % list.length]]
      .forEach((n) => { new Image().src = n.src; });   // pre-load neighbours
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
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      const stops = [lbClose, lbPrev, lbNext, lbOrder];
      const i = stops.indexOf(document.activeElement);
      e.preventDefault();
      stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
    }
  });

  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- start ---------- */
  showNextBatch();
})();
