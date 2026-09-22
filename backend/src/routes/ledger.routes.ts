import { Router } from "express";
import {
  createLedgerRequest,
  getDistributorLedgerRequests,
  getDistributorLedgers,
  downloadLedger,
} from "../controllers/ledger.controller";
import { requireApprovedDistributor } from "../middleware/require-approved-distributor.middleware";

const router = Router();

// Gated by requireApprovedDistributor
router.post("/ledger-requests", requireApprovedDistributor, createLedgerRequest);
router.get("/ledger-requests", requireApprovedDistributor, getDistributorLedgerRequests);
router.get("/ledgers", requireApprovedDistributor, getDistributorLedgers);
router.get("/ledgers/:id/download", requireApprovedDistributor, downloadLedger);

export default router;
