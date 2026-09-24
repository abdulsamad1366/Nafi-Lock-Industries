"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquiry = createInquiry;
exports.getAllInquiries = getAllInquiries;
exports.updateInquiryStatus = updateInquiryStatus;
const db_1 = __importDefault(require("../config/db"));
async function createInquiry(req, res, next) {
    try {
        const inquiry = await db_1.default.inquiry.create({
            data: {
                name: req.body.name,
                company: req.body.company || null,
                email: req.body.email,
                phone: req.body.phone,
                message: req.body.message,
                brandId: req.body.brandId || null,
                productId: req.body.productId || null,
            },
        });
        res.status(201).json(inquiry);
    }
    catch (err) {
        next(err);
    }
}
async function getAllInquiries(_req, res, next) {
    try {
        const inquiries = await db_1.default.inquiry.findMany({
            include: { brand: true, product: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(inquiries);
    }
    catch (err) {
        next(err);
    }
}
async function updateInquiryStatus(req, res, next) {
    try {
        const inquiry = await db_1.default.inquiry.update({
            where: { id: req.params.id },
            data: { status: req.body.status },
        });
        res.json(inquiry);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=inquiries.controller.js.map