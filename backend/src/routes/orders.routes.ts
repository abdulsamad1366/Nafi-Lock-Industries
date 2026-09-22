import { Router } from "express";
import {
  createOrder,
  getDistributorOrders,
  getDistributorOrderById,
} from "../controllers/orders.controller";
import { requireApprovedDistributor } from "../middleware/require-approved-distributor.middleware";

const router = Router();

// All distributor order routes strictly gated by requireApprovedDistributor
router.post("/", requireApprovedDistributor, createOrder);
router.get("/", requireApprovedDistributor, getDistributorOrders);
router.get("/:id", requireApprovedDistributor, getDistributorOrderById);

export default router;
