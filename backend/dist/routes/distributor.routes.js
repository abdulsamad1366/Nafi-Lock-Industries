"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distributor_controller_1 = require("../controllers/distributor.controller");
const user_auth_middleware_1 = require("../middleware/user-auth.middleware");
const router = (0, express_1.Router)();
// Gated by requireAuth (pending distributors need to check their status)
router.get("/me", user_auth_middleware_1.requireAuth, distributor_controller_1.getDistributorMe);
router.post("/apply", user_auth_middleware_1.requireAuth, distributor_controller_1.applyDistributor);
exports.default = router;
//# sourceMappingURL=distributor.routes.js.map