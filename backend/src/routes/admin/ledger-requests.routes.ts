import { Router, Response, NextFunction } from "express";
import prisma from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";
import { uploadLedgerMiddleware } from "../../middleware/pdf-upload.middleware";

const router = Router();

// Gated by Admin authMiddleware
router.use(authMiddleware);

/**
 * GET /api/admin/ledger-requests
 * List all ledger requests
 */
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status && ["REQUESTED", "FULFILLED"].includes(status as string)) {
      where.status = status;
    }

    const requests = await prisma.ledgerRequest.findMany({
      where,
      include: {
        distributor: {
          select: {
            id: true,
            name: true,
            email: true,
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
      },
      orderBy: { requestedAt: "desc" },
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/ledger-requests/:id/fulfill
 * Upload ledger PDF and mark request as fulfilled
 */
router.post(
  "/:id/fulfill",
  uploadLedgerMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "A PDF file is required to fulfill the ledger request" });
      }

      const ledgerRequest = await prisma.ledgerRequest.findUnique({
        where: { id },
      });

      if (!ledgerRequest) {
        return res.status(404).json({ error: "Ledger request not found" });
      }

      const fileUrl = `uploads/ledgers/${req.file.filename}`;
      const defaultTitle =
        title ||
        `Account Statement — ${new Date().toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        })}`;

      const [ledger, updatedRequest] = await prisma.$transaction([
        prisma.ledger.create({
          data: {
            distributorId: ledgerRequest.distributorId,
            requestId: ledgerRequest.id,
            title: defaultTitle,
            fileUrl,
            uploadedById: req.admin?.id || "admin",
          },
        }),
        prisma.ledgerRequest.update({
          where: { id },
          data: {
            status: "FULFILLED",
            fulfilledAt: new Date(),
          },
        }),
      ]);

      res.status(201).json({
        message: "Ledger uploaded and request fulfilled successfully",
        ledger,
        request: updatedRequest,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
