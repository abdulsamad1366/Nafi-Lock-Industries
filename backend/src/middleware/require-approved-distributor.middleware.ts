import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthenticatedUserRequest, requireAuth } from "./user-auth.middleware";

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
export function requireApprovedDistributor(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  // First ensure user is logged in
  requireAuth(req, res, async () => {
    try {
      if (!req.user || req.user.role !== "DISTRIBUTOR") {
        return res.status(403).json({
          code: "NOT_A_DISTRIBUTOR",
          error: "Access restricted — a registered distributor account is required.",
        });
      }

      const profile = await prisma.distributorProfile.findUnique({
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
          error:
            "Your distributor application is currently under review by factory administration.",
        });
      }

      if (profile.status === "REJECTED") {
        return res.status(403).json({
          code: "DISTRIBUTOR_REJECTED",
          status: "REJECTED",
          error:
            "Your distributor application was not approved. Please contact wholesale support.",
        });
      }

      if (profile.status === "APPROVED") {
        return next();
      }

      return res.status(403).json({
        code: "UNAUTHORIZED_STATUS",
        error: "Invalid distributor status.",
      });
    } catch (err) {
      next(err);
    }
  });
}
