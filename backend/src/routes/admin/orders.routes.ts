import { Router, Response, NextFunction } from "express";
import prisma from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";

const router = Router();

// Gated by Admin authMiddleware
router.use(authMiddleware);

/**
 * GET /api/admin/orders
 * List all distributor orders
 */
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
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
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/orders/:id
 * Update order status and notes
 */
router.patch("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.order.update({
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
  } catch (err) {
    next(err);
  }
});

export default router;
