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
 * Allows an existing CUSTOMER to submit an application to become a DISTRIBUTOR
 */
export async function applyDistributor(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { companyName, gstNumber, businessAddress, city, state } = req.body;

    if (!companyName || !businessAddress || !city || !state) {
      return res.status(400).json({
        error: "Company name, business address, city, and state are required",
      });
    }

    const existingProfile = await prisma.distributorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        error: `Distributor profile already exists with status: ${existingProfile.status}`,
      });
    }

    const [updatedUser, profile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: "DISTRIBUTOR" },
      }),
      prisma.distributorProfile.create({
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
  } catch (err) {
    next(err);
  }
}
