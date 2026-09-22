import { Router } from "express";
import {
  getDistributorMe,
  applyDistributor,
} from "../controllers/distributor.controller";
import { requireAuth } from "../middleware/user-auth.middleware";

const router = Router();

// Gated by requireAuth (pending distributors need to check their status)
router.get("/me", requireAuth, getDistributorMe);
router.post("/apply", requireAuth, applyDistributor);

export default router;
