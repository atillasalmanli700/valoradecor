/* =============================================================
   VALORA DECOR — Site Interactions
   ============================================================= */

/* ---------- Navigation: mobile menu ---------- */
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const burger = nav.querySelector(".nav__burger");
  burger?.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
  // close menu on link click (mobile)
  nav.querySelectorAll(".nav__mobile a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("is-open"));
  });
})();

/* ---------- Active nav link ---------- */
(function () {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("data-nav") === path.replace(".html", "")) {
      a.classList.add("active");
    }
  });
})();

/* ---------- Reveal on scroll ---------- */
(function () {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ---------- FAQ accordion ---------- */
(function () {
  document.querySelectorAll(".faq__item").forEach(item => {
    const q = item.querySelector(".faq__q");
    q?.addEventListener("click", () => {
      item.classList.toggle("is-open");
    });
  });
})();

/* ---------- Before/After slider ---------- */
(function () {
  document.querySelectorAll(".ba").forEach(ba => {
    const range = ba.querySelector('input[type="range"]');
    const after = ba.querySelector(".ba__img--after");
    const handle = ba.querySelector(".ba__handle");
    if (!range || !after || !handle) return;
    const update = (v) => {
      after.style.clipPath = `inset(0 0 0 ${v}%)`;
      handle.style.left = `${v}%`;
    };
    range.addEventListener("input", e => update(e.target.value));
    update(range.value || 50);
  });
})();

/* ---------- SVG placeholder renderer ----------
   When a product has no image, we render a styled SVG
   that mimics a paneled wall — looks far better than a gray box.
-------------------------------------------------------------- */
function svgPanelPlaceholder(productOrOpts) {
  const p = productOrOpts || {};
  const palettes = {
    "wood-tex--oak":    { dark: "#8b6a3d", mid: "#b08d5b", light: "#d4b580", slat: "#6f4e26" },
    "wood-tex--walnut": { dark: "#3d2818", mid: "#5b3f2e", light: "#7a5a44", slat: "#261609" },
    "wood-tex--ash":    { dark: "#b6aa8e", mid: "#d6c9ad", light: "#eee2c8", slat: "#8f8464" },
    "wood-tex--black":  { dark: "#0d0d0d", mid: "#1d1d1d", light: "#2d2d2d", slat: "#000000" },
    "wood-tex":         { dark: "#96743f", mid: "#b8915c", light: "#d9b680", slat: "#6b4c22" },
    "mirror-tex":       { dark: "#a8b3b8", mid: "#d1d8dc", light: "#eef2f4", slat: "#8a9499" }
  };
  const pal = palettes[p.texture] || palettes["wood-tex"];
  const isMirror = p.texture === "mirror-tex";

  if (isMirror) {
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="m1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${pal.light}"/>
          <stop offset="45%" stop-color="${pal.mid}"/>
          <stop offset="100%" stop-color="${pal.dark}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="${pal.mid}"/>
      <rect x="40" y="40" width="320" height="420" fill="url(#m1)" stroke="#2a2a2a" stroke-width="2"/>
      <rect x="52" y="52" width="296" height="396" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <line x1="70" y1="60" x2="340" y2="440" stroke="rgba(255,255,255,0.25)" stroke-width="30"/>
      <line x1="100" y1="420" x2="320" y2="120" stroke="rgba(255,255,255,0.12)" stroke-width="50"/>
    </svg>`;
  }

  const slats = [];
  const slatW = 22;
  for (let i = 0; i < 20; i++) {
    const x = i * slatW;
    const shade = i % 3 === 0 ? pal.dark : (i % 3 === 1 ? pal.mid : pal.light);
    slats.push(`<rect x="${x}" y="0" width="${slatW - 2}" height="500" fill="${shade}"/>`);
    slats.push(`<line x1="${x + slatW - 1}" y1="0" x2="${x + slatW - 1}" y2="500" stroke="${pal.slat}" stroke-width="1"/>`);
  }
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="shd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
      </linearGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.04 0"/>
      </filter>
    </defs>
    <rect width="400" height="500" fill="${pal.mid}"/>
    ${slats.join("")}
    <rect width="400" height="500" fill="url(#shd)"/>
    <rect width="400" height="500" filter="url(#grain)" opacity="0.8"/>
  </svg>`;
}

/* ---------- Product card renderer ---------- */
function renderProductCard(p) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
    : svgPanelPlaceholder(p);
  const badge = p.badge
    ? `<span class="product-card__badge ${p.badge === 'Sale' ? 'product-card__badge--sale' : ''}">${p.badge}</span>`
    : "";
  const priceHtml = p.price === null
    ? `<span class="product-card__price"><span>${p.priceDisplay}</span></span>`
    : `<span class="product-card__price"><span class="from">From</span><span>${p.priceDisplay}</span></span>`;
  return `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-card__media">${media}${badge}</div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__meta">${p.size} · ${p.color}</div>
        ${priceHtml}
        <div class="product-card__swatches">
          <span class="swatch" style="background:${p.colorSwatch}"></span>
        </div>
      </div>
    </a>
  `;
}

/* ---------- Products page: grid + filters ---------- */
(function () {
  const grid = document.getElementById("productGrid");
  if (!grid || !window.VALORA_PRODUCTS) return;

  const state = { color: "all", size: "all", material: "all", room: "all" };
  const filters = window.VALORA_FILTERS;

  // populate selects
  const buildSelect = (id, items, onChange) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
    el.addEventListener("change", onChange);
  };
  buildSelect("filter-color",    filters.color,    e => { state.color = e.target.value;    render(); });
  buildSelect("filter-size",     filters.size,     e => { state.size = e.target.value;     render(); });
  buildSelect("filter-material", filters.material, e => { state.material = e.target.value; render(); });
  buildSelect("filter-room",     filters.room,     e => { state.room = e.target.value;     render(); });

  const countEl = document.getElementById("filterCount");
  const resetBtn = document.getElementById("filterReset");
  resetBtn?.addEventListener("click", () => {
    state.color = "all"; state.size = "all"; state.material = "all"; state.room = "all";
    ["filter-color","filter-size","filter-material","filter-room"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "all";
    });
    render();
  });

  function render() {
    const list = window.VALORA_PRODUCTS.filter(p => {
      if (state.color    !== "all" && p.colorFilter !== state.color)    return false;
      if (state.size     !== "all" && p.sizeFilter  !== state.size)     return false;
      if (state.material !== "all" && p.category    !== state.material) return false;
      if (state.room     !== "all" && !(p.roomType || []).includes(state.room)) return false;
      return true;
    });
    grid.innerHTML = list.map(renderProductCard).join("") ||
      `<p class="muted" style="grid-column:1/-1;padding:48px 0;text-align:center;">No panels match your filters. Try resetting.</p>`;
    if (countEl) countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  }
  render();
})();

/* ---------- Homepage: featured products ---------- */
(function () {
  const grid = document.getElementById("featuredGrid");
  if (!grid || !window.VALORA_PRODUCTS) return;
  // pick first 4 acoustic panels as "featured"
  const featured = window.VALORA_PRODUCTS
    .filter(p => p.category === "acoustic-panel")
    .slice(0, 4);
  grid.innerHTML = featured.map(renderProductCard).join("");
})();

/* ---------- Product detail page ---------- */
(function () {
  const root = document.getElementById("pdpRoot");
  if (!root || !window.VALORA_PRODUCTS) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || window.VALORA_PRODUCTS[0].id;
  const p = window.VALORA_PRODUCTS.find(x => x.id === id) || window.VALORA_PRODUCTS[0];

  document.title = `${p.name} — Valora Decor`;
  const nameEl = document.getElementById("pdpName");
  const subEl = document.getElementById("pdpSub");
  const priceEl = document.getElementById("pdpPrice");
  const descEl = document.getElementById("pdpDesc");
  const mainMediaEl = document.getElementById("pdpMainMedia");
  const thumbsEl = document.getElementById("pdpThumbs");
  const specEl = document.getElementById("pdpSpec");
  const bestUsesEl = document.getElementById("pdpBestUses");
  const crumbEl = document.getElementById("pdpCrumb");

  if (nameEl) nameEl.textContent = p.name;
  if (subEl) subEl.textContent = `${p.size} · ${p.color}`;
  if (priceEl) {
    priceEl.innerHTML = p.price === null
      ? `<span>${p.priceDisplay}</span>`
      : `<span class="from">From</span><span>${p.priceDisplay}</span>`;
  }
  if (descEl) descEl.textContent = p.description;
  if (crumbEl) crumbEl.textContent = p.name;

  // gallery placeholders — show 5 variations of the same texture
  const mediaHtml = p.image ? `<img src="${p.image}" alt="${p.name}">` : svgPanelPlaceholder(p);
  if (mainMediaEl) mainMediaEl.innerHTML = mediaHtml;
  if (thumbsEl) {
    thumbsEl.innerHTML = Array.from({length: 5}).map((_, i) =>
      `<div class="pdp__thumb ${i === 0 ? 'active' : ''}" data-i="${i}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : svgPanelPlaceholder(p)}</div>`
    ).join("");
    thumbsEl.querySelectorAll(".pdp__thumb").forEach(t => {
      t.addEventListener("click", () => {
        thumbsEl.querySelectorAll(".pdp__thumb").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
      });
    });
  }
  if (specEl) {
    specEl.innerHTML = `
      <dt>Size</dt><dd>${p.size}</dd>
      <dt>Color</dt><dd>${p.color}</dd>
      <dt>Material</dt><dd>${p.material}</dd>
      <dt>Acoustic Backing</dt><dd>${p.acousticBacking}</dd>
      <dt>Installation</dt><dd>${p.installation}</dd>
      <dt>In Stock</dt><dd>${p.inStock ? "Yes — Alpharetta warehouse" : "Made to order"}</dd>
    `;
  }
  if (bestUsesEl) {
    bestUsesEl.innerHTML = (p.bestUses || []).map(u => `<li>${u}</li>`).join("");
  }

  // related products
  const related = document.getElementById("pdpRelated");
  if (related) {
    const items = window.VALORA_PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0,4);
    const fallback = window.VALORA_PRODUCTS.filter(x => x.id !== p.id).slice(0,4);
    related.innerHTML = (items.length ? items : fallback).map(renderProductCard).join("");
  }
})();

/* ---------- Contact / quote form (demo) ---------- */
(function () {
  document.querySelectorAll("[data-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const msg = form.querySelector("[data-form-msg]");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setTimeout(() => {
        if (msg) {
          msg.textContent = "✓ Thanks — we'll be in touch within one business day. For urgent quotes, call (615) 968-4925.";
          msg.style.color = "var(--color-walnut)";
        }
        if (btn) { btn.disabled = false; btn.textContent = "Send request"; }
        form.reset();
      }, 700);
    });
  });
})();

/* ---------- Ticker duplication (for infinite loop) ---------- */
(function () {
  document.querySelectorAll(".ticker__track").forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });
})();

/* ---------- Smooth anchor offset for sticky nav ---------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
