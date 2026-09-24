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
 * GET /api/admin/distributors
 * List all distributor applications, filterable by status
 */
router.get("/", async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            where.status = status;
        }
        const distributors = await db_1.default.distributorProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
                assignedRep: true,
            },
            orderBy: { appliedAt: "desc" },
        });
        res.json(distributors);
    }
    catch (err) {
        next(err);
    }
});
/**
 * PATCH /api/admin/distributors/:id
 * Approve, reject, or assign sales rep
 */
router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, assignedRepId } = req.body;
        const updateData = {
            reviewedAt: new Date(),
            reviewedById: req.admin?.id || "admin",
        };
        if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            updateData.status = status;
        }
        if (assignedRepId !== undefined) {
            updateData.assignedRepId = assignedRepId || null;
        }
        const updated = await db_1.default.distributorProfile.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                assignedRep: true,
            },
        });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=distributors.routes.js.map