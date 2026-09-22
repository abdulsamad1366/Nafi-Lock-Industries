import { Router } from "express";
import { listCatalogs, downloadCatalog } from "../controllers/catalogs.controller";
import { requireApprovedDistributor } from "../middleware/require-approved-distributor.middleware";

const router = Router();

// Public: anyone can view catalog names
router.get("/", listCatalogs);

// Gated: only approved distributors can download the actual PDF files
router.get("/:id/download", requireApprovedDistributor, downloadCatalog);

export default router;
