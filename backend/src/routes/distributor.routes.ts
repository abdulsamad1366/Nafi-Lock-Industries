import { Router } from "express";
import {
  getDistributorMe,
  applyDistributor,
  updateDistributorProfile,
} from "../controllers/distributor.controller";
import { requireAuth } from "../middleware/user-auth.middleware";

const router = Router();

// Gated by requireAuth (pending distributors need to check their status)
router.get("/me", requireAuth, getDistributorMe);
router.put("/me", requireAuth, updateDistributorProfile);
router.put("/profile", requireAuth, updateDistributorProfile);
router.post("/apply", requireAuth, applyDistributor);

export default router;
