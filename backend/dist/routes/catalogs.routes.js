"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogs_controller_1 = require("../controllers/catalogs.controller");
const require_approved_distributor_middleware_1 = require("../middleware/require-approved-distributor.middleware");
const router = (0, express_1.Router)();
// Public: anyone can view catalog names
router.get("/", catalogs_controller_1.listCatalogs);
// Gated: only approved distributors can download the actual PDF files
router.get("/:id/download", require_approved_distributor_middleware_1.requireApprovedDistributor, catalogs_controller_1.downloadCatalog);
exports.default = router;
//# sourceMappingURL=catalogs.routes.js.map