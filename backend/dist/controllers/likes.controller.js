"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeProduct = likeProduct;
exports.unlikeProduct = unlikeProduct;
exports.getLikedProducts = getLikedProducts;
const db_1 = __importDefault(require("../config/db"));
const product_serializer_1 = require("../utils/product-serializer");
/**
 * POST /api/products/:id/like
 * Add a product to the user's liked list
 */
async function likeProduct(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        // Verify product exists
        const product = await db_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const liked = await db_1.default.likedProduct.upsert({
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
    }
    catch (err) {
        next(err);
    }
}
/**
 * DELETE /api/products/:id/like
 * Remove a product from the user's liked list
 */
async function unlikeProduct(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        await db_1.default.likedProduct.deleteMany({
            where: {
                userId,
                productId,
            },
        });
        res.json({ message: "Product removed from liked items" });
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/users/me/liked-products
 * Retrieve all liked products for current user (gating dealer pricing based on role/status)
 */
async function getLikedProducts(req, res, next) {
    try {
        const userId = req.user.id;
        const likedRecords = await db_1.default.likedProduct.findMany({
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
        const isApproved = await (0, product_serializer_1.isUserApprovedDistributor)(req.user);
        const products = likedRecords.map((lr) => lr.product);
        res.json((0, product_serializer_1.serializeProducts)(products, isApproved));
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=likes.controller.js.map