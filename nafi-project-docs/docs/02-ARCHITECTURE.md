# Architecture

## Why this architecture
The client wants the site to be **scalable at an ERP level** — able to add new
brands, categories, and products **without editing code or redeploying**. This
rules out a static/JSON-file catalog and requires a real database + admin panel.

## Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js + Express (separate service, REST API)
- **Database:** PostgreSQL, accessed via Prisma ORM
- **Image handling:** Multer (upload) + Sharp (resize/compress) — images stored
  on the VPS's own disk, not a third-party CDN, since the client hosts their own server
- **Admin auth:** JWT-based session, protecting all `/admin/*` routes and
  backend admin endpoints
- **Process management:** PM2 for both frontend and backend Node processes
- **Reverse proxy / SSL:** Nginx for Windows, with Let's Encrypt/Certbot for HTTPS

## Why frontend and backend are separate
Decoupling the REST API from the Next.js app means:
- The backend can later serve other clients (a dealer mobile app, etc.)
  without change.
- Frontend and backend can be deployed/restarted independently.
- Clear separation of concerns for whoever maintains this long-term.

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
              │             /backend/uploads (product images, resized via sharp)
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
│   │   │   └── auth.routes.ts
│   │   ├── controllers/
│   │   │   ├── brands.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── inquiries.controller.ts
│   │   │   └── auth.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── utils/validators.ts
│   ├── uploads/
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
│   │   ├── contact/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── login/page.tsx
│   │       ├── brands/page.tsx
│   │       ├── products/page.tsx
│   │       └── inquiries/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── BrandCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ContactForm.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── themeTokens.ts
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

## Key structural principle
Brand theme colors live as **data** in `frontend/lib/themeTokens.ts`, not
hardcoded into components. `ThemeProvider` applies the correct CSS variable
set based on which brand route is active. Adding a 4th brand later means
adding one entry to this data file, not touching every component.
