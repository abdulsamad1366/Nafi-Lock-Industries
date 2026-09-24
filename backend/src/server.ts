import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Existing Public & Admin Routers
import brandsRouter from "./routes/brands.routes";
import productsRouter from "./routes/products.routes";
import categoriesRouter from "./routes/categories.routes";
import inquiriesRouter from "./routes/inquiries.routes";
import adminAuthRouter from "./routes/auth.routes";

// Phase 2: User Auth & Distributor Routers
import userAuthRouter from "./routes/user-auth.routes";
import distributorRouter from "./routes/distributor.routes";
import ordersRouter from "./routes/orders.routes";
import ledgerRouter from "./routes/ledger.routes";
import { purgeExpiredLedgers } from "./controllers/ledger.controller";
import catalogsRouter from "./routes/catalogs.routes";
import likesRouter from "./routes/likes.routes";

// Phase 2: Admin Extension Routers
import adminDistributorsRouter from "./routes/admin/distributors.routes";
import adminOrdersRouter from "./routes/admin/orders.routes";
import adminLedgerRequestsRouter from "./routes/admin/ledger-requests.routes";
import adminSalesRepsRouter from "./routes/admin/sales-reps.routes";
import adminCatalogsRouter from "./routes/admin/catalogs.routes";

import { errorHandler } from "./middleware/error.middleware";
import prisma from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for cloud hosting / monitoring
app.get("/health", async (_req, res) => {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  let dbStatus = "unknown";
  let dbError: string | null = null;
  try {
    if (dbConfigured) {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } else {
      dbStatus = "missing_env";
    }
  } catch (err: any) {
    dbStatus = "error";
    dbError = err.message;
  }
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConfigured,
    dbStatus,
    dbError,
  });
});
app.get("/api/health", async (_req, res) => {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  let dbStatus = "unknown";
  let dbError: string | null = null;
  try {
    if (dbConfigured) {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } else {
      dbStatus = "missing_env";
    }
  } catch (err: any) {
    dbStatus = "error";
    dbError = err.message;
  }
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConfigured,
    dbStatus,
    dbError,
  });
});

// Security: Explicitly block direct public access to private catalogs and ledgers
app.use("/uploads/catalogs", (_req, res) =>
  res.status(403).json({ error: "Access denied. Use gated download route." })
);
app.use("/uploads/ledgers", (_req, res) =>
  res.status(403).json({ error: "Access denied. Use gated download route." })
);
// Only public assets like product images are statically served
app.use("/uploads", express.static("uploads"));

// Phase 1 Routes
app.use("/api/brands", brandsRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/inquiries", inquiriesRouter);

// Phase 2: Public User Auth (Customer & Distributor)
app.use("/api/auth", userAuthRouter);

// Phase 2: Distributor & User Routes
app.use("/api/distributor", distributorRouter);
app.use("/api/orders", ordersRouter);
app.use("/api", ledgerRouter);
app.use("/api/catalogs", catalogsRouter);
app.use("/api", likesRouter);

// Admin Routes (Gated by admin authMiddleware)
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/distributors", adminDistributorsRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/ledger-requests", adminLedgerRequestsRouter);
app.use("/api/admin/sales-reps", adminSalesRepsRouter);
app.use("/api/admin/catalogs", adminCatalogsRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🔒 Nafi Lock Industries API running on port ${PORT}`);
  // Initial purge of any ledgers older than 7 days
  purgeExpiredLedgers().catch((err) =>
    console.error("Initial ledger purge error:", err)
  );
  // Recurring hourly auto-deletion daemon
  setInterval(() => {
    purgeExpiredLedgers().catch((err) =>
      console.error("Recurring ledger purge error:", err)
    );
  }, 60 * 60 * 1000);
});

export default app;
