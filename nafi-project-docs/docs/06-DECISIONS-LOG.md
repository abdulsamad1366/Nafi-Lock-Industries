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
