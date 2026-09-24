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
 * GET /api/admin/sales-reps
 * List all sales reps
 */
router.get("/", async (_req, res, next) => {
    try {
        const reps = await db_1.default.salesRep.findMany({
            include: {
                _count: {
                    select: { distributorProfiles: true },
                },
            },
            orderBy: { name: "asc" },
        });
        res.json(reps);
    }
    catch (err) {
        next(err);
    }
});
/**
 * POST /api/admin/sales-reps
 * Create a new sales rep
 */
router.post("/", async (req, res, next) => {
    try {
        const { name, email, phone, photoUrl } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Name, email, and phone are required" });
        }
        const rep = await db_1.default.salesRep.create({
            data: {
                name,
                email,
                phone,
                photoUrl: photoUrl || null,
            },
        });
        res.status(201).json(rep);
    }
    catch (err) {
        next(err);
    }
});
/**
 * PUT /api/admin/sales-reps/:id
 * Update sales rep
 */
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone, photoUrl } = req.body;
        const rep = await db_1.default.salesRep.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
            },
        });
        res.json(rep);
    }
    catch (err) {
        next(err);
    }
});
/**
 * DELETE /api/admin/sales-reps/:id
 * Delete sales rep
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        // Unassign distributors before deleting
        await db_1.default.distributorProfile.updateMany({
            where: { assignedRepId: id },
            data: { assignedRepId: null },
        });
        await db_1.default.salesRep.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=sales-reps.routes.js.map