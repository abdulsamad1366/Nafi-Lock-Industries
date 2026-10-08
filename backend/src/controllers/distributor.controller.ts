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

/**
 * PUT /api/distributor/profile
 * Allows approved/registered distributor to update their business profile & contact info
 */
export async function updateDistributorProfile(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { name, phone, companyName, gstNumber, businessAddress, city, state } = req.body;

    // 1. Update User contact fields if provided
    const userUpdateData: { name?: string; phone?: string | null } = {};
    if (typeof name === "string" && name.trim()) {
      userUpdateData.name = name.trim();
    }
    if (phone !== undefined) {
      userUpdateData.phone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

    // 2. Update DistributorProfile fields if provided
    const profileUpdateData: {
      companyName?: string;
      gstNumber?: string | null;
      businessAddress?: string;
      city?: string;
      state?: string;
    } = {};

    if (typeof companyName === "string" && companyName.trim()) {
      profileUpdateData.companyName = companyName.trim();
    }
    if (gstNumber !== undefined) {
      profileUpdateData.gstNumber =
        typeof gstNumber === "string" && gstNumber.trim() ? gstNumber.trim().toUpperCase() : null;
    }
    if (typeof businessAddress === "string" && businessAddress.trim()) {
      profileUpdateData.businessAddress = businessAddress.trim();
    }
    if (typeof city === "string" && city.trim()) {
      profileUpdateData.city = city.trim();
    }
    if (typeof state === "string" && state.trim()) {
      profileUpdateData.state = state.trim();
    }

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.distributorProfile.update({
        where: { userId },
        data: profileUpdateData,
      });
    }

    // 3. Return full updated user object
    const updatedUser = await prisma.user.findUnique({
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

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}
