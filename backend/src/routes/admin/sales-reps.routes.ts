import { Router, Response, NextFunction } from "express";
import prisma from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";

const router = Router();

// Gated by Admin authMiddleware
router.use(authMiddleware);

/**
 * GET /api/admin/sales-reps
 * List all sales reps
 */
router.get("/", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reps = await prisma.salesRep.findMany({
      include: {
        _count: {
          select: { distributorProfiles: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(reps);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/sales-reps
 * Create a new sales rep
 */
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, photoUrl } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }

    const rep = await prisma.salesRep.create({
      data: {
        name,
        email,
        phone,
        photoUrl: photoUrl || null,
      },
    });

    res.status(201).json(rep);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/sales-reps/:id
 * Update sales rep
 */
router.put("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, phone, photoUrl } = req.body;

    const rep = await prisma.salesRep.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
      },
    });

    res.json(rep);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/sales-reps/:id
 * Delete sales rep
 */
router.delete("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Unassign distributors before deleting
    await prisma.distributorProfile.updateMany({
      where: { assignedRepId: id },
      data: { assignedRepId: null },
    });

    await prisma.salesRep.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
