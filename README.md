# Nafi Lock Industries

Premium lock manufacturer website — **S-Nafi · Greek · Raksham**

A multi-brand digital showroom, customer portal, and gated B2B distributor portal.

---

## 🏗️ Architecture

- **Frontend:** Next.js (App Router) + Tailwind CSS → `frontend/`
- **Backend:** Node.js + Express REST API (TypeScript) → `backend/`
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Deployment:** Render (API Web Service via `render.yaml`) + Vercel / VPS (Frontend)

See [`nafi-project-docs/docs/`](./nafi-project-docs/docs/) for complete project documentation and design system specifications.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Verify or create backend/.env:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
# JWT_SECRET="your-admin-jwt-secret"
# USER_JWT_SECRET="your-user-jwt-secret"
# PORT=5001

# Push database schema to Supabase
npm run db:push

# (Optional) Seed initial demo data (brands, categories, sample catalog, demo users)
npm run db:seed

# Start backend dev server (runs on http://localhost:5001)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Configure environment variables in frontend/.env.local:
# NEXT_PUBLIC_API_URL="http://localhost:5001/api" # (or your live Render API URL)

# Start frontend dev server (runs on http://localhost:3000)
npm run dev
```

---

## 🛠️ Common Commands

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start Express dev server with hot reload (`http://localhost:5001`) |
| `npm run build` | Generate Prisma client and compile TypeScript to `dist/` |
| `npm run start` | Run compiled production server (`node dist/server.js`) |
| `npm run db:push` | Push schema changes directly to PostgreSQL / Supabase |
| `npm run db:seed` | Seed database with initial products, brands, and accounts |
| `npm run db:generate` | Regenerate Prisma client artifacts |

### Frontend (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server (`http://localhost:3000`) |
| `npm run build` | Build Next.js production bundle |
| `npm run start` | Start Next.js production server |
| `npx tsc --noEmit` | Run TypeScript type checks |

---

## 🌐 Cloud Deployment (Render API)

The backend is configured for 1-click cloud deployment on Render via the included [`render.yaml`](./render.yaml) Blueprint:

1. In [Render Dashboard](https://dashboard.render.com/), choose **New +** → **Blueprint**.
2. Select repository `abdulsamad1366/Nafi-Lock-Industries`.
3. Provide your Supabase `DATABASE_URL` when prompted.
4. Render automatically runs `npm install --include=dev && npm run build` and starts `node dist/server.js`.
5. Health checks are monitored at `/health` and `/api/health`.

Once deployed, set the live URL in your frontend:
```env
NEXT_PUBLIC_API_URL="https://<your-render-service>.onrender.com/api"
```

---

## 📁 Project Structure

```
nafi-lock-industries/
├── backend/                   # Express REST API (TypeScript)
│   ├── prisma/                # Prisma schema (schema.prisma), tsconfig, and seed script
│   ├── src/                   # Server setup, routes, controllers, middleware
│   │   ├── controllers/       # Products, Brands, Auth, Distributor, Orders, Ledger
│   │   ├── middleware/        # Auth gates, optionalAuth, distributor approval checks
│   │   └── routes/            # Public, Distributor, and Admin API endpoints
│   └── uploads/               # Product photos, catalogs, and customer ledgers
├── frontend/                  # Next.js App Router
│   ├── app/                   # Pages: Home, Brand pages, /products/[slug], /distributor, /account, /admin
│   ├── components/            # ProductCard, ProductGallery, ProductSpecTable, OrderCartDrawer, etc.
│   ├── lib/                   # API client (fetchAPI), userAuth helpers, theme tokens
│   └── public/                # Static brand logos & placeholder SVGs
├── render.yaml                # Render Blueprint automated deployment spec
└── nafi-project-docs/         # Architecture, design systems, and decision logs
```

---

## 🔐 Key User Roles & Portals

- **Customer:** Public catalog browsing, inquiry submission, and liked products collection (`/account/liked`).
- **Distributor:** Gated B2B dealer experience (`/distributor/dashboard`). Requires admin review before login. Includes dealer pricing, order cart drawer, order tracking, catalog downloads, and sales representative contact.
- **Admin:** Management portal (`/admin`) for product catalog, distributor approvals, order statuses, sales reps, and ledger fulfillment.
