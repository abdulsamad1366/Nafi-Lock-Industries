"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Existing Public & Admin Routers
const brands_routes_1 = __importDefault(require("./routes/brands.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const inquiries_routes_1 = __importDefault(require("./routes/inquiries.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Phase 2: User Auth & Distributor Routers
const user_auth_routes_1 = __importDefault(require("./routes/user-auth.routes"));
const distributor_routes_1 = __importDefault(require("./routes/distributor.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const ledger_routes_1 = __importDefault(require("./routes/ledger.routes"));
const catalogs_routes_1 = __importDefault(require("./routes/catalogs.routes"));
const likes_routes_1 = __importDefault(require("./routes/likes.routes"));
// Phase 2: Admin Extension Routers
const distributors_routes_1 = __importDefault(require("./routes/admin/distributors.routes"));
const orders_routes_2 = __importDefault(require("./routes/admin/orders.routes"));
const ledger_requests_routes_1 = __importDefault(require("./routes/admin/ledger-requests.routes"));
const sales_reps_routes_1 = __importDefault(require("./routes/admin/sales-reps.routes"));
const catalogs_routes_2 = __importDefault(require("./routes/admin/catalogs.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint for cloud hosting / monitoring
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// Security: Explicitly block direct public access to private catalogs and ledgers
app.use("/uploads/catalogs", (_req, res) => res.status(403).json({ error: "Access denied. Use gated download route." }));
app.use("/uploads/ledgers", (_req, res) => res.status(403).json({ error: "Access denied. Use gated download route." }));
// Only public assets like product images are statically served
app.use("/uploads", express_1.default.static("uploads"));
// Phase 1 Routes
app.use("/api/brands", brands_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/categories", categories_routes_1.default);
app.use("/api/inquiries", inquiries_routes_1.default);
// Phase 2: Public User Auth (Customer & Distributor)
app.use("/api/auth", user_auth_routes_1.default);
// Phase 2: Distributor & User Routes
app.use("/api/distributor", distributor_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api", ledger_routes_1.default);
app.use("/api/catalogs", catalogs_routes_1.default);
app.use("/api", likes_routes_1.default);
// Admin Routes (Gated by admin authMiddleware)
app.use("/api/admin/auth", auth_routes_1.default);
app.use("/api/admin/distributors", distributors_routes_1.default);
app.use("/api/admin/orders", orders_routes_2.default);
app.use("/api/admin/ledger-requests", ledger_requests_routes_1.default);
app.use("/api/admin/sales-reps", sales_reps_routes_1.default);
app.use("/api/admin/catalogs", catalogs_routes_2.default);
// Error handling
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🔒 Nafi Lock Industries API running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map