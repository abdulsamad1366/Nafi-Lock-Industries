import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";

/**
 * POST /api/orders
 * Create a new distributor B2B order
 */
export async function createOrder(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;
    const { items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item." });
    }

    // Validate all products and quantities against minOrderQty and fetch dealer prices
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({
          error: `Product with ID ${item.productId} was not found or is inactive.`,
        });
      }

      const minQty = product.minOrderQty || 1;
      if (item.quantity < minQty) {
        return res.status(400).json({
          error: `Item "${product.name}" requires a minimum order quantity of ${minQty} units (received ${item.quantity}).`,
        });
      }

      if (!product.dealerPrice) {
        return res.status(400).json({
          error: `Item "${product.name}" does not have an active dealer price. Contact factory support.`,
        });
      }

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: Number(product.dealerPrice),
      });
    }

    // Generate human-readable order number
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          distributorId,
          status: "PLACED",
          notes: notes || null,
          items: {
            create: orderItemsData.map((oi) => ({
              productId: oi.productId,
              quantity: oi.quantity,
              unitPrice: oi.unitPrice,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  material: true,
                  size: true,
                },
              },
            },
          },
        },
      });

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders
 * List orders for the authenticated distributor
 */
export async function getDistributorOrders(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { distributorId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { placedAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 * Retrieve details for a specific order owned by distributor
 */
export async function getDistributorOrderById(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, distributorId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                material: true,
                size: true,
                finish: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}
