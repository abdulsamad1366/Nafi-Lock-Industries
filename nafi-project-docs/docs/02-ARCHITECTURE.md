# Architecture

## Why this architecture
The client wants the site to be **scalable at an ERP level** — able to add new
brands, categories, and products **without editing code or redeploying**. This
rules out a static/JSON-file catalog and requires a real database + admin panel.

The site now also includes a **three-tier auth system** (Customer, Distributor,
Admin) and a **distributor portal** with dealer pricing, ordering, order
tracking, ledger requests, and catalog downloads — see
`10-AUTH-AND-DISTRIBUTOR-PORTAL.md` for full detail. This section reflects the
updated architecture.

## Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js + Express (separate service, REST API)
- **Database:** PostgreSQL, accessed via Prisma ORM
- **Image handling:** Multer (upload) + Sharp (resize/compress) — images stored
  on the VPS's own disk, not a third-party CDN, since the client hosts their own server
- **File handling (catalogs/ledgers):** uploaded via Multer, stored on VPS disk,
  served through gated download endpoints (not static public URLs)
- **Auth — two separate systems, deliberately not unified:**
  - **Admin auth:** `AdminUser` table, JWT-based session, protecting all
    `/admin/*` routes and backend admin endpoints
  - **User auth:** `User` table (role: `CUSTOMER` | `DISTRIBUTOR`), separate
    JWT, protecting `/account/*` and `/distributor/*` routes and endpoints.
    Product/catalog endpoints support **optional auth** — a valid token is
    decoded if present (to determine what to include in the response, e.g.
    dealer pricing) but is not required to browse the public catalog.
- **Process management:** PM2 for both frontend and backend Node processes
- **Reverse proxy / SSL:** Nginx for Windows, with Let's Encrypt/Certbot for HTTPS

## Why frontend and backend are separate
Decoupling the REST API from the Next.js app means:
- The backend can later serve other clients (a dealer mobile app, etc.)
  without change.
- Frontend and backend can be deployed/restarted independently.
- Clear separation of concerns for whoever maintains this long-term.

## Why Admin auth and User auth are two separate systems
Admin access is a different trust boundary than customer/distributor access.
Keeping `AdminUser` completely separate (own table, own JWT, own login
endpoint) means a bug or exploit in the public signup/login flow can never
touch admin-level access. They are not roles on the same table.

## Why pricing/MOQ/downloads are gated server-side, not just hidden in the UI
Dealer price, minimum order quantity, and file downloads (catalogs, ledgers)
must never be present in an API response to a guest, customer, or
not-yet-approved distributor — not sent-then-hidden, but omitted from the
JSON entirely. This is enforced in the controller layer based on the decoded
token's role and (for distributors) their `DistributorProfile.status`.

## Hosting environment (client-provided)
- **Windows VPS**, 8 GB RAM, Xeon E5-2680 v3 — sufficient for Next.js + Express
  + PostgreSQL running concurrently.
- **Node.js, PostgreSQL, and Nginx are already installed on the VPS** (confirmed
  by client) — no OS-level setup needed, build can go straight to app deployment.
- **Domain confirmed:** www.nafilockindustries.com

## Deployment topology
```
[Domain] → Nginx (reverse proxy + SSL termination)
              │
              ├── /api/*  → Express backend (PM2, port 5000)
              │                  │
              │                  ▼
              │             PostgreSQL (local, via Prisma)
              │                  │
              │             /backend/uploads (product images, catalogs,
              │             ledgers — resized/served via sharp + gated routes)
              │
              └── /*      → Next.js frontend (PM2, port 3000)
```

## Full folder structure
```
nafi-lock-industries/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/db.ts
│   │   ├── routes/
│   │   │   ├── brands.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── categories.routes.ts
│   │   │   ├── inquiries.routes.ts
│   │   │   ├── auth.routes.ts              (admin login — unchanged)
│   │   │   ├── user-auth.routes.ts         (NEW — customer/distributor signup+login)
│   │   │   ├── distributor.routes.ts       (NEW — apply, profile, dashboard data)
│   │   │   ├── orders.routes.ts            (NEW)
│   │   │   ├── ledger.routes.ts            (NEW — requests + fulfilled files)
│   │   │   ├── catalogs.routes.ts          (NEW — downloadable catalog PDFs)
│   │   │   ├── likes.routes.ts             (NEW — liked products)
│   │   │   ├── sales-reps.routes.ts        (NEW)
│   │   │   └── admin/
│   │   │       ├── distributors.routes.ts  (NEW — approve/reject applications)
│   │   │       ├── orders.routes.ts        (NEW — manage all orders/status)
│   │   │       ├── ledger-requests.routes.ts (NEW — queue + fulfill)
│   │   │       └── sales-reps.routes.ts    (NEW — CRUD + assignment)
│   │   ├── controllers/
│   │   │   ├── brands.controller.ts
│   │   │   ├── products.controller.ts      (updated: strips dealerPrice/minOrderQty
│   │   │   │                                unless requester is an approved distributor)
│   │   │   ├── inquiries.controller.ts
│   │   │   ├── auth.controller.ts          (admin — unchanged)
│   │   │   ├── user-auth.controller.ts     (NEW)
│   │   │   ├── distributor.controller.ts   (NEW)
│   │   │   ├── orders.controller.ts        (NEW)
│   │   │   ├── ledger.controller.ts        (NEW)
│   │   │   ├── catalogs.controller.ts      (NEW)
│   │   │   ├── likes.controller.ts         (NEW)
│   │   │   └── sales-reps.controller.ts    (NEW)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts          (admin — unchanged)
│   │   │   ├── user-auth.middleware.ts     (NEW — requireAuth: any logged-in User)
│   │   │   ├── require-approved-distributor.middleware.ts (NEW — single reusable
│   │   │   │                                gate for every distributor-only route)
│   │   │   ├── optional-auth.middleware.ts (NEW — decodes token if present,
│   │   │   │                                doesn't block guests; used on product/
│   │   │   │                                catalog endpoints to decide what to include)
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── utils/validators.ts
│   ├── uploads/
│   │   ├── products/
│   │   ├── catalogs/
│   │   └── ledgers/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/placeholders/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  (Home)
│   │   ├── globals.css
│   │   ├── brands/
│   │   │   ├── s-nafi/page.tsx
│   │   │   ├── greek/
│   │   │   │   ├── page.tsx
│   │   │   │   └── theme.css
│   │   │   └── raksham/
│   │   │       ├── page.tsx
│   │   │       └── theme.css
│   │   ├── blog/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── login/page.tsx            (UPDATED — public login, no longer
│   │   │                              redirects to /admin/login)
│   │   ├── signup/page.tsx           (NEW — customer signup / distributor apply)
│   │   ├── account/                  (NEW — customer dashboard)
│   │   │   ├── layout.tsx            (auth-gated: any logged-in User)
│   │   │   ├── page.tsx              (Overview)
│   │   │   ├── liked/page.tsx
│   │   │   ├── inquiries/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── distributor/              (NEW — distributor dashboard)
│   │   │   ├── layout.tsx            (auth-gated: role=DISTRIBUTOR;
│   │   │   │                          shows "pending approval" state if not
│   │   │   │                          yet APPROVED, else full dashboard)
│   │   │   ├── page.tsx              (Overview — status, rep contact card)
│   │   │   ├── catalog/page.tsx      (products WITH dealerPrice + minOrderQty)
│   │   │   ├── liked/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx          (My Orders — list + status)
│   │   │   │   └── new/page.tsx      (Place Order — build from an order cart)
│   │   │   ├── ledger/page.tsx       (request + view/download fulfilled ledgers)
│   │   │   ├── downloads/page.tsx    (catalog PDFs)
│   │   │   ├── quote-requests/page.tsx
│   │   │   └── profile/page.tsx      (company details + assigned rep)
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── login/page.tsx        (unchanged — NOT in public nav)
│   │       ├── brands/page.tsx
│   │       ├── products/page.tsx     (UPDATED — now includes dealerPrice,
│   │       │                          minOrderQty fields on the product form)
│   │       ├── inquiries/page.tsx
│   │       ├── distributors/page.tsx (NEW — review/approve/reject applications,
│   │       │                          assign sales rep)
│   │       ├── orders/page.tsx       (NEW — all orders, update status)
│   │       ├── ledger-requests/page.tsx (NEW — queue, upload-to-fulfill)
│   │       ├── sales-reps/page.tsx   (NEW — CRUD)
│   │       └── catalogs/page.tsx     (NEW — upload/manage catalog PDFs)
│   ├── components/
│   │   ├── Header.tsx                (UPDATED — Login nav item now points to
│   │   │                              /login, not /admin/login)
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── BrandCard.tsx
│   │   ├── ProductCard.tsx           (UPDATED — like/heart icon for logged-in
│   │   │                              users; shows dealerPrice + "Add to Order"
│   │   │                              only for approved distributors)
│   │   ├── ProductGrid.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── OrderCartProvider.tsx     (NEW — client-side cart context; distributor
│   │   │                              adds products while browsing, reviews and
│   │   │                              submits as an Order — see doc 10)
│   │   ├── OrderCartDrawer.tsx       (NEW — persistent cart UI, distributor-only)
│   │   ├── DistributorStatusBanner.tsx (NEW — "pending approval" banner)
│   │   └── SalesRepCard.tsx          (NEW)
│   ├── lib/
│   │   ├── api.ts
│   │   ├── themeTokens.ts
│   │   └── userAuth.ts               (NEW — user/distributor session helpers,
│   │                                  separate from any admin auth helper)
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

## Key structural principles
- Brand theme colors live as **data** in `frontend/lib/themeTokens.ts`, not
  hardcoded into components. `ThemeProvider` applies the correct CSS variable
  set based on which brand route is active. Adding a 4th brand later means
  adding one entry to this data file, not touching every component.
- Distributor-only access is enforced by **one reusable middleware**
  (`require-approved-distributor.middleware.ts`) used by every gated route —
  pricing, MOQ, orders, ledger, catalog downloads. Adding a new distributor
  feature later means reusing this same guard, not writing new gating logic.
- The distributor dashboard is a **shell + pluggable sections**
  (`/distributor/*` routes, each independent), so new functions are added as
  new routes/nav entries rather than restructuring the dashboard.
