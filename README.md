# Valora Decor — Premium Website

Modern, high-converting website for Valora Decor (acoustic wall panels, Alpharetta / Atlanta, GA).

Built with clean HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies. Drop it on any host (Netlify, Vercel, Hostinger, GoDaddy, your existing web host, or even a USB stick for demos) and it works.

---

## File structure

```
valora-decor/
├── index.html           ← Homepage
├── products.html        ← Product grid with filters
├── product.html         ← Product detail template (?id=...)
├── contractors.html     ← Contractor / dealer program + apply form
├── gallery.html         ← Projects gallery + before/after
├── installation.html    ← Install guide, methods, LED add-on, FAQ
├── about.html           ← Brand story, values, showroom
├── contact.html         ← Contact form + phones + map
├── css/
│   └── styles.css       ← All styles (design system tokens at top)
├── js/
│   ├── products.js      ← PRODUCT DATA — edit this to add/change products
│   └── main.js          ← Interactions (filters, PDP, FAQ, before/after)
├── images/              ← Drop product photos here
└── README.md            ← This file
```

---

## How to add a new product

Open `js/products.js`. Each product is a single object in the `VALORA_PRODUCTS` array. Copy an existing one, paste below it, and change the values:

```js
{
  id: "new-panel-id",              // ← must be UNIQUE (no spaces)
  name: "Your Product Name",
  category: "acoustic-panel",      // see categories below
  size: "9.5 ft × 2 ft",           // display size
  sizeFilter: "9.5x2",             // filter key — must match js/products.js VALORA_FILTERS.size
  price: 89,                       // number (or null for "quote on request")
  priceDisplay: "$89",             // what shows on the card
  material: "Real wood veneer with acoustic felt backing",
  color: "Honey Oak",
  colorFilter: "oak",              // filter key (oak, walnut, ash, black, mirror, accent)
  colorSwatch: "#c9a368",          // dot color on the card
  roomType: ["living-room","office","restaurant"],
  badge: "New",                    // or null / "Sale" / "Bestseller" / "Premium"
  image: "images/honey-oak.jpg",   // or null to use the SVG placeholder
  texture: "wood-tex--oak",        // fallback placeholder style
  description: "Short product paragraph for the detail page.",
  acousticBacking: "9mm black acoustic felt — NRC ≈ 0.45",
  installation: "Construction silicone or screws. Pre-cut to length.",
  bestUses: ["Accent walls","Hotels","Home theaters"],
  inStock: true
}
```

**Categories** (used in filters and related products):
- `acoustic-panel` — full 9.5 ft × 2 ft panels
- `veneer-strip` — 9.5 ft × 6 in trim strips
- `square-panel` — 24 in × 24 in tiles
- `mirror-panel` — decorative mirror panels
- `lighting` — LED kits and accessories
- `service` — installation or consultation services

**Texture placeholder classes** (when `image` is `null`):
- `wood-tex` — generic oak
- `wood-tex--oak` — lighter oak
- `wood-tex--walnut` — dark walnut
- `wood-tex--ash` — pale ash
- `wood-tex--black` — matte black
- `mirror-tex` — mirror finish

Save the file. Refresh the browser. New product shows up on Products page and is linkable via `product.html?id=your-id`.

---

## How to add product photos

1. Save your images into the `images/` folder. Recommended: 1600 × 2000 px (4:5 ratio), JPG or WebP, under 300 KB each.
2. In `js/products.js`, change `image: null` to `image: "images/your-file.jpg"`.
3. Done.

If you don't have photos yet, leave `image: null` — the site will render a beautiful SVG placeholder in the product's wood color.

---

## How to change text on any page

All text is plain HTML — open the relevant `.html` file and edit directly. Key search terms:

- Phone numbers: `(615) 968-4925` / `(770) 500-6766` / `+16159684925` / `+17705006766`
- Address: `190 Bluegrass Valley Pkwy`
- WhatsApp: `wa.me/16159684925`
- Hero headline: in `index.html`, look for `<h1 class="h-display hero__title">`
- Pricing mentions: search for `$69`, `$13`, `$24`, `$88`

For site-wide changes (nav links, footer), edit each file — they're kept in sync manually. Or wire up a build step with `include-html` tools later if you prefer.

---

## How to change colors, fonts, spacing

All design tokens live at the top of `css/styles.css`, inside the `:root { ... }` block:

```css
:root {
  --color-ink:        #0d0d0d;   /* primary black */
  --color-walnut:     #5b3f2e;   /* accent brown */
  --color-oak:        #b08d5b;   /* primary wood tone */
  --font-serif: "Cormorant Garamond", serif;
  --font-sans:  "Inter", sans-serif;
  ...
}
```

Change a value → entire site updates. No need to hunt through files.

---

## Adding a real Google Map to the Contact page

1. Visit [maps.google.com](https://maps.google.com), search for `190 Bluegrass Valley Pkwy, Alpharetta, GA`
2. Click Share → Embed a map → Copy HTML
3. Open `contact.html`, find the SVG map placeholder (search for `Replace this illustrative map`)
4. Replace the entire `<svg>...</svg>` block with the Google Maps `<iframe>`

---

## Connecting the contact form to real email

The forms currently show a fake success message. To wire them to real email delivery, pick one:

**Option A — Formspree (easiest, free tier):**
1. Sign up at [formspree.io](https://formspree.io), create a form, copy your endpoint (e.g., `https://formspree.io/f/abc123`)
2. In `contact.html` and `contractors.html`, find `<form class="form" data-form>` and change to:
   ```html
   <form class="form" action="https://formspree.io/f/abc123" method="POST">
   ```
3. Remove the `data-form` attribute so JS doesn't intercept the submit.

**Option B — Netlify Forms (if hosted on Netlify):**
Add `netlify` and `name="quote"` to the `<form>` tag. That's it.

**Option C — Your own email script:**
Point the form `action` to your PHP / Node endpoint.

---

## Deploying

**Netlify (recommended, free):** Drag the `valora-decor` folder into [app.netlify.com/drop](https://app.netlify.com/drop). Live in 30 seconds.

**Vercel:** Install Vercel CLI, run `vercel` inside the folder.

**GoDaddy / Hostinger / shared hosting:** Upload the folder contents via FTP into your `public_html/` directory.

**Custom domain:** Point your DNS A record to your host's IP or add a CNAME. Connect to your site control panel.

---

## Mobile / responsive

The site is mobile-first responsive:
- Sticky nav with hamburger on screens < 960 px
- Sticky "Call now" + "WhatsApp" bottom bar on screens < 960 px
- Grid cards collapse from 4 → 2 → 1 column
- Hero typography scales fluidly with `clamp()`

Test on your phone by visiting your deployed URL.

---

## SEO tips (quick wins)

1. Each page has a unique `<title>` and `<meta name="description">` — update them for your actual copy.
2. Add a `favicon.ico` to the root — browsers show it in tabs.
3. Add structured data (schema.org `LocalBusiness`) inside `index.html` `<head>` — Google loves it for local results.
4. Register the site with Google Business Profile and link to it in the footer.

---

## Browser support

Modern browsers (Chrome, Safari, Firefox, Edge — last 2 years). The site uses CSS variables, `clamp()`, `aspect-ratio`, and `backdrop-filter` — all widely supported.

---

## What's next (roadmap ideas)

- Wire up a real checkout (Shopify Buy Buttons, Stripe Payment Links)
- Add a blog for SEO (`blog/` folder with individual posts)
- Add Google Analytics or Plausible for tracking
- Customer review integration (Google Reviews API or Trustpilot widget)
- Photo gallery — swap the SVG placeholders for real install photos as they come in

---

**Built with care. Ready to sell walls.**
