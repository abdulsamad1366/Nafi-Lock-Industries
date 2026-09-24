"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistributorMe = getDistributorMe;
exports.applyDistributor = applyDistributor;
const db_1 = __importDefault(require("../config/db"));
/**
 * GET /api/distributor/me
 * Returns profile, status, and assigned sales rep (accessible to PENDING and APPROVED distributors)
 */
async function getDistributorMe(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                distributorProfile: {
                    include: {
                        assignedRep: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
/**
 * POST /api/distributor/apply
 * Allows an existing CUSTOMER to submit an application to become a DISTRIBUTOR
 */
async function applyDistributor(req, res, next) {
    try {
        const userId = req.user.id;
        const { companyName, gstNumber, businessAddress, city, state } = req.body;
        if (!companyName || !businessAddress || !city || !state) {
            return res.status(400).json({
                error: "Company name, business address, city, and state are required",
            });
        }
        const existingProfile = await db_1.default.distributorProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            return res.status(400).json({
                error: `Distributor profile already exists with status: ${existingProfile.status}`,
            });
        }
        const [updatedUser, profile] = await db_1.default.$transaction([
            db_1.default.user.update({
                where: { id: userId },
                data: { role: "DISTRIBUTOR" },
            }),
            db_1.default.distributorProfile.create({
                data: {
                    userId,
                    companyName,
                    gstNumber: gstNumber || null,
                    businessAddress,
                    city,
                    state,
                    status: "PENDING",
                },
            }),
        ]);
        res.status(201).json({
            message: "Distributor application submitted successfully",
            role: updatedUser.role,
            profile,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=distributor.controller.js.map