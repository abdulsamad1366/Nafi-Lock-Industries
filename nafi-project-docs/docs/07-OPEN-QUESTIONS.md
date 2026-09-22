# Open Questions

Things raised during planning that are **not yet answered**. Resolve these
before building the affected part, rather than guessing.

## Product catalog content
- [ ] **Deferred by client.** Client is still setting up and growing their
  actual product range — no fixed real list exists yet. A draft placeholder
  catalog (realistic sample names/specs) should be used to unblock building
  the data structure/UI, to be replaced with real products as the client adds
  them via the admin panel. See `09-SAMPLE-PRODUCT-CATALOG.md`.
- [ ] Actual spec values per real product — fields are defined
  (`04-DATA-MODEL.md`), values will be entered by the client over time via
  `/admin/products`.

## Brand differentiation copy
- [ ] **Deferred by client.** "Why This Brand" section content for each brand
  page — to be written later.

## Contact / inquiry form
- [ ] **Deferred by client.** Business email/phone number to display and
  receive inquiries — to be provided later.
- [ ] Exact form fields to include (name, company, email, phone, message
  likely; still to confirm: brand/product selector dropdown).
- [ ] Is the site primarily dealer/distributor-facing (bulk orders) or also
  open to retail/individual customers? Affects form fields and copy tone.

## Admin panel
- [ ] Who needs admin access — just the client, or multiple people? Affects
  whether multi-role support is needed now or can be added later.

## Company/about content
- [ ] **Deferred by client.** "Why Nafi" trust section on Home — heritage/trust
  copy (years in business, certifications, factory location, export markets).
- [ ] Company "About" content for the Contact page.

## Assets
- [ ] Real product photography and brand logos — currently using placeholder
  SVG icons (see `08-PLACEHOLDER-ASSETS.md`).

## Distributor portal (see `10-AUTH-AND-DISTRIBUTOR-PORTAL.md` for full design)
- [ ] Actual dealer prices and minimum order quantities per product — not yet
  provided, needed to seed `dealerPrice`/`minOrderQty`.
- [ ] Catalog scope — one overall downloadable PDF, or one per brand?
- [ ] Distributor application fields beyond company name/GST/address — any
  additional business proof/documents required for approval?
- [ ] Ledger request format — free-text note (current design) or a structured
  date-range picker?
- [ ] Sales rep roster — who are the actual sales reps to seed into the system?
