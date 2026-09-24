"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
const require_approved_distributor_middleware_1 = require("../middleware/require-approved-distributor.middleware");
const router = (0, express_1.Router)();
// All distributor order routes strictly gated by requireApprovedDistributor
router.post("/", require_approved_distributor_middleware_1.requireApprovedDistributor, orders_controller_1.createOrder);
router.get("/", require_approved_distributor_middleware_1.requireApprovedDistributor, orders_controller_1.getDistributorOrders);
router.get("/:id", require_approved_distributor_middleware_1.requireApprovedDistributor, orders_controller_1.getDistributorOrderById);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map