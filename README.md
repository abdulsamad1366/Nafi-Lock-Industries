# Nafi Lock Industries

Premium lock manufacturer website — **S-Nafi · Greek · Raksham**

## Architecture

- **Frontend:** Next.js (App Router) + Tailwind CSS → `frontend/`
- **Backend:** Node.js + Express REST API → `backend/`
- **Database:** PostgreSQL via Prisma ORM
- **Hosting:** Windows VPS with Nginx reverse proxy + PM2

See [`nafi-project-docs/docs/`](./nafi-project-docs/docs/) for full project documentation.

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env .env.local    # edit DATABASE_URL and JWT_SECRET
npx prisma db push
npx prisma db seed
npm run dev            # → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # → http://localhost:3000
```

## Project Structure
```
nafi-lock-industries/
├── backend/           # Express API + Prisma + PostgreSQL
│   ├── prisma/        # Schema + seed
│   ├── src/           # Server, routes, controllers, middleware
│   └── uploads/       # Product images (local disk)
├── frontend/          # Next.js App Router
│   ├── app/           # Pages and routes
│   ├── components/    # Reusable UI components
│   ├── lib/           # API client + theme tokens
│   └── public/        # Static assets + placeholder SVGs
└── nafi-project-docs/ # Project documentation
```
