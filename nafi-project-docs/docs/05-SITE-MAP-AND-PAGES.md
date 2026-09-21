# Site Map & Page Content

## Navigation (confirmed order)
```
Home | S-Nafi | Greek | Raksham | Contact
```

## Routes
```
/                    → Home
/brands/s-nafi       → S-Nafi brand page
/brands/greek        → Greek brand page
/brands/raksham      → Raksham brand page
/contact             → About + inquiry form
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

## Contact page (`/contact`)
- Company background (manufacturing capability, factory, dealer network)
- Inquiry form — fields TBD, see Open Questions
- Contact details (email/phone) — TBD, see Open Questions

## Admin panel (`/admin`, auth-gated)
- `/admin/login`
- `/admin/brands` — CRUD for brands (name, tagline, theme, order, active status)
- `/admin/products` — CRUD for products (assign brand + category, upload images, specs)
- `/admin/inquiries` — view/manage contact form submissions
