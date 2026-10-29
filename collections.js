/* ============================================================
   UNBOXED by terdòô — collections.js
   Tiny helper script for 50ml.html, 100ml.html, special-products.html.
   You do NOT need to edit this to add products.

   It does four small jobs:
   1. Opens/closes the mobile menu.
   2. Shows how many items are in the Bag (saved by the homepage).
   3. Builds each "Enquire on WhatsApp" link from the card's own
      name + size, so the message always matches the perfume.
   4. Shows the placeholder if a product image is missing.
   ============================================================ */

(function () {
  "use strict";

  // Same number as script.js (international format, no plus sign, no leading zero)
  const WHATSAPP_NUMBER = "2349065551118";
  const STORE_NAME = "Unboxed by terdòô";

  /* 1. Mobile menu */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* 2. Bag count (the bag itself lives on the homepage) */
  const bagCount = document.getElementById("bagCount");
  if (bagCount) {
    try {
      const saved = JSON.parse(localStorage.getItem("unboxed_bag_v1") || "{}");
      bagCount.textContent = Object.values(saved).reduce((sum, qty) => sum + qty, 0);
    } catch (e) {
      bagCount.textContent = "0";
    }
  }

  /* 3. WhatsApp enquiry links */
  document.querySelectorAll(".product-card").forEach((card) => {
    const link = card.querySelector(".enquire-link");
    if (!link) return;

    const name = card.querySelector("h3");
    const size = card.querySelector(".size-pill");
    const price = card.querySelector(".price");

    let message = "Hello " + STORE_NAME + ", I'd like to enquire about " +
      (name ? name.textContent.trim() : "a perfume") +
      (size ? " (" + size.textContent.trim() + ")" : "");

    // Only mention the price if a real one has been filled in
    if (price && /[1-9]/.test(price.textContent)) {
      message += ", listed at " + price.textContent.trim();
    }
    message += ". Is it available?";

    link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    link.target = "_blank";
    link.rel = "noopener";
  });

  /* 4. Missing images fall back to the placeholder */
  function markMissing(img) {
    const photo = img.closest(".product-photo");
    if (photo) photo.classList.add("img-missing");
  }
  document.querySelectorAll(".product-photo img").forEach((img) => {
    img.addEventListener("error", () => markMissing(img));
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markMissing(img);
  });

  /* Footer year */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
