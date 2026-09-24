"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeExpiredLedgers = purgeExpiredLedgers;
exports.createLedgerRequest = createLedgerRequest;
exports.getDistributorLedgerRequests = getDistributorLedgerRequests;
exports.getDistributorLedgers = getDistributorLedgers;
exports.downloadLedger = downloadLedger;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
const LEDGER_EXPIRY_DAYS = 7;
const LEDGER_EXPIRY_MS = LEDGER_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
/**
 * Purge ledger files and database records that are older than 7 days.
 */
async function purgeExpiredLedgers() {
    try {
        const cutoffDate = new Date(Date.now() - LEDGER_EXPIRY_MS);
        const expiredLedgers = await db_1.default.ledger.findMany({
            where: {
                uploadedAt: { lt: cutoffDate },
            },
        });
        if (expiredLedgers.length === 0)
            return 0;
        for (const item of expiredLedgers) {
            try {
                const filePath = path_1.default.isAbsolute(item.fileUrl)
                    ? item.fileUrl
                    : path_1.default.join(process.cwd(), item.fileUrl);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            catch (fileErr) {
                console.warn(`[Ledger Purge] Failed unlinking file ${item.fileUrl}:`, fileErr);
            }
        }
        const deleteResult = await db_1.default.ledger.deleteMany({
            where: {
                id: { in: expiredLedgers.map((l) => l.id) },
            },
        });
        console.log(`[Ledger Purge] Purged ${deleteResult.count} expired ledger(s) older than ${LEDGER_EXPIRY_DAYS} days.`);
        return deleteResult.count;
    }
    catch (err) {
        console.error("[Ledger Purge] Error executing cleanup:", err);
        return 0;
    }
}
/**
 * POST /api/ledger-requests
 * Submit a request for an account balance statement / ledger
 */
async function createLedgerRequest(req, res, next) {
    try {
        const distributorId = req.user.id;
        const { note } = req.body;
        const request = await db_1.default.ledgerRequest.create({
            data: {
                distributorId,
                note: note || null,
                status: "REQUESTED",
            },
        });
        res.status(201).json(request);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/ledger-requests
 * Retrieve all ledger requests for current distributor
 */
async function getDistributorLedgerRequests(req, res, next) {
    try {
        const distributorId = req.user.id;
        const requests = await db_1.default.ledgerRequest.findMany({
            where: { distributorId },
            orderBy: { requestedAt: "desc" },
        });
        res.json(requests);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/ledgers
 * Retrieve all fulfilled ledger records for current distributor.
 * Automatically purges any records older than 7 days and computes live countdown.
 */
async function getDistributorLedgers(req, res, next) {
    try {
        const distributorId = req.user.id;
        // Purge expired ledgers first
        await purgeExpiredLedgers();
        const ledgers = await db_1.default.ledger.findMany({
            where: { distributorId },
            orderBy: { uploadedAt: "desc" },
        });
        const now = Date.now();
        const enrichedLedgers = ledgers.map((l) => {
            const uploadedTime = new Date(l.uploadedAt).getTime();
            const expiresAt = new Date(uploadedTime + LEDGER_EXPIRY_MS);
            const msRemaining = Math.max(0, expiresAt.getTime() - now);
            const daysLeft = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
            const hoursLeft = Math.ceil(msRemaining / (60 * 60 * 1000));
            return {
                ...l,
                expiresAt: expiresAt.toISOString(),
                daysLeft,
                hoursLeft,
                isExpired: msRemaining <= 0,
            };
        });
        res.json(enrichedLedgers);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/ledgers/:id/download
 * Gated file stream for private ledger PDFs — verifies ownership and enforces 7-day retention
 */
async function downloadLedger(req, res, next) {
    try {
        const distributorId = req.user.id;
        const { id } = req.params;
        const ledger = await db_1.default.ledger.findFirst({
            where: { id, distributorId },
        });
        if (!ledger) {
            return res.status(404).json({ error: "Ledger document not found" });
        }
        // Enforce 7-day retention limit
        const uploadedTime = new Date(ledger.uploadedAt).getTime();
        const isExpired = Date.now() - uploadedTime > LEDGER_EXPIRY_MS;
        if (isExpired) {
            // Purge immediately
            try {
                const filePath = path_1.default.isAbsolute(ledger.fileUrl)
                    ? ledger.fileUrl
                    : path_1.default.join(process.cwd(), ledger.fileUrl);
                if (fs_1.default.existsSync(filePath))
                    fs_1.default.unlinkSync(filePath);
                await db_1.default.ledger.delete({ where: { id: ledger.id } });
            }
            catch (e) {
                console.error("[Ledger Download] Error deleting expired ledger:", e);
            }
            return res.status(410).json({
                error: "This ledger statement expired after 7 days and has been deleted for security compliance. Please submit a new request.",
            });
        }
        const filePath = path_1.default.isAbsolute(ledger.fileUrl)
            ? ledger.fileUrl
            : path_1.default.join(process.cwd(), ledger.fileUrl);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: "Ledger file missing on storage disk" });
        }
        const filename = path_1.default.basename(filePath);
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=ledger.controller.js.map