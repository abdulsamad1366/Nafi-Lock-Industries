"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../config/db"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const pdf_upload_middleware_1 = require("../../middleware/pdf-upload.middleware");
const router = (0, express_1.Router)();
// Gated by Admin authMiddleware
router.use(auth_middleware_1.authMiddleware);
/**
 * GET /api/admin/ledger-requests
 * List all ledger requests
 */
router.get("/", async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status && ["REQUESTED", "FULFILLED"].includes(status)) {
            where.status = status;
        }
        const requests = await db_1.default.ledgerRequest.findMany({
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
    }
    catch (err) {
        next(err);
    }
});
/**
 * POST /api/admin/ledger-requests/:id/fulfill
 * Upload ledger PDF and mark request as fulfilled
 */
router.post("/:id/fulfill", pdf_upload_middleware_1.uploadLedgerMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "A PDF file is required to fulfill the ledger request" });
        }
        const ledgerRequest = await db_1.default.ledgerRequest.findUnique({
            where: { id },
        });
        if (!ledgerRequest) {
            return res.status(404).json({ error: "Ledger request not found" });
        }
        const fileUrl = `uploads/ledgers/${req.file.filename}`;
        const defaultTitle = title ||
            `Account Statement — ${new Date().toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
            })}`;
        const [ledger, updatedRequest] = await db_1.default.$transaction([
            db_1.default.ledger.create({
                data: {
                    distributorId: ledgerRequest.distributorId,
                    requestId: ledgerRequest.id,
                    title: defaultTitle,
                    fileUrl,
                    uploadedById: req.admin?.id || "admin",
                },
            }),
            db_1.default.ledgerRequest.update({
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
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=ledger-requests.routes.js.map