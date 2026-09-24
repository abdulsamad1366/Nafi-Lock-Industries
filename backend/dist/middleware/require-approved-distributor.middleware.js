"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireApprovedDistributor = requireApprovedDistributor;
const db_1 = __importDefault(require("../config/db"));
const user_auth_middleware_1 = require("./user-auth.middleware");
/**
 * requireApprovedDistributor middleware:
 * 1. Checks user authentication via requireAuth.
 * 2. Checks role === "DISTRIBUTOR".
 * 3. Fetches live DistributorProfile from database.
 * 4. Distinguishes:
 *    - Not a distributor -> 403 NOT_A_DISTRIBUTOR
 *    - Pending approval -> 403 DISTRIBUTOR_PENDING
 *    - Rejected -> 403 DISTRIBUTOR_REJECTED
 *    - Approved -> passes through to next()
 */
function requireApprovedDistributor(req, res, next) {
    // First ensure user is logged in
    (0, user_auth_middleware_1.requireAuth)(req, res, async () => {
        try {
            if (!req.user || req.user.role !== "DISTRIBUTOR") {
                return res.status(403).json({
                    code: "NOT_A_DISTRIBUTOR",
                    error: "Access restricted — a registered distributor account is required.",
                });
            }
            const profile = await db_1.default.distributorProfile.findUnique({
                where: { userId: req.user.id },
            });
            if (!profile) {
                return res.status(403).json({
                    code: "NO_DISTRIBUTOR_PROFILE",
                    error: "Distributor profile not found. Please submit an application.",
                });
            }
            if (profile.status === "PENDING") {
                return res.status(403).json({
                    code: "DISTRIBUTOR_PENDING",
                    status: "PENDING",
                    error: "Your distributor application is currently under review by factory administration.",
                });
            }
            if (profile.status === "REJECTED") {
                return res.status(403).json({
                    code: "DISTRIBUTOR_REJECTED",
                    status: "REJECTED",
                    error: "Your distributor application was not approved. Please contact wholesale support.",
                });
            }
            if (profile.status === "APPROVED") {
                return next();
            }
            return res.status(403).json({
                code: "UNAUTHORIZED_STATUS",
                error: "Invalid distributor status.",
            });
        }
        catch (err) {
            next(err);
        }
    });
}
//# sourceMappingURL=require-approved-distributor.middleware.js.map