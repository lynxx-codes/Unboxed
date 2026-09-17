/* ============================================================
   UNBOXED by terdòô — site logic
   Cart lives entirely in localStorage. Checkout hands off to a
   pre-filled WhatsApp message — no payment form, no admin panel,
   no data ever leaves the visitor's own device except that message.
   ============================================================ */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "2349065551118"; // 0906 555 1118, international format, no plus/leading zero
  const CART_KEY = "unboxed_bag_v1";
  const CUSTOMER_KEY = "unboxed_customer_v1";

  const money = (n) => "₦" + n.toLocaleString("en-NG");

  /* ---------------- Product data ----------------
     Placeholder catalogue — swap names, notes, prices and photo
     placeholders for the real shelf whenever ready. Each product's
     "photo" is a labelled placeholder box until real images are added.
  --------------------------------------------------- */
  const PRODUCTS = [
    { id: "p1", name: "Baccarat Rouge 540", house: "Maison Francis Kurkdjian", kind: "niche", tag: "Tester-checked", notes: "Saffron, jasmine, amberwood", size: "70ml", price: 185000, images: images/bacarrat.jpg},
    { id: "p2", name: "Oud Wood", house: "Tom Ford Private Blend", kind: "unisex", tag: "Best seller", notes: "Rare oud, sandalwood, vetiver", size: "50ml", price: 165000, images: images/download.jpeg},
    { id: "p3", name: "Black Orchid", house: "Tom Ford", kind: "women", tag: "Tester-checked", notes: "Black truffle, ylang-ylang, patchouli", size: "50ml",
       price: 98000, images: images/oudwood.jpeg},
    { id: "p4", name: "Sauvage Elixir", house: "Dior", kind: "men", tag: "Restocked", notes: "Bergamot, cardamom, vanilla", size: "60ml", price: 112000, images: images/dior.jpeg},
    { id: "p5", name: "Delina", house: "Parfums de Marly", kind: "women", tag: "Niche pick", notes: "Turkish rose, lychee, musk", size: "75ml", price: 145000, images: images/parfums.jpeg},
    { id: "p6", name: "Layton", house: "Parfums de Marly", kind: "men", tag: "Tester-checked", notes: "Apple, lavender, vanilla", size: "75ml", price: 138000, images: images/delina.jpeg},
    { id: "p7", name: "Aventus", house: "Creed", kind: "men", tag: "Signature", notes: "Pineapple, birch, musk", size: "50ml", price: 175000, images: images/gemini-2.5-flash-image_A_promotional_photo_of_a_perfume_product._Shot_from_an_extreme_low_angle_looking-0 (1).jpg},
    { id: "p8", name: "Good Girl", house: "Carolina Herrera", kind: "women", tag: "Fixed price", notes: "Tuberose, cacao, tonka bean", size: "50ml", price: 92000, images: images/gemini-2.5-flash-image_A_promotional_photo_of_a_perfume_product._Shot_from_an_extreme_low_angle_looking-0 (1).jpeg},
    { id: "p9", name: "Interlude Man", house: "Amouage", kind: "niche", tag: "Rare find", notes: "Incense, oud, smoked woods", size: "50ml", price: 195000, images: images/gemini-2.5-flash-image_A_promotional_photo_of_a_perfume_product._Shot_from_an_extreme_low_angle_looking.jpeg},
  ];

  /* ---------------- Reviews ---------------- */
  const REVIEWS = [
    { name: "Chiamaka O.", area: "Lekki", stars: 5, text: "The Baccarat Rouge was exactly the tester scent — nothing watered down. Delivery came same day." },
    { name: "Tobenna A.", area: "Abuja", stars: 5, text: "First time ordering fragrance online without seeing it first. Landed in Abuja in two days, sealed properly, no leaks." },
    { name: "Fadeke S.", area: "Ikoyi", stars: 5, text: "Prices are fixed like they say — no last-minute price change once I confirmed. That alone earned my repeat business." },
    { name: "Emeka N.", area: "Port Harcourt", stars: 4, text: "Guided me to a scent close to Aventus at a fraction of the price. Very patient over WhatsApp." },
    { name: "Amara I.", area: "Lekki", stars: 5, text: "Genuine niche perfumes are hard to find in Lagos without getting scammed. Unboxed has been consistent every time." },
  ];

  /* ================= State ================= */

  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage unavailable — cart just won't persist across reloads */
    }
  }

  function loadCustomer() {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveCustomer(data) {
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data));
    } catch (e) {
      /* ignore */
    }
  }

  /* ================= Render: products ================= */

  const productGrid = document.getElementById("productGrid");
  const filterRow = document.getElementById("filterRow");
  let activeFilter = "all";

  function productCardHTML(p) {
    return `
      <article class="product-card" data-kind="${p.kind}">
        <div class="product-photo">
          <span class="product-tag">${p.tag}</span>
          <span class="ph-label">Photo placeholder<br>${p.name}</span>
        </div>
        <div class="product-body">
          <span class="product-kind">${p.house} · ${p.size}</span>
          <h3>${p.name}</h3>
          <p class="product-notes">${p.notes}</p>
          <div class="product-foot">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-id="${p.id}">Add to bag →</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const visible = activeFilter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.kind === activeFilter);
    productGrid.innerHTML = visible.map(productCardHTML).join("");
    productGrid.querySelectorAll(".add-btn").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.id, btn));
    });
  }

  filterRow.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderProducts();
  });

  /* ================= Render: reviews ================= */

  const reviewTrack = document.getElementById("reviewTrack");

  function initials(name) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }

  function reviewCardHTML(r) {
    const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);
    return `
      <article class="review-card">
        <span class="review-stars">${stars}</span>
        <p class="review-quote">"${r.text}"</p>
        <div class="review-who">
          <span class="review-avatar">${initials(r.name)}</span>
          <div>
            <b>${r.name}</b>
            <span>${r.area}</span>
          </div>
        </div>
      </article>
    `;
  }

  reviewTrack.innerHTML = REVIEWS.map(reviewCardHTML).join("");

  /* ================= Cart logic ================= */

  const bagItemsEl = document.getElementById("bagItems");
  const bagEmptyMsg = document.getElementById("bagEmptyMsg");
  const bagCountEl = document.getElementById("bagCount");
  const sumCountEl = document.getElementById("sumCount");
  const sumTotalEl = document.getElementById("sumTotal");
  const sendOrderBtn = document.getElementById("sendOrderBtn");
  const toast = document.getElementById("toast");

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function addToCart(id, triggerEl) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    showToast(`${findProduct(id).name} added to bag`);
    if (triggerEl) {
      triggerEl.textContent = "Added ✓";
      setTimeout(() => { triggerEl.textContent = "Add to bag →"; }, 1200);
    }
  }

  function setQty(id, qty) {
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = qty;
    }
    saveCart();
    renderCart();
  }

  function cartEntries() {
    return Object.keys(cart)
      .map((id) => ({ product: findProduct(id), qty: cart[id] }))
      .filter((e) => e.product);
  }

  function bagRowHTML(entry) {
    const { product, qty } = entry;
    return `
      <div class="bag-row" data-id="${product.id}">
        <div class="bag-thumb" aria-hidden="true"></div>
        <div class="bag-info">
          <b>${product.name}</b>
          <span>${money(product.price)} · ${product.size}</span>
        </div>
        <div class="qty-control">
          <button class="qty-minus" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button class="qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <button class="bag-remove">Remove</button>
      </div>
    `;
  }

  function renderCart() {
    const entries = cartEntries();
    const totalItems = entries.reduce((s, e) => s + e.qty, 0);
    const totalPrice = entries.reduce((s, e) => s + e.qty * e.product.price, 0);

    bagCountEl.textContent = totalItems;
    sumCountEl.textContent = totalItems;
    sumTotalEl.textContent = money(totalPrice);
    sendOrderBtn.disabled = totalItems === 0;

    if (entries.length === 0) {
      bagItemsEl.innerHTML = "";
      bagItemsEl.appendChild(bagEmptyMsg);
      return;
    }

    bagItemsEl.innerHTML = entries.map(bagRowHTML).join("");

    bagItemsEl.querySelectorAll(".bag-row").forEach((row) => {
      const id = row.dataset.id;
      row.querySelector(".qty-plus").addEventListener("click", () => setQty(id, (cart[id] || 0) + 1));
      row.querySelector(".qty-minus").addEventListener("click", () => setQty(id, (cart[id] || 0) - 1));
      row.querySelector(".bag-remove").addEventListener("click", () => setQty(id, 0));
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ================= Checkout → WhatsApp ================= */

  const orderForm = document.getElementById("orderForm");
  const custNameEl = document.getElementById("custName");
  const custPhoneEl = document.getElementById("custPhone");
  const custAddressEl = document.getElementById("custAddress");
  const custNoteEl = document.getElementById("custNote");

  (function prefillCustomer() {
    const saved = loadCustomer();
    if (!saved) return;
    custNameEl.value = saved.name || "";
    custPhoneEl.value = saved.phone || "";
    custAddressEl.value = saved.address || "";
  })();

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entries = cartEntries();
    if (entries.length === 0) return;

    const name = custNameEl.value.trim();
    const phone = custPhoneEl.value.trim();
    const address = custAddressEl.value.trim();
    const note = custNoteEl.value.trim();

    if (!name || !phone || !address) {
      showToast("Please fill in your name, phone and address");
      return;
    }

    saveCustomer({ name, phone, address });

    const lines = entries.map(
      (e) => `• ${e.product.name} (${e.product.size}) x${e.qty} — ${money(e.product.price * e.qty)}`
    );
    const total = entries.reduce((s, e) => s + e.qty * e.product.price, 0);

    const message = [
      `Hello Unboxed by terdòô, I'd like to place an order:`,
      ``,
      ...lines,
      ``,
      `Subtotal: ${money(total)}`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Delivery address: ${address}`,
      note ? `Note: ${note}` : null,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  /* ================= Bag button scrolls to order ================= */

  document.getElementById("openBag").addEventListener("click", () => {
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    document.getElementById("bagPanel").classList.add("reveal", "in");
  });

  /* ================= Mobile nav toggle ================= */

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ================= Scroll reveal ================= */

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ================= Footer year ================= */

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ================= Init ================= */

  renderProducts();
  renderCart();
})();
