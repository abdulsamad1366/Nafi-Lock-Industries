"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserApprovedDistributor = isUserApprovedDistributor;
exports.serializeProduct = serializeProduct;
exports.serializeProducts = serializeProducts;
const db_1 = __importDefault(require("../config/db"));
/**
 * Check if the authenticated requester is an APPROVED distributor
 */
async function isUserApprovedDistributor(user) {
    if (!user || user.role !== "DISTRIBUTOR")
        return false;
    const profile = await db_1.default.distributorProfile.findUnique({
        where: { userId: user.id },
        select: { status: true },
    });
    return profile?.status === "APPROVED";
}
/**
 * Serialize a single product: strip dealerPrice and minOrderQty unless requester is approved distributor
 */
function serializeProduct(product, isApprovedDistributor) {
    if (!product)
        return product;
    if (isApprovedDistributor) {
        return product;
    }
    const { dealerPrice, minOrderQty, ...rest } = product;
    return rest;
}
/**
 * Serialize an array of products
 */
function serializeProducts(products, isApprovedDistributor) {
    return products.map((p) => serializeProduct(p, isApprovedDistributor));
}
//# sourceMappingURL=product-serializer.js.map