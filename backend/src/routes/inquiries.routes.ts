import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
} from "../controllers/inquiries.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public — submit an inquiry
router.post("/", createInquiry);

// Admin-protected — view and manage inquiries
router.get("/", authMiddleware, getAllInquiries);
router.patch("/:id/status", authMiddleware, updateInquiryStatus);

export default router;
