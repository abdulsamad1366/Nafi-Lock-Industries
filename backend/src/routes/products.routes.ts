import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { optionalAuth } from "../middleware/optional-auth.middleware";
import { uploadMiddleware } from "../middleware/upload.middleware";

const router = Router();

// Public / Gated Pricing (passes optionalAuth to check distributor status)
router.get("/", optionalAuth, getAllProducts);
router.get("/:slug", optionalAuth, getProductBySlug);

// Admin-protected
router.post("/", authMiddleware, uploadMiddleware, createProduct);
router.put("/:id", authMiddleware, uploadMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
