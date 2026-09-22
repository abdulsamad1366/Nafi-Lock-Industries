import { Router } from "express";
import {
  likeProduct,
  unlikeProduct,
  getLikedProducts,
} from "../controllers/likes.controller";
import { requireAuth } from "../middleware/user-auth.middleware";

const router = Router();

// Gated by requireAuth (Customers and Distributors alike)
router.post("/products/:id/like", requireAuth, likeProduct);
router.delete("/products/:id/like", requireAuth, unlikeProduct);
router.get("/users/me/liked-products", requireAuth, getLikedProducts);

export default router;
