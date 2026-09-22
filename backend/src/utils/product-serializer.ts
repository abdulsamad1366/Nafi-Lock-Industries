import prisma from "../config/db";
import { UserAuthPayload } from "../middleware/user-auth.middleware";

/**
 * Check if the authenticated requester is an APPROVED distributor
 */
export async function isUserApprovedDistributor(
  user?: UserAuthPayload
): Promise<boolean> {
  if (!user || user.role !== "DISTRIBUTOR") return false;
  const profile = await prisma.distributorProfile.findUnique({
    where: { userId: user.id },
    select: { status: true },
  });
  return profile?.status === "APPROVED";
}

/**
 * Serialize a single product: strip dealerPrice and minOrderQty unless requester is approved distributor
 */
export function serializeProduct(product: any, isApprovedDistributor: boolean) {
  if (!product) return product;
  if (isApprovedDistributor) {
    return product;
  }
  const { dealerPrice, minOrderQty, ...rest } = product;
  return rest;
}

/**
 * Serialize an array of products
 */
export function serializeProducts(
  products: any[],
  isApprovedDistributor: boolean
) {
  return products.map((p) => serializeProduct(p, isApprovedDistributor));
}
