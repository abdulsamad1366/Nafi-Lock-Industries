# Decisions Log

Chronological record of decisions made during planning. Append new entries at
the bottom as future discussions happen — don't rewrite history here.

1. **Company:** Nafi Lock Industries, a lock manufacturer with 3 brands:
   S-Nafi, Raksham, Greek.
2. **Brands are parallel, not tiered.** Initially considered price/quality
   tiers (economy/mid/premium) — explicitly rejected. All three brands sell
   the same category of product (classic locks) as separate brand identities,
   differentiated by **quality/price** positioning (confirmed), not by product type.
3. **Navigation confirmed:** Home / S-Nafi / Greek / Raksham / Contact — no
   separate "Brands" dropdown, each brand is a top-level nav item.
4. **Home page shows the full catalog** (all products from all brands
   together, with filter tabs). Individual brand pages show only that brand's
   products.
5. **Design inspiration:** atomlocks.com (same industry, premium hardware
   positioning) and velisqa.com (premium dark aesthetic, different industry).
   Direction taken: premium/showroom feel, not e-commerce cart functionality.
6. **Tech stack finalized:** Next.js frontend + Express backend (separate
   services) + PostgreSQL via Prisma + JWT admin auth. Static/JSON-file
   catalog explicitly rejected in favor of a real database, because the client
   wants **ERP-level scalability** — adding brands/products through an admin
   UI, not code changes.
7. **Hosting:** Client has their own Windows VPS (8GB RAM, Xeon E5-2680 v3).
   Adjusted stack accordingly: Nginx (Windows) reverse proxy, PM2 process
   management, PostgreSQL installed locally on the VPS (no cloud DB service),
   images stored on local disk via Multer + Sharp (no Cloudinary).
8. **Frontend/backend split into separate folders** (`frontend/`, `backend/`)
   rather than using Next.js API routes — decoupled so the backend could serve
   other clients later.
9. **Design system:** Fraunces (headlines) + IBM Plex Sans (body) + IBM Plex
   Mono (specs only) across the whole site. Dark, premium palette.
10. **Per-brand color themes:** Nafi (parent) and S-Nafi share one palette
    (brass/charcoal). Greek and Raksham each get their own distinct palette —
    Greek: Aegean blue/marble (classical reference). Raksham: guardian
    red/gunmetal (protection reference, from the Sanskrit/Hindi meaning of
    "raksha"). Full hex values in `03-DESIGN-SYSTEM.md`.
11. **Product categories defined:** Padlocks, Door Locks (Mortise),
    Cylindrical/Knob Locks, Cabinet/Drawer Locks, Hasp & Staple/Latches.
12. **Product spec fields defined:** Material, Size, Finish, Number of keys,
    Locking mechanism, Warranty.
13. **Placeholder product images created** as brand-colored SVG line-art icons
    (one per category, plus brand-specific color variants for Greek and
    Raksham) — see `08-PLACEHOLDER-ASSETS.md`. Real product photography to
    replace these later.
14. **Explicit instruction from client: do not write application code in this
    conversation.** The actual build happens in Antigravity; this conversation
    is for planning/architecture/design and supervision only.
15. **Domain confirmed:** www.nafilockindustries.com.
16. **VPS confirmed ready:** Node.js, PostgreSQL, and Nginx are already
    installed — no OS-level setup needed before deployment.
17. **Deferred to later (client's choice):** real product list (client is
    still building out their catalog — no fixed list exists yet), contact
    email/phone, and "Why This Brand"/"Why Nafi" copy. A sample placeholder
    product catalog will be used to unblock the build in the meantime — see
    `09-SAMPLE-PRODUCT-CATALOG.md`.
18. **Nav restructured:** Home / S-Nafi / Raksham / Greek / Blog / Contact / Login
    (client updated the site structure and shared the actual repo, built via
    Antigravity — matched the planned architecture closely, confirming the
    build is on track).
19. **Three-tier login system added:** Customer, Distributor, Admin — each a
    genuinely separate identity, not one role field. `AdminUser` stays fully
    separate (own table/JWT) from the new `User` table (role: CUSTOMER |
    DISTRIBUTOR). Distributor signup requires admin approval before dealer
    features unlock.
20. **Distributor-only features confirmed:** dealer pricing (`dealerPrice`,
    hidden from everyone else — enforced server-side, not just UI-hidden),
    minimum order quantity (`minOrderQty`, same visibility rule), catalog PDF
    downloads, order placement + order tracking (PLACED → CONFIRMED →
    PROCESSING → SHIPPED → DELIVERED), ledger request-and-fulfill workflow
    (distributor requests, admin uploads the file), a dedicated assigned sales
    rep contact, and liked/saved products (this last one available to
    customers too, not distributor-only).
21. **Orders are request-and-fulfill, not real-time payment.** No payment
    gateway — client handles payment/invoicing offline; the system only
    tracks order status. Flagged as a bigger addition if this changes later.
22. **Ordering is integrated into the catalog browsing experience** — an
    "Add to Order" action on product cards builds a persistent order cart
    (client-side, shown via a slide-out drawer) that a distributor reviews
    and submits as one Order, rather than a disconnected order form.
23. **Full design written up in `10-AUTH-AND-DISTRIBUTOR-PORTAL.md`** —
    data model, access-control matrix, auth flows, order cart mechanics, and
    both dashboards (customer `/account`, distributor `/distributor/dashboard`)
    plus new admin panel sections (`/admin/distributors`, `/admin/orders`,
    `/admin/ledger-requests`, `/admin/sales-reps`, `/admin/catalogs`).
24. **Correction: distributor login is now gated by approval, not just
    dashboard content.** Originally a distributor could log in immediately
    after applying and see a pending banner inside the dashboard. Changed to:
    a `PENDING` or `REJECTED` distributor cannot log in at all (no JWT
    issued, even with correct credentials) — only once an admin approves via
    `/admin/distributors` can that account log in successfully. Requires a
    patch to the already-generated `user-auth.controller.ts` login handler.
25. **Product detail page added:** `/products/[slug]`, reached via a "View
    Details" button on every `ProductCard` (Home, brand pages, distributor
    catalog, liked products — all consistent). Themed by the product's own
    brand regardless of the page it was clicked from. Shows gallery, specs,
    description, brand-appropriate action area (enquire for guests/customers,
    price + add-to-order for approved distributors, like icon for any
    logged-in user), and related products.
