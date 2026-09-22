import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";
import {
  isUserApprovedDistributor,
  serializeProducts,
} from "../utils/product-serializer";

/**
 * POST /api/products/:id/like
 * Add a product to the user's liked list
 */
export async function likeProduct(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const productId = req.params.id;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const liked = await prisma.likedProduct.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
      },
      update: {},
    });

    res.status(201).json({ message: "Product liked successfully", liked });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/products/:id/like
 * Remove a product from the user's liked list
 */
export async function unlikeProduct(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const productId = req.params.id;

    await prisma.likedProduct.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.json({ message: "Product removed from liked items" });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/me/liked-products
 * Retrieve all liked products for current user (gating dealer pricing based on role/status)
 */
export async function getLikedProducts(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const likedRecords = await prisma.likedProduct.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
      orderBy: { likedAt: "desc" },
    });

    const isApproved = await isUserApprovedDistributor(req.user);
    const products = likedRecords.map((lr) => lr.product);

    res.json(serializeProducts(products, isApproved));
  } catch (err) {
    next(err);
  }
}
