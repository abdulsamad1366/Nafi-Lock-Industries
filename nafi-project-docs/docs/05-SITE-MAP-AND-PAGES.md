# Site Map & Page Content

## Navigation (confirmed order)
```
Home | S-Nafi | Raksham | Greek | Blog | Contact | Login
```

## Routes
```
/                    → Home
/brands/s-nafi       → S-Nafi brand page
/brands/raksham      → Raksham brand page
/brands/greek        → Greek brand page
/products/[slug]     → Product detail page (NEW — see below)
/blog                → Blog
/contact             → About + inquiry form
/login               → Public login (Customer or Distributor)
/signup              → Signup (Customer or Distributor application)
/account/*           → Customer dashboard (auth-gated)
/distributor/*        → Distributor dashboard (auth-gated, approval-gated —
                        see 10-AUTH-AND-DISTRIBUTOR-PORTAL.md)
/admin/*             → Admin panel (auth-gated, not public nav)
```

## Home page (`/`) — Nafi/brass palette
1. **Hero** — Nafi Lock Industries intro, company tagline
2. **Brand strip** — 3 equal-weight cards (S-Nafi, Greek, Raksham), each with
   name + one-line identity + "View" link. No tier badges — all three are
   equal, parallel brands.
3. **Full product catalog** — every product from all three brands shown
   together in one grid. Each `ProductCard` carries a brand tag (since
   products are mixed together here). Filter tabs above the grid:
   `All | S-Nafi | Greek | Raksham`.
4. **Why Nafi** — manufacturing heritage/trust section (content TBD).
5. **CTA → Contact**
6. **Footer** — company info, quick links.

## Brand page template (`/brands/[slug]`) — used by all three, themed per brand
1. **Brand Hero** — logo/wordmark, brand name, brand-specific tagline, short
   brand story paragraph.
2. **Product grid** — filtered to only this brand's products
   (`products.filter(p => p.brand === slug)`). No brand tag needed since it's
   implied by the page.
3. **Why This Brand** — 3–4 value points specific to this brand (content TBD —
   see Open Questions).
4. **Specifications/Certifications block** — if applicable (ISI marks, etc.)
5. **CTA** — "Interested in stocking [Brand]?" → links to `/contact`, ideally
   pre-filling which brand the inquiry is about.

## Product detail page (`/products/[slug]`) — NEW
Reached from a **"View Details" button on every `ProductCard`** — Home's
catalog, brand pages, distributor catalog, liked-products lists, all link
here the same way. Themed by the product's own brand (`themeKey`), regardless
of which page the visitor arrived from — so an S-Nafi product looks
brass-themed even when clicked from Home's mixed all-brands grid.

1. **Breadcrumb** — Home / [Brand] / [Product name], brand link goes to
   `/brands/[brandSlug]`
2. **Image gallery** — `product.images[]`, main image + thumbnails (falls
   back to the category placeholder icon if no real photos uploaded yet)
3. **Title block** — product name, brand tag/badge, category
4. **Spec table** — material, size, finish, number of keys, locking
   mechanism, warranty (IBM Plex Mono, per design system) — only fields that
   have a value are shown, no blank rows
5. **Description** — product's `description` field
6. **Action area — differs by who's viewing:**
   - **Guest / Customer:** "Enquire About This Product" button →
     `/contact`, pre-filling the product (and its brand) in the inquiry form
   - **Approved Distributor:** `dealerPrice` and `minOrderQty` shown, plus a
     quantity selector and "Add to Order" button — same `OrderCartProvider`
     used on `/distributor/catalog`, so adding from the detail page and the
     grid both land in the same cart
   - **Any logged-in user (Customer or Distributor):** like/heart icon,
     same as on `ProductCard`
7. **Related products** — small `ProductGrid`, same brand or category,
   excluding the current product (3–4 items)

## Contact page (`/contact`)
- Company background (manufacturing capability, factory, dealer network)
- Inquiry form — fields TBD, see Open Questions
- Contact details (email/phone) — TBD, see Open Questions

## Admin panel (`/admin`, auth-gated)
- `/admin/login`
- `/admin/brands` — CRUD for brands (name, tagline, theme, order, active status)
- `/admin/products` — CRUD for products (assign brand + category, upload images, specs)
- `/admin/inquiries` — view/manage contact form submissions
