"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ledger_controller_1 = require("../controllers/ledger.controller");
const require_approved_distributor_middleware_1 = require("../middleware/require-approved-distributor.middleware");
const router = (0, express_1.Router)();
// Gated by requireApprovedDistributor
router.post("/ledger-requests", require_approved_distributor_middleware_1.requireApprovedDistributor, ledger_controller_1.createLedgerRequest);
router.get("/ledger-requests", require_approved_distributor_middleware_1.requireApprovedDistributor, ledger_controller_1.getDistributorLedgerRequests);
router.get("/ledgers", require_approved_distributor_middleware_1.requireApprovedDistributor, ledger_controller_1.getDistributorLedgers);
router.get("/ledgers/:id/download", require_approved_distributor_middleware_1.requireApprovedDistributor, ledger_controller_1.downloadLedger);
exports.default = router;
//# sourceMappingURL=ledger.routes.js.map