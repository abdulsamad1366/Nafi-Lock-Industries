"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../config/db"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Gated by Admin authMiddleware
router.use(auth_middleware_1.authMiddleware);
/**
 * GET /api/admin/orders
 * List all distributor orders
 */
router.get("/", async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        const orders = await db_1.default.order.findMany({
            where,
            include: {
                distributor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        distributorProfile: {
                            select: {
                                companyName: true,
                                gstNumber: true,
                                city: true,
                                state: true,
                            },
                        },
                    },
                },
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
    }
    catch (err) {
        next(err);
    }
});
/**
 * PATCH /api/admin/orders/:id
 * Update order status and notes
 */
router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const updateData = {};
        if (status)
            updateData.status = status;
        if (notes !== undefined)
            updateData.notes = notes;
        const updated = await db_1.default.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=orders.routes.js.map