/* ============================================================
   UNBOXED by terdòô — script.js
   You should not need to edit this file. Products, prices and
   contact details all live in data.js.

   The bag is saved in this device's own browser storage. Ordering
   opens a pre-filled WhatsApp message. No payments, no accounts,
   nothing is sent anywhere until the customer taps send in WhatsApp.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- 0. Read data.js safely ---------------- */

  const SET = (typeof SETTINGS !== "undefined" && SETTINGS) ? SETTINGS : {};
  const RAW_LIST = (typeof PRODUCT_LIST !== "undefined") ? PRODUCT_LIST : null;
  const REVIEW_LIST = (typeof REVIEWS !== "undefined" && Array.isArray(REVIEWS)) ? REVIEWS : [];

  const WHATSAPP = String(SET.whatsappNumber || "2349065551118").replace(/\D/g, "");
  const BATCH = Math.max(6, parseInt(SET.batchSize, 10) || 24);
  const SHOW_PATHS = SET.showMissingPhotoPath !== false;
  let FOLDER = SET.imageFolder == null ? "images/" : String(SET.imageFolder);
  if (FOLDER && FOLDER.slice(-1) !== "/") FOLDER += "/";

  const CART_KEY = "unboxed_bag_v2";
  const CUSTOMER_KEY = "unboxed_customer_v2";
  const MAX_QTY = 99;

  /* ---------------- 1. Small helpers ---------------- */

  const $ = (id) => document.getElementById(id);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function money(n) {
    try { return "₦" + n.toLocaleString("en-NG"); }
    catch (e) { return "₦" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  }

  const ICON_ADD =
    '<svg class="ic-add" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M12 11.5v5M9.5 14h5"/></svg>';
  const ICON_CHECK =
    '<svg class="ic-check" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  let toastTimer = null;
  function toast(message) {
    const t = $("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------------- 2. Turn the product list into products ---------------- */

  function parseNumber(text) {
    const cleaned = String(text || "").replace(/[₦,\s]/g, "");
    return /^\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
  }

  // "100 ML" and "100ml" count as the same size
  function sizeKey(text) {
    return String(text || "").toLowerCase().replace(/\s+/g, "");
  }

  function parseProducts(text) {
    const list = [];
    const seen = {};
    String(text || "").split("\n").forEach((raw) => {
      const line = raw.trim();
      if (!line || line.charAt(0) === "#") return;

      const p = line.split("|").map((s) => s.trim());
      let file = p[0];
      if (!file) return;
      if (!/\.[a-z0-9]{2,5}$/i.test(file)) file += ".jpg";   // "5" means "5.jpg"

      if (seen[file]) {
        console.warn("data.js: the photo " + file + " is listed twice. Only the first one is used.");
        return;
      }
      seen[file] = true;

      const number = list.length + 1;
      list.push({
        id: file,
        src: FOLDER + file,
        name: p[1] || ("Fragrance " + number),
        hasName: !!p[1],
        size: p[2] || "",
        sizeKey: sizeKey(p[2]),
        price: parseNumber(p[3]),
        was: parseNumber(p[4]),
        number: number
      });
    });
    return list;
  }

  const products = parseProducts(RAW_LIST);
  const byId = {};
  products.forEach((p) => { byId[p.id] = p; });

  /* ---------------- 3. Business details from data.js ---------------- */

  function fillBusinessDetails() {
    document.querySelectorAll('[data-link="whatsapp"]').forEach((a) => { a.href = "https://wa.me/" + WHATSAPP; });
    document.querySelectorAll('[data-link="tel"]').forEach((a) => { a.href = "tel:+" + WHATSAPP; });

    if (SET.instagramHandle) {
      const handle = String(SET.instagramHandle).replace(/^@/, "");
      document.querySelectorAll('[data-link="instagram"]').forEach((a) => {
        a.href = "https://www.instagram.com/" + encodeURIComponent(handle);
      });
    }
    if (SET.address) {
      const q = encodeURIComponent(String(SET.address));
      document.querySelectorAll('[data-link="directions"]').forEach((a) => {
        a.href = "https://www.google.com/maps/search/?api=1&query=" + q;
      });
      document.querySelectorAll('[data-text="address"]').forEach((n) => { n.textContent = SET.address; });
    }
    if (SET.phoneDisplay) {
      document.querySelectorAll('[data-text="phone"]').forEach((n) => { n.textContent = SET.phoneDisplay; });
    }

    const hoursBox = $("hoursList");
    if (hoursBox && Array.isArray(SET.hours) && SET.hours.length) {
      hoursBox.textContent = "";
      SET.hours.forEach((row) => {
        const div = el("div");
        div.appendChild(el("span", "", row[0]));
        div.appendChild(el("span", "", row[1]));
        hoursBox.appendChild(div);
      });
    }

    const facts = $("heroFacts");
    if (facts && Array.isArray(SET.stats) && SET.stats.length) {
      facts.textContent = "";
      SET.stats.forEach((row) => {
        const box = el("div", "hero-fact");
        box.appendChild(el("b", "", row[0]));
        box.appendChild(el("span", "", row[1]));
        facts.appendChild(box);
      });
    }

    const year = $("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------------- 4. Announcement bar ---------------- */

  function initAnnouncement() {
    const bar = $("promoBar");
    const text = String(SET.announcement || "").trim();
    if (!bar || !text) return;

    const KEY = "unboxed_announcement_dismissed";
    try { if (sessionStorage.getItem(KEY) === text) return; } catch (e) { /* ignore */ }

    $("promoText").textContent = text;
    bar.hidden = false;
    $("promoClose").addEventListener("click", () => {
      bar.hidden = true;
      try { sessionStorage.setItem(KEY, text); } catch (e) { /* ignore */ }
    });
  }

  /* ---------------- 5. The bag (cart) ---------------- */

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
      const clean = {};
      Object.keys(parsed).forEach((id) => {
        const qty = Number(parsed[id]);
        if (byId[id] && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, MAX_QTY);
      });
      return clean;
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
  }

  function loadCustomer() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "null");
      if (!parsed || typeof parsed !== "object") return null;
      return {
        name: typeof parsed.name === "string" ? parsed.name : "",
        phone: typeof parsed.phone === "string" ? parsed.phone : "",
        address: typeof parsed.address === "string" ? parsed.address : ""
      };
    } catch (e) {
      return null;
    }
  }

  function saveCustomer(data) {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  let cart = loadCart();

  const bagItems = $("bagItems");
  const bagEmpty = $("bagEmpty");

  function cartEntries() {
    return Object.keys(cart)
      .filter((id) => byId[id])
      .map((id) => ({ product: byId[id], qty: cart[id] }));
  }

  function cartTotals() {
    let count = 0, subtotal = 0, unpriced = 0;
    cartEntries().forEach((e) => {
      count += e.qty;
      if (e.product.price !== null) subtotal += e.product.price * e.qty;
      else unpriced += e.qty;
    });
    return { count: count, subtotal: subtotal, unpriced: unpriced };
  }

  function addToCart(id) {
    if (!byId[id]) return;
    cart[id] = Math.min((cart[id] || 0) + 1, MAX_QTY);
    saveCart();
    renderBag();
    syncCardButtons();
    toast(byId[id].name + " added to your bag");
  }

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id];
    else cart[id] = Math.min(qty, MAX_QTY);
    saveCart();
    renderBag();
    syncCardButtons();
  }

  function metaText(p) {
    const bits = [];
    bits.push(p.price !== null ? money(p.price) : "Ask for price");
    if (p.size) bits.push(p.size);
    return bits.join(" · ");
  }

  function bagRow(entry) {
    const p = entry.product;
    const row = el("div", "bag-row");
    row.dataset.id = p.id;

    const thumb = el("div", "bag-thumb");
    const img = document.createElement("img");
    img.alt = "";
    img.src = p.src;
    img.loading = "lazy";
    img.addEventListener("error", () => img.remove());
    thumb.appendChild(img);

    const info = el("div", "bag-info");
    info.appendChild(el("b", "", p.name));
    info.appendChild(el("span", "", metaText(p)));

    const qty = el("div", "qty-control");
    const minus = el("button", "", "−");
    minus.type = "button";
    minus.dataset.act = "minus";
    minus.setAttribute("aria-label", "One less " + p.name);
    const num = el("span", "", String(entry.qty));
    const plus = el("button", "", "+");
    plus.type = "button";
    plus.dataset.act = "plus";
    plus.setAttribute("aria-label", "One more " + p.name);
    qty.appendChild(minus);
    qty.appendChild(num);
    qty.appendChild(plus);

    const remove = el("button", "bag-remove", "Remove");
    remove.type = "button";
    remove.dataset.act = "remove";
    remove.setAttribute("aria-label", "Remove " + p.name + " from your bag");

    row.appendChild(thumb);
    row.appendChild(info);
    row.appendChild(qty);
    row.appendChild(remove);
    return row;
  }

  function renderBag() {
    const entries = cartEntries();
    const totals = cartTotals();

    $("bagCount").textContent = totals.count;
    $("sumCount").textContent = totals.count;
    $("sumTotal").textContent = money(totals.subtotal);
    $("sendOrderBtn").disabled = totals.count === 0;

    const note = $("sumNote");
    if (totals.unpriced > 0) {
      note.textContent = totals.unpriced + (totals.unpriced === 1 ? " item has" : " items have") +
        " no price listed yet. We will confirm " + (totals.unpriced === 1 ? "its" : "their") + " price on WhatsApp.";
      note.hidden = false;
    } else {
      note.hidden = true;
    }

    bagItems.textContent = "";
    bagEmpty.hidden = entries.length > 0;
    entries.forEach((e) => bagItems.appendChild(bagRow(e)));
  }

  // one listener for every +, − and Remove button in the bag
  bagItems.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const row = btn.closest(".bag-row");
    if (!row) return;
    const id = row.dataset.id;
    const now = cart[id] || 0;
    if (btn.dataset.act === "plus") setQty(id, now + 1);
    else if (btn.dataset.act === "minus") setQty(id, now - 1);
    else if (btn.dataset.act === "remove") setQty(id, 0);
  });

  /* ---------------- 6. The collection ---------------- */

  const grid = $("productGrid");
  const filterRow = $("filterRow");
  const searchInput = $("searchInput");
  const loadMoreBtn = $("loadMore");
  const gridCount = $("gridCount");
  const emptyMsg = $("emptyMsg");

  let activeSize = "all";
  let query = "";
  let filtered = [];
  let shown = 0;
  let rendered = [];   // cards currently on the page: { p, photo, failed }

  function makeCard(p, indexInBatch, eager) {
    const card = el("article", "product-card");
    card.style.setProperty("--i", indexInBatch);

    /* photo */
    const photo = el("button", "product-photo");
    photo.type = "button";
    photo.setAttribute("aria-label", "View " + p.name + " larger");
    const entry = { p: p, photo: photo, failed: false };

    const img = document.createElement("img");
    img.alt = p.name;
    img.decoding = "async";
    img.loading = eager ? "eager" : "lazy";
    img.addEventListener("load", () => photo.classList.add("loaded"));
    img.addEventListener("error", () => {
      entry.failed = true;
      photo.classList.add("no-photo");
      photo.disabled = true;
      const note = el("span", "photo-missing", "Photo coming soon");
      if (SHOW_PATHS) note.appendChild(el("small", "", p.src));
      photo.appendChild(note);
      console.warn("Photo not found: " + p.src);
    });
    img.src = p.src;
    if (img.complete && img.naturalWidth > 0) photo.classList.add("loaded");
    photo.appendChild(img);

    if (p.was !== null && p.price !== null && p.was > p.price) {
      photo.appendChild(el("span", "sale-badge", "Sale"));
    }
    photo.addEventListener("click", () => openViewer(entry));

    /* name, price, size  (left)  +  add to bag icon (right) */
    const body = el("div", "product-body");
    const info = el("div", "product-info");
    info.appendChild(el("h3", "product-name", p.name));

    const meta = el("p", "product-meta");
    if (p.price !== null) {
      meta.appendChild(el("span", "price", money(p.price)));
      if (p.was !== null && p.was > p.price) meta.appendChild(el("span", "price-was", money(p.was)));
    } else {
      meta.appendChild(el("span", "", "Ask for price"));
    }
    if (p.size) meta.appendChild(el("span", "", "· " + p.size));
    info.appendChild(meta);

    const btn = el("button", "cart-btn");
    btn.type = "button";
    btn.dataset.id = p.id;
    btn.innerHTML = ICON_ADD + ICON_CHECK;
    const badge = el("span", "cart-qty");
    badge.hidden = true;
    btn.appendChild(badge);
    btn.setAttribute("aria-label", "Add " + p.name + " to bag");
    btn.addEventListener("click", () => {
      addToCart(p.id);
      btn.classList.add("added");
      setTimeout(() => btn.classList.remove("added"), 1100);
    });

    body.appendChild(info);
    body.appendChild(btn);
    card.appendChild(photo);
    card.appendChild(body);

    rendered.push(entry);
    return card;
  }

  // shows how many of each item are in the bag, on the product's own button
  function syncCardButtons() {
    grid.querySelectorAll(".cart-btn").forEach((btn) => {
      const qty = cart[btn.dataset.id] || 0;
      const p = byId[btn.dataset.id];
      const badge = btn.querySelector(".cart-qty");
      btn.classList.toggle("in-bag", qty > 0);
      badge.hidden = qty === 0;
      badge.textContent = qty;
      btn.setAttribute("aria-label", (qty > 0 ? "Add another " : "Add ") + p.name + " to bag" + (qty > 0 ? " (" + qty + " in bag)" : ""));
    });
  }

  function updateFooter() {
    if (!products.length) {
      gridCount.textContent = "";
      loadMoreBtn.hidden = true;
      emptyMsg.hidden = true;
      return;
    }
    emptyMsg.hidden = filtered.length > 0;
    if (!filtered.length) {
      gridCount.textContent = "";
      loadMoreBtn.hidden = true;
      return;
    }
    if (shown >= filtered.length) {
      loadMoreBtn.hidden = true;
      gridCount.textContent = "Showing all " + filtered.length + (filtered.length === 1 ? " perfume" : " perfumes");
    } else {
      loadMoreBtn.hidden = false;
      gridCount.textContent = "Showing " + shown + " of " + filtered.length;
    }
  }

  function addBatch(first) {
    const slice = filtered.slice(shown, shown + BATCH);
    const frag = document.createDocumentFragment();
    slice.forEach((p, i) => frag.appendChild(makeCard(p, i, first && i < 6)));
    grid.appendChild(frag);
    shown += slice.length;
    syncCardButtons();
    updateFooter();
  }

  function applyFilters() {
    const q = query.trim().toLowerCase();
    filtered = products.filter((p) => {
      if (activeSize !== "all" && p.sizeKey !== activeSize) return false;
      if (!q) return true;
      return (p.name + " " + p.size).toLowerCase().indexOf(q) !== -1;
    });
    grid.textContent = "";
    rendered = [];
    shown = 0;
    addBatch(true);
  }

  // Filter buttons: "All" plus the sizes listed in data.js → filterSizes (50ml, 100ml)
  function buildSizeChips() {
    const wanted = Array.isArray(SET.filterSizes) ? SET.filterSizes : ["50ml", "100ml"];
    const sizes = wanted.filter((s) => {
      const k = sizeKey(s);
      return k && products.some((p) => p.sizeKey === k);   // hide a button if nothing matches it
    });
    if (!sizes.length) return;

    function chip(label, key) {
      const b = el("button", "chip" + (key === "all" ? " active" : ""), label);
      b.type = "button";
      b.dataset.key = key;
      b.setAttribute("aria-pressed", key === "all" ? "true" : "false");
      return b;
    }
    filterRow.appendChild(chip("All", "all"));
    sizes.forEach((s) => filterRow.appendChild(chip(String(s).trim(), sizeKey(s))));
    filterRow.hidden = false;

    filterRow.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      filterRow.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      b.classList.add("active");
      b.setAttribute("aria-pressed", "true");
      activeSize = b.dataset.key;
      applyFilters();
    });
  }

  function resetFilters() {
    query = "";
    searchInput.value = "";
    activeSize = "all";
    filterRow.querySelectorAll(".chip").forEach((c) => {
      const isAll = c.dataset.key === "all";
      c.classList.toggle("active", isAll);
      c.setAttribute("aria-pressed", isAll ? "true" : "false");
    });
    applyFilters();
  }

  function initCollection() {
    if (RAW_LIST === null) {
      grid.appendChild(el("p", "empty-msg", "The product list could not be loaded. Check that data.js is in the same folder as index.html."));
      return;
    }
    if (!products.length) {
      grid.appendChild(el("p", "empty-msg", "No products yet. Add them in data.js."));
      return;
    }
    buildSizeChips();

    let searchTimer = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { query = searchInput.value; applyFilters(); }, 150);
    });
    $("clearSearch").addEventListener("click", resetFilters);
    loadMoreBtn.addEventListener("click", () => addBatch(false));

    applyFilters();
  }

  /* ---------------- 7. Photo viewer ---------------- */

  const lightbox = $("lightbox");
  const lbImg = $("lbImg");
  const lbAdd = $("lbAdd");
  let lbList = [];
  let lbIndex = -1;
  let lastFocus = null;
  let lbAddTimer = null;

  function showInViewer(index) {
    if (!lbList.length) return closeViewer();
    lbIndex = (index + lbList.length) % lbList.length;
    const p = lbList[lbIndex].p;
    lbImg.src = p.src;
    lbImg.alt = p.name;
    $("lbName").textContent = p.name;
    $("lbMeta").textContent = metaText(p);
    $("lbCount").textContent = (lbIndex + 1) + " / " + lbList.length;
    lbAdd.textContent = "Add to bag";
    clearTimeout(lbAddTimer);

    // quietly load the neighbours so next / previous feels instant
    [lbList[(lbIndex + 1) % lbList.length], lbList[(lbIndex - 1 + lbList.length) % lbList.length]]
      .forEach((n) => { new Image().src = n.p.src; });
  }

  function openViewer(entry) {
    lbList = rendered.filter((r) => !r.failed);
    const index = lbList.indexOf(entry);
    if (index < 0) return;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    showInViewer(index);
    $("lbClose").focus();
  }

  function closeViewer() {
    lightbox.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    lbIndex = -1;
    clearTimeout(lbAddTimer);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $("lbClose").addEventListener("click", closeViewer);
  $("lbPrev").addEventListener("click", () => showInViewer(lbIndex - 1));
  $("lbNext").addEventListener("click", () => showInViewer(lbIndex + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeViewer(); });

  lbAdd.addEventListener("click", () => {
    if (lbIndex < 0) return;
    addToCart(lbList[lbIndex].p.id);
    lbAdd.textContent = "Added ✓";
    clearTimeout(lbAddTimer);
    lbAddTimer = setTimeout(() => { lbAdd.textContent = "Add to bag"; }, 1200);
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeViewer();
    else if (e.key === "ArrowLeft") showInViewer(lbIndex - 1);
    else if (e.key === "ArrowRight") showInViewer(lbIndex + 1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the viewer while it is open
      const stops = [$("lbClose"), $("lbPrev"), $("lbNext"), lbAdd];
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
    if (Math.abs(dx) > 50) showInViewer(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------------- 8. Checkout → WhatsApp ---------------- */

  const orderForm = $("orderForm");
  const fName = $("custName");
  const fPhone = $("custPhone");
  const fAddress = $("custAddress");
  const fNote = $("custNote");

  (function prefill() {
    const saved = loadCustomer();
    if (!saved) return;
    fName.value = saved.name;
    fPhone.value = saved.phone;
    fAddress.value = saved.address;
  })();

  function openWhatsApp(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entries = cartEntries();
    if (!entries.length) { toast("Your bag is empty"); return; }

    const name = fName.value.trim();
    const phone = fPhone.value.trim();
    const address = fAddress.value.trim();
    const note = fNote.value.trim();
    if (!name || !phone || !address) {
      toast("Please fill in your name, phone and address");
      (!name ? fName : !phone ? fPhone : fAddress).focus();
      return;
    }
    saveCustomer({ name: name, phone: phone, address: address });

    const totals = cartTotals();
    const lines = entries.map((e) => {
      const p = e.product;
      const size = p.size ? " (" + p.size + ")" : "";
      const cost = p.price !== null ? money(p.price * e.qty) : "price to confirm";
      return "• " + p.name + size + " x" + e.qty + " — " + cost;
    });

    const message = [
      "Hello UNBOXED by terdòô, I'd like to place an order:",
      "",
      lines.join("\n"),
      "",
      "Subtotal: " + money(totals.subtotal) + (totals.unpriced ? " (plus " + totals.unpriced + " item(s) to be priced)" : ""),
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Delivery address: " + address,
      note ? "Note: " + note : ""
    ].join("\n").trim();

    openWhatsApp("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message));
  });

  $("openBag").addEventListener("click", () => {
    const target = $("order");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- 9. Reviews ---------------- */

  function renderReviews() {
    const track = $("reviewTrack");
    if (!track) return;
    track.textContent = "";

    const real = REVIEW_LIST.filter((r) => r && r.text);
    if (!real.length) {
      const card = el("article", "review-card insta");
      card.appendChild(el("p", "review-quote", "See what our customers say about us on Instagram."));
      const handle = String(SET.instagramHandle || "unboxed_by_terdoo").replace(/^@/, "");
      const link = el("a", "btn solid", "View reviews on Instagram");
      link.href = "https://www.instagram.com/" + encodeURIComponent(handle);
      link.target = "_blank";
      link.rel = "noopener";
      card.appendChild(link);
      track.appendChild(card);
      return;
    }

    real.forEach((r) => {
      const stars = Math.max(0, Math.min(5, parseInt(r.stars, 10) || 5));
      const name = String(r.name || "Customer");
      const card = el("article", "review-card");
      card.appendChild(el("span", "review-stars", "★".repeat(stars) + "☆".repeat(5 - stars)));
      card.appendChild(el("p", "review-quote", "“" + r.text + "”"));
      const who = el("div", "review-who");
      who.appendChild(el("span", "review-avatar", name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase()));
      const meta = el("div");
      meta.appendChild(el("b", "", name));
      if (r.area) meta.appendChild(el("span", "", r.area));
      who.appendChild(meta);
      card.appendChild(who);
      track.appendChild(card);
    });
  }

  /* ---------------- 10. Menu + scroll animation ---------------- */

  const navToggle = $("navToggle");
  const navLinks = $("navLinks");

  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !e.target.closest(".site-nav")) setMenu(false);
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 980) setMenu(false); });

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    items.forEach((n) => io.observe(n));
  }

  /* ---------------- 11. Start ---------------- */

  fillBusinessDetails();
  initAnnouncement();
  renderReviews();
  renderBag();
  initCollection();
  initReveal();
})();
