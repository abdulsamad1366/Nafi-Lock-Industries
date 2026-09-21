import { Router } from "express";
import {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brands.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public
router.get("/", getAllBrands);
router.get("/:slug", getBrandBySlug);

// Admin-protected
router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.delete("/:id", authMiddleware, deleteBrand);

export default router;
