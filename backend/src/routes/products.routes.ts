import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadMiddleware } from "../middleware/upload.middleware";

const router = Router();

// Public
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin-protected
router.post("/", authMiddleware, uploadMiddleware, createProduct);
router.put("/:id", authMiddleware, uploadMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
