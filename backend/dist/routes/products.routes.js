"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const optional_auth_middleware_1 = require("../middleware/optional-auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Public / Gated Pricing (passes optionalAuth to check distributor status)
router.get("/", optional_auth_middleware_1.optionalAuth, products_controller_1.getAllProducts);
router.get("/:slug", optional_auth_middleware_1.optionalAuth, products_controller_1.getProductBySlug);
// Admin-protected
router.post("/", auth_middleware_1.authMiddleware, upload_middleware_1.uploadMiddleware, products_controller_1.createProduct);
router.put("/:id", auth_middleware_1.authMiddleware, upload_middleware_1.uploadMiddleware, products_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, products_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map