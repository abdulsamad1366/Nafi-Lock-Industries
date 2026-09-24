"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLedgerRequest = createLedgerRequest;
exports.getDistributorLedgerRequests = getDistributorLedgerRequests;
exports.getDistributorLedgers = getDistributorLedgers;
exports.downloadLedger = downloadLedger;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
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
 * Retrieve all fulfilled ledger records for current distributor
 */
async function getDistributorLedgers(req, res, next) {
    try {
        const distributorId = req.user.id;
        const ledgers = await db_1.default.ledger.findMany({
            where: { distributorId },
            orderBy: { uploadedAt: "desc" },
        });
        res.json(ledgers);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/ledgers/:id/download
 * Gated file stream for private ledger PDFs — verifies ownership
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