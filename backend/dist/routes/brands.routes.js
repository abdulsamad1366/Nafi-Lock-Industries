"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brands_controller_1 = require("../controllers/brands.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/", brands_controller_1.getAllBrands);
router.get("/:slug", brands_controller_1.getBrandBySlug);
// Admin-protected
router.post("/", auth_middleware_1.authMiddleware, brands_controller_1.createBrand);
router.put("/:id", auth_middleware_1.authMiddleware, brands_controller_1.updateBrand);
router.delete("/:id", auth_middleware_1.authMiddleware, brands_controller_1.deleteBrand);
exports.default = router;
//# sourceMappingURL=brands.routes.js.map