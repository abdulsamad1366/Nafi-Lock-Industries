"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_controller_1 = require("../controllers/likes.controller");
const user_auth_middleware_1 = require("../middleware/user-auth.middleware");
const router = (0, express_1.Router)();
// Gated by requireAuth (Customers and Distributors alike)
router.post("/products/:id/like", user_auth_middleware_1.requireAuth, likes_controller_1.likeProduct);
router.delete("/products/:id/like", user_auth_middleware_1.requireAuth, likes_controller_1.unlikeProduct);
router.get("/users/me/liked-products", user_auth_middleware_1.requireAuth, likes_controller_1.getLikedProducts);
exports.default = router;
//# sourceMappingURL=likes.routes.js.map