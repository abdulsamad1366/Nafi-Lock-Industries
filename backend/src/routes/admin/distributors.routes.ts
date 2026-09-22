import { Router, Response, NextFunction } from "express";
import prisma from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";

const router = Router();

// Gated by Admin authMiddleware
router.use(authMiddleware);

/**
 * GET /api/admin/distributors
 * List all distributor applications, filterable by status
 */
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status as string)) {
      where.status = status;
    }

    const distributors = await prisma.distributorProfile.findMany({
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
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/distributors/:id
 * Approve, reject, or assign sales rep
 */
router.patch("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, assignedRepId } = req.body;

    const updateData: Record<string, unknown> = {
      reviewedAt: new Date(),
      reviewedById: req.admin?.id || "admin",
    };

    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      updateData.status = status;
    }

    if (assignedRepId !== undefined) {
      updateData.assignedRepId = assignedRepId || null;
    }

    const updated = await prisma.distributorProfile.update({
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
  } catch (err) {
    next(err);
  }
});

export default router;
