import { Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import prisma from "../config/db";
import { AuthenticatedUserRequest } from "../middleware/user-auth.middleware";

/**
 * POST /api/ledger-requests
 * Submit a request for an account balance statement / ledger
 */
export async function createLedgerRequest(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;
    const { note } = req.body;

    const request = await prisma.ledgerRequest.create({
      data: {
        distributorId,
        note: note || null,
        status: "REQUESTED",
      },
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ledger-requests
 * Retrieve all ledger requests for current distributor
 */
export async function getDistributorLedgerRequests(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;

    const requests = await prisma.ledgerRequest.findMany({
      where: { distributorId },
      orderBy: { requestedAt: "desc" },
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ledgers
 * Retrieve all fulfilled ledger records for current distributor
 */
export async function getDistributorLedgers(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;

    const ledgers = await prisma.ledger.findMany({
      where: { distributorId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json(ledgers);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ledgers/:id/download
 * Gated file stream for private ledger PDFs — verifies ownership
 */
export async function downloadLedger(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const distributorId = req.user!.id;
    const { id } = req.params;

    const ledger = await prisma.ledger.findFirst({
      where: { id, distributorId },
    });

    if (!ledger) {
      return res.status(404).json({ error: "Ledger document not found" });
    }

    const filePath = path.isAbsolute(ledger.fileUrl)
      ? ledger.fileUrl
      : path.join(process.cwd(), ledger.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Ledger file missing on storage disk" });
    }

    const filename = path.basename(filePath);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
}
