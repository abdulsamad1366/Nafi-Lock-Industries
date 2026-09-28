import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";

/**
 * GET /api/distributor/me
 * Returns profile, status, and assigned sales rep (accessible to PENDING and APPROVED distributors)
 */
export async function getDistributorMe(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
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
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/distributor/apply
 * Legacy endpoint — distributor application is handled during signup
 */
export async function applyDistributor(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const existingProfile = await prisma.distributorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        error: `Distributor profile already exists with status: ${existingProfile.status}`,
      });
    }

    return res.status(400).json({
      error: "Distributor application is handled during registration at /signup.",
    });
  } catch (err) {
    next(err);
  }
}
