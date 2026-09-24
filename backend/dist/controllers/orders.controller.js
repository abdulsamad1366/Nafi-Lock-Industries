"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getDistributorOrders = getDistributorOrders;
exports.getDistributorOrderById = getDistributorOrderById;
const db_1 = __importDefault(require("../config/db"));
/**
 * POST /api/orders
 * Create a new distributor B2B order
 */
async function createOrder(req, res, next) {
    try {
        const distributorId = req.user.id;
        const { items, notes } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Order must contain at least one item." });
        }
        // Validate all products and quantities against minOrderQty and fetch dealer prices
        const productIds = items.map((i) => i.productId);
        const dbProducts = await db_1.default.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });
        const productMap = new Map(dbProducts.map((p) => [p.id, p]));
        const orderItemsData = [];
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
        const order = await db_1.default.$transaction(async (tx) => {
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
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/orders
 * List orders for the authenticated distributor
 */
async function getDistributorOrders(req, res, next) {
    try {
        const distributorId = req.user.id;
        const orders = await db_1.default.order.findMany({
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
                                brand: true,
                                category: true,
                                minOrderQty: true,
                            },
                        },
                    },
                },
            },
            orderBy: { placedAt: "desc" },
        });
        res.json(orders);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/orders/:id
 * Retrieve details for a specific order owned by distributor
 */
async function getDistributorOrderById(req, res, next) {
    try {
        const distributorId = req.user.id;
        const { id } = req.params;
        const order = await db_1.default.order.findFirst({
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
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=orders.controller.js.map